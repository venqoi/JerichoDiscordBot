const { __permissionsManager } = require("../../Utilities/__miscUtils");
const __embedGenerator = require("../../Utilities/__embedGen");
const databaseCore = require("../../functions/coreHandler/externalHandler/databaseCore");
const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pong", "pinging"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 0, {
      message: message,
    });

    if (!__permissionsReview) return undefined;
    let __tempRawEmbed = {
      title: `**Jericho Network/Flow Stats**`,
      description: `<a:onlineGif:854345313409302538> __**Network Stats**__\n<:announcements:852963180732350484> **Jericho's Latency/Ping : \`${
        bot?.ws?.ping ?? "9999+"
      }ms\`**\n<:announcements:852963180732350484> **Database Connection Ping : \`${
        databaseCore?.status?.connectionPing ?? "9999+"
      }ms\`**\n<:announcements:852963180732350484> **Database Query Ping : \`${
        databaseCore?.status?.queryPing ?? "9999+"
      }ms\`**\n\n<a:Offline:852962407969980446> __**Server Credentials**__\n<:announcements:852963180732350484> **Server Name : \`${
        message?.guild?.name ?? "Unknown Guild"
      }\`**`,
    };
    return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
      message: message,
      channel: message?.channel,
    });
  },
  async slashCommand(bot, interaction, jsonData, filters) {
    if (!(bot && interaction && interaction instanceof CommandInteraction))
      return undefined;
    await interaction.deferReply({ ephemeral: true });
    let __tempRawEmbed = {
      title: `**Jericho Network/Flow Stats**`,
      description: `<a:onlineGif:854345313409302538> __**Network Stats**__\n<:announcements:852963180732350484> **Jericho's Latency/Ping : \`${
        bot?.ws?.ping ?? "9999+"
      }ms\`**\n<:announcements:852963180732350484> **Database Connection Ping : \`${
        databaseCore?.status?.connectionPing ?? "9999+"
      }ms\`**\n<:announcements:852963180732350484> **Database Query Ping : \`${
        databaseCore?.status?.queryPing ?? "9999+"
      }ms\`**\n\n<a:Offline:852962407969980446> __**Server Credentials**__\n<:announcements:852963180732350484> **Server Name : \`${
        interaction?.guild?.name ?? "Unknown Guild"
      }\`**`,
    };
    return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
      interaction: interaction,
    });
  },
};
