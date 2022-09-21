const {
  guildPrefixFetcher,
  __permissionsManager,
} = require("../../Utilities/__miscUtils");
const chattingHandler = require("../../functions/chattingHandler/backendEmployer");
const {
  __quickCheck,
} = require("../../functions/chattingHandler/frontendEmployer");
const __embedGenerator = require("../../Utilities/__embedGen");
const { Message } = require("discord.js");
module.exports = {
  name: "chatting",
  aliases: ["chat", "chatt", "ai", "aichatting", "aichat", "aichatt"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 3, {
      message: message,
    });
    if (!__permissionsReview) return undefined;
    let __cachedPrefix = guildPrefixFetcher(
      message?.guildId ?? message?.guild?.id
    );
    if (!args?.[0] || !(message instanceof Message)) {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}chatting <mainCommand> <subCommand> <extra-Value-On-Demand>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      };
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    }
    let __tempChattingHandler = new chattingHandler(),
      __tempResponse;
    if (args?.[0]?.toLowerCase()?.trim() === "setup") {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member }
      );
      if (!__permissionsReview) return undefined;
      let __tempCaches = {
        channelId:
          message?.mentions?.channels?.first()?.id ??
          (!isNaN(Number(args?.[1])) ? args?.[1] : undefined) ??
          undefined,
        language:
          (isNaN(Number(args?.[1])) && args?.[1]?.length <= 4
            ? args?.[1]
            : undefined) ?? undefined,
      };
      __tempResponse = await __tempChattingHandler.__setupConfig(message, {
        skipCapture: __tempCaches,
      });
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}chatting setup <blank>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (args?.[0]?.toLowerCase()?.trim() === "edit") {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true }
      );
      if (!__permissionsReview) return undefined;
      let __tempCaches = {
        channelId:
          args?.[1]?.toLowerCase()?.trim() === "channel"
            ? message?.mentions?.channels?.first()?.id
            : undefined,
        language:
          args?.[1]?.toLowerCase()?.trim() === "language"
            ? args?.[2]
            : undefined,
      };
      __tempResponse = await __tempChattingHandler.__editConfig(message, {
        skipCapture: __tempCaches,
        selection: __tempCaches?.channelId
          ? "editchannel"
          : __tempCaches?.language
          ? "editlanguage"
          : undefined,
      });
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Edit Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}chatting edit <blank>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else return undefined;
    } else if (args?.[0]?.toLowerCase()?.trim() === "delete") {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true }
      );
      if (!__permissionsReview) return undefined;
      __tempResponse = await __tempChattingHandler.__deleteConfig(message);
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Delete Config Request Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}chatting delete\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather Setup is already Present for Deletion Process by :** \`${__cachedPrefix}chatting check\`\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else {
        let __tempRawEmbed = {
          title: `**Delete Config is Completed and Synced**`,
          description: `**Old Config has been Deleted from Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check Saved Config by -** \`${__cachedPrefix}chatting check\`\n<a:turuncu:852965555018399775> **You can Setup new Config by -** \`${__cachedPrefix}chatting setup\`\n<a:turuncu:852965555018399775> **You can Edit Saved Config by -** \`${__cachedPrefix}chatting edit\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            message: message,
            channel: message?.channel,
          }
        );
      }
    } else if (args?.[0]?.toLowerCase()?.trim() === "check") {
      let __tempResponse = __quickCheck(message, "guild");
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**No Config has been Found**`,
          description: `**Please Setup a Config like -** \`${__cachedPrefix}chatting setup\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else {
        let __tempRawEmbed = {
          title: `**Chatting Config Stats**`,
          description: `<a:yes:817492826148700211> __**Stats**__\n<a:turuncu:852965555018399775> **Selected Channel :** <#${__tempResponse?.rawArgs?.channelId}>\n<a:turuncu:852965555018399775> **Texting Language :** \`${__tempResponse?.rawArgs?.language}\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__\`You can check for Actual Language Name by Match Code at\` [Universal Language Code](https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code)`,
        };
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            message: message,
            channel: message?.channel,
          }
        );
      }
    } else if (args?.[0]?.toLowerCase()?.trim() === "help") {
      let __tempRawEmbed = {
        title: `**Chatting Help Dashboard**`,
        description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Chatting Config :** \`${__cachedPrefix}chatting setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}chatting edit\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}chatting delete\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}chatting check\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
      };
      return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    } else {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}chatting <mainCommand> <subCommand> <extra-Value-On-Demand>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help chatting\` **OR** \`${__cachedPrefix}chatting help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      };
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    }
  },
};
