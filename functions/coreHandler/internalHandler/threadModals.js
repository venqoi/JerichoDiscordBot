const {
  ThreadChannel,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuInteraction,
  ButtonBuilder,
  Message,
  BaseInteraction,
  ButtonInteraction,
  ButtonStyle,
} = require('discord.js')
const {
  sleep,
  __fetchInteractionCustomId,
} = require('../../../Utilities/__miscUtils')
const { __internalErrorManager } = require('../../../Utilities/__cacheUtils')
const {
  defaultAuthor,
  defaultFooter,
} = require('../../../resources/__defaultPublicCredentials')

class QuestionProcessGenerator {
  static cache = {}
  async __create(rawData) {
    try {
      if (!rawData?.rawMessage) return undefined
      else if (this.threadChannel) return undefined
      this.threadChannel = await this.#__customThreadCreator(
        rawData?.rawMessage,
        rawData?.options,
      )
      this.destroyed = false
      QuestionProcessGenerator.cache[this.threadChannel.id] = this
      return this.threadChannel
    } catch (error) {
      __internalErrorManager(error, {
        category: 'QuestionProcessGenerator.__create Function',
      })
      return undefined
    }
  }
  async destroy(
    rawTime = 10 * 1000,
    Reason = 'Question Process has been Ended',
  ) {
    try {
      if (!this.threadChannel || this.destroyed) return undefined
      this.destroyed = true
      await sleep(rawTime)
      this.threadChannel = await this.threadChannel?.guild?.channels
        ?.fetch(this.threadChannel?.id)
        .catch(() => {
          return undefined
        })
      if (!this.threadChannel) return undefined
      return await this.threadChannel.delete(Reason)
    } catch (error) {
      __internalErrorManager(error, {
        category: 'QuestionProcessGenerator.destroy Function',
      })
      return undefined
    }
  }
  static async __fetch(threadResolve) {
    try {
      var __tempThreadId = await rawChannel.threads.resolveId(threadResolve)
      return QuestionProcessGenerator.cache[__tempThreadId]
    } catch (error) {
      __internalErrorManager(error, {
        category: 'QuestionProcessGenerator.__fetch Function',
      })
      return undefined
    }
  }
  async #__customThreadCreator(rawMessage, rawOptions) {
    if (rawMessage?.channel && rawMessage?.channel instanceof ThreadChannel)
      return rawMessage?.channel
    else
      return await rawMessage?.channel?.threads.create({
        name: rawOptions?.name ?? 'Question Process by Jericho',
        startMessage: rawOptions?.messageId ?? rawMessage?.id ?? rawMessage,
        reason:
          rawOptions?.reason ??
          'Needed Space for Question Process and will be Deleted after completion',
      })
  }
  async __fetchArmontaryResponse(rawEmbed, filter, rawOptions) {
    try {
      if (!rawEmbed) return undefined
      let __tempEmbed = this.#__customEmbedGenerator(rawEmbed)
      if (!__tempEmbed) return undefined
      let cachedMessage = await this.#__questionDelivery(
        {
          embed: __tempEmbed?.embed,
          component: __tempEmbed?.component,
        },
        rawOptions,
      )
      if (rawOptions?.fetchType.includes('interaction'))
        return await this.#__fetchAwaitInteractionResponse(
          cachedMessage,
          __tempEmbed?.generatedCustomId,
          rawOptions,
        )
      if (rawOptions?.fetchType.includes('string'))
        return await this.#__fetchAwaitStringResponse(
          filter,
          cachedMessage,
          rawOptions,
        )
      if (rawOptions?.fetchType.includes('mentions'))
        return await this.#__fetchAwaitMentionsResponse(
          filter,
          cachedMessage,
          rawOptions,
          rawOptions?.returnType,
        )
    } catch (error) {
      __internalErrorManager(error, {
        category: 'QuestionProcessGenerator.__fetchArmontaryResponse Function',
      })
      return undefined
    }
  }
  #__fetchAwaitInteractionResponse(
    cachedMessage,
    generatedCustomId,
    rawOptions,
  ) {
    if (!this.threadChannel || !cachedMessage) return undefined
    return new Promise(async (resolve) => {
      let __tempInteractionCache = await new Promise((resolve) => {
        cachedMessage?.client?.on('interactionCreate', (interaction) => {
          if (
            interaction &&
            interaction instanceof BaseInteraction &&
            interaction?.message?.id === cachedMessage?.id &&
            (interaction?.customId === generatedCustomId ||
              interaction?.customId?.includes(generatedCustomId)) &&
            interaction?.user?.id === rawOptions?.readAuthorId
          )
            resolve(interaction)
        })
        cachedMessage?.client?.on('messageCreate', (message) => {
          if (
            message &&
            message instanceof Message &&
            message?.channel?.id === cachedMessage?.channel?.id
          )
            resolve(message)
        })
        setTimeout(
          () => resolve(undefined),
          rawOptions?.maxTime ?? rawOptions?.time ?? 5 * 60 * 1000,
        )
      })

      let __tempResponseValue
      if (
        __tempInteractionCache &&
        __tempInteractionCache instanceof ButtonInteraction &&
        __tempInteractionCache?.customId?.includes('end<\\>halt')
      )
        __tempResponseValue = rawOptions?.returnType
          ?.toLowerCase()
          ?.trim()
          ?.includes('array')
          ? ['end']
          : 'end'
      else if (
        __tempInteractionCache &&
        __tempInteractionCache instanceof SelectMenuInteraction &&
        __tempInteractionCache?.values?.[0] &&
        typeof __tempInteractionCache?.values?.[0] === 'string' &&
        __tempInteractionCache?.values?.[0] !== ''
      )
        __tempResponseValue = rawOptions?.returnType
          ?.toLowerCase()
          ?.trim()
          ?.includes('array')
          ? __tempInteractionCache?.values
          : __tempInteractionCache?.values?.[0]
      else if (
        __tempInteractionCache &&
        __tempInteractionCache instanceof Message &&
        __tempInteractionCache?.content &&
        typeof __tempInteractionCache?.content === 'string' &&
        __tempInteractionCache?.content !== ''
      )
        __tempResponseValue = rawOptions?.returnType
          ?.toLowerCase()
          ?.trim()
          ?.includes('array')
          ? [__tempInteractionCache?.content]
          : __tempInteractionCache?.content

      if (
        (__tempResponseValue &&
          typeof __tempResponseValue === 'string' &&
          __tempResponseValue?.toLowerCase()?.trim() === 'end') ||
        (Array.isArray(__tempResponseValue) &&
          __tempResponseValue?.length > 0 &&
          __tempResponseValue?.find(
            (data) => data?.toLowerCase()?.trim() === 'end',
          ))
      ) {
        if (
          __tempInteractionCache &&
          __tempInteractionCache instanceof BaseInteraction
        ) {
          await __tempInteractionCache
            .update({
              embeds: [
                {
                  title:
                    '<a:sharingan:805342816695877642> **Auditor Process has been Halted/Ended**',
                  author: defaultAuthor,
                  footer: defaultFooter,
                  description: `__**Response Analysis**__\n<a:no:797219912963719228> **Your Response : \`end/halt\`**\n<a:no:797219912963719228> **You can Re-Attempt the Process with more suitable reasoning and values**`,
                  color: 'DD0004',
                },
              ],
              components: [],
            })
            ?.catch(() => undefined)
        } else if (
          __tempInteractionCache &&
          __tempInteractionCache instanceof Message
        ) {
          await cachedMessage
            .edit({
              embeds: [
                {
                  title:
                    '<a:sharingan:805342816695877642> **Auditor Process has been Halted/Ended**',
                  author: defaultAuthor,
                  footer: defaultFooter,
                  description: `__**Response Analysis**__\n<a:no:797219912963719228> **Your Response : \`end/halt\`**\n<a:no:797219912963719228> **You can Re-Attempt the Process with more suitable reasoning and values**`,
                  color: 'DD0004',
                },
              ],
              components: [],
            })
            ?.catch(() => undefined)
        }
        return resolve('end')
      } else if (
        rawOptions?.returnType === 'channel' &&
        __tempInteractionCache &&
        __tempInteractionCache instanceof BaseInteraction
      ) {
        await __tempInteractionCache
          .update({
            embeds: [
              {
                title:
                  '<a:sharingan:805342816695877642> **Server Channel has been Apointed**',
                author: defaultAuthor,
                footer: defaultFooter,
                description: `__**Response Analysis**__\n**You Selected your Desired Channel**\n**Channel :** <#${__tempResponseValue}> **has been selected**`,
                color: 'RANDOM',
              },
            ],
            components: [],
          })
          ?.catch(() => undefined)
        return resolve(
          cachedMessage?.guild?.channels?.cache?.get(__tempResponseValue) ??
            (await cachedMessage?.guild?.channels
              ?.fetch(__tempResponseValue)
              ?.catch(() => undefined)) ??
            undefined,
        )
      } else if (
        rawOptions?.returnType === 'channel' &&
        __tempInteractionCache &&
        __tempInteractionCache instanceof Message
      ) {
        await cachedMessage
          .edit({
            embeds: [
              {
                title:
                  '<a:sharingan:805342816695877642> **Server Channel has been Apointed**',
                author: defaultAuthor,
                footer: defaultFooter,
                description: `__**Response Analysis**__\n**You Selected your Desired Channel**\n**Channel :** <#${
                  __tempInteractionCache?.mentions?.channels?.first()?.id ??
                  __tempResponseValue
                }> **has been selected**`,
                color: 'RANDOM',
              },
            ],
            components: [],
          })
          ?.catch(() => undefined)
        return resolve(
          __tempInteractionCache?.mentions?.channels?.first() ??
            cachedMessage?.guild?.channels?.cache?.get(__tempResponseValue) ??
            cachedMessage?.guild?.channels?.cache?.find(
              (channel) =>
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
                ].includes(channel?.type) &&
                channel?.name?.toLowerCase()?.trim() ===
                  __tempResponseValue?.toLowerCase()?.trim(),
            ) ??
            (await cachedMessage?.guild?.channels
              ?.fetch(__tempResponseValue)
              ?.catch(() => undefined)) ??
            undefined,
        )
      } else if (
        __tempInteractionCache &&
        __tempInteractionCache instanceof BaseInteraction
      ) {
        await __tempInteractionCache
          .update({
            embeds: [
              {
                title:
                  '<a:sharingan:805342816695877642> **Response has been Cached/Selected**',
                author: defaultAuthor,
                footer: defaultFooter,
                description: `__**Response Analysis**__\n**You Selected Option and has been Cached to the Jericho's Brain**\n**Option :** \`${__tempResponseValue}\` **has been Selected**`,
                color: 'RANDOM',
              },
            ],
            components: [],
          })
          ?.catch(() => undefined)
        resolve(__tempResponseValue)
      } else if (
        __tempInteractionCache &&
        __tempInteractionCache instanceof Message
      ) {
        await cachedMessage
          .edit({
            embeds: [
              {
                title:
                  '<a:sharingan:805342816695877642> **Response has been Cached/Selected**',
                author: defaultAuthor,
                footer: defaultFooter,
                description: `__**Response Analysis**__\n**You Selected Option and has been Cached to the Jericho's Brain**\n**Option :** \`${__tempResponseValue}\` **has been Selected**`,
                color: 'RANDOM',
              },
            ],
            components: [],
          })
          ?.catch(() => undefined)
        resolve(__tempResponseValue)
      } else resolve(undefined)
    })
  }
  async #__fetchAwaitStringResponse(filter, cachedMessage, rawOptions) {
    if (!this.threadChannel) return undefined
    let __tempResponse = await new Promise(async (resolve) => {
      let __tempCollection = await this.threadChannel
        .awaitMessages({
          filter: filter,
          max: rawOptions?.maxResponse ?? rawOptions?.max ?? 1,
          time: rawOptions?.maxTime ?? rawOptions?.time ?? 10 * 60 * 1000,
          errors: rawOptions?.error ?? rawOptions?.errors ?? ['time'],
        })
        .catch(() => resolve(undefined))
      return resolve(__tempCollection?.first() ?? undefined)
    })
    if (
      cachedMessage &&
      __tempResponse instanceof Message &&
      __tempResponse?.content
    )
      await cachedMessage
        .edit({
          embeds: [
            {
              title:
                '<a:sharingan:805342816695877642> **Response has been Cached/Selected**',
              author: defaultAuthor,
              footer: defaultFooter,
              description: `__**Response Analysis**__\n**You Selected Option and has been Cached to the Jericho's Brain**\n**Response :** \`${
                __tempResponse?.content ?? "'Corrupt Data'"
              }\` **has been Selected**`,
              color: 'RANDOM',
            },
          ],
          components: [],
        })
        ?.catch(() => undefined)
    return __tempResponse
  }

  async #__fetchAwaitMentionsResponse(
    filter,
    cachedMessage,
    rawOptions,
    returnType = 'channel',
  ) {
    if (!this.threadChannel) return undefined
    let __tempResponse = await new Promise(async (resolve) => {
      let __tempCollection = await this.threadChannel
        .awaitMessages({
          filter: filter,
          max: rawOptions?.maxResponse ?? rawOptions?.max ?? 1,
          time: rawOptions?.maxTime ?? rawOptions?.time ?? 10 * 60 * 1000,
          errors: rawOptions?.error ?? rawOptions?.errors ?? ['time'],
        })
        .catch(() => resolve(undefined))
      return resolve(
        (returnType === 'channel'
          ? __tempCollection?.first()?.mentions?.channels?.first()
          : __tempCollection?.first()?.mentions?.users?.first()) ?? undefined,
      )
    })
    if (
      cachedMessage &&
      __tempResponse instanceof Message &&
      __tempResponse?.content
    )
      await cachedMessage
        .edit({
          embeds: [
            {
              title:
                '<a:sharingan:805342816695877642> **Response has been Cached/Selected**',
              author: defaultAuthor,
              footer: defaultFooter,
              description: `__**Response Analysis**__\n**You Selected Option and has been Cached to the Jericho's Brain**\n**Response :** \`${
                __tempResponse?.name ??
                __tempResponse?.username ??
                __tempResponse?.nickname ??
                "'Corrupt Data'"
              }\` **has been Selected**`,
              color: 'RANDOM',
            },
          ],
          components: [],
        })
        ?.catch(() => undefined)
    return __tempResponse
  }
  async #__questionDelivery(cookedDelivery, rawOptions) {
    let __tempDelivery = {}
    if (cookedDelivery?.embed)
      __tempDelivery['embeds'] = [cookedDelivery?.embed]
    if (cookedDelivery?.component)
      __tempDelivery['components'] =
        cookedDelivery?.component &&
        Array.isArray(cookedDelivery?.component) &&
        cookedDelivery?.component?.length > 0
          ? cookedDelivery?.component
          : [cookedDelivery?.component]
    if (rawOptions?.editMessage)
      return await rawOptions?.editMessage.edit(__tempDelivery)
    else return await this.threadChannel.send(__tempDelivery)
  }
  #__customEmbedGenerator(rawEmbed) {
    let rawComponents,
      generatedCustomId,
      __tempDescription = rawEmbed?.description
    __tempDescription =
      __tempDescription &&
      __tempDescription[0] &&
      !['_', '*'].includes(__tempDescription[0])
        ? `**${__tempDescription}**`
        : __tempDescription
    let __tempColor = rawEmbed?.color ?? 'RANDOM'
    let __tempTitle =
      rawEmbed?.title && !rawEmbed?.title?.startsWith(`*`)
        ? `**${rawEmbed?.title}**`
        : rawEmbed?.title
    let cookedEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Jericho',
        iconURL: 'https://i.imgur.com/MHNLIls.jpg',
        url:
          'https://discord.com/api/oauth2/authorize?client_id=727761190100664391&permissions=398156889591&redirect_uri=https%3A%2F%2Fdiscord.gg%2FMfME24sJ2a&response_type=code&scope=guilds%20bot%20guilds.join%20applications.commands',
      })
      .setTitle(__tempTitle ?? '')
      .setDescription(__tempDescription ?? '')
      .setTimestamp()
      .setColor(__tempColor ?? 'RANDOM')
    if (rawEmbed?.image) cookedEmbed.setImage(rawEmbed?.image)
    if (rawEmbed?.thumbnail) cookedEmbed.setThumbnail(rawEmbed?.thumbnail)
    if (rawEmbed?.components) {
      generatedCustomId = __fetchInteractionCustomId(
        {
          category: 'threadModel',
          subCategory: 'config-method',
          messageUri: rawEmbed?.caches?.cachedMessage?.id,
        },
        false,
      )?.customId
      rawComponents = this.#__allocationOfMenuComponents(
        { ...rawEmbed?.components, generatedCustomId },
        true,
      )
    }
    return {
      embed: cookedEmbed,
      component: rawComponents,
      generatedCustomId: generatedCustomId,
    }
  }
  #__allocationOfMenuComponents(rawData, addEnd = true) {
    if (!rawData?.options || !rawData?.generatedCustomId) return undefined
    let __allocatedArray = [],
      __tempGarbageCache,
      __allocationSize = 24
    for (
      let keyCount = 0;
      keyCount < rawData?.options?.length;
      keyCount += __allocationSize
    ) {
      __tempGarbageCache = rawData?.options?.slice(
        keyCount,
        keyCount + __allocationSize,
      )
      if (__tempGarbageCache?.length > 0 && __allocatedArray?.length < 4)
        __allocatedArray.push(
          new SelectMenuBuilder()
            .setCustomId(rawData?.generatedCustomId + keyCount ?? 'selectMenu')
            .setPlaceholder('🍁 Select Option 🍁')
            .addOptions(__tempGarbageCache)
            .setMaxValues(rawData?.maxValues ?? 1)
            .setMinValues(rawData?.minValues ?? 1),
        )
    }
    __allocatedArray = __allocatedArray?.slice(0, 5)?.filter(Boolean)
    if (addEnd) {
      __allocatedArray.push(
        new ButtonBuilder()
          .setCustomId(rawData?.generatedCustomId + 'end<\\>halt')
          .setEmoji(`🏮`)
          .setLabel('Halt/End Process')
          .setStyle(ButtonStyle.Danger),
      )
    }
    return __allocatedArray?.map((interactionsCaches) => {
      return new ActionRowBuilder().addComponents([interactionsCaches])
    })
  }
}

module.exports = QuestionProcessGenerator
