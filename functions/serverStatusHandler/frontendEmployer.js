const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Message,
  ButtonInteraction,
  ButtonStyle,
} = require("discord.js");
const { query } = require("gamedig");
const { quickCheck } = require("../../resources/__gameStatusResources");
const {
  __fetchInteractionCustomId,
  __prettyMsLTE,
  __fileFunctions,
} = require("../../Utilities/__miscUtils");
const databaseManager = require("../coreHandler/externalHandler/databaseCore");
const { __internalErrorManager } = require("../../Utilities/__cacheUtils");
const __customPlayTimeAddon = require("./__customPlayTimeAddon");

class frontEndEmployer {
  static defaultValue = {
    error: {
      color: "#DD0004",
      description:
        "<a:no:797219912963719228> **Error has Occured by:** <a:no:797219912963719228>\n```1) Game Server is Down/Closed on Given IP and Port\n2) Game Server is Crashed or On Internal-Server-Maintenance\n3) Game Server is Blocking Jericho to Fetch Required Data```\n\n⚠️ **You can Try :** ⚠️\n```1) Check if Server is Crashed or Closed and Re-Start it\n2) Check if Server is Blocking Jericho's IP , if you want to whitelist then Try to contact Developer through Support Server\n3) Check IP and Port are correct for Server Query , So check for actual Server Query Port\n4) Or else Join Support Server and talk with Developers in help and support```",
    },
    maintenance: {
      color: "#E6FF49",
      description:
        " ** Server is in Maintenance ** \n ** ⚠️Server went Under Maintenance for a while ** \n ** ⚠️Server may be Restarting / Under - Progress ** \n ** ⚠️Kindly Wait for Some - Time ** \n ** ⚠️You can ask Staffs about the Current Status ** ",
    },
    color: "#2BFF5E",
    description: "- Game Server Status Exclusive Feature -",
    pfp: "https://i.imgur.com/MHNLIls.jpg",
    fileCachespath: "__gameServerStatusCaches.txt",
    directoryPath: "../resources/__solidCaches",
    encodingType: "utf8",
  };
  static #__privateCachesData = [];
  static async __header(bot) {
    let cacheStorage = await frontEndEmployer.getData(
      "all",
      undefined,
      undefined,
      true
    );
    if (
      !(cacheStorage && Array.isArray(cacheStorage) && cacheStorage?.length > 0)
    )
      return undefined;
    return void (await Promise.all(
      cacheStorage?.map(
        async (statusData) =>
          await frontEndEmployer
            .#__parseRawStatus(bot, statusData)
            ?.catch(() => undefined)
      )
    ));
  }
  static async __gameServerStatusEmbedHandler(bot, message, interaction) {
    if (
      !(
        frontEndEmployer
          .__commonCustomId(
            "specialEditionRefreshButton<//>" + message?.guild?.id
          )
          ?.trim()
          ?.includes(interaction?.customId?.trim()) &&
        interaction instanceof ButtonInteraction
      )
    )
      return undefined;
    if (!(message && message instanceof Message)) return undefined;
    await interaction.deferReply({ ephemeral: true })?.catch(() => undefined);
    let preCaches = await frontEndEmployer.getData(
      message?.guild?.id,
      undefined,
      message?.id,
      true
    );
    try {
      if (!preCaches?.[0])
        return await interaction
          .editReply({
            content:
              "💢 **`Requested Game Server Status cannot be Refreshed!!`**",
          })
          .catch(() => undefined);
      else await frontEndEmployer.#__parseRawStatus(bot, preCaches?.[0]);
      return await interaction
        .editReply({
          content: "♦️ **`Game Server Status has been Refreshed`**",
        })
        .catch(() => undefined);
    } catch (error) {
      await __internalErrorManager(error, {
        category: "frontEndEmployer.__gameServerStatusEmbedHandler Function",
      });
      return await interaction
        .editReply({
          content:
            "💢 **`Requested Game Server Status cannot be Refreshed!!`**",
        })
        .catch(() => undefined);
    }
  }
  static async #__parseRawStatus(bot, rawData) {
    if (!rawData?.rawArgs) return undefined;
    let rawChannel =
      bot.channels.cache.get(rawData.rawArgs?.channelId) ??
      (await bot.channels
        .fetch(rawData.rawArgs?.channelId)
        ?.catch(() => undefined));
    if (!rawChannel?.name) return undefined;
    let rawFetched = await frontEndEmployer.#__parseRawArgsAndQuery(
      rawData.rawArgs
    );
    let rawEmbed = new EmbedBuilder().setAuthor({
      iconURL: rawFetched?.pfp,
      name: rawFetched?.name ?? "** **",
    });
    if (rawFetched?.thumbnail)
      rawEmbed.setThumbnail(
        rawFetched?.thumbnail ?? rawData.rawArgs?.thumbnail
      );
    if (rawFetched?.banner)
      rawEmbed.setImage(rawFetched?.banner ?? rawData.rawArgs?.banner);
    if (rawFetched?.maintenance) {
      rawEmbed.setDescription(rawFetched?.maintenance);
      rawEmbed.setColor(frontEndEmployer.defaultValue?.maintenance?.color);
    } else if (rawFetched?.status) {
      if (rawFetched?.description || rawData.rawArgs?.description)
        rawEmbed.setDescription(
          "**`" +
            (rawFetched?.description ?? rawData.rawArgs?.description) +
            "`**"
        );
      if (rawFetched?.color) rawEmbed.setColor(rawData.rawArgs?.color);
      rawEmbed.addFields({
        name: "**Server Host :** ",
        value: "**" + rawFetched.host + "**",
        inline: true,
      });
      if (rawFetched.map || rawFetched?.gameName)
        rawEmbed.addFields({
          name: "**Server Map :** ",
          value: "**`" + (rawFetched.map ?? rawFetched?.gameName) + "`**",
          inline: true,
        });
      if (rawFetched.ping)
        rawEmbed.addFields({
          name: "**Server Ping :** ",
          value: "**`" + rawFetched.ping + "`**",
          inline: true,
        });
      if (rawFetched.players?.onlinePlayers && rawFetched.players?.maxPlayers)
        rawEmbed.addFields({
          name: "**Players Count :** ",
          value:
            "**`" +
            rawFetched.players?.onlinePlayers?.length +
            "/" +
            rawFetched.players?.maxPlayers +
            "`**",
          inline: true,
        });
      if (rawFetched.password)
        rawEmbed.addFields({
          name: "**Server Password :** ",
          value: "**`" + rawFetched?.password + "`**",
          inline: false,
        });
      if (
        rawFetched?.players?.formatedPlayers &&
        (rawFetched?.players?.formattedTime ||
          rawFetched?.players?.formattedScore ||
          rawFetched?.players?.formattedTeam ||
          rawFetched?.players?.formattedPing)
      )
        rawEmbed.addFields({
          name: "** **",
          value: "** **",
          inline: false,
        });
      if (
        rawFetched?.players?.formatedPlayers &&
        (rawFetched?.players?.formattedTime ||
          rawFetched?.players?.formattedScore ||
          rawFetched?.players?.formattedTeam ||
          rawFetched?.players?.formattedPing)
      )
        rawEmbed.addFields({
          name: "**Server Players :** ",
          value: "```" + rawFetched.players?.formatedPlayers + "```",
          inline: true,
        });
      else if (rawFetched?.players?.formatedPlayers)
        rawEmbed.addFields({
          name: "**Server Players :** ",
          value: "```" + rawFetched.players?.formatedPlayers + "```",
          inline: false,
        });

      if (
        rawFetched?.players?.formatedPlayers &&
        (rawFetched?.players?.formattedTime ||
          rawFetched?.players?.formattedScore ||
          rawFetched?.players?.formattedTeam ||
          rawFetched?.players?.formattedPing)
      )
        rawEmbed.addFields({
          name: rawFetched?.players?.formattedTeam
            ? "**Team Distribution :**"
            : rawFetched?.players?.formattedScore
            ? "**Score-Board :**"
            : rawFetched?.players?.formattedPing
            ? "**Player Pings :**"
            : rawFetched?.players?.formattedTime
            ? "**Play Time :**"
            : "** **",
          value: rawFetched?.players?.formattedTeam
            ? "```" + rawFetched.players?.formattedTeam + "```"
            : rawFetched?.players?.formattedScore
            ? "```" + rawFetched.players?.formattedScore + "```"
            : rawFetched?.players?.formattedPing
            ? "```" + rawFetched?.players?.formattedPing + "```"
            : rawFetched?.players?.formattedTime
            ? "```" + rawFetched.players?.formattedTime + "```"
            : " ** **",
          inline: true,
        });
    } else {
      rawEmbed.addFields({
        name: "**Server Host :** ",
        value: "**" + rawFetched.host + "**",
        inline: true,
      });
      rawEmbed.setDescription(
        frontEndEmployer.defaultValue?.error?.description ??
          rawFetched?.description ??
          rawData.rawArgs?.description
      );
      rawEmbed.setColor(frontEndEmployer.defaultValue?.error?.color);
    }
    rawEmbed.setFooter({
      iconURL: rawFetched?.pfp,
      text: "Slot Number : " + rawFetched?.slotId + "",
    });
    rawEmbed.setTimestamp();

    let rawActionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(
          frontEndEmployer.__commonCustomId(
            "specialEditionRefreshButton<//>" + rawData?.guildId
          )
        )
        .setEmoji(`<a:loading:852967099341209661>`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Primary)
    );
    return await frontEndEmployer.#__embedDelivery(
      bot,
      {
        packages: rawActionRow
          ? { embeds: [rawEmbed], components: [rawActionRow] }
          : { embeds: [rawEmbed] },
        channel: rawChannel,
        messageId: rawData?.rawArgs?.messageId,
      },
      rawData
    );
  }
  static async #__parseRawArgsAndQuery(rawArgs) {
    if (!rawArgs?.host) return undefined;
    let uriParsed = {
        hostname: rawArgs?.host?.split(":")?.[0],
        port: rawArgs?.host?.split(":")?.[1],
      },
      garbageHiddenCaches = 0,
      __indexingNumbers = 0;
    if (!uriParsed?.hostname) return undefined;
    let rawGameStatusData =
      rawArgs?.maintenance !== "true"
        ? await query({
            type: rawArgs?.gameName,
            host: uriParsed?.hostname,
            port:
              uriParsed?.port ??
              (quickCheck({
                rawString: rawArgs?.gameName,
                checkType: "id",
                returnType: "all",
              })?.port ||
                quickCheck({
                  rawString: rawArgs?.gameName,
                  checkType: "id",
                  returnType: "all",
                })?.queryPort),
            maxAttempts: Math.floor(Math.random() * 10) + 5,
            attemptTimeout: 10 * 1000,
          })?.catch(() => undefined)
        : undefined;
    rawGameStatusData =
      rawArgs?.host &&
      typeof rawArgs?.host === "string" &&
      rawArgs?.host?.trim() !== "" &&
      rawGameStatusData
        ? frontEndEmployer.#__parseRemainingQuery(
            rawGameStatusData,
            rawArgs?.host
          )
        : undefined;
    if (rawGameStatusData)
      frontEndEmployer.#__recordData(
        rawGameStatusData,
        quickCheck({
          rawString: rawArgs?.gameName,
          checkType: "id",
          returnType: "all",
        })?.gameName
      );
    return {
      name: rawArgs?.name ?? undefined,
      players: rawGameStatusData
        ? {
            onlinePlayers:
              rawArgs?.hidePlayersCount !== "true"
                ? rawGameStatusData.players?.length > 0
                  ? rawGameStatusData.players?.map((player) => player?.name)
                  : []
                : undefined,
            formatedPlayers:
              rawArgs?.hidePlayersNames !== "true"
                ? rawGameStatusData.players?.length > 0
                  ? rawGameStatusData.players
                      ?.map((player, index) => {
                        if (
                          !(
                            player?.name &&
                            typeof player?.name === "string" &&
                            !["", "null", "undefined"].includes(
                              player?.name?.toLowerCase()?.trim()
                            ) &&
                            !/\u00A7[0-9A-FK-OR]/gi.test(
                              player?.name?.toLowerCase()?.trim()
                            )
                          )
                        )
                          ++garbageHiddenCaches;
                        else if (index <= 14)
                          return (
                            ++__indexingNumbers +
                            ") " +
                            player.name?.replace(/\u00A7[0-9A-FK-OR]/gi, "")
                          );
                        if (index === rawGameStatusData.players?.length - 1)
                          return (
                            (garbageHiddenCaches && garbageHiddenCaches > 0
                              ? garbageHiddenCaches === 1
                                ? "\n - More 1 Player is Unfetchable/Hidden -"
                                : `\n - ${garbageHiddenCaches} More Players are Unfetchable/Hidden -`
                              : "") +
                            (rawGameStatusData.players?.length -
                              garbageHiddenCaches -
                              15 >
                            0
                              ? rawGameStatusData.players?.length -
                                  garbageHiddenCaches -
                                  15 ===
                                1
                                ? "\n - 1 More Player is Online -"
                                : `\n - ${
                                    rawGameStatusData.players?.length -
                                    garbageHiddenCaches -
                                    15
                                  } More Players are Online -`
                              : "")
                          );
                        else return undefined;
                      })
                      ?.filter(Boolean)
                      ?.join(" \n")
                  : "<> No Online Players are Detected <>"
                : undefined,
            formattedTime:
              rawArgs?.hidePlayersNames !== "true"
                ? rawGameStatusData.players?.length > 0 &&
                  rawGameStatusData.players
                    ?.slice(0, 15)
                    ?.find((player) => player?.logggedTime)
                  ? rawGameStatusData.players
                      ?.map((player, index) => {
                        if (
                          !(
                            player?.name &&
                            typeof player?.name === "string" &&
                            !["", "null", "undefined"].includes(
                              player?.name?.toLowerCase()?.trim()
                            ) &&
                            !/\u00A7[0-9A-FK-OR]/gi.test(
                              player?.name?.toLowerCase()?.trim()
                            )
                          )
                        )
                          return undefined;
                        else if (index <= 14) {
                          return player?.logggedTime &&
                            !isNaN(Number(player?.logggedTime))
                            ? __prettyMsLTE(player?.logggedTime) +
                                (player.name?.length > 20 ? "\n" : "")
                            : `- None -` +
                                (player.name?.length > 20 ? "\n" : "");
                        } else return undefined;
                      })
                      ?.filter(Boolean)
                      ?.join(" \n")
                  : undefined
                : undefined,
            formattedScore:
              rawArgs?.hidePlayersNames !== "true"
                ? rawGameStatusData.players?.length > 0 &&
                  rawGameStatusData.players
                    ?.slice(0, 15)
                    ?.find(
                      (player) =>
                        player?.score &&
                        (!isNaN(Number(player.score)) || player.score === 0)
                    )
                  ? rawGameStatusData.players
                      ?.map((player, index) => {
                        if (
                          !(
                            player?.name &&
                            typeof player?.name === "string" &&
                            !["", "null", "undefined"].includes(
                              player?.name?.toLowerCase()?.trim()
                            ) &&
                            !/\u00A7[0-9A-FK-OR]/gi.test(
                              player?.name?.toLowerCase()?.trim()
                            )
                          )
                        )
                          return undefined;
                        else if (index <= 14) {
                          return player?.score || player.score === 0
                            ? `${player?.score}` +
                                (player.name?.length > 20 ? "\n" : "")
                            : `- None -` +
                                (player.name?.length > 20 ? "\n" : "");
                        } else return undefined;
                      })
                      ?.filter(Boolean)
                      ?.join(" \n")
                  : undefined
                : undefined,
            formattedTeam:
              rawArgs?.hidePlayersNames !== "true"
                ? rawGameStatusData.players?.length > 0 &&
                  rawGameStatusData.players
                    ?.slice(0, 15)
                    ?.find((player) => player?.team || player?.team === 0)
                  ? rawGameStatusData.players
                      ?.map((player, index) => {
                        if (
                          !(
                            player?.name &&
                            typeof player?.name === "string" &&
                            !["", "null", "undefined"].includes(
                              player?.name?.toLowerCase()?.trim()
                            ) &&
                            !/\u00A7[0-9A-FK-OR]/gi.test(
                              player?.name?.toLowerCase()?.trim()
                            )
                          )
                        )
                          return undefined;
                        else if (index <= 14) {
                          return player?.team || player?.team === 0
                            ? (rawGameStatusData?.raw?.teams?.[player?.team]
                                ?.name ?? `${player?.team}`) +
                                (player.name?.length > 20 ? "\n" : "")
                            : `- None -` +
                                (player.name?.length > 20 ? "\n" : "");
                        } else return undefined;
                      })
                      ?.filter(Boolean)
                      ?.join(" \n")
                  : undefined
                : undefined,
            formattedPing:
              rawArgs?.hidePlayersNames !== "true"
                ? rawGameStatusData.players?.length > 0 &&
                  rawGameStatusData.players
                    ?.slice(0, 15)
                    ?.find((player) => player?.ping || player?.ping === 0)
                  ? rawGameStatusData.players
                      ?.map((player, index) => {
                        if (
                          !(
                            player?.name &&
                            typeof player?.name === "string" &&
                            !["", "null", "undefined"].includes(
                              player?.name?.toLowerCase()?.trim()
                            ) &&
                            !/\u00A7[0-9A-FK-OR]/gi.test(
                              player?.name?.toLowerCase()?.trim()
                            )
                          )
                        )
                          return undefined;
                        else if (index <= 14) {
                          return (player?.ping || player?.ping === 0) &&
                            ![""].includes(player?.ping)
                            ? `${player?.ping}` +
                                (player.name?.length > 20 ? "\n" : "")
                            : `- None -` +
                                (player.name?.length > 20 ? "\n" : "");
                        } else return undefined;
                      })
                      ?.filter(Boolean)
                      ?.join(" \n")
                  : undefined
                : undefined,
            maxPlayers:
              rawArgs?.hidePlayersCount !== "true"
                ? parseInt(rawGameStatusData.maxplayers)
                : undefined,
          }
        : undefined,
      host: !(rawArgs?.hideIp === "true" && rawArgs?.hidePort === "true")
        ? rawArgs?.hideIp === "true"
          ? "||`Hidden Ip`||" +
            (uriParsed?.port ? ":`" + uriParsed?.port + "`" : "")
          : rawArgs?.hidePort === "true"
          ? "`" +
            uriParsed?.hostname +
            (uriParsed?.port ? "`:" + "||`Hidden Port`||" : "`")
          : "`" +
            uriParsed?.hostname +
            (uriParsed?.port ? "`:`" + uriParsed?.port + "`" : "`")
        : "||`Hidden Host`||",
      status: rawGameStatusData ? "Online" : undefined,
      ping:
        rawArgs?.hidePing !== "true"
          ? rawGameStatusData?.ping ??
            rawGameStatusData?.raw?.ping ??
            "Un - Fetchable"
          : undefined,
      password:
        rawArgs?.hidePassword !== "true"
          ? rawGameStatusData?.password ?? "Not - Found Or False"
          : undefined,
      pfp:
        rawArgs?.hidePfp === "true"
          ? frontEndEmployer?.defaultValue?.pfp
          : rawArgs?.pfp ?? frontEndEmployer?.defaultValue?.pfp,
      banner: rawArgs?.hideBanner === "true" ? undefined : rawArgs?.banner,
      thumbnail:
        rawArgs?.hideThumbnail === "true" ? undefined : rawArgs?.thumbnail,
      color: rawArgs?.color ?? frontEndEmployer.defaultValue?.color,
      name:
        rawArgs?.name
          ?.replace(/[^\u0000-\u00ff]/gi, "")
          ?.replace(/\u00A7[0-9A-FK-OR]/gi, "") ??
        frontEndEmployer.defaultValue?.name,
      description:
        rawArgs?.description?.replace(/\u00A7[0-9A-FK-OR]/gi, "") ??
        rawGameStatusData?.name?.replace(/\u00A7[0-9A-FK-OR]/gi, "") ??
        (rawGameStatusData?.map &&
        rawGameStatusData?.map !== "" &&
        rawGameStatusData?.map?.length >= 15
          ? rawGameStatusData?.map?.replace(/\u00A7[0-9A-FK-OR]/gi, "")
          : frontEndEmployer.defaultValue?.description),
      map: !(
        rawGameStatusData?.map &&
        rawGameStatusData?.map !== "" &&
        rawGameStatusData?.map?.length < 15
      )
        ? !(
            rawGameStatusData?.raw?.gamemode &&
            rawGameStatusData?.raw?.gamemode !== "" &&
            rawGameStatusData?.raw?.gamemode?.length < 15
          )
          ? rawGameStatusData?.raw?.mapname &&
            rawGameStatusData?.raw?.mapname !== "" &&
            rawGameStatusData?.raw?.mapname?.length < 15
            ? rawGameStatusData?.raw?.mapname?.replace(
                /\u00A7[0-9A-FK-OR]/gi,
                ""
              )
            : undefined
          : rawGameStatusData?.raw?.gamemode?.replace(
              /\u00A7[0-9A-FK-OR]/gi,
              ""
            )
        : rawGameStatusData?.map?.replace(/\u00A7[0-9A-FK-OR]/gi, ""),
      gameName: quickCheck({
        rawString: rawArgs?.gameName,
        checkType: "id",
        returnType: "all",
      })?.gameName,
      slotId: rawArgs?.slotId,
      maintenance: ["true", "yes"].includes(
        rawArgs?.maintenance?.toLowerCase()?.trim()
      )
        ? rawArgs?.maintenanceDescription?.replace(
            /\u00A7[0-9A-FK-OR]/gi,
            ""
          ) ?? frontEndEmployer.defaultValue?.maintenance?.description
        : undefined,
    };
  }
  static #__parseRemainingQuery(rawData, uniqueIndentifier) {
    if (
      !rawData?.players?.find(
        (player) =>
          player?.raw?.time ||
          player?.raw?.time === 0 ||
          player?.raw?.score ||
          player?.raw?.score === 0 ||
          player?.raw?.team ||
          player?.raw?.team === 0 ||
          player?.raw?.ping ||
          player?.raw?.ping === 0
      )
    ) {
      let __customPlayTimeAddonInstance =
        __customPlayTimeAddon.getInstance(uniqueIndentifier) ??
        new __customPlayTimeAddon(rawData?.players, uniqueIndentifier);
      rawData.players =
        rawData.players?.length > 0
          ? __customPlayTimeAddonInstance.parse(rawData?.players) ?? []
          : [];
    }
    if (
      rawData?.players &&
      Array.isArray(rawData?.players) &&
      rawData?.players?.length > 0
    )
      rawData.players = rawData.players?.map((player) => {
        return {
          ...player,
          logggedTime:
            player?.raw?.time &&
            parseInt(player?.raw?.time) &&
            parseInt(player?.raw?.time) >= 0
              ? parseInt(player?.raw?.time * 1000)
              : player?.playTime &&
                parseInt(player?.playTime) &&
                parseInt(player?.playTime) >= 0
              ? parseInt(player?.playTime)
              : undefined,
          score:
            (player?.raw?.score || player?.raw?.score === 0) &&
            !isNaN(Number(player?.raw?.score))
              ? parseInt(player?.raw?.score)
              : undefined,
          team: player?.raw?.team,
          playerPing:
            (player?.raw?.ping || player?.raw?.ping === 0) &&
            parseInt(player?.raw?.ping)
              ? parseInt(player?.raw?.ping)
              : undefined,
        };
      });

    if (!rawData?.raw) return rawData;
    let rawObjects = Object.entries(rawData?.raw);
    rawObjects.map((data) => {
      if (typeof data[1] === "object" && !Array.isArray(data[1]))
        rawData.raw = { ...rawData.raw, ...data[1] };
    });
    return rawData;
  }
  static async #__embedDelivery(bot, rawDatas, caches) {
    let rawMessage;
    if (!(bot && rawDatas?.packages && rawDatas?.channel?.name))
      return undefined;
    else if (
      rawDatas?.messageId &&
      typeof rawDatas?.messageId === "string" &&
      rawDatas?.messageId !== ""
    ) {
      rawMessage =
        rawDatas?.channel?.messages?.cache?.get(rawDatas?.messageId?.trim()) ??
        (await rawDatas?.channel?.messages
          ?.fetch({ message: rawDatas?.messageId?.trim(), cache: true })
          ?.catch(() => undefined));
      if (!rawMessage?.channel)
        rawMessage = await rawDatas?.channel
          ?.send(rawDatas?.packages)
          ?.catch(() => undefined);
      else await rawMessage?.edit(rawDatas?.packages)?.catch(() => undefined);
    } else
      rawMessage = await rawDatas?.channel
        ?.send(rawDatas?.packages)
        ?.catch(() => undefined);
    if (
      !rawMessage ||
      (rawDatas?.messageId && rawMessage?.id === rawDatas?.messageId)
    )
      return rawMessage;
    else return await frontEndEmployer.#__registerMessageId(rawMessage, caches);
  }
  static async getData(
    fetchType = "all",
    slotId = undefined,
    messageId = undefined,
    returnFetch = true
  ) {
    let databaseValues;
    if (fetchType?.toLowerCase()?.trim() === "all")
      databaseValues =
        (await databaseManager.fetch("universalGuildSettings", {
          fetchCache: returnFetch ?? true,
          category: "status",
          subCategory: "server",
        })) ?? [];
    else
      databaseValues =
        (await databaseManager.fetch("universalGuildSettings", {
          guildId: fetchType,
          fetchCache: returnFetch ?? true,
          category: "status",
          subCategory: "server",
        })) ?? [];
    if (databaseValues && Array.isArray(databaseValues))
      return databaseValues
        .map((data) => {
          data.rawArgs =
            databaseManager.__customParser(undefined, {
              rawArgs: data?.rawArgs,
              tableName: "universalGuildSettings",
              categoryName: "status",
              subCategory: "server",
            }) ?? data?.rawArgs;
          if (
            (!(slotId && typeof slotId === "string" && slotId?.trim() !== "") &&
              !(
                messageId &&
                typeof messageId === "string" &&
                messageId?.trim() !== ""
              )) ||
            (slotId &&
              typeof slotId === "string" &&
              slotId?.trim() !== "" &&
              data.rawArgs?.slotId?.trim() === slotId?.trim()) ||
            (messageId &&
              typeof messageId === "string" &&
              messageId?.trim() !== "" &&
              data.rawArgs?.messageId?.trim() === messageId?.trim()) ||
            (slotId &&
              typeof slotId === "string" &&
              slotId?.toLowerCase()?.trim() === "all")
          )
            return data;
          else return undefined;
        })
        ?.filter(Boolean);
    else return undefined;
  }
  static __commonCustomId(rawMessageData) {
    if (
      !(
        rawMessageData &&
        typeof rawMessageData === "string" &&
        rawMessageData !== ""
      )
    )
      return undefined;
    return __fetchInteractionCustomId(
      {
        interactionType: "button",
        category: "serverStatus",
        subCategory: "refresh",
        messageUri: rawMessageData,
      },
      false
    )?.customId;
  }
  static async #__registerMessageId(rawMessage, rawData) {
    let __tempCachedData = rawData;
    if (!__tempCachedData.rawArgs) return undefined;
    __tempCachedData.rawArgs =
      databaseManager.__customParser(undefined, {
        rawArgs: __tempCachedData?.rawArgs,
        tableName: "universalGuildSettings",
        categoryName: "status",
      }) ?? __tempCachedData?.rawArgs;
    __tempCachedData.rawArgs["messageId"] = rawMessage?.id;
    return await databaseManager.__query(
      `UPDATE universalGuildSettings SET rawArgs = "${databaseManager.__customParser(
        {
          structures: __tempCachedData?.rawArgs,
          tableName: "universalGuildSettings",
          categoryName: "status",
        }
      )}" WHERE guildId = "${
        rawMessage?.guild?.id
      }" AND category = "status" AND subCategory = "server" AND uId = "${
        __tempCachedData?.uId
      }"`,
      undefined,
      false,
      undefined,
      "universalGuildSettings"
    );
  }
  static #__recordData(rawData, gameName) {
    if (
      frontEndEmployer.#__privateCachesData[`"${gameName}"`] === rawData?.name
    )
      return undefined;
    else frontEndEmployer.#__privateCachesData[`"${gameName}"`] = rawData?.name;
    return __fileFunctions(
      "write",
      (__fileFunctions("read", undefined, {
        filePath: frontEndEmployer.defaultValue.fileCachespath,
        directoryPath: frontEndEmployer.defaultValue.directoryPath,
        encodingType: frontEndEmployer.defaultValue?.encodingType,
      }) ?? "") +
        "[ " +
        gameName +
        " ]\n\n" +
        JSON.stringify(rawData) +
        "\n\n\n",
      {
        filePath: frontEndEmployer.defaultValue.fileCachespath,
        directoryPath: frontEndEmployer.defaultValue.directoryPath,
        encodingType: frontEndEmployer.defaultValue?.encodingType,
      }
    );
  }
}

module.exports = frontEndEmployer;
