const { __permissionsManager } = require("../../Utilities/__miscUtils");
const __embedGenerator = require("../../Utilities/__embedGen");
const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "donate",
  aliases: ["donation", "donated", "dona"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 0, {
      message: message,
    });

    if (!__permissionsReview) return undefined;
    let __tempRawEmbed = {
      title: `**Jericho Donation Stats**`,
      description: `*Donations are for Jericho's Future Developments and Support Developer for continue support of Jericho*\n\n__**International Donations**__\n <:paypal:1006781867929903134> [PayPal Link Here](https://paypal.me/sidislive?country.x=IN&locale.x=en_GB)\n\n__**Upi Donations**__\n <a:dollarfly:1006791591551307796> \`runinmascot.famc@idfcbank\``,
      image: "https://i.imgur.com/FiZhsuN.png?1",
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
      title: `**Jericho Donation Stats**`,
      description: `*Donations are for Jericho's Future Developments and Support Developer for continue support of Jericho*\n\n__**International Donations**__\n <:paypal:1006781867929903134> [PayPal Link Here](https://paypal.me/sidislive?country.x=IN&locale.x=en_GB)\n\n__**Upi Donations**__\n <a:dollarfly:1006791591551307796> \`runinmascot.famc@idfcbank\``,
      image: "https://i.imgur.com/FiZhsuN.png?1",
    };
    return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
      interaction: interaction,
    });
  },
};
