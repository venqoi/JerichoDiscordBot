const {
  EmbedBuilder,
  BaseInteraction,
  Message,
  User,
  BaseChannel,
  ButtonBuilder,
  ActionRowBuilder,
  Colors,
  ButtonStyle,
} = require("discord.js");
const {
  defaultAuthor,
  defaultFooter,
  defaultErrorEmbed,
  defaultSupportField,
  __defaultHints,
  defaultSupportServer,
  defaultInviteUri,
} = require("../resources/__defaultPublicCredentials");

class embedGenerator {
  static async __errorEmbed(bot, rawEmbed = {}, filters = {}) {
    if (!rawEmbed) return undefined;
    filters.method ??= "send";
    rawEmbed.color ??= defaultErrorEmbed?.color;
    rawEmbed.title ??= defaultErrorEmbed?.title;
    rawEmbed.description ??= defaultErrorEmbed?.description;
    if (!filters?.skipHints)
      rawEmbed.hintField = embedGenerator.__hintSlotGenerator(
        bot,
        filters?.message?.guild?.id ??
          filters?.message?.guildId ??
          filters?.guildId ??
          filters?.guild?.id ??
          filters?.channel?.guild?.id,
        "embedGen"
      );
    return await embedGenerator.__rawEmbedGen(bot, rawEmbed, filters);
  }
  static async __normalPublishEmbed(bot, rawEmbed, filters = {}) {
    if (!rawEmbed) return undefined;
    if (!filters?.skipHints)
      rawEmbed.hintField = embedGenerator.__hintSlotGenerator(
        bot,
        filters?.message?.guild?.id ??
          filters?.message?.guildId ??
          filters?.guildId ??
          filters?.guild?.id ??
          filters?.channel?.guild?.id,
        "embedGen"
      );
    filters.method ??= "send";
    return await embedGenerator.__rawEmbedGen(bot, rawEmbed, filters);
  }
  static async __rawEmbedGen(bot, rawEmbed = {}, filters = {}) {
    try {
      if (!rawEmbed || !filters) return undefined;
      let __cookedcomponents = [],
        __defaultComponents = [];
      let __tempAuthor =
        rawEmbed?.author &&
        typeof rawEmbed?.author === "string" &&
        rawEmbed?.author?.toLowerCase()?.trim() === "none"
          ? undefined
          : rawEmbed?.author ?? defaultAuthor;
      let __tempDescription =
        rawEmbed?.description ??
        rawEmbed?.des ??
        rawEmbed?.descrip ??
        undefined;
      let __tempFooter =
        rawEmbed?.footer &&
        typeof rawEmbed?.footer === "string" &&
        rawEmbed?.footer?.toLowerCase()?.trim() === "none"
          ? undefined
          : rawEmbed?.footer ?? defaultFooter;
      let __tempImage = rawEmbed?.image ?? undefined;
      let __tempThumbnail = rawEmbed?.thumbnail ?? undefined;
      let __tempFields = rawEmbed?.fields ?? rawEmbed?.field ?? undefined;

      let __cookedEmbed = new EmbedBuilder().setColor(
        rawEmbed?.color ?? Colors.Green
      );
      if (__tempAuthor) __cookedEmbed.setAuthor(__tempAuthor);
      if (rawEmbed?.title) __cookedEmbed.setTitle(rawEmbed?.title);
      if (rawEmbed?.color) __cookedEmbed.setColor(rawEmbed?.color);
      if (__tempDescription) __cookedEmbed.setDescription(__tempDescription);
      if (__tempFooter) __cookedEmbed.setFooter(__tempFooter);
      if (__tempThumbnail) __cookedEmbed.setThumbnail(__tempThumbnail);
      if (__tempImage) __cookedEmbed.setImage(__tempImage);
      if (
        __tempFields &&
        Array.isArray(__tempFields) &&
        Array.isArray(__tempFields)?.length > 1
      )
        __cookedEmbed.addFields(__tempFields);
      else if (__tempFields && typeof __tempFields === "object")
        __cookedEmbed.addFields([
          Array.isArray(__tempFields) && __tempFields?.length === 1
            ? __tempFields[0]
            : __tempFields,
        ]);
      if (
        rawEmbed?.hintField?.name ||
        rawEmbed?.hintField?.value ||
        rawEmbed?.hintField?.inline
      )
        __cookedEmbed.addFields([
          {
            name: rawEmbed?.hintField?.name,
            value: rawEmbed?.hintField?.value,
            inline: rawEmbed?.hintField?.inline,
          },
        ]);

      /*

      // Default Support field

      __cookedEmbed.addFields([
        {name: defaultSupportField?.name,
        value: defaultSupportField?.value,
        inline: defaultSupportField?.inline
      }]);
      
      */

      // Default Button - Support field
      __defaultComponents.push(
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Support Server")
            .setStyle(ButtonStyle.Link)
            .setURL(defaultSupportServer?.inviteUri)
            .setEmoji("<a:cb_settings:926873825025613874>"),
          new ButtonBuilder()
            .setLabel("Invite Me")
            .setStyle(ButtonStyle.Link)
            .setURL(defaultInviteUri)
            .setEmoji("<a:Check:852964644326211634>"),
        ])
      );
      if (
        !filters?.method ||
        (filters?.method && filters?.method?.toLowerCase()?.trim() === "send")
      )
        return await embedGenerator.__sendEmbed(
          bot,
          {
            message: filters?.message,
            channel: filters?.channel,
            interaction: filters?.interaction,
            user: filters?.user,
            embed: __cookedEmbed,
            components: [...__defaultComponents, ...__cookedcomponents],
          },
          filters
        );
      else if (
        filters?.method &&
        filters?.method?.toLowerCase()?.trim() === "edit"
      )
        return await embedGenerator.__editEmbed(
          bot,
          {
            message: filters?.message,
            interaction: filters?.interaction,
            embed: __cookedEmbed,
            components: __cookedcomponents,
          },
          filters
        );
      else if (
        filters?.method &&
        filters?.method?.toLowerCase()?.trim() === "return"
      )
        return { embed: __cookedEmbed, component: __cookedcomponents };
      else return __cookedEmbed;
    } catch {
      return undefined;
    }
  }
  static async __sendEmbed(bot, rawData, filters) {
    if (!rawData || !filters) return undefined;
    try {
      let __tempChannel = await embedGenerator.__advancedFetcher(
        bot,
        rawData?.channel ?? rawData?.message,
        "channel"
      );
      let __tempInteraction = await embedGenerator.__advancedFetcher(
        bot,
        rawData?.interaction,
        "interaction"
      );
      let __tempUser = await embedGenerator.__advancedFetcher(
        bot,
        rawData?.user,
        "user"
      );
      if (__tempChannel)
        return await __tempChannel?.send({
          embeds: [rawData?.embed],
          components: rawData?.components,
        });
      else if (__tempInteraction) {
        if (filters?.deferUpdate) {
          await __tempInteraction.deferReply({
            ephemeral: Boolean(
              filters?.deferUpdate?.ephemeral ??
                filters?.deferUpdate?.private ??
                true
            ),
          });
          const { sleep } = require("./__miscUtils");
          await sleep(filters?.deferUpdate?.waitTime ?? 3 * 1000);
          return await __tempInteraction?.editReply({
            embeds: [rawData?.embed],
            components: rawData?.components,
          });
        }
        return await __tempInteraction
          .editReply({
            embeds: [rawData?.embed],
            components: rawData?.components,
          })
          ?.catch(
            async () =>
              await __tempInteraction
                .reply({
                  embeds: [rawData?.embed],
                  components: rawData?.components,
                })
                ?.catch(() => undefined)
          );
      } else if (__tempUser)
        return await __tempUser?.send({
          embeds: [rawData?.embed],
          components: rawData?.components,
        });
      else return false;
    } catch {
      return undefined;
    }
  }
  static async __editEmbed(bot, rawData, filters) {
    if (!rawData || !filters) return undefined;
    try {
      let __tempMessage = await embedGenerator.__advancedFetcher(
        bot,
        rawData?.message,
        "message"
      );
      let __tempInteraction = await embedGenerator.__advancedFetcher(
        bot,
        rawData?.interaction,
        "interaction"
      );
      if (__tempMessage)
        return await __tempMessage?.edit({
          embeds: [rawData?.embed],
          components: rawData?.components,
        });
      else if (__tempInteraction) {
        if (filters?.deferUpdate) {
          await __tempInteraction.deferReply({
            ephemeral: Boolean(
              filters?.deferUpdate?.ephemeral ??
                filters?.deferUpdate?.private ??
                true
            ),
          });
          const { sleep } = require("./__miscUtils");
          await sleep(filters?.deferUpdate?.waitTime ?? 3 * 1000);
          return await __tempInteraction?.editReply({
            embeds: [rawData?.embed],
            components: rawData?.components,
          });
        }
      } else return false;
    } catch {
      return undefined;
    }
  }
  static async __advancedFetcher(bot, rawValue, checkType, ignoreTypes = []) {
    try {
      if (!checkType || !rawValue) return undefined;
      let __tempCooked;
      switch (checkType?.toLowerCase()?.trim()) {
        case "channel":
          if (typeof rawValue === "string" && !isNaN(Number(rawValue)) && bot) {
            __tempCooked = await bot.channels.cache.get(rawValue);
            __tempCooked ??= await bot.channels.fetch(rawValue);
            return __tempCooked ?? undefined;
          } else if (
            typeof rawValue === "string" &&
            isNaN(Number(rawValue)) &&
            bot
          ) {
            __tempCooked = bot.channels.cache.find((channel) =>
              [rawValue?.toLowerCase()?.trim()].includes(
                channel?.name?.toLowerCase()?.trim()
              )
            );
            return __tempCooked;
          } else if (rawValue instanceof BaseChannel) return rawValue;
          else if (
            rawValue instanceof Message ||
            rawValue instanceof BaseInteraction
          )
            return rawValue?.channel;
          else return undefined;
        case "user":
          if (typeof rawValue === "string" && !isNaN(Number(rawValue)) && bot) {
            __tempCooked = await bot.users.cache.get(rawValue);
            __tempCooked ??= await bot.users.fetch(rawValue);
            return __tempCooked ?? undefined;
          } else if (
            typeof rawValue === "string" &&
            isNaN(Number(rawValue)) &&
            bot
          ) {
            __tempCooked = bot.users.cache.find((user) =>
              [rawValue?.toLowerCase()?.trim()].includes(
                user?.username?.toLowerCase()?.trim()
              )
            );
            return __tempCooked;
          } else if (rawValue instanceof User) return rawValue;
          else if (rawValue instanceof BaseInteraction) return rawValue?.user;
          else if (rawValue instanceof Message) return rawValue?.author;
        case "interaction":
          if (
            rawValue instanceof BaseInteraction &&
            !ignoreTypes.includes(rawValue?.type)
          )
            return rawValue;
          else return undefined;
        case "message":
          if (rawValue instanceof Message) return rawValue;
          else return undefined;
        default:
          return undefined;
      }
    } catch {
      return undefined;
    }
  }
  static __hintSlotGenerator(bot, guildId, returnType = "normal") {
    let __tempDefaultHints = __defaultHints(bot, guildId, [
      "ads",
      "features",
      "beta",
      "default",
    ]);
    let __tempHint =
      __tempDefaultHints[
        Math.floor(Math.random() * __tempDefaultHints?.length)
      ];
    switch (returnType?.toLowerCase()?.trim()) {
      case "embedgen":
        if (!__tempHint) return undefined;
        return {
          name: "<a:welcome:725108875220746362> __**Random Ads**__",
          value: __tempHint,
          inline: false,
        };
      case "normal":
        return __tempHint;
      default:
        return undefined;
    }
  }
}

module.exports = embedGenerator;
