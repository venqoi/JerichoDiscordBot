const { __permissionsManager } = require("../../Utilities/__miscUtils");
const __embedGenerator = require("../../Utilities/__embedGen");
const { CommandInteraction, Message } = require("discord.js");
const recordsBackend = require("../../functions/recordsHandler/backendEmployer");

module.exports = {
  name: "records",
  aliases: ["record", "rec", "reco"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 0, {
      message: message,
    });
    if (!__permissionsReview) return undefined;
    let __cachedPrefix = guildPrefixFetcher(
      message?.guildId ?? message?.guild?.id
    );
    if (!args?.[0] || !(message instanceof Message)) {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}records <mainCommand> <subCommand> <extra-Value-On-Demand>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Records Help Command :** \`${__cachedPrefix}help records\` **OR** \`${__cachedPrefix}records help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      };
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    } else if (
      args?.[0]?.toLowerCase()?.trim() === "complaint" &&
      args?.[1]?.trim() !== ""
    ) {
      let backendInstance = new recordsBackend();
      let memberMetadata =
        message?.mentions?.users?.first() ??
        message?.guild?.members?.cache?.get(args?.[1]?.trim()) ??
        message?.guild?.members?.cache?.find(
          (u) =>
            u.user?.username?.toLowerCase()?.trim() ===
            args?.[1]?.toLowerCase()?.trim()
        ) ??
        (await message?.guild?.members?.fetch(args?.[1]?.trim()));
      let __tempResponse = await backendInstance.__setupConfig(message, {
        member: memberMetadata,
      });
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}records setup <mention-channel>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Records Help Command :** \`${__cachedPrefix}help records\` **OR** \`${__cachedPrefix}records help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (
      args?.[0]?.toLowerCase()?.trim() === "setup" &&
      args?.[1]?.trim() !== ""
    ) {
      let backendInstance = new recordsBackend();
      let channelMetadata =
        message?.mentions?.channels?.first() ??
        message?.guild?.channels?.cache?.get(args?.[1]?.trim()) ??
        message?.guild?.channels?.cache?.find(
          (c) =>
            c.name?.toLowerCase()?.trim() === args?.[1]?.toLowerCase()?.trim()
        ) ??
        (await message?.guild?.channels?.fetch(args?.[1]?.trim()));
      let __tempResponse = await backendInstance.__setupConfig(message, {
        channelId: channelMetadata?.id,
      });
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}records setup <mention-channel>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Records Help Command :** \`${__cachedPrefix}help records\` **OR** \`${__cachedPrefix}records help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (
      args?.[0]?.toLowerCase()?.trim() === "edit" &&
      args?.[1]?.trim() !== ""
    ) {
      let backendInstance = new recordsBackend();
      let channelMetadata =
        message?.mentions?.channels?.first() ??
        message?.guild?.channels?.cache?.get(args?.[1]?.trim()) ??
        message?.guild?.channels?.cache?.find(
          (c) =>
            c.name?.toLowerCase()?.trim() === args?.[1]?.toLowerCase()?.trim()
        ) ??
        (await message?.guild?.channels?.fetch(args?.[1]?.trim()));
      let __tempResponse = await backendInstance.__editConfig(message, {
        channelId: channelMetadata?.id,
      });
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}records edit <mention-channel>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Records Help Command :** \`${__cachedPrefix}help records\` **OR** \`${__cachedPrefix}records help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (args?.[0]?.toLowerCase()?.trim() === "delete") {
      let backendInstance = new recordsBackend();
      let __tempResponse = await backendInstance.__deleteConfig(message);
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}records delete\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Records Help Command :** \`${__cachedPrefix}help records\` **OR** \`${__cachedPrefix}records help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (args?.[0]?.toLowerCase()?.trim() === "help") {
      let __tempRawEmbed = {
        title: `**User-Records Help Dashboard**`,
        description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Chatting Config :** \`${__cachedPrefix}chatting setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}chatting edit\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}chatting delete\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}chatting check\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
      };
      return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    }
  },
  async slashCommand(bot, interaction, jsonData, filters) {
    if (!(bot && interaction && interaction instanceof CommandInteraction))
      return undefined;
    await interaction.deferReply({ ephemeral: true });
  },
};
