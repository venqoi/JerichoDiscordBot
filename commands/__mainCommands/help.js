const {
  guildPrefixFetcher,
  __permissionsManager,
} = require("../../Utilities/__miscUtils");
const bookFrameworkEngine = require("../../functions/coreHandler/internalHandler/__bookFramework");

module.exports = {
  name: "help",
  aliases: ["helped", "support", "h"],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 0, {
      message: message,
    });
    if (!__permissionsReview) return undefined;
    let __cachedPrefix = guildPrefixFetcher(
      message?.guildId ?? message?.guild?.id
    );
    let rawCaches = {
        home: {
          title: "__**Home Page**__",
          description: `🏷️ **What is Jericho ?**\n> *Jericho is a Multi-Purpose Discord Bot using discord.js v14 (may change based on requirement) , It's Discord Verified Discord Bot and is around 1.4k+ Servers with 5 million Users (may change based on time) , Currently it got 5+ Main features after a Hard Reboot from Old Users and Will be Developing new and required features for Users , Jericho's Main Purpose was to provide premium work/feature for free in exchange of love and share*\n\n\n🏷️ **Who is the Main Developer ?**\n> [Wolf Street](https://discordapp.com/users/525761712209526804) *is the Current Main Developer and He is the Creator and Founder of Jericho Packages and Bot , He is a Cyber Security Aspirant and Develops Stuff as per his hobby . He is from India , He won many Hackhthons and Tournaments within 2 - 3 Years of Span and Currently Studying for graduating College . Wolf's Life is full singles and will be forever Lmao !!*`,
          image: "https://i.imgur.com/Csu7gYv.jpg",
        },
        chatting: {
          title: "__**Girlfriend Chatting Feature**__",
          description: `<a:heartdiamond:805342773824716802> **What is Girlfriend Chatting ?**\n> *Girlfriend Chatting is a A.I. Chatting Bot based feature with proper translations*\n\n<a:heartdiamond:805342773824716802> **Common Commands :**\n<:announcements:852963180732350484> **Setting up Chatting Config :** \`${__cachedPrefix}chatting setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}chatting edit\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}chatting delete\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}chatting check\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
          image: "https://i.imgur.com/JbC8WMI.jpg",
        },
        prefix: {
          title: "__**Discord Server Prefix Feature**__",
          description: `<a:heartdiamond:805342773824716802> **What is Discord Server Prefix ?**\n> *Custom Prefix for Jericho in-case for community based Server with loads of Other Bots with same Default-Prefixes*\n\n<a:heartdiamond:805342773824716802> **Common Commands :**<:announcements:852963180732350484> **Setting up New Custom Prefix :** \`${__cachedPrefix}prefix <new prefix>\`\n<:announcements:852963180732350484> **Editting Saved Prefix :** \`${__cachedPrefix}prefix <new prefix>\`\n<:announcements:852963180732350484> **Deleting Saved/Old Prefix :** \`${__cachedPrefix}prefix delete\``,
          image: "https://i.imgur.com/7U5WgWz.jpg",
        },
        status: {
          title: "__**Game Server Status Feature**__",
          description: `<a:heartdiamond:805342773824716802> **What is Game Server Status ?**\n> *Its a Discord-GameServers Linked Status with Auto-Refreshing and On-Demand Refresh Button , It helps to show real Time Status using query Port or Server Port (if server allows sharing Server Status Data) , This Feature Supports 250+ Games and some Common Steam Protocols Supported Servers*\n\n<a:heartdiamond:805342773824716802> **Common Commands :**\n<:announcements:852963180732350484> **Setting up Status Config :** \`${__cachedPrefix}status setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}status edit <slot-Id/"all">\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}status delete <slot-Id>/"all"\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}status check <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Maintenance Mode Config :** \`${__cachedPrefix}status maintenance <slot-Id/'all'> <"on"/"off">\`\n<:announcements:852963180732350484> **Hide/Unhide Config :** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Check Supported Game-Server :** \`${__cachedPrefix}status check games\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
          image: "https://i.imgur.com/C7Df1ZC.jpg",
        },
      },
      rawData = [],
      garbageStructure = {};
    if (args?.[0] && rawCaches[args?.[0]?.toLowerCase()?.trim()])
      garbageStructure[args?.[0]?.toLowerCase()?.trim()] =
        rawCaches[args?.[0]?.toLowerCase()?.trim()];
    else garbageStructure = rawCaches;

    rawData = Object.entries(garbageStructure)
      ?.map((data) => data?.[1])
      ?.filter(Boolean);
    let bookFramework = new bookFrameworkEngine(
      rawData?.map((data) => data?.description),
      {
        bookType: "single",
        rawChannel: message?.channel,
        authorMessage: message,
        embedTexture: rawData,
      }
    );
    return await bookFramework.start();
  },
};
