const { Message, BaseChannel, EmbedBuilder } = require('discord.js')
const bookFrameworkEngine = require('../coreHandler/internalHandler/__bookFramework')
const databaseManager = require('../coreHandler/externalHandler/databaseCore')
const questionEnv = require('../coreHandler/internalHandler/threadModals')
const {
  __rawFetchBody,
  __fileFunctions,
} = require('../../Utilities/__miscUtils.js')

class chattingBackend {
  static caches = {
    __languageTextUrl:
      'https://github.com/umpirsky/language-list/blob/master/data/en/language.txt',
    defaultFileCachePath: {
      directoryPath: '../../resources/__solidCaches',
      filePath: '__rawLanguagesList.txt',
      encodingType: 'utf8',
    },
    parsedLanguagesList: undefined,
  }
  static rawQuestionEmbed = {
    channelEmbed: {
      title:
        '**<:announcements:852963180732350484> Chatting Channel Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select Text Channel from the below in-built Menu List for the Server**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **Please Select 1 Option from the Below List even the Menus are greater than 1**\n\n__**Extra Side Operation**__\n> **You can mention Channel like : \`#general\` OR You can give Channel Id Or Channel Name as \`56123xxxxxxx.... OR general\` from Developer Role to Channel Settings**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/7jA9AhU.jpg',
      components: {
        minValues: 1,
        maxValues: 1,
      },
    },
    languageEmbed: {
      title: '**<:announcements:852963180732350484> Language Code Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select Universal Language Code for the Server like \`en/ru or e.t.c\` from [Source of Languages Codes](https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code) or Above List**\n<a:twitch100:805342901256192021> **Jericho will use Google Translator on Both ends to trnaslate languages**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **Please give a Valid Language Code or else chatting won't work**\n<a:twitch100:805342901256192021> **Please give \`en\` for \`English\` as Default if you don't want to change it**\n<a:twitch100:805342901256192021> **Or Give \`default\` or \`null\` to save a default value**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/jQ79mXp.jpg',
      captureDefault: 'en',
    },
    endEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Completed**',
      embedDescription: `**Config Process is Ended and Completed with no Errors**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Config by -** \`je!chatting check\`\n**<a:turuncu:852965555018399775> You can Edit Saved Config by -** \`je!chatting edit <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Config by -** \`je!chatting delete\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    crashEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Crashed**',
      embedDescription: `**Config Process is Ended and Crashed**\n**Please Retry after Sometime or Reach Developer at Support Server**\n\n__**Reasons**__\n<a:turuncu:852965555018399775>  **Process is Crashed Because of Wrong Type Value**\n<a:turuncu:852965555018399775>  **Api Error during Api Calls and Thread Customization during the Process**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Config by -** \`je!chatting check\`\n**<a:turuncu:852965555018399775> You can Edit Saved Config by -** \`je!chatting edit <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Config by -** \`je!chatting delete\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    haltEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Halted Mid-Way**',
      embedDescription: `**Config Process is Halted and Ended with no Issue**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Config by -** \`je!chatting check\`\n**<a:turuncu:852965555018399775> You can Edit Saved Config by -** \`je!chatting edit <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Config by -** \`je!chatting delete\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    editEmbed: {
      title:
        '**<:announcements:852963180732350484> Editting Config Option Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select Respective Option from the below in-built Menu List for the Server**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **Please Select 1 Option from the Below List even the Menus are greater than 1**`,
      maxTime: 2 * 60 * 1000,
      components: {
        minValues: 1,
        maxValues: 1,
        options: [
          {
            label: '🏁 Channel',
            emoji: '<a:XTN90:725107292768305172>',
            description:
              'Change Config for Server Text Channel for the feature in Server',
            value: 'Channel',
          },
          {
            label: '💯 Language',
            emoji: '<a:redstar:796503787292459088>',
            description:
              'Change Config for Language Code for the feature in Server',
            value: 'Language',
          },
        ],
      },
    },
  }
  async __setupConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'chatting',
          subCategory: 'server',
          returnIndex: 0,
        })) ?? undefined
      if (databaseCredentials) return undefined
      const filter = (upcomingMessage) =>
        upcomingMessage?.author?.id ===
        (rawMessage?.author?.id ?? rawMessage?.user?.id)
      let __tempLogs = {}
      switch (configFilters?.selection?.toLowerCase()?.trim()) {
        case 'setupchannel':
          __tempLogs['channelId'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.channelId
              ? configFilters?.skipCapture?.channelId
              : await this.__fetchChannelId(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.channelEmbed,
                )
          return await this.__databaseDelivery(rawMessage, {
            ...__tempLogs,
            selection: 'setup',
            guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
          })
        case 'setuplanguage':
          __tempLogs['language'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.language
              ? configFilters?.skipCapture?.language
              : await this.__fetchString(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.languageEmbed,
                  true,
                )
          if (!__tempLogs['language'])
            return await this.__destroyHandler('error')
          __tempLogs['language'] = __tempLogs['language']?.toLowerCase()?.trim()
          return await this.__databaseDelivery(rawMessage, {
            ...__tempLogs,
            selection: 'setup',
            guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
          })
        default:
          __tempLogs['channelId'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.channelId
              ? configFilters?.skipCapture?.channelId
              : await this.__fetchChannelId(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.channelEmbed,
                )
          __tempLogs['language'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.language
              ? configFilters?.skipCapture?.language
              : await this.__fetchString(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.languageEmbed,
                  true,
                )
          __tempLogs['language'] = __tempLogs?.['language']
            ?.toLowerCase()
            ?.trim()
          return await this.__databaseDelivery(rawMessage, {
            ...__tempLogs,
            selection: 'setup',
            guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
          })
      }
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __editConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'chatting',
          subCategory: 'server',
          returnIndex: 0,
        })) ?? undefined
      if (!databaseCredentials) return undefined
      const filter = (upcomingMessage) =>
        upcomingMessage?.author?.id ===
        (rawMessage?.author?.id ?? rawMessage?.user?.id)
      let __tempLogs =
        databaseManager.__customParser(undefined, {
          rawArgs: databaseCredentials?.rawArgs,
          tableName: 'universalGuildSettings',
          categoryName: 'chatting',
        }) ?? {}
      switch (configFilters?.selection?.toLowerCase()?.trim()) {
        case 'editchannel':
          __tempLogs['column'] = 'channelId'
          __tempLogs['value'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.channelId
              ? configFilters?.skipCapture?.channelId
              : await this.__fetchChannelId(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.channelEmbed,
                )
          return await this.__databaseDelivery(rawMessage, {
            ...__tempLogs,
            selection: 'edit',
            guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
          })
        case 'editlanguage':
          __tempLogs['column'] = 'language'
          __tempLogs['value'] =
            configFilters?.skipCapture && configFilters?.skipCapture?.language
              ? configFilters?.skipCapture?.language
              : await this.__fetchString(
                  rawMessage,
                  filter,
                  chattingBackend.rawQuestionEmbed?.languageEmbed,
                  true,
                )
          if (!(__tempLogs['value'] && __tempLogs['value']?.trim() !== ''))
            return await this.__destroyHandler('error')
          __tempLogs['value'] = __tempLogs['value']?.toLowerCase()?.trim()
          return await this.__databaseDelivery(rawMessage, {
            ...__tempLogs,
            selection: 'edit',
            guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
          })
        default:
          let __tempCaptureParent = await this.__fetchInteractionOption(
            rawMessage,
            chattingBackend.rawQuestionEmbed?.editEmbed,
          )
          if (
            !__tempCaptureParent ||
            __tempCaptureParent?.toLowerCase()?.trim() === 'end'
          )
            return undefined
          if (__tempCaptureParent?.toLowerCase()?.trim() === 'channel') {
            __tempLogs['column'] = 'channelId'
            __tempLogs['value'] =
              configFilters?.skipCapture &&
              configFilters?.skipCapture?.channelId
                ? configFilters?.skipCapture?.channelId
                : await this.__fetchChannelId(
                    rawMessage,
                    filter,
                    chattingBackend.rawQuestionEmbed?.channelEmbed,
                  )

            return await this.__databaseDelivery(rawMessage, {
              ...__tempLogs,
              selection: 'edit',
              guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
            })
          } else if (
            __tempCaptureParent?.toLowerCase()?.trim() === 'language'
          ) {
            __tempLogs['column'] = 'language'
            __tempLogs['value'] =
              configFilters?.skipCapture && configFilters?.skipCapture?.language
                ? configFilters?.skipCapture?.language
                : await this.__fetchString(
                    rawMessage,
                    filter,
                    chattingBackend.rawQuestionEmbed?.languageEmbed,
                  )
            if (!(__tempLogs['value'] && __tempLogs['value']?.trim() !== ''))
              return await this.__destroyHandler('error')
            __tempLogs['value'] = __tempLogs['value']?.toLowerCase()?.trim()
            return await this.__databaseDelivery(rawMessage, {
              ...__tempLogs,
              selection: 'edit',
              guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
            })
          } else return undefined
      }
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __deleteConfig(rawMessage) {
    if (!(rawMessage && rawMessage instanceof Message)) return undefined
    let databaseCredentials =
      (await databaseManager.fetch('universalGuildSettings', {
        guildId: rawMessage?.guild?.id,
        fetchCache: true,
        category: 'chatting',
        subCategory: 'server',
        returnIndex: 0,
      })) ?? undefined
    if (!databaseCredentials) return undefined
    else
      return await this.__databaseDelivery(rawMessage, {
        selection: 'delete',
        guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
      })
  }
  async __fetchInteractionOption(rawMessage, rawQuestionEmbed) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      {
        ...rawQuestionEmbed,
        components: {
          ...rawQuestionEmbed?.components,
        },
        caches: { cachedMessage: rawMessage },
      },
      undefined,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['interaction'],
        readAuthorId: rawMessage?.author?.id,
        returnType: 'string',
      },
    )
    if (!__tempResponse) return undefined
    else return __tempResponse
  }

  async __fetchChannelId(
    rawMessage,
    filter,
    rawQuestionEmbed,
    ifresolve = false,
  ) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    const cacheChannels = await rawMessage?.guild?.channels?.fetch()
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      {
        ...rawQuestionEmbed,
        components: {
          ...rawQuestionEmbed?.components,
          options: cacheChannels
            ?.map((channel) => {
              if (
                ![
                  'GUILD_VOICE',
                  'GROUP_DM',
                  'DM',
                  'GUILD_CATEGORY',
                  'GUILD_STORE',
                  'GUILD_NEWS_THREAD',
                  'GUILD_PUBLIC_THREAD',
                  'GUILD_PRIVATE_THREAD',
                  'GUILD_STAGE_VOICE',
                  'UNKNOWN',
                ].includes(channel?.type)
              )
                return {
                  label: channel?.name,
                  description:
                    'Channel Name : ' +
                    channel?.name +
                    ' For Chatting Setup/Feature',
                  emoji: '<a:yes:817492826148700211>',
                  value: channel?.id,
                }
            })
            ?.filter(Boolean),
        },
        caches: { cachedMessage: rawMessage },
      },
      filter,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['interaction', 'string', 'mentions'],
        readAuthorId: rawMessage?.author?.id,
        returnType: 'channel',
      },
    )
    if (!__tempResponse) return await this.__destroyHandler('crashend')
    else if (__tempResponse instanceof BaseChannel) return __tempResponse?.id
    else if (__tempResponse?.mentions?.channels)
      return ifresolve
        ? __tempResponse?.mentions?.channels?.first()
        : __tempResponse?.mentions?.channels?.first()?.id
    else if (
      !rawQuestionEmbed?.skipHalt &&
      ((typeof __tempResponse?.content === 'string' &&
        __tempResponse?.content?.toLowerCase()?.trim() === 'end') ||
        (typeof __tempResponse === 'string' &&
          __tempResponse?.toLowerCase()?.trim() === 'end'))
    )
      return await this.__destroyHandler('halt')
    else if (__tempResponse?.content)
      return ifresolve
        ? this.threadChannel.guild.channels.resolve(__tempResponse?.content) ??
            undefined
        : this.threadChannel.guild.channels.resolve(__tempResponse?.content)?.id
    else return await this.__destroyHandler('crashend')
  }
  async __fetchString(
    rawMessage,
    filter,
    rawQuestionEmbed,
    showLanguagesCaches = false,
  ) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    if (showLanguagesCaches) {
      let cachedLanguages = await chattingBackend.#__defaultLanguages()
      let bookFramework = new bookFrameworkEngine(
        cachedLanguages?.map((cache, index) => {
          return `**\`${index + 1}) ${cache?.name}\` :** \`${cache?.code}\``
        }),
        {
          bookType: cachedLanguages?.length > 1 ? 'multiple40' : 'single',
          rawChannel: __tempThreadChannel,
          authorMessage: rawMessage,
          embedTexture: new Array(cachedLanguages?.length).fill({
            title: '⛰️ Languages List for Selection ⛰️',
          }),
        },
      )
      await bookFramework.start()
    }
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      rawQuestionEmbed,
      filter,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['string'],
      },
    )
    if (!__tempResponse) return await this.__destroyHandler('crashend')
    else if (
      !rawQuestionEmbed?.skipHalt &&
      ((typeof __tempResponse?.content === 'string' &&
        __tempResponse?.content?.toLowerCase()?.trim() === 'end') ||
        (typeof __tempResponse === 'string' &&
          __tempResponse?.toLowerCase()?.trim() === 'end'))
    )
      return await this.__destroyHandler('halt')
    else if (
      typeof __tempResponse?.content === 'string' &&
      ['default', 'null'].includes(
        __tempResponse?.content?.toLowerCase()?.trim(),
      )
    )
      return rawQuestionEmbed?.captureDefault ?? undefined
    else if (typeof __tempResponse?.content === 'string')
      return __tempResponse?.content
    else return await this.__destroyHandler('crashend')
  }
  async __databaseDelivery(rawMessage, rawSavedData) {
    if (!rawMessage?.channel || !rawSavedData) return undefined
    let __tempRawArgs, __tempCachedData
    if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('setup')
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          fetchCache: true,
        })) ?? []
      __tempRawArgs = databaseManager.__customParser({
        structures: {
          channelId: rawSavedData?.channelId,
          language: rawSavedData?.language?.toLowerCase()?.trim(),
        },
        tableName: 'universalGuildSettings',
        categoryName: 'chatting',
      })
      if (!__tempRawArgs) return undefined
      await databaseManager.__query(
        `INSERT INTO universalGuildSettings VALUES(${await databaseManager.__getuId(
          'universalGuildSettings',
        )},"chatting","server","${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }","${__tempRawArgs}")`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      return await this.__destroyHandler('end')
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('edit')
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId:
            rawMessage?.guild?.id ??
            rawSavedData?.guildId ??
            this.threadChannel?.guild?.id,
          category: 'chatting',
          fetchCache: true,
          subCategory: 'server',
          returnIndex: 0,
        })) ?? undefined
      if (
        !__tempCachedData?.rawArgs ||
        !(
          rawMessage?.guild?.id ||
          rawSavedData?.guildId ||
          this.threadChannel?.guild?.id
        )
      )
        return undefined
      __tempRawArgs =
        databaseManager.__customParser(undefined, {
          rawArgs: __tempCachedData?.rawArgs,
          tableName: 'universalGuildSettings',
          categoryName: 'chatting',
        }) ?? __tempCachedData?.rawArgs
      if (!__tempRawArgs) return undefined
      else if (rawSavedData?.column)
        __tempRawArgs[rawSavedData?.column] = rawSavedData?.value
      else if (rawSavedData?.channelId && rawSavedData?.language)
        __tempRawArgs = {
          ...__tempRawArgs,
          ...rawSavedData,
        }
      await databaseManager.__query(
        `UPDATE universalGuildSettings SET rawArgs = "${databaseManager.__customParser(
          {
            structures: __tempRawArgs,
            tableName: 'universalGuildSettings',
            categoryName: 'chatting',
          },
        )}" WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "chatting" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      return await this.__destroyHandler('end')
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('delete')
    ) {
      return await databaseManager.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "chatting" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
    } else return undefined
  }
  async __destroyHandler(errorType = 'error') {
    if (!this.threadChannel || !this.__threadEnv || this.__threadEnv?.destroyed)
      return true
    if (errorType?.toLowerCase()?.trim() === 'halt') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          chattingBackend.rawQuestionEmbed?.haltEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Halted!',
      )
      throw new Error('Question Process has been Halted!')
    } else if (errorType?.toLowerCase()?.trim() === 'crash') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          chattingBackend.rawQuestionEmbed?.crashEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Crashed un-Expectedly!',
      )
      throw new Error('Question Process has been Crashed Expectedly!')
    } else if (errorType?.toLowerCase()?.trim() === 'crashend') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          chattingBackend.rawQuestionEmbed?.crashEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Completed!',
      )
      throw new Error('Question Process has been Completed!')
    } else if (errorType?.toLowerCase()?.trim() === 'end') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          chattingBackend.rawQuestionEmbed?.endEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Completed!',
      )
      return true
    } else return true
  }
  #__customUtils(parseColumnResponse, customSendQueryParser) {
    if (
      parseColumnResponse?.value &&
      typeof parseColumnResponse?.value === 'string'
    ) {
      if (
        parseColumnResponse?.ignoreValues &&
        Array.isArray(parseColumnResponse?.ignoreValues) &&
        parseColumnResponse?.ignoreValues?.length > 0 &&
        parseColumnResponse?.ignoreValues.includes(
          parseColumnResponse?.value?.toLowerCase()?.trim(),
        )
      )
        return parseColumnResponse?.value
      else if (
        parseColumnResponse?.value?.toLowerCase()?.trim().startsWith('embed')
      )
        return (
          `embed` +
          parseColumnResponse?.value[5]?.toUpperCase() +
          parseColumnResponse?.value
            .substring(6, parseColumnResponse?.value?.length)
            ?.toLowerCase()
        )
      else
        return (
          `embed` +
          parseColumnResponse?.value[0]?.toUpperCase() +
          parseColumnResponse?.value
            .substring(1, parseColumnResponse?.value?.length)
            ?.toLowerCase()
        )
    } else if (customSendQueryParser) {
      let cookedEmbed = new EmbedBuilder()
        .setTitle(customSendQueryParser?.embedTitle ?? '')
        .setDescription(customSendQueryParser?.embedDescription ?? '')
        .setTimestamp()
        .setColor(customSendQueryParser?.embedColor ?? 'RANDOM')
      if (customSendQueryParser?.embedImage)
        cookedEmbed.setImage(customSendQueryParser?.embedImage)
      if (customSendQueryParser?.embedThumbnail)
        cookedEmbed.setThumbnail(customSendQueryParser?.embedThumbnail)
      return { embeds: [cookedEmbed] }
    } else return undefined
  }
  async #__questionProcessCreator(rawMessage) {
    if (!rawMessage) return undefined
    this.__threadEnv = new questionEnv()
    this.threadChannel = await this.__threadEnv.__create({
      rawMessage: rawMessage,
      options: {
        name: '🍁 Girlfriend Chatting Auditor 🍁',
        reason: '🍁 Auditor Process for Girlfriend Chatting for Server 🍁',
        messageId: rawMessage?.id,
      },
    })
    return this.threadChannel
  }
  static async #__defaultLanguages() {
    if (
      chattingBackend?.caches?.parsedLanguagesList &&
      Array.isArray(chattingBackend?.caches?.parsedLanguagesList) &&
      chattingBackend?.caches?.parsedLanguagesList?.length > 0
    )
      return chattingBackend?.caches?.parsedLanguagesList
    let __rawBody =
      chattingBackend?.cachedfileText ??
      (await __rawFetchBody(chattingBackend?.caches?.__languageTextUrl, {
        returnObject: 'data',
      }))
    if (!chattingBackend?.cachedfileText)
      chattingBackend.cachedfileText = __rawBody
    /**
     * @type {String[]} __rawPhaseOne -> Phase One as Array
     */
    let __rawPhaseOne =
        __rawBody && __rawBody?.includes('\r')
          ? __rawBody
              ?.split('\r\n')
              ?.filter(
                (raw) =>
                  raw &&
                  typeof raw === 'string' &&
                  raw?.toLowerCase()?.trim() !== '',
              )
          : __rawBody
              ?.split('\n')
              ?.filter(
                (raw) =>
                  raw &&
                  typeof raw === 'string' &&
                  raw?.toLowerCase()?.trim() !== '',
              ),
      __rawPhaseTwo = []
    __rawPhaseTwo = __rawPhaseOne
      .map((rawValue) => {
        return {
          name: rawValue?.split('(')?.[0]?.trim(),
          code: rawValue?.split('(')?.[1]?.replace(')', '')?.trim(),
        }
      })
      .filter(Boolean)

    chattingBackend.caches.parsedLanguagesList = __rawPhaseTwo ?? []
    return __rawPhaseTwo
  }
  static get cachedfileText() {
    return __fileFunctions('read', undefined, {
      filePath: chattingBackend.caches?.defaultFileCachePath?.filePath,
      directoryPath:
        chattingBackend.caches?.defaultFileCachePath?.directoryPath,
      encodingType: chattingBackend.caches?.defaultFileCachePath?.encodingType,
    })
  }
  static set cachedfileText(rawData) {
    return __fileFunctions('write', rawData, {
      filePath: chattingBackend.caches?.defaultFileCachePath?.filePath,
      directoryPath:
        chattingBackend.caches?.defaultFileCachePath?.directoryPath,
      encodingType: chattingBackend.caches?.defaultFileCachePath?.encodingType,
    })
  }
}

module.exports = chattingBackend
