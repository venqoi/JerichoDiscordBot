const databaseCore = require("../externalHandler/databaseCore");
const __embedGenerator = require("../../../Utilities/__embedGen");
const statusFrontEndHandler = require("../../serverStatusHandler/frontendEmployer");
const { __internalErrorManager } = require("../../../Utilities/__cacheUtils");
const { __statsEmbedGenerator } = require("./__internalStats");
const {
  __defaultActivities,
  defaultSupportServer,
} = require("../../../resources/__defaultPublicCredentials");
const {
  __header,
  __quickCheck,
} = require("../../chattingHandler/frontendEmployer");
const {
  sleep,
  __userCooldownsFunc,
  guildPrefixFetcher,
  __fileFunctions,
} = require("../../../Utilities/__miscUtils");
const __slashCommandCore = require("./slashCommandCore");
const { Message, Guild, PermissionFlagsBits } = require("discord.js");

class eventsIntervalHolder {
  static caches = { presencePhase: false };
  static async __capture(bot, sleepTimeoutinMs = 1 * 1000) {
    if (!bot) return undefined;
    await sleep(sleepTimeoutinMs);
    await eventsIntervalHolder.__databaseConnectionInitiater();
    await __slashCommandCore.__configure(bot);
    eventsIntervalHolder.__deleteCaches();
    return void (await eventsIntervalHolder.__infiniteLoopInterval(bot));
  }
  static async __databaseConnectionInitiater() {
    await databaseCore.__connect();
    await databaseCore.refreshAll();
    if (databaseCore.refreshAllBoolean)
      return void console.log(
        `🏺 - Mysql | Database Data has been Cached and Refreshed with database Core`
      );
    else return undefined;
  }
  static async __infiniteLoopInterval(bot) {
    eventsIntervalHolder.__randomizedActivity(bot);
    setInterval(
      () => eventsIntervalHolder.__randomizedActivity(bot),
      60 * 1000
    );

    setInterval(
      async () => await databaseCore.__inifinitePingAliveConnection(),
      10 * 60 * 1000
    );

    setInterval(
      async () => await statusFrontEndHandler.__header(bot),
      2 * 60 * 1000
    );
    let __garbageChannel =
      bot.channels.cache.get(defaultSupportServer?.stats?.channelId) ??
      (await bot.channels
        .fetch(defaultSupportServer?.stats?.channelId)
        .catch(() => undefined));
    if (!__garbageChannel) return undefined;
    let garbageMessage =
      __garbageChannel.messages.cache.get(
        defaultSupportServer?.stats?.messageId
      ) ??
      (await __garbageChannel.messages
        .fetch({ message: defaultSupportServer?.stats?.messageId, cache: true })
        .catch(() => undefined));

    if (!garbageMessage) return undefined;
    setInterval(
      async () => await __statsEmbedGenerator(bot, garbageMessage),
      5 * 60 * 1000
    );
    return;
  }
  static async __messageCapture(bot, message) {
    if (!bot.isReady() || !databaseCore.refreshAllBoolean) return undefined;
    else if (message?.author?.id === bot?.user?.id) return undefined;
    else if (message?.author?.bot || message?.author?.system) return undefined;
    else if (__quickCheck(message)) return await __header(bot, message);
    let prefixGuild = guildPrefixFetcher(
      message?.guild?.id ?? message?.guildId
    );
    if (message?.content?.trim() === "<@727761190100664391>")
      return await eventsIntervalHolder.__checkforJerichoMention(bot, message);
    if (
      !message?.content
        ?.toLowerCase()
        ?.trim()
        ?.split(" ")?.[0]
        ?.startsWith(prefixGuild?.toLowerCase()?.trim())
    )
      return undefined;
    const cookedArgs = message?.content
      ?.slice(prefixGuild?.length)
      ?.trim()
      ?.split(/ +/);
    const commandName = cookedArgs?.shift()?.toLowerCase();
    const command =
      bot.commands.get(commandName?.toLowerCase()?.trim()) ??
      bot.commands.find((cmd) =>
        cmd?.aliases?.includes(commandName?.toLowerCase()?.trim())
      );
    if (!command) return undefined;
    let __cooldownResponse = await __userCooldownsFunc(
      bot,
      commandName,
      message?.author?.id,
      {
        cooldownValue: 5,
        prefixGuild: prefixGuild?.toLowerCase()?.trim() ?? "je!",
        sendChannel: message?.channel,
      }
    );
    if (!__cooldownResponse) return undefined;
    try {
      return void command.directCommand(bot, message, cookedArgs);
    } catch (error) {
      let __tempRawEmbed = {
        title: `**Internal Process Crashes are Detected**`,
        description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments**\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Internal Command Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Internal Command Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**`,
      };
      __internalErrorManager(error, {
        category: "eventsIntervalHolder.__messageCapture Function",
      });
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    }
  }
  static async __guildCapture(bot, rawGuild, method = "create") {
    try {
      if (!(rawGuild && rawGuild instanceof Guild)) return undefined;
      let cachedChannel =
          bot.channels?.cache?.get(defaultSupportServer?.eventLogsChannelId) ??
          (await bot.channels
            ?.fetch(defaultSupportServer?.eventLogsChannelId)
            ?.catch(() => undefined)),
        __tempRawEmbed;
      if (!cachedChannel) return undefined;
      else if (method?.toLowerCase()?.trim() === "create") {
        let __inviteMetadata = !rawGuild?.vanityURLCode
          ? rawGuild?.invites?.cache?.find((invite) => {
              if (
                invite.expiresAt?.getTime() - new Date()?.getTime() >
                10 * 60 * 1000
              )
                return true;
            })?.code ??
            (await rawGuild?.invites
              ?.create(
                rawGuild?.channels?.cache?.find(
                  (channel) => channel?.type === "GUILD_TEXT"
                )
              )
              ?.then((invite) => invite?.code)
              ?.catch(() => undefined))
          : rawGuild?.vanityURLCode;
        let __cachedOwner = await rawGuild
          ?.fetchOwner()
          ?.catch(() => undefined);
        __tempRawEmbed = {
          title: `**Jericho Joined a Server**`,
          description: `<a:yes:817492826148700211> __**Internal Analysis**__\n<:announcements:852963180732350484> **Server Name :** \`${
            rawGuild?.name
          }\`\n<:announcements:852963180732350484> **Server Id :** \`${
            rawGuild?.id
          }\`\n<:announcements:852963180732350484> **Server Owner :** \`${
            __cachedOwner?.user?.username
          }\`\n<:announcements:852963180732350484> **Server Owner Id :** \`${
            __cachedOwner?.user?.id
          }\`\n<:announcements:852963180732350484> **Server Url :** ${
            __inviteMetadata && typeof __inviteMetadata === "string"
              ? "[Invite Url](" + "https://discord.gg/" + __inviteMetadata + ")"
              : "`Un-Fetchable`"
          }\n<:announcements:852963180732350484> **Server Members Count :** \`${
            rawGuild?.memberCount
          }\`\n<:announcements:852963180732350484> **Server Roles Count :** \`${
            rawGuild?.roles?.cache?.size
          }\`\n<:announcements:852963180732350484> **Server Channel Counts :** \`${
            rawGuild?.channels?.cache?.size
          }\``,
        };
        let __tempRawEmbedTwo = {
          title: `**Jericho at your Service**`,
          description: `<a:yes:817492826148700211> __**Internal Service**__\n<:announcements:852963180732350484> **Ping Report :** \`je!ping\`\n<:announcements:852963180732350484> **Custom Prefix :** \`je!prefix help\`\n<:announcements:852963180732350484> **Girlfriend Chatting :** \`je!chatting help\`\n<:announcements:852963180732350484> **Game Server Status :** \`je!status help\`\n<:announcements:852963180732350484> **Help Command :** \`je!help\`\n** - More Features will be Joining Soon , Because We are \`Re-Making Jericho\` from scratch**\n\n<a:yes:817492826148700211> __**Server Analysis**__\n<:dnd:821777466670055474> **Server Name :** \`${rawGuild?.name}\`\n<:dnd:821777466670055474> **Custom Prefix :** \`je!\`\n<:dnd:821777466670055474> **Universal Prefix :** \`je!\`\n<:dnd:821777466670055474> **Server Emojis Count :** \`${rawGuild?.emojis?.cache?.size}\`\n<:dnd:821777466670055474> **Server Channels :** \`${rawGuild?.channels?.cache?.size}\`\n<:dnd:821777466670055474> **Server Members :** \`${rawGuild?.memberCount}\`\n<:dnd:821777466670055474> **Server Roles :** \`${rawGuild?.roles?.cache?.size}\`\n\n<a:yes:817492826148700211> __**Support For You**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**`,
        };
        await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbedTwo, {
          channel: rawGuild?.channels?.cache?.find(
            (channel) =>
              channel?.type === "GUILD_TEXT" &&
              channel
                ?.permissionsFor(rawGuild?.members?.me)
                ?.has(PermissionFlagsBits.SendMessages)
          ),
        });
      } else if (method?.toLowerCase()?.trim() === "delete") {
        let __tempResponse = await databaseCore.__query(
          `DELETE FROM universalGuildSettings WHERE guildId = "${rawGuild?.id}"`,
          undefined,
          false,
          undefined,
          "universalGuildSettings"
        );
        if (!__tempResponse)
          throw new Error("Database Guild Cache Deletion got Crashed");
        __tempRawEmbed = {
          title: `**Jericho Left a Server**`,
          description: `<a:no:797219912963719228> __**Internal Analysis**__\n<:announcements:852963180732350484> **Server Name :** \`${rawGuild?.name}\`\n<:announcements:852963180732350484> **Server Id :** \`${rawGuild?.id}\`\n<:announcements:852963180732350484> **Server Members Count :** \`${rawGuild?.memberCount}\``,
          color: "RED",
        };
      }
      return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
        channel: cachedChannel,
      });
    } catch (error) {
      await __internalErrorManager(error, {
        category: "eventsIntervalHolder.__guildCapture Function",
      });
      return undefined;
    }
  }
  static __randomizedActivity(bot) {
    let presenceCache = __defaultActivities(bot);
    return void bot.user.setPresence(presenceCache);
  }
  static __deleteCaches() {
    __fileFunctions("delete", undefined, {
      filePath: "__gameServerStatusCaches.txt",
      directoryPath: "../resources/__solidCaches",
    });
    __fileFunctions("delete", undefined, {
      filePath: "__cachedTimeData.txt",
      directoryPath: "../resources/__solidCaches",
    });
    return void __fileFunctions("delete", undefined, {
      filePath: "__rawGamesList.txt",
      directoryPath: "../resources/__solidCaches",
    });
  }
  static async __checkforJerichoMention(bot, rawMessage) {
    if (!(rawMessage && rawMessage instanceof Message)) return undefined;
    let prefixGuild = guildPrefixFetcher(
      rawMessage?.guild?.id ?? rawMessage?.guildId
    );
    let __tempRawEmbed = {
      title: `**Jericho at your Service**`,
      description: `<a:yes:817492826148700211> __**Internal Service**__\n<:announcements:852963180732350484> **Ping Report :** \`${prefixGuild}ping\`\n<:announcements:852963180732350484> **Custom Prefix :** \`${prefixGuild}prefix help\`\n<:announcements:852963180732350484> **Girlfriend Chatting :** \`${prefixGuild}chatting help\`\n<:announcements:852963180732350484> **Game Server Status :** \`je!status help\`\n<:announcements:852963180732350484> **Help Command :** \`je!help\`\n\n<a:yes:817492826148700211> __**Server Analysis**__\n<:dnd:821777466670055474> **Server Name :** \`${rawMessage?.guild?.name}\`\n<:dnd:821777466670055474> **Custom Prefix :** \`${prefixGuild}\`\n<:dnd:821777466670055474> **Universal Prefix :** \`je!\`\n<:dnd:821777466670055474> **Server Emojis Count :** \`${rawMessage?.guild?.emojis?.cache?.size}\`\n<:dnd:821777466670055474> **Server Channels :** \`${rawMessage?.guild?.channels?.cache?.size}\`\n<:dnd:821777466670055474> **Server Members :** \`${rawMessage?.guild?.memberCount}\`\n<:dnd:821777466670055474> **Server Roles :** \`${rawMessage?.guild?.roles?.cache?.size}\`\n\n<a:yes:817492826148700211> __**Support For You**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**`,
    };
    return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
      message: rawMessage,
      channel: rawMessage?.channel,
    });
  }
}

module.exports = eventsIntervalHolder;
