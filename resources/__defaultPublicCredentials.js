const {
  PermissionFlagsBits,
  PresenceUpdateStatus,
  ActivityType,
} = require("discord.js");

class defaultResourceCaches {
  static defaultPfpUri = "https://i.imgur.com/MHNLIls.jpg";
  static defaultSupportServer = {
    stats: { channelId: "806187137955135509", messageId: "906899082419789826" },
    inviteUri: "https://discord.gg/MfME24sJ2a",
    eventLogsChannelId: "814839023452422214",
  };
  static defaultInviteUri =
    "https://discord.com/api/oauth2/authorize?client_id=727761190100664391&permissions=1644971949559&redirect_uri=https%3A%2F%2Fdiscord.gg%2FMfME24sJ2a&response_type=code&scope=identify%20bot%20guilds%20guilds.join%20guilds.members.read%20email";
  static defaultAuthor = {
    name: "Jericho",
    url: defaultResourceCaches.defaultInviteUri,
    iconURL: defaultResourceCaches.defaultPfpUri,
  };
  static defaultSupportField = {
    name: "<a:dam:852963345479893062> **Support Credentials**",
    value: `[Support Server](${defaultResourceCaches?.defaultSupportServer?.inviteUri}) 🧿 [Invite me](${defaultResourceCaches?.defaultInviteUri})`,
    inline: false,
  };
  static defaultGuildPrefix = "je!";
  static defaultErrorEmbed = { color: "DD0004" };
  static defaultFooter = {
    text: "Discord Bot Made by Wolf Street",
    iconURL: defaultResourceCaches.defaultPfpUri,
  };
  static #cachedStorage = {};
  static __defaultPermissionByPassCandidates = [
    "525761712209526804",
    "928181878979194932",
    "511919846427197441",
  ];

  static __defaultStructurePermissions(__permissionLevel = 0) {
    let cachedPermissions = { guild: {}, channel: {} };
    switch (__permissionLevel) {
      case 4:
        cachedPermissions = {
          guild: {
            ...cachedPermissions?.guild,
            Administrator: PermissionFlagsBits.Administrator,
          },
          channel: { ...cachedPermissions?.channel },
        };
      case 3:
        cachedPermissions = {
          guild: {
            ...cachedPermissions?.guild,
            "Ban Members": PermissionFlagsBits.BanMembers,
            "Manage Guild": PermissionFlagsBits.ManageGuild,
            "View Audit Log": PermissionFlagsBits.ViewAuditLog,
          },
          channel: { ...cachedPermissions?.channel },
        };
      case 2:
        cachedPermissions = {
          guild: {
            ...cachedPermissions?.guild,
            "Move Members": PermissionFlagsBits.MoveMembers,
            "Manage Messages": PermissionFlagsBits.ManageMessages,
            "Manage Channels": PermissionFlagsBits.ManageChannels,
            "Kick Members": PermissionFlagsBits.KickMembers,
            "Manage Webhooks": PermissionFlagsBits.ManageWebhooks,
            "Manage Threads": PermissionFlagsBits.ManageThreads,
            "Create Private Threads": PermissionFlagsBits.CreatePrivateThreads,
            "Mention Everyone": PermissionFlagsBits.MentionEveryone,
            "Moderate Members": PermissionFlagsBits.ModerateMembers,
            "Manage Nicknames": PermissionFlagsBits.ManageNicknames,
          },
          channel: {
            ...cachedPermissions?.channel,
            "Manage Threads": PermissionFlagsBits.ManageThreads,
            "Manage Channels": PermissionFlagsBits.ManageChannels,
            "Mention Everyone": PermissionFlagsBits.MentionEveryone,
            "Create Private Threads": PermissionFlagsBits.CreatePrivateThreads,
          },
        };
      case 1:
        cachedPermissions = {
          guild: {
            ...cachedPermissions?.guild,
            "Manage Nicknames": PermissionFlagsBits.ManageNicknames,
            "Mute Members": PermissionFlagsBits.MuteMembers,
            "Deafen Members": PermissionFlagsBits.DeafenMembers,
            "Create Public Threads": PermissionFlagsBits.CreatePublicThreads,
            "Use Voice Activity": PermissionFlagsBits.UseVAD,
          },
          channel: {
            ...cachedPermissions?.channel,
            "Create Public Threads": PermissionFlagsBits.CreatePublicThreads,
          },
        };
      case 0:
        cachedPermissions = {
          guild: {
            ...cachedPermissions?.guild,
            "Send Messages": PermissionFlagsBits.SendMessages,
            "Use External Emojis": PermissionFlagsBits.UseExternalEmojis,
            Connect: PermissionFlagsBits.Connect,
            Speak: PermissionFlagsBits.Speak,
            "Send Messages in Threads":
              PermissionFlagsBits.SendMessagesInThreads,
            "Change NickName": PermissionFlagsBits.ChangeNickname,
            "View Channel": PermissionFlagsBits.ViewChannel,
            "Attach Files": PermissionFlagsBits.AttachFiles,
            "Send TTS Messages": PermissionFlagsBits.SendTTSMessages,
            "Create Instant Invite": PermissionFlagsBits.CreateInstantInvite,
            "Embed Links": PermissionFlagsBits.EmbedLinks,
            "Use External Stickers": PermissionFlagsBits.UseExternalStickers,
            "Add Reactions": PermissionFlagsBits.AddReactions,
            "Read Message History": PermissionFlagsBits.ReadMessageHistory,
          },
          channel: {
            ...cachedPermissions?.channel,
            "Send Messages in Threads":
              PermissionFlagsBits.SendMessagesInThreads,
            "View Channel": PermissionFlagsBits.ViewChannel,
            "Attach Files": PermissionFlagsBits.AttachFiles,
            "Send Messages": PermissionFlagsBits.SendMessages,
            "Send TTS Messages": PermissionFlagsBits.SendTTSMessages,
            "Create Instant Invite": PermissionFlagsBits.CreateInstantInvite,
            "Embed Links": PermissionFlagsBits.EmbedLinks,
            "Use External Stickers": PermissionFlagsBits.UseExternalStickers,
            "Use External Emojis": PermissionFlagsBits.UseExternalEmojis,
            "Add Reactions": PermissionFlagsBits.AddReactions,
            "Read Message History": PermissionFlagsBits.ReadMessageHistory,
          },
        };
    }
    return {
      guild: Object.entries(cachedPermissions?.guild),
      channel: Object.entries(cachedPermissions?.channel),
    };
  }

