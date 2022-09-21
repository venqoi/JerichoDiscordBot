const {
  Collection,
  PermissionFlagsBits,
  User,
  Guild,
  Message,
  BaseInteraction,
} = require("discord.js");
const crypto = require("crypto");
const path = require("path");
const humanizeDuration = require("humanize-duration");
const {
  defaultGuildPrefix,
  __defaultStructurePermissions,
  __defaultPermissionByPassCandidates,
} = require("../resources/__defaultPublicCredentials");
const databaseCore = require("../functions/coreHandler/externalHandler/databaseCore");
const __embedGenerator = require("./__embedGen");
const fileSystem = require("fs");
const { __internalErrorManager } = require("./__cacheUtils");
const Axios = require("axios").default;

class miscUtils {
  static cachedStorage = { cooldownCaches: null };
  static async sleep(milliSeconds = 5 * 1000) {
    if (milliSeconds && milliSeconds <= 0) return undefined;
    return new Promise((resolve) => setTimeout(resolve, milliSeconds));
  }

  static async __permissionsManager(
    bot,
    __permissionsLevel = 0,
    rawData,
    filters = {}
  ) {
    if (!(rawData?.guild || rawData?.channel || rawData?.message))
      return undefined;
    let __tempRawGuild =
        rawData?.guild ??
        rawData?.channel?.guild ??
        rawData?.message?.guild ??
        rawData?.interaction?.guild,
      __tempRawMessage = rawData?.message ?? rawData?.interaction?.message,
      __tempRawChannel =
        rawData?.channel ??
        rawData?.message?.channel ??
        rawData?.interaction?.channel,
      __tempRawInteraction = rawData?.interaction;
    if (
      (__tempRawGuild &&
        __tempRawGuild instanceof Guild &&
        __tempRawGuild?.members?.me?.permissions?.has(
          PermissionFlagsBits.Administrator
        )) ||
      (__tempRawMessage &&
        __tempRawMessage instanceof Message &&
        __defaultPermissionByPassCandidates?.includes(
          __tempRawMessage?.author?.id
        )) ||
      (__tempRawInteraction &&
        __tempRawInteraction instanceof BaseInteraction &&
        __defaultPermissionByPassCandidates?.includes(
          __tempRawInteraction?.user?.id
        ))
    )
      return true;
    let permissionMetdatas = __defaultStructurePermissions(__permissionsLevel);
    let __tempChannelMissings = [],
      __tempGuildMissings = [];
    if (!__tempRawChannel || !__tempRawGuild?.members?.me) return undefined;
    else if (permissionMetdatas?.channel?.length > 0) {
      __tempChannelMissings = permissionMetdatas?.channel?.map(
        (permissionObject, indexNumber) => {
          if (!permissionObject?.[0] || !permissionObject[1]) return undefined;
          else if (
            !filters?.checkMember &&
            !filters?.checkRole &&
            !__tempRawChannel
              ?.permissionsFor(__tempRawGuild?.members?.me)
              ?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else if (
            filters?.checkMember &&
            !filters?.checkMember
              ?.permissionsIn(__tempRawChannel)
              ?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else if (
            filters?.checkRole &&
            !filters?.checkRole
              ?.permissionsIn(__tempRawChannel)
              ?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else return undefined;
        }
      );

      __tempChannelMissings = __tempChannelMissings?.filter(Boolean);
    }
    if (permissionMetdatas?.guild?.length > 0) {
      __tempGuildMissings = permissionMetdatas?.guild?.map(
        (permissionObject, indexNumber) => {
          if (!permissionObject?.[0] || !permissionObject[1]) return undefined;
          else if (
            !filters?.checkMember &&
            !filters?.checkRole &&
            !__tempRawGuild?.members?.me?.permissions?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else if (
            filters?.checkMember &&
            !filters?.checkMember?.permissions?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else if (
            filters?.checkRole &&
            !checkRole?.permissions?.has(permissionObject[1])
          )
            return `\`${indexNumber + 1}) ${permissionObject[0]?.trim()}\``;
          else return undefined;
        }
      );

      __tempGuildMissings = __tempGuildMissings?.filter(Boolean);
    }
    if (
      __tempGuildMissings &&
      Array.isArray(__tempGuildMissings) &&
      __tempGuildMissings?.length <= 0 &&
      __tempChannelMissings &&
      Array.isArray(__tempChannelMissings) &&
      __tempChannelMissings?.length <= 0
    )
      return true;
    else if (
      !filters?.skipMail &&
      (__tempRawMessage?.author || __tempRawMessage?.user)
    ) {
      let __tempRawEmbed = {
        title: `**Missing Permissions is Detected**`,
        description:
          `<a:rage:854414888944533544> __**Analysis Report**__\n**Channel :** ${
            __tempRawChannel?.id
              ? `<#${__tempRawChannel?.id}>`
              : "Not Specified/Unkown Channel"
          }\n**Server : \`${
            __tempRawGuild?.name ?? "Unknown Server"
          }\`**\n**Permissions For : \`${
            filters?.checkMember?.nickname ??
            filters?.checkMember?.user?.username ??
            filters?.checkRole?.name ??
            "Jericho"
          }\`**\n\n` +
          `${
            __tempGuildMissings &&
            Array.isArray(__tempGuildMissings) &&
            __tempGuildMissings?.length > 0
              ? `<a:no:797219912963719228> __**Server Permissions**__\n${__tempGuildMissings.join(
                  "\n"
                )}\n\n`
              : ""
          }` +
          `${
            __tempChannelMissings &&
            Array.isArray(__tempChannelMissings) &&
            __tempChannelMissings?.length > 0
              ? `<a:no:797219912963719228> __**Channel Permissions**__\n${__tempChannelMissings.join(
                  "\n"
                )}`
              : ""
          }` +
          `\n\n<a:onlineGif:854345313409302538> __**Note**__ **: You need to Add those Permissions to the \`Persor/Role\` in the Server to have a Functional Command**`,
      };

      let dmCheckResult = await __embedGenerator.__errorEmbed(
        bot,
        __tempRawEmbed,
        {
          user: __tempRawMessage?.author ?? __tempRawMessage?.user,
        }
      );
      if (!dmCheckResult)
        await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: __tempRawMessage,
          channel: __tempRawChannel,
        });
      if (filters?.returnMissings)
        return {
          guildPermissions: __tempGuildMissings,
          channelPermissions: __tempChannelMissings,
        };
      else return false;
    } else if (filters?.returnMissings)
      return {
        guildPermissions: __tempGuildMissings,
        channelPermissions: __tempChannelMissings,
      };
    else return false;
  }
  static guildPrefixFetcher(guildId) {
    if (!(guildId && guildId !== ""))
      return defaultGuildPrefix?.trim() ?? "je!";

    let __setting = databaseCore.__customParser(undefined, undefined, {
      tableName: "universalGuildSettings",
      filters: {
        guildId: guildId,
        category: "prefix",
        fetchCache: true,
        subCategory: "server",
        returnIndex: 0,
      },
    });
    if (!__setting?.rawArgs) return defaultGuildPrefix?.trim() ?? "je!";
    __setting.rawArgs =
      databaseCore.__customParser(undefined, {
        rawArgs: __setting?.rawArgs,
        tableName: "universalGuildSettings",
        categoryName: "prefix",
      }) ?? __setting?.rawArgs;
    return (
      __setting?.rawArgs?.prefix ??
      __setting?.prefix ??
      defaultGuildPrefix?.trim() ??
      "je!"
    );
  }
  static __parseArraySlots(getFavorableSlot) {
    if (
      getFavorableSlot?.rawDataArray &&
      Array.isArray(getFavorableSlot?.rawDataArray) &&
      getFavorableSlot?.rawDataArray?.length > 0 &&
      getFavorableSlot?.returnType
    ) {
      let __tempGarbageCount = getFavorableSlot?.minSlotId
          ? parseInt(getFavorableSlot?.minSlotId) - 1
          : 0,
        __tempGarbage = getFavorableSlot?.rawDataArray
          ?.map((rawData) => {
            ++__tempGarbageCount;
            if (
              rawData[getFavorableSlot?.checkkey ?? "slotId"] &&
              parseInt(rawData[getFavorableSlot?.checkkey ?? "slotId"]) !==
                __tempGarbageCount
            ) {
              __tempGarbageCount = parseInt(
                rawData[getFavorableSlot?.checkkey ?? "slotId"]
              );
              return parseInt(rawData[getFavorableSlot?.checkkey ?? "slotId"]);
            } else return undefined;
          })
          ?.filter(Boolean)
          ?.sort((initial, after) => initial - after);
      if (
        !(
          __tempGarbage &&
          Array.isArray(__tempGarbage) &&
          __tempGarbage?.length > 0 &&
          __tempGarbage[0] &&
          !isNaN(Number(__tempGarbage[0]))
        )
      )
        return undefined;
      switch (getFavorableSlot?.returnType?.toLowerCase()?.trim()) {
        case "id":
          return (
            __tempGarbage[0] ??
            (getFavorableSlot?.rawDataArray?.length &&
            getFavorableSlot?.rawDataArray?.length <
              parseInt(getFavorableSlot?.maxSlotId ?? 1000)
              ? getFavorableSlot?.rawDataArray?.length
              : undefined)
          );
        case "ids":
          return __tempGarbage;
        case "slots":
          return __tempGarbage?.length ?? 0;
      }
    } else return undefined;
  }
  static async __redirectFuncRecursive(
    rawArray,
    rawFunction,
    rawArgs,
    configfilters
  ) {
    if (!(rawArray && Array.isArray(rawArray) && rawArray?.length > 0))
      return undefined;
    try {
      return await Promise.all(
        rawArray?.map(async (mappedValue) => {
          if (
            configfilters?.cachedData?.indexValue &&
            configfilters?.cachedData?.key &&
            !rawArgs[parseInt(configfilters?.cachedData?.indexValue)]
          )
            rawArgs[parseInt(configfilters?.cachedData?.indexValue)] = {
              ...rawArgs[parseInt(configfilters?.cachedData?.indexValue)],
              [configfilters.cachedData.key]: mappedValue,
            };
          return await rawFunction(...rawArgs);
        })
      ).catch(() => {
        return undefined;
      });
    } catch (error) {
      __internalErrorManager(error, {
        category: "miscUtils.__redirectFuncRecursive Function",
      });
      return undefined;
    }
  }
  static async __rawFetchBody(Url, configFilters = {}) {
    try {
      if (!Url || !configFilters) return undefined;
      configFilters.statusCodes ??= [];
      configFilters.statusCodes.push(200);
      let rawResponse = await Axios.get(Url);
      if (
        configFilters?.returnObject &&
        rawResponse?.status &&
        configFilters?.statusCodes?.includes(parseInt(rawResponse?.status ?? 0))
      )
        return rawResponse[configFilters?.returnObject];
      else return undefined;
    } catch (error) {
      __internalErrorManager(error, {
        category: "miscUtils.__rawFetchBody Function",
      });
      return undefined;
    }
  }
  static __fetchInteractionCustomId(configs, generateCustomId = true) {
    let customHook;
    if (generateCustomId) customHook = crypto.randomBytes(20).toString("hex");
    return {
      customId: `${configs?.interactionType ?? "selectMenu"}<\\>${
        configs?.category
      }<\\>${configs?.subCategory}<\\>${configs?.messageUri}${
        customHook ? "<\\>" + customHook : ""
      }`,
      generatedCustomId: customHook,
    };
  }
  static async __userCooldownsFunc(bot, commandName, authorId, filters = {}) {
    const commandCooldowns =
      miscUtils?.cachedStorage?.cooldownCaches ?? new Collection();
    let expirationTime = 0;

    if (!commandCooldowns.has(commandName))
      commandCooldowns.set(commandName, new Collection());

    const presentTime = Date.now();
    const timestamps = commandCooldowns.get(commandName);
    const cooldownAmount = (filters?.cooldownValue ?? 5) * 1000;
    if (timestamps.has(authorId)) {
      expirationTime = timestamps.get(authorId) + cooldownAmount;
      if (presentTime < expirationTime) {
        const timeLeft = (expirationTime - presentTime) / 1000;
        const Embedm = {
          title: "Command Usage Cooldown Request",
          des: `**Don't Rush , Jericho may get** \` Overload \`\n**Please wait for** ${timeLeft.toFixed(
            1
          )} **more seconds before re-using the** \`${
            filters?.prefixGuild
          }${commandName}\` **command**.`,
        };
        return void (await __embedGenerator.__errorEmbed(bot, Embedm, {
          channel: filters?.sendChannel,
        }));
      }
    }

    timestamps.set(authorId, presentTime);
    setTimeout(() => timestamps.delete(authorId), cooldownAmount);
    miscUtils.cachedStorage.cooldownCaches ??= commandCooldowns;
    return presentTime >= expirationTime;
  }
  static __fileFunctions(method, rawWriteableData, configs) {
    try {
      if (
        !fileSystem.existsSync(
          path.join(
            __dirname,
            "/" + (configs?.directoryPath ?? "../resources/__solidCaches")
          )
        )
      )
        fileSystem.mkdirSync(
          path.join(
            __dirname,
            "/" + (configs?.directoryPath ?? "../resources/__solidCaches")
          )
        );
      const __cacheLocation = path.join(
        __dirname,
        "/" +
          ((configs?.directoryPath ?? "../resources/__solidCaches") +
            "/" +
            configs?.filePath)
      );
      if (!__cacheLocation) return undefined;
      switch (method?.toLowerCase()?.trim()) {
        case "write":
          return fileSystem.writeFileSync(__cacheLocation, rawWriteableData, {
            encoding: configs.encodingType ?? "utf8",
          });
        case "read":
          return fileSystem.readFileSync(__cacheLocation, {
            encoding: configs.encodingType ?? "utf8",
          });
        case "delete":
          return fileSystem.unlinkSync(__cacheLocation);
        default:
          return fileSystem.readFileSync(__cacheLocation, {
            encoding: configs.encodingType ?? "utf8",
          });
      }
    } catch {
      return undefined;
    }
  }
  static async __dmCheckUtil(rawUser) {
    if (!(rawUser && rawUser instanceof User)) return undefined;
    try {
      let tempMessage = await rawUser.send({
        content:
          "🏮 `Don't Worry its for Testing Purpose : It will be deleted after a second!!` 🏮",
      });
      if (!tempMessage) return undefined;
      await tempMessage?.delete();
      return true;
    } catch (error) {
      __internalErrorManager(error, {
        category: "miscUtils.__dmCheckUtil Function",
      });
      return undefined;
    }
  }
  static __prettyMsLTE(milliSeconds = 0) {
    const shortEnglishHumanizer = humanizeDuration.humanizer({
      language: "shortEn",
      languages: {
        shortEn: {
          y: () => "y",
          mo: () => "mo",
          w: () => "w",
          d: () => "d",
          h: () => "h",
          m: () => "m",
          s: () => "s",
          ms: () => "ms",
        },
      },
    });
    return shortEnglishHumanizer(milliSeconds)
      ?.split(", ")
      ?.map((s) => {
        if (s?.includes("."))
          s = "" + s?.split(".")?.[0] + s?.replace(/[^a-zA-Z]/g, "") + "";
        return s?.replace(" ", "");
      })
      ?.join(" ")
      ?.trim();
  }
}
module.exports = miscUtils;
