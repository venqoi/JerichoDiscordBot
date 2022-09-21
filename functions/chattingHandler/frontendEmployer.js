require("dotenv").config();
const { chattingKey, chattingId } = process.env;
const { Message, MessageMentions } = require("discord.js");
const databaseManager = require("../coreHandler/externalHandler/databaseCore");
const translaterTool = require("translate-google");
const Axios = require("axios").default;
const { URL } = require("url");
const { guildPrefixFetcher } = require("../../Utilities/__miscUtils");
const { __internalErrorManager } = require("../../Utilities/__cacheUtils");

class frontEndEmployer {
  static __chattingApi = { baseUrl: "http://api.brainshop.ai/get?" };
  static dialogues = {
    error: {
      music: `Ouch! I can't help with other Stuff than "chatting" here , Please look in - \`//prefix//player help\``,
      news: `Grab Some News at "https://www.bbc.com/news" and UptoDate yourself!!`,
      default: `Ouch! I can't help with other Stuff than "chatting" here`,
    },
  };
  static async __header(bot, rawMessage) {
    try {
      if (
        !frontEndEmployer.__rawContentChecking(bot, rawMessage) ||
        !(rawMessage instanceof Message)
      )
        return undefined;
      await rawMessage.channel.sendTyping();
      let __tempGuildSetting = frontEndEmployer.__quickCheck(rawMessage);
      if (!__tempGuildSetting?.rawArgs?.channelId) return undefined;
      let __cookedResponse = await frontEndEmployer.__capture(
        rawMessage,
        __tempGuildSetting
      );
      return await rawMessage
        ?.reply({
          content:
            __cookedResponse?.response ??
            `**Oopsie.. Woah! You got my Brain Tangle . Hehehe!! Wait I am going for some Shower**`,
          ...{ allowedMentions: { repliedUser: false } },
          ...__cookedResponse?.options,
        })
        ?.catch(() => undefined);
    } catch (error) {
      __internalErrorManager(error, {
        category: "frontEndEmployer.__header Function",
      });
      return undefined;
    }
  }
  static __rawContentChecking(bot, rawMessage) {
    return Boolean(
      rawMessage &&
        rawMessage instanceof Message &&
        rawMessage?.channel &&
        !(
          rawMessage?.content?.toLowerCase()?.trim()?.startsWith("<@") &&
          (rawMessage?.mentions?.users?.first()?.id ||
            rawMessage?.mentions?.roles?.first()?.id)
        ) &&
        !(
          rawMessage?.content?.split(" ")?.length === 2 &&
          !isNaN(Number(rawMessage?.content?.split(" ")?.[1]?.trim())) &&
          rawMessage?.content
            ?.split(" ")
            ?.find((word) =>
              [
                "clear",
                "purge",
                "clean",
                "delete",
                "remove",
                "bulkdelete",
              ].includes(word?.toLowerCase()?.trim())
            )
        ) &&
        ((rawMessage?.mentions?.repliedUser?.id &&
          rawMessage?.mentions?.repliedUser?.id === bot?.user?.id) ??
          !rawMessage?.mentions?.repliedUser?.id)
    );
  }
  static async __capture(rawMessage, __tempGuildSetting) {
    if (!(rawMessage && rawMessage instanceof Message)) return undefined;
    if (!__tempGuildSetting?.guildId) return undefined;
    let __tempString = await frontEndEmployer.__translateManager(
      frontEndEmployer.__componentParser(rawMessage) ?? rawMessage?.content
    );
    let __tempRawResponse = await frontEndEmployer.__fetchApiReply(
      __tempString,
      {
        queryParams: {
          authorId: rawMessage?.author?.id ?? rawMessage?.user?.id,
          guildId: rawMessage?.guildId ?? rawMessage?.guild?.id,
        },
      }
    );
    let __cookedResponse =
      (await frontEndEmployer.__translateManager(__tempRawResponse, {
        customLanguage: __tempGuildSetting?.rawArgs?.language ?? "en",
      })) ?? __tempRawResponse;
    return {
      response:
        __cookedResponse && __cookedResponse !== ""
          ? "**" + __cookedResponse + "**"
          : undefined,
      options: {
        allowedMentions: { repliedUser: false },
      },
    };
  }
  static async __fetchApiReply(rawContent, filters) {
    try {
      if (!rawContent || !filters) return undefined;
      const __tempRawResponse = await Axios.get(
        encodeURI(
          frontEndEmployer.__chattingApi?.baseUrl +
            `bid=${chattingId}&key=${chattingKey}&uid=${
              filters?.queryParams?.authorId ?? 0
            }&msg=${rawContent}`
        )
      ).catch(() => {
        return undefined;
      });
      if (!__tempRawResponse?.data?.cnt) return undefined;
      __tempRawResponse.data.cnt = frontEndEmployer.#__customParser(undefined, {
        rawString: __tempRawResponse?.data?.cnt,
        guildId: filters?.queryParams?.guildId,
        checkUrl: "www.msn.com",
      });
      return __tempRawResponse?.data?.cnt?.replace(/[&@<>]/g, "");
    } catch (error) {
      __internalErrorManager(error, {
        category: "frontEndEmployer.__fetchApiReply Function",
      });
      return undefined;
    }
  }
  static async __translateManager(rawContent, filters) {
    try {
      if (!(rawContent && rawContent !== "")) return rawContent;
      let __tempFilters = { to: "en" };
      if (!rawContent) return undefined;
      else if (filters?.customLanguage && filters?.customLanguage?.length <= 4)
        __tempFilters.to = filters?.customLanguage?.toLowerCase()?.trim();
      let __tempTranslatedString = await translaterTool(
        rawContent,
        __tempFilters
      )?.catch(async () => await translaterTool(rawContent, { to: "en" }));
      return __tempTranslatedString ?? undefined;
    } catch (error) {
      __internalErrorManager(error, {
        category: "frontEndEmployer.__translateManager Function",
      });
      return rawContent;
    }
  }
  static __componentParser(rawMessage) {
    if (!(rawMessage && rawMessage instanceof Message && rawMessage?.content))
      return undefined;
    let __tempContent = rawMessage?.content;
    if (rawMessage?.mentions?.channels?.first()?.name) {
      __tempContent = frontEndEmployer.#__customParser({
        content: __tempContent,
        mentions: Array.from(rawMessage?.mentions?.channels),
        pattern: MessageMentions?.CHANNELS_PATTERN,
      });
    }
    if (rawMessage?.mentions?.users?.first()?.username) {
      __tempContent = frontEndEmployer.#__customParser({
        content: __tempContent,
        mentions: Array.from(rawMessage?.mentions?.users),
        pattern: MessageMentions?.USERS_PATTERN,
      });
    }
    if (rawMessage?.mentions?.everyone) {
      return __tempContent.replace(
        MessageMentions.EVERYONE_PATTERN,
        "everyone"
      );
    }
    if (rawMessage?.mentions?.roles?.first()?.name) {
      __tempContent = frontEndEmployer.#__customParser({
        content: __tempContent,
        mentions: Array.from(rawMessage?.mentions?.roles),
        pattern: MessageMentions?.ROLES_PATTERN,
      });
    }
    if (
      rawMessage?.mentions?.members?.first()?.nickname ||
      rawMessage?.mentions?.members?.first()?.user?.username
    ) {
      __tempContent = frontEndEmployer.#__customParser({
        content: __tempContent,
        mentions: Array.from(rawMessage?.mentions?.members),
        pattern: MessageMentions?.USERS_PATTERN,
      });
    }
    if (rawMessage?.mentions?.client?.user?.username) {
      __tempContent = frontEndEmployer.#__customParser({
        content: __tempContent,
        mentions: [rawMessage?.mentions?.client],
        pattern: MessageMentions?.USERS_PATTERN,
      });
    }
    return __tempContent;
  }
  static __quickCheck(rawMessage, checkType = "channel") {
    let __tempChattingSetting = databaseManager.__customParser(
      undefined,
      undefined,
      {
        tableName: "universalGuildSettings",
        filters: {
          guildId: rawMessage?.guild?.id,
          category: "chatting",
          subCategory: "server",
          returnIndex: 0,
        },
      }
    );
    if (!__tempChattingSetting?.rawArgs) return undefined;
    __tempChattingSetting.rawArgs =
      databaseManager.__customParser(undefined, {
        rawArgs: __tempChattingSetting?.rawArgs,
        tableName: "universalGuildSettings",
        categoryName: "chatting",
      }) ?? __tempChattingSetting?.rawArgs;
    if (
      checkType?.toLowerCase()?.trim() === "channel" &&
      __tempChattingSetting?.rawArgs &&
      __tempChattingSetting?.rawArgs?.channelId === rawMessage?.channel?.id
    )
      return __tempChattingSetting;
    else if (
      checkType?.toLowerCase()?.trim() === "guild" &&
      __tempChattingSetting?.guildId &&
      __tempChattingSetting?.guildId ===
        (rawMessage?.guildId || rawMessage?.guild?.id)
    )
      return __tempChattingSetting;
    else return undefined;
  }
  static #__customParser(checkPatterns, parseApiExternalLinks) {
    if (
      checkPatterns?.content &&
      typeof checkPatterns?.content === "string" &&
      checkPatterns?.mentions &&
      checkPatterns?.pattern
    ) {
      if (
        !(
          checkPatterns?.mentions?.length && checkPatterns?.mentions?.length > 0
        )
      )
        return undefined;
      let __tempCache = checkPatterns?.content;
      checkPatterns?.mentions.map((mention) => {
        __tempCache = __tempCache?.replace(
          checkPatterns?.pattern,
          mention?.name ??
            mention?.nickname ??
            mention?.user?.username ??
            mention?.username
        );
      });
      return __tempCache ?? checkPatterns?.content;
    } else if (
      parseApiExternalLinks?.rawString &&
      parseApiExternalLinks?.checkUrl
    ) {
      let __tempParsed =
        typeof parseApiExternalLinks?.rawString === "string"
          ? parseApiExternalLinks?.rawString.match(
              /(((https?:\/\/)|(www\.))[^\s]+)/g
            )
          : undefined;
      if (
        !(
          __tempParsed &&
          Array.isArray(__tempParsed) &&
          __tempParsed?.length > 0
        )
      )
        return parseApiExternalLinks?.rawString;

      let __tempGarbage,
        __tempPrefix = guildPrefixFetcher(parseApiExternalLinks?.guildId);
      for (let count = 0, len = __tempParsed.length; count < len; ++count) {
        __tempGarbage = new URL(__tempParsed[count]);
        if (
          __tempGarbage &&
          __tempGarbage?.hostname &&
          __tempGarbage?.pathname &&
          __tempGarbage?.hostname
            ?.toLowerCase()
            ?.trim()
            ?.includes(parseApiExternalLinks?.checkUrl ?? "www.msn.com") &&
          __tempGarbage?.pathname?.toLowerCase()?.trim()?.includes("music")
        )
          return frontEndEmployer.dialogues?.error?.music.replace(
            "//prefix//",
            __tempPrefix ?? "je!"
          );
        else if (
          __tempGarbage &&
          __tempGarbage?.hostname &&
          __tempGarbage?.pathname &&
          __tempGarbage?.hostname
            ?.toLowerCase()
            ?.trim()
            ?.includes(parseApiExternalLinks?.checkUrl ?? "www.msn.com") &&
          __tempGarbage?.pathname?.toLowerCase()?.trim()?.includes("news")
        )
          return frontEndEmployer.dialogues?.error?.news.replace(
            "//prefix//",
            __tempPrefix ?? "je!"
          );
        else if (
          __tempGarbage &&
          __tempGarbage?.hostname &&
          __tempGarbage?.pathname &&
          __tempGarbage?.hostname
            ?.toLowerCase()
            ?.trim()
            ?.includes(parseApiExternalLinks?.checkUrl ?? "www.msn.com")
        )
          return frontEndEmployer.dialogues?.error?.default.replace(
            "//prefix//",
            __tempPrefix ?? "je!"
          );
      }
      return parseApiExternalLinks?.rawString ?? "";
    } else return undefined;
  }
}

module.exports = frontEndEmployer;