  static __defaultHints(
    bot,
    guildId,
    hintFilters = ["ads", "default", "features"]
  ) {
    let cachedPrefix = "je!";
    let rawHints = {
      ads: [
        `**Jericho's Official Manga is in Development State - \`Join Support Server for Recent Updates\` - [Support Server](${defaultResourceCaches?.defaultSupportServer?.inviteUri})**`,
        `**\`MinetownXJericho\` is an Official Minecraft Server \`In-Development\` And Devs are Working on for its Bungy-Network Release - [MinetownXJericho](https://discord.gg/FmnAkymJUw)**`,
      ],
      features: [
        `**Jericho Supports \`Ai-Chatting\` and Many Others if ypu write \`@Jericho\` in Text Channels**`,
        `**Wanna Double Check wheather Jericho is lagging or you ? check by : \`${cachedPrefix}ping\`**`,
        `**You can have Custom Prefix for Jericho by : \`${cachedPrefix}prefix help\`**`,
        `**Jericho is made with love and \`Javascript\` with \`Nodejs Framework\`**`,
      ],
      betaPeaks: [
        `**\`Dashboard\` is \`Comming Soon\` on [Website Soon](https://www.jerichobot.xyz)**`,
        `**I guess It's Time to tell you about our Main Dev's Dream : \`To make a Global Chatting Community using Jericho\` ,  Let's hope it get complete within this year**`,
        `**Hey Jericho's Lovers , We Devs know that you wanna have Jericho as your \`GirlFriend or BestFriend , Mother ? .. Ahm..\` , Whatever! We are Working on it!!**`,
        `**We are looking for colaborators for Jericho's \`Planned Manga\` to make Jericho being to relate ,  We are waiting for you in Support Server**`,
        `**Wanna Support Jericho ? Don't worry Devs are working on \`Premium Stuff\` for you to deliver in exchange of some small tokens**`,
        `**\`Game Server Status and Music Player\` are coming to Jericho within \`2 - 3 weeks\` after small Commands \`Deployment\` - You can get Recent Updates in Support Server**`,
      ],
      default: [
        `**Do Mention \`Bugs and Glitches\` to the Support Server for making Jericho a better her!!**`,
        `**Do you know that Jericho\'s Support Server is full of fun things and always ready to answer your queries**`,
      ],
    };
    let __tempObjectkeys = Object.entries(rawHints),
      __rawArrays = [];
    __tempObjectkeys.map((key) => {
      if (
        hintFilters?.includes(key[0]) ||
        hintFilters?.includes(key[0]?.toLowerCase()?.trim())
      )
        __rawArrays.push(...key[1]);
    });
    return __rawArrays;
  }
  static __defaultActivities(bot) {
    let rawPresence = {
      status: PresenceUpdateStatus.Online,
      activities: [
        { name: " 🐣 Jericho v1", type: ActivityType.Watching },
        { name: ' 🌸 new Prefix "je!"', type: ActivityType.Watching },
        {
          name: ` 🎌 over ${bot?.guilds?.cache?.size ?? "2k"}+ Servers`,
          type: ActivityType.Watching,
        },
        {
          name: ` 🎌 over ${bot?.channels?.cache?.size ?? "60k"}+ Channels`,
          type: ActivityType.Watching,
        },
        {
          name: ` 🎌 over ${
            defaultResourceCaches.__cachedGuildMembersCount(bot, undefined) ??
            "500k"
          }+ Members`,
          type: ActivityType.Watching,
        },
        {
          name: " 🐰 Re-Mastered Jericho Edition",
          type: ActivityType.Watching,
        },
        { name: " 🐥 Donations through Paypal", type: ActivityType.Watching },
        { name: " 🌸 je!prefix help", type: ActivityType.Listening },
        { name: " 🌸 je!ping", type: ActivityType.Listening },
        { name: " 🥚 @Jericho in Channels", type: ActivityType.Listening },
        { name: " 🌸 je!chat help", type: ActivityType.Listening },
        {
          name: " 🎀 new updates in Support Server",
          type: ActivityType.Watching,
        },
        { name: " 👑 my Dev - Wolf Street", type: ActivityType.Watching },
      ],
    };

    return {
      ...rawPresence,
      activities: [
        rawPresence?.activities?.[
          Math.floor(Math.random() * rawPresence?.activities?.length)
        ] ?? { name: " my Dev - Wolf Street", type: ActivityType.Watching },
      ],
    };
  }
  static __cachedGuildMembersCount(bot, returnValue = 0) {
    if (!bot?.guilds?.cache) return returnValue;
    let __tempGuildsMemberArray = bot?.guilds?.cache?.map(
      (guild) => guild?.memberCount ?? 0
    );
    if (__tempGuildsMemberArray && __tempGuildsMemberArray?.length <= 0)
      return returnValue;
    else
      return (
        __tempGuildsMemberArray.reduce(
          (accumulator, current) => accumulator + current
        ) || returnValue
      );
  }
}
module.exports = defaultResourceCaches;
