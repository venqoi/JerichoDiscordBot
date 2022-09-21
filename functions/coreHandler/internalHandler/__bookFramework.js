const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} = require('discord.js')
const { __fetchInteractionCustomId } = require('../../../Utilities/__miscUtils')

class bookFramework {
  static defaultValue = {
    author: { name: 'Jericho', iconURL: 'https://i.imgur.com/MHNLIls.jpg' },
    color: '#27FF1D',
    placementError: {
      title: '📖 **Menu Browsing UI Error** 📖',
      description:
        "📀 `Browsing Feature Faced Logical Error while accessing non-extistent Page from Caches`\n📀 `Please Click on` **`Back or Home`** `for Resetting or Revert to the Previous one!!`\n📀 `If Issue Still Persists then Please Contant Jericho's Main Developer`",
      color: '#DD0004',
    },
    title: '📖 **Menu Browsing UI** 📖',
    footer: {
      text: 'Browsing Storage',
      iconURL: 'https://i.imgur.com/MHNLIls.jpg',
    },
  }
  static instancesCaches = {}
  constructor(rawArray = [], configFilters = {}) {
    this.caches = rawArray
    this.type = configFilters?.bookType ?? configFilters.type ?? 'single'
    this.channel =
      configFilters?.rawChannel ?? configFilters?.authorMessage?.channel
    this.authorMessage = configFilters?.authorMessage
    this.author = configFilters?.authorMessage?.author ?? configFilters?.author
    this.destroyed = false
    this.embedCaches =
      configFilters?.embedTexture &&
      Array.isArray(configFilters?.embedTexture) &&
      configFilters?.embedTexture?.length > 0
        ? configFilters?.embedTexture
        : undefined
    this.formatedCaches = []
  }
  async start(rawArray = [], configFilters = {}) {
    this.#__parse({ ...configFilters, caches: rawArray ?? this.caches })
    if (
      (!(
        this.caches &&
        Array.isArray(this.caches) &&
        this.caches?.length > 0
      ) ||
        !this.channel) &&
      this.type
    )
      return undefined
    this.formatedCaches = this.#__parse(undefined, true)
    this.embedCaches =
      configFilters?.embedTexture &&
      Array.isArray(configFilters?.embedTexture) &&
      configFilters?.embedTexture?.length > 0
        ? configFilters?.embedTexture
        : this.embedCaches
    return await this.__paperCycleManager(
      configFilters?.position ?? 0,
      undefined,
      configFilters,
    )
  }
  static async __paperButtonsManager(bot, interaction) {
    if (
      !(
        interaction &&
        interaction instanceof ButtonInteraction &&
        interaction?.customId?.includes(
          bookFramework.#__generateCustomId(interaction?.channel?.id),
        ) &&
        interaction?.message?.id &&
        bookFramework?.instancesCaches[interaction?.message?.id] &&
        interaction?.user?.id?.trim() ===
          bookFramework?.instancesCaches[
            interaction?.message?.id
          ]?.author?.id?.trim()
      )
    )
      return undefined
    let instance = bookFramework?.instancesCaches[interaction?.message?.id]
    await interaction.deferReply()?.catch(() => undefined)
    return await instance.__paperCycleManager(
      interaction?.customId?.split('<//>')?.filter(Boolean)?.pop(),
      interaction,
    )
  }
  async __paperCycleManager(nextPosition = 0, interaction, filters) {
    if (
      !(
        this.formatedCaches &&
        Array.isArray(this.formatedCaches) &&
        this.formatedCaches?.length > 0
      )
    )
      return undefined
    let positionMetadata = this.#__parse(
      undefined,
      undefined,
      `${nextPosition}`,
    )
    if ([undefined, null, false].includes(positionMetadata?.current))
      return await this.__embedParser(
        {
          ...bookFramework.defaultValue?.placementError,
          position: [undefined, null, false].includes(positionMetadata?.next)
            ? this.formatedCaches?.length
            : -1,
        },
        interaction,
        filters,
      )
    else
      return await this.__embedParser(
        {
          ...this.embedCaches?.[parseInt(nextPosition)],
          description: this.formatedCaches?.[parseInt(nextPosition)],
          position: Number(nextPosition),
        },
        interaction,
        filters,
      )
  }
  async __embedParser(rawEmbed, interaction, filters) {
    if (!(rawEmbed?.description || rawEmbed?.des)) return undefined
    else rawEmbed.des = rawEmbed?.des ?? rawEmbed.description
    let cookedEmbed = new EmbedBuilder()
      .setAuthor(bookFramework.defaultValue?.author)
      .setColor(rawEmbed?.color ?? bookFramework.defaultValue.color)
      .setFooter(bookFramework.defaultValue.footer)
      .setTitle(rawEmbed?.title ?? bookFramework.defaultValue?.title)
      .setDescription(
        rawEmbed?.des &&
          Array.isArray(rawEmbed?.des) &&
          rawEmbed?.des?.length > 0
          ? rawEmbed?.des?.join('\n')
          : rawEmbed?.des,
      )
      .setTimestamp()
    if (rawEmbed?.image || rawEmbed?.banner)
      cookedEmbed.setImage(rawEmbed?.image ?? rawEmbed?.banner)
    if (rawEmbed?.thumbnail) cookedEmbed.setThumbnail(rawEmbed?.thumbnail)
    let cookedComponents =
      this.formatedCaches?.length > 1
        ? this.#__generateComponents(
            this.#__parse(undefined, undefined, `${rawEmbed?.position}`),
            this.channel?.id,
          )
        : undefined
    return await this.#__embedDelivery(
      cookedComponents
        ? {
            embeds: [cookedEmbed],
            components: [cookedComponents],
          }
        : { embeds: [cookedEmbed] },
      interaction,
      filters,
    )
  }
  async #__embedDelivery(rawData, interaction, filters) {
    if (!rawData) return undefined
    else if (interaction?.message) {
      await interaction.message?.edit(rawData)?.catch(() => undefined)
      return await interaction?.deleteReply()?.catch(() => undefined)
    }
    let messageCache = await this.channel.send(rawData)?.catch(() => undefined)
    if (interaction && interaction instanceof ButtonInteraction)
      await interaction.deleteReply()?.catch(() => undefined)
    if (!messageCache) return undefined
    else bookFramework.instancesCaches[messageCache?.id] = this
    return messageCache
  }
  #__generateComponents(positionMetadata, channelId) {
    let __cachedCustomId = bookFramework.#__generateCustomId(channelId),
      rawButtons = []
    if (!positionMetadata?.current && positionMetadata?.current !== 0) {
      rawButtons.push(
        new ButtonBuilder()
          .setCustomId(
            __cachedCustomId +
              '<//>back<//>' +
              (positionMetadata?.next ?? positionMetadata?.previous),
          )
          .setEmoji(`↪️`)
          .setLabel('Revert')
          .setStyle(ButtonStyle.Danger),
      )
    } else if (
      (positionMetadata?.previous || positionMetadata?.previous === 0) &&
      positionMetadata?.current
    )
      rawButtons.push(
        new ButtonBuilder()
          .setCustomId(
            __cachedCustomId + '<//>previous<//>' + positionMetadata?.previous,
          )
          .setEmoji(`⬅️`)
          .setLabel('Backward')
          .setStyle(ButtonStyle.Primary),
      )
    rawButtons.push(
      new ButtonBuilder()
        .setCustomId(__cachedCustomId + '<//>home<//>' + 0)
        .setEmoji(`💠`)
        .setLabel('Home')
        .setStyle(ButtonStyle.Primary),
    )
    if (
      positionMetadata?.next &&
      (positionMetadata?.current || positionMetadata?.current === 0)
    )
      rawButtons.push(
        new ButtonBuilder()
          .setCustomId(
            __cachedCustomId + '<//>next<//>' + positionMetadata?.next,
          )
          .setEmoji(`➡️`)
          .setLabel('Forward')
          .setStyle(ButtonStyle.Primary),
      )
    return new ActionRowBuilder().addComponents(rawButtons)
  }
  static #__generateCustomId(channelId) {
    if (!(channelId && typeof channelId === 'string' && channelId !== ''))
      return undefined
    return __fetchInteractionCustomId(
      {
        interactionType: 'button',
        category: 'bookFramework',
        subCategory: 'public',
        messageUri: channelId,
      },
      false,
    )?.customId
  }
  #__parse(parseRawData, parseCaches, getPositionMetadatas) {
    if (parseRawData?.caches) {
      this.channel ??=
        this.authorMessage?.channel ??
        parseRawData?.authorMessage?.channel ??
        parseRawData?.channel
      this.authorMessage ??= this.authorMessage ?? parseRawData?.authorMessage
      this.author ??=
        this.author ?? this.authorMessage?.author ?? parseRawData?.author
      this.caches ??= this.caches ?? parseRawData?.caches
      this.type ??=
        this.type ?? parseRawData?.bookType ?? parseRawData.type ?? 'single'
      return this
    } else if (parseCaches) {
      let rawCaches =
          Array.isArray(parseCaches) && parseCaches?.length > 0
            ? parseCaches
            : this.caches,
        garbageArray = [],
        garbage,
        cachedSelection = Number(this.type?.replace(/\D+/g, '')) || 10
      return rawCaches
        ?.map((cache, index) => {
          if (this.type?.toLowerCase()?.trim().includes('single'))
            return [cache]
          else if (this.type?.toLowerCase()?.trim().includes('multiple')) {
            if (garbageArray?.length >= cachedSelection) {
              garbage = garbageArray
              garbageArray = [cache]
              return garbage
            } else garbageArray.push(cache)
            if (index === rawCaches?.length - 1) return garbageArray
            else return undefined
          } else return [cache]
        })
        ?.filter(Boolean)
    } else if (getPositionMetadatas && !isNaN(Number(getPositionMetadatas))) {
      let rawTime = {
        previous: Number(getPositionMetadatas) - 1,
        current: Number(getPositionMetadatas),
        next: Number(getPositionMetadatas) + 1,
      }
      if (rawTime.previous <= -1) rawTime.previous = undefined
      if (rawTime?.next >= this.formatedCaches?.length) rawTime.next = undefined
      if (
        rawTime?.current >= this.formatedCaches?.length ||
        rawTime?.current <= -1
      )
        rawTime.current = undefined
      return rawTime
    } else return undefined
  }
}

module.exports = bookFramework
