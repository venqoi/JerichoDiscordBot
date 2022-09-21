const {
  __permissionsManager,
  guildPrefixFetcher,
} = require("../../Utilities/__miscUtils");
const {
  defaultGuildPrefix,
} = require("../../resources/__defaultPublicCredentials");
const __embedGenerator = require("../../Utilities/__embedGen");
const databaseCore = require("../../functions/coreHandler/externalHandler/databaseCore");
const { Message, CommandInteraction } = require("discord.js");

module.exports = {
  name: "prefix",
  aliases: ["prefixes", "pref", "pre"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 0, {
      message: message,
    });
    if (!__permissionsReview) return undefined;
    let __cachedPrefix = guildPrefixFetcher(
      message?.guild?.id ?? message?.guildId
    );
    if (!args?.[0] || !(message instanceof Message)) {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}prefix <"delete"/new prefix>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      };
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    } else if (args?.[0]?.toLowerCase()?.trim() === "delete") {
      let __tempCachedData =
        (await databaseCore.fetch("universalGuildSettings", {
          guildId: message?.guild?.id ?? message?.guildId,
          category: "prefix",
          fetchCache: true,
          subCategory: "server",
          returnIndex: 0,
        })) ?? undefined;
      if (!__tempCachedData) {
        let __tempRawEmbed = {
          title: `**Deleting Prefix Request Crashed**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Check Weather Setup is already Present for Deletion Process by \`@Jericho\` - By Mentioning Jericho**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      }
      let __cacheReponse = await databaseCore.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          message?.guildId ?? message?.guild?.id
        }" AND category = "prefix" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        "universalGuildSettings"
      );
      if (!__cacheReponse) {
        let __tempRawEmbed = {
          title: `**Deleting Prefix Request Crashed**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Sync and Deletion Process has been Crashed with Error**\n<a:no:797219912963719228> **Please Check Weather Setup is already Present for Deletion Process by \`@Jericho\` - By Mentioning Jericho**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        });
      } else {
        let __tempRawEmbed = {
          title: `**Delete Prefix is Completed and Synced**`,
          description: `**Old Prefix has been Deleted from Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Setup new Prefix by -** \`${__cachedPrefix}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`${__cachedPrefix}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
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
        title: `**Prefix Help Dashboard**`,
        description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up New Custom Prefix :** \`${__cachedPrefix}prefix <new prefix>\`\n<:announcements:852963180732350484> **Editting Saved Prefix :** \`${__cachedPrefix}prefix <new prefix>\`\n<:announcements:852963180732350484> **Deleting Saved/Old Prefix :** \`${__cachedPrefix}prefix delete\``,
      };
      return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    } else if (
      args?.[0]?.trim()?.length > 0 &&
      args?.[0]?.trim()?.length < 5 &&
      !/\d/.test(args[0]?.trim())
    ) {
      let __tempCachedData =
          (await databaseCore.fetch("universalGuildSettings", {
            guildId: message?.guild?.id ?? message?.guildId,
            category: "prefix",
            fetchCache: true,
            subCategory: "server",
            returnIndex: 0,
          })) ?? undefined,
        __tempResponse;
      if (__tempCachedData?.rawArgs) {
        let __tempRawArgs =
          databaseCore.__customParser(undefined, {
            rawArgs: __tempCachedData?.rawArgs,
            tableName: "universalGuildSettings",
            categoryName: "prefix",
          }) ?? __tempCachedData?.rawArgs;
        if (!__tempRawArgs) return undefined;
        __tempRawArgs = { prefix: args?.[0]?.toLowerCase()?.trim() };
        if (__tempRawArgs?.prefix !== defaultGuildPrefix) {
          __tempResponse = await databaseCore.__query(
            `UPDATE universalGuildSettings SET rawArgs = "${databaseCore.__customParser(
              {
                structures: __tempRawArgs,
                tableName: "universalGuildSettings",
                categoryName: "prefix",
              }
            )}" WHERE guildId = "${
              message?.guild?.id ?? message?.guildId
            }" AND category = "prefix" AND subCategory = "server"`,
            undefined,
            false,
            undefined,
            "universalGuildSettings"
          );
        } else {
          __tempResponse = await databaseCore.__query(
            `DELETE FROM universalGuildSettings WHERE guildId = "${
              message?.guildId ?? message?.guild?.id
            }" AND category = "prefix" AND subCategory = "server"`,
            undefined,
            false,
            undefined,
            "universalGuildSettings"
          );
        }
        if (!__tempResponse) {
          let __tempRawEmbed = {
            title: `**Setting up New Prefix Request Crashed**`,
            description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
          };
          return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
            message: message,
            channel: message?.channel,
          });
        } else {
          let __tempRawEmbed = {
            title: `**Setting up New Prefix is Completed and Synced**`,
            description: `**New Prefix has been Updated in Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check New Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Delete/Reset new Prefix by -** \`${__cachedPrefix}prefix delete\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`${__cachedPrefix}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
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
      } else {
        let __tempCachedData =
          (await databaseCore.fetch("universalGuildSettings", {
            fetchCache: true,
          })) ?? [];
        let __tempRawArgs = databaseCore.__customParser({
          structures: {
            prefix: args[0]?.toLowerCase()?.trim(),
          },
          tableName: "universalGuildSettings",
          categoryName: "prefix",
        });
        if (!__tempRawArgs) return undefined;
        let __tempResponse = await databaseCore.__query(
          `INSERT INTO universalGuildSettings VALUES(${
            __tempCachedData?.length + 1
          },"prefix","server","${
            message?.guild?.id ?? message?.guildId
          }","${__tempRawArgs}")`,
          undefined,
          false,
          undefined,
          "universalGuildSettings"
        );
        if (!__tempResponse) {
          let __tempRawEmbed = {
            title: `**Setting up Prefix Request Crashed**`,
            description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
          };
          return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
            message: message,
            channel: message?.channel,
          });
        } else {
          let __tempRawEmbed = {
            title: `**Setting up Prefix is Completed and Synced**`,
            description: `**New Prefix has been Updated in Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Delete/Reset new Prefix by -** \`${__cachedPrefix}prefix delete\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`${__cachedPrefix}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
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
      }
    } else {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}prefix <"delete"/new prefix>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Chatting Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      };
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      });
    }
  },
  async slashCommand(bot, interaction, jsonData, filters) {
    if (!(bot && interaction && interaction instanceof CommandInteraction))
      return undefined;
    await interaction.deferReply({ ephemeral: true });
    let __cachedPrefix = guildPrefixFetcher(
      interaction?.guild?.id ?? interaction?.guildId
    );
    if (
      interaction &&
      interaction?.options?.getString("set") &&
      interaction?.options?.getString("set")?.trim()?.length > 0 &&
      interaction?.options?.getString("set")?.trim()?.length < 5 &&
      !/\d/.test(interaction?.options?.getString("set")?.trim())
    ) {
      let __tempCachedData =
          (await databaseCore.fetch("universalGuildSettings", {
            guildId: interaction?.guild?.id ?? interaction?.guildId,
            category: "prefix",
            fetchCache: true,
            subCategory: "server",
            returnIndex: 0,
          })) ?? undefined,
        __tempResponse;
      if (__tempCachedData?.rawArgs) {
        let __tempRawArgs =
          databaseCore.__customParser(undefined, {
            rawArgs: __tempCachedData?.rawArgs,
            tableName: "universalGuildSettings",
            categoryName: "prefix",
          }) ?? __tempCachedData?.rawArgs;
        if (!__tempRawArgs) return undefined;
        __tempRawArgs = {
          prefix: interaction?.options?.getString("set")?.toLowerCase()?.trim(),
        };
        if (__tempRawArgs?.prefix !== defaultGuildPrefix) {
          __tempResponse = await databaseCore.__query(
            `UPDATE universalGuildSettings SET rawArgs = "${databaseCore.__customParser(
              {
                structures: __tempRawArgs,
                tableName: "universalGuildSettings",
                categoryName: "prefix",
              }
            )}" WHERE guildId = "${
              interaction?.guild?.id ?? interaction?.guildId
            }" AND category = "prefix" AND subCategory = "server"`,
            undefined,
            false,
            undefined,
            "universalGuildSettings"
          );
        } else {
          __tempResponse = await databaseCore.__query(
            `DELETE FROM universalGuildSettings WHERE guildId = "${
              interaction?.guildId ?? interaction?.guild?.id
            }" AND category = "prefix" AND subCategory = "server"`,
            undefined,
            false,
            undefined,
            "universalGuildSettings"
          );
        }
        if (!__tempResponse) {
          let __tempRawEmbed = {
            title: `**Setting up New Prefix Request Crashed**`,
            description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
          };
          return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
            interaction: interaction,
          });
        } else {
          let __tempRawEmbed = {
            title: `**Setting up New Prefix is Completed and Synced**`,
            description: `**New Prefix has been Updated in Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check New Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Delete/Reset new Prefix by -** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix delete\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}help prefix\` **OR** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix help\`\n**Help Command :** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}help\``,
          };
          return await __embedGenerator.__normalPublishEmbed(
            bot,
            __tempRawEmbed,
            {
              interaction: interaction,
            }
          );
        }
      } else {
        let __tempCachedData =
          (await databaseCore.fetch("universalGuildSettings", {
            fetchCache: true,
          })) ?? [];
        let __tempRawArgs = databaseCore.__customParser({
          structures: {
            prefix: interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim(),
          },
          tableName: "universalGuildSettings",
          categoryName: "prefix",
        });
        if (!__tempRawArgs) return undefined;
        let __tempResponse = await databaseCore.__query(
          `INSERT INTO universalGuildSettings VALUES(${
            __tempCachedData?.length + 1
          },"prefix","server","${
            interaction?.guild?.id ?? interaction?.guildId
          }","${__tempRawArgs}")`,
          undefined,
          false,
          undefined,
          "universalGuildSettings"
        );
        if (!__tempResponse) {
          let __tempRawEmbed = {
            title: `**Setting up Prefix Request Crashed**`,
            description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
          };
          return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
            interaction: interaction,
          });
        } else {
          let __tempRawEmbed = {
            title: `**Setting up Prefix is Completed and Synced**`,
            description: `**New Prefix has been Updated in Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Delete/Reset new Prefix by -** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix delete\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}help prefix\` **OR** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}prefix help\`\n**Help Command :** \`${interaction?.options
              ?.getString("set")
              ?.toLowerCase()
              ?.trim()}help\``,
          };
          return await __embedGenerator.__normalPublishEmbed(
            bot,
            __tempRawEmbed,
            {
              interaction: interaction,
            }
          );
        }
      }
    } else if (
      interaction &&
      [true, false].includes(interaction?.options?.getBoolean("delete"))
    ) {
      let __tempCachedData =
        (await databaseCore.fetch("universalGuildSettings", {
          guildId: interaction?.guild?.id ?? interaction?.guildId,
          category: "prefix",
          fetchCache: true,
          subCategory: "server",
          returnIndex: 0,
        })) ?? undefined;
      if (!__tempCachedData) {
        let __tempRawEmbed = {
          title: `**Deleting Prefix Request Crashed**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Check Weather Setup is already Present for Deletion Process by \`@Jericho\` - By Mentioning Jericho**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          interaction: interaction,
        });
      }
      let __cacheReponse = await databaseCore.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          interaction?.guildId ?? interaction?.guild?.id
        }" AND category = "prefix" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        "universalGuildSettings"
      );
      if (!__cacheReponse) {
        let __tempRawEmbed = {
          title: `**Deleting Prefix Request Crashed**`,
          description: `<a:heartshade:854344829746937876> __**Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Sync and Deletion Process has been Crashed with Error**\n<a:no:797219912963719228> **Please Check Weather Setup is already Present for Deletion Process by \`@Jericho\` - By Mentioning Jericho**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`${__cachedPrefix}help prefix\` **OR** \`${__cachedPrefix}prefix help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        };
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          interaction: interaction,
        });
      } else {
        let __tempRawEmbed = {
          title: `**Delete Prefix is Completed and Synced**`,
          description: `**Old Prefix has been Deleted from Jericho's Brain**\n__**May-Require Commands/Notes**__\n<a:turuncu:852965555018399775> **You can check Saved Prefix by \`@Jericho\` - By Mentioning Jericho**\n<a:turuncu:852965555018399775> **You can Setup new Prefix by -** \`je!prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Edit Saved Prefix by -** \`je!prefix <new prefix>\`\n<a:turuncu:852965555018399775> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help/Tips in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Prefix Help Command :** \`je!help prefix\` **OR** \`je!prefix help\`\n**Help Command :** \`je!help\``,
        };
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            interaction: interaction,
          }
        );
      }
    } else if (
      interaction &&
      [true, false].includes(interaction?.options?.getBoolean("get"))
    ) {
      let __tempCachedData =
        (await databaseCore.fetch("universalGuildSettings", {
          guildId: interaction?.guild?.id ?? interaction?.guildId,
          category: "prefix",
          fetchCache: true,
          subCategory: "server",
          returnIndex: 0,
        })) ?? undefined;
      return await interaction
        .editReply({
          content: `<a:twitch100:805342901256192021> **Prefix of Discord Server : "\`${
            interaction?.guild?.name
          }\`" is : \`${__tempCachedData?.rawArgs?.prefix ?? "je!"}\`**`,
        })
        ?.catch(() => undefined);
    } else
      return await interaction
        .editReply({
          content: `<a:no:797219912963719228> **Dunno What Command you are Requesting**`,
        })
        ?.catch(() => undefined);
  },
};
