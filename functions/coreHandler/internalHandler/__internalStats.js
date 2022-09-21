const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Message,
  ButtonInteraction,
  ButtonStyle,
} = require("discord.js");
const systemManager = require("systeminformation");
const {
  __fetchInteractionCustomId,
  __prettyMsLTE,
} = require("../../../Utilities/__miscUtils");
const {
  __cachedGuildMembersCount,
  defaultAuthor,
  defaultFooter,
} = require("../../../resources/__defaultPublicCredentials");
const databaseCore = require("../externalHandler/databaseCore");

class __statsInternal {
  static async __rawFetch() {
    let cookedData = {},
      __rawCpuSpeed,
      __rawCpuLoads,
      __rawData;

    // Cpu Credentials Fetches
    __rawData = await systemManager.cpu();
    __rawCpuSpeed = await systemManager.cpuCurrentSpeed();
    __rawCpuLoads = await systemManager.currentLoad();
    cookedData.raw = {
      cpu: {
        ...__rawData,
        cpuCurrentSpeed: { ...__rawCpuSpeed },
        cpuCurrentLoad: { ...__rawCpuLoads },
      },
    };
    cookedData.cpu = {
      cores: {
        totalCores: __rawData?.physicalCores,
        solidCores: __rawData?.cores,
      },
      cpu: {
        company: __rawData?.manufacturer,
        name: __rawData?.brand,
        processors: {
          count: __rawData?.processors,
          model: __rawData?.model,
          family: __rawData?.family,
        },
        vendor: __rawData?.vendor,
        cache: __rawData?.cache?.l1d,
        socket: __rawData?.processors,
        speed: {
          current: {
            average: __rawCpuSpeed.avg,
            min: __rawCpuSpeed?.min,
            max: __rawCpuSpeed?.max,
          },
          default: __rawData?.speed,
          max: __rawData?.speedMax,
          min: __rawData?.speedMin,
        },
        loads: {
          average: __rawCpuLoads?.avgLoad,
          current: {
            default: __rawCpuLoads?.currentLoad,
            user: __rawCpuLoads?.currentLoadUser,
            system: __rawCpuLoads?.currentLoadSystem,
          },
        },
      },
    };

    // Memory Credentials Fetches
    __rawData = await systemManager.mem();
    cookedData.raw = { ...cookedData.raw, memory: { ...__rawData } };
    cookedData.memory = {
      total: __rawData.total,
      free: __rawData.free,
      used: __rawData.used,
      active: __rawData.active,
      available: __rawData.available,
      swap: {
        total: __rawData.swaptotal,
        free: __rawData.swapfree,
        used: __rawData?.swapused,
      },
    };

    // Operating System Metadata Fetches
    __rawData = await systemManager.osInfo();
    cookedData.raw = { ...cookedData.raw, os: { ...__rawData } };
    cookedData.os = {
      platform: __rawData?.platform,
      distro: __rawData?.distro,
      release: __rawData?.release,
      kernel: __rawData?.kernel,
      arch: __rawData?.arch,
      hostname: __rawData?.hostname,
      logofile: __rawData?.logofile,
      serial: __rawData?.serial,
      build: __rawData?.build,
    };
    return cookedData;
  }
  static async __statsEmbedGenerator(
    bot,
    message,
    interaction,
    method = "edit"
  ) {
    if (
      interaction &&
      !__statsInternal
        .__commonCustomId(message?.id)
        ?.trim()
        ?.includes(interaction?.customId?.trim())
    )
      return undefined;
    if (!(message && message instanceof Message)) return undefined;
    if (interaction) await interaction.deferReply({ ephemeral: true });
    const bytesToGigaBytes = (bytes, digits) =>
      digits
        ? (bytes / (1024 * 1024 * 1024)).toFixed(digits)
        : bytes / (1024 * 1024 * 1024);
    let __cachedData = await __statsInternal.__rawFetch();
    let __cookedEmbed = new EmbedBuilder()
      ?.setTitle(
        `<a:landowner:926873793954205716> **Jericho Internal Monitor** <a:landowner:926873793954205716>`
      )
      .setAuthor(defaultAuthor)
      .setFooter(defaultFooter)
      .setColor("61FFF8")
      .setTimestamp(new Date())
      .addFields([
        {
          name: "__**Memory Resources**__",
          value: `**RAM Usage** <a:3281_sharingan:805342816695877642>\n${__statsInternal.__emojiFrame(
            parseFloat(
              (__cachedData?.memory?.used * 100) / __cachedData?.memory?.total
            ).toFixed(3)
          )}\n *Used ${parseFloat(
            (__cachedData?.memory?.used * 100) / __cachedData?.memory?.total
          ).toFixed(3)}% of the Total Memory Capacity* \n \`[ ${Math.trunc(
            bytesToGigaBytes(__cachedData?.memory?.used, 2)
          )} GB / ${Math.trunc(
            bytesToGigaBytes(__cachedData?.memory?.total)
          )} GB ]\``,
          inline: true,
        },
        {
          name: "**      **",
          value: `**Swap Usage** <a:3281_sharingan:805342816695877642>\n${__statsInternal.__emojiFrame(
            parseFloat(
              (__cachedData?.memory?.swap?.used * 100) /
                __cachedData?.memory?.swap?.total
            ).toFixed(3)
          )}\n *Used ${parseFloat(
            (__cachedData?.memory?.swap?.used * 100) /
              __cachedData?.memory?.swap?.total
          ).toFixed(3)}% of the Total Memory Capacity* \n \`[ ${Math.trunc(
            bytesToGigaBytes(__cachedData?.memory?.swap?.used)
          )} GB / ${Math.trunc(
            bytesToGigaBytes(__cachedData?.memory?.swap?.total)
          )} GB ]\``,
          inline: true,
        },
        {
          name: "**               **",
          value: "**             **\n\n** **",
          inline: true,
        },
      ])
      .addFields([
        {
          name: "__**Cpu Resources**__",
          value: `**Cpu Speed** <a:3281_sharingan:805342816695877642>\n${__statsInternal.__emojiFrame(
            parseFloat(
              (__cachedData?.cpu?.cpu?.speed?.current?.average * 100) /
                __cachedData?.cpu?.cpu?.speed?.current?.max
            ).toFixed(3)
          )}\n *Cpu Going ${parseFloat(
            (__cachedData?.cpu?.cpu?.speed?.current?.average * 100) /
              __cachedData?.cpu?.cpu?.speed?.current?.max
          ).toFixed(3)}% of the Max Cpu Speed* \n \`[ ${
            __cachedData?.cpu?.cpu?.speed?.current?.average
          } mHz / ${__cachedData?.cpu?.cpu?.speed?.current?.max} mHz ]\``,
          inline: true,
        },
        {
          name: "**      **",
          value: `**Cpu Load** <a:3281_sharingan:805342816695877642>\n${__statsInternal.__emojiFrame(
            parseFloat(__cachedData?.cpu?.cpu?.loads?.current?.default).toFixed(
              3
            )
          )}\n *Used ${parseFloat(
            __cachedData?.cpu?.cpu?.loads?.current?.system
          ).toFixed(3)}% of the Total Cpu Load Capacity* \n \`[ ${Math.trunc(
            __cachedData?.cpu?.cpu?.loads?.current?.system
          )} / ${Math.trunc(
            __cachedData?.cpu?.cpu?.loads?.current?.default
          )} ]\``,
          inline: true,
        },
        {
          name: "**               **",
          value: "**             **\n\n** **",
          inline: true,
        },
      ])
      .addFields({
        name: "__**Environment Docs**__",
        value: `<:Green:853662606078640188> **Operating System :** \`${__cachedData?.os?.platform} v${__cachedData?.os?.release} Build [${__cachedData?.os?.build}]\`\n<:Green:853662606078640188> **Node :** \`${process?.version}v\`\n<:Green:853662606078640188> **Host Name :** \`${__cachedData?.os?.hostname}\`\n<:Green:853662606078640188> **Kernal :** \`${__cachedData?.os?.kernel}\`\n<:Green:853662606078640188> **Operating System Type :** \`${__cachedData?.os?.logofile}\``,
      })
      .addFields({
        name: "__**Cpu Docs**__",
        value: `<:link:852963036506751006> **Name :** \`${__cachedData?.cpu?.cpu?.name}\`\n<:link:852963036506751006> **Company :** \`${__cachedData?.cpu?.cpu?.company}\`\n<:link:852963036506751006> **Model :** \`${__cachedData?.cpu?.cpu?.processors?.model}\`\n<:link:852963036506751006> **Family :** \`${__cachedData?.cpu?.cpu?.processors?.family}\`\n<:link:852963036506751006> **Cores :** \`${__cachedData?.cpu?.cores?.solidCores}\`\n<:link:852963036506751006> **Physical Cores :** \`${__cachedData?.cpu?.cores?.totalCores}\`\n<:link:852963036506751006> **Vendor Id :** \`${__cachedData?.cpu?.cpu?.vendor}\`\n<:link:852963036506751006> **Cache Size :** \`${__cachedData?.cpu?.cpu?.cache} Bytes\``,
      })
      .addFields({
        name: "__**Jericho's Network**__",
        value: `<:Purple:853662785744928768> **Uptime :** \`${__prettyMsLTE(
          bot?.uptime
        )}\`\n<:Purple:853662785744928768> **Latency :** \`${
          bot?.ws.ping
        }ms\`\n<:Purple:853662785744928768> **Database Connection Latency :** \`${
          databaseCore.status?.connectionPing
        }ms\`\n<:Purple:853662785744928768> **Database Query Latency :** \`${
          databaseCore.status?.queryPing
        }ms\``,
      })
      .addFields({
        name: "__**Jericho's Statistics**__",
        value: `<:link:852963036506751006> **Servers :** \`${
          bot?.guilds?.cache?.size
        } Servers\`\n<:link:852963036506751006> **Channels :** \`${
          bot?.channels?.cache?.size
        } Channels\`\n<:link:852963036506751006> **Users :** \`${__cachedGuildMembersCount(
          bot
        )}+ Users\``,
      });
    let __cachedCustomId = __statsInternal
      .__commonCustomId(message?.id)
      ?.trim();
    let __cachedComponents = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(__cachedCustomId)
        .setEmoji(`<a:loading:852967099341209661>`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Primary)
    );
    if (method?.toLowerCase()?.trim() === "edit")
      await message
        .edit({ embeds: [__cookedEmbed], components: [__cachedComponents] })
        .catch(() => undefined);
    else if (method?.toLowerCase()?.trim() === "send")
      await message?.channel
        .send({ embeds: [__cookedEmbed], components: [__cachedComponents] })
        .catch(() => undefined);
    if (interaction && interaction instanceof ButtonInteraction) {
      return await interaction
        .editReply({
          content:
            "**<a:cb_settings:926873825025613874> Refreshed Jericho's Stats**",
          ephemeral: true,
        })
        .catch(() => undefined);
    } else return undefined;
  }
  static __emojiFrame(rawPercentage = 0) {
    const startemoji = "<a:start:806348375963205672>";
    const endemoji = "<:end:806348374424813620>";
    const progressbar = "<a:progress:805863055954280469>";
    const stopemoji = "<a:pro_stop:805863156076642334>";
    const blankemoji = "<:blank:806152977416978512>";
    let emojiCaches = [];
    const psize = parseInt(((rawPercentage ?? 0) / 10).toFixed(1));
    const ssize = psize + 1;

    for (let count = 1; count <= 10; count += 1) {
      if (count === ssize) emojiCaches.push(stopemoji);
      else if (count === 1 && count > ssize) emojiCaches.push(stopemoji);
      else if (count === 1) emojiCaches.push(startemoji);
      else if (count < ssize) emojiCaches.push(progressbar);
      else emojiCaches.push(blankemoji);
    }
    if (ssize > 10) emojiCaches.push(stopemoji);
    else emojiCaches.push(endemoji);
    return emojiCaches.join("");
  }
  static __commonCustomId(messageId) {
    if (!(messageId && typeof messageId === "string" && messageId !== ""))
      return undefined;
    return __fetchInteractionCustomId(
      {
        interactionType: "button",
        category: "jerichoStats",
        subCategory: "refresh",
        messageUri: messageId,
      },
      false
    )?.customId;
  }
}
module.exports = __statsInternal;
