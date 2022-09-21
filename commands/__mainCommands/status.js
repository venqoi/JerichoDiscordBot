const {
  __permissionsManager,
  guildPrefixFetcher,
} = require('../../Utilities/__miscUtils')
const __embedGenerator = require('../../Utilities/__embedGen')
const backendEngine = require('../../functions/serverStatusHandler/backendEmployer')
const {
  getData,
} = require('../../functions/serverStatusHandler/frontendEmployer')
const {
  quickCheck,
  __parseBody,
} = require('../../resources/__gameStatusResources')
const bookFrameworkEngine = require('../../functions/coreHandler/internalHandler/__bookFramework')

module.exports = {
  name: 'status',
  aliases: [
    'statuses',
    'gameserverstatus',
    'serverstatus',
    'gamestats',
    'serverstats',
    'gss',
    'gsstatus',
  ],
  async directCommand(bot, message, args) {
    let __permissionsReview = await __permissionsManager(bot, 'citizen', {
      message: message,
    })
    if (!__permissionsReview) return undefined
    let __cachedPrefix = guildPrefixFetcher(
      message?.guildId ?? message?.guild?.id,
    )
    if (!args?.[0]) {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}status <mainCommand> <subCommand> <extra-Value-On-Demand>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      }
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      })
    }
    let __gameStatusInstance = new backendEngine()
    if (args?.[0]?.toLowerCase()?.trim() === 'setup') {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true },
      )
      if (!__permissionsReview) return undefined
      let __tempCaches = {
        channelId:
          message?.mentions?.channels?.first()?.id ??
          (!isNaN(Number(args?.[1])) ? args?.[1] : undefined) ??
          undefined,
      }
      let __tempResponse = await __gameStatusInstance.__setupConfig(message, {
        skipCapture: __tempCaches,
      })
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status setup <blank>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      } else return undefined
    } else if (
      args?.[0]?.toLowerCase()?.trim() === 'edit' &&
      args?.[1]?.trim() !== ''
    ) {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true },
      )
      if (!__permissionsReview) return undefined
      let __tempCaches = {
        slotSelection: args?.[1]?.trim() ?? undefined,
        skipCapture: {
          column: args?.[2]?.trim(),
          value: args?.[3]?.trim(),
        },
      }
      let __tempResponse = await __gameStatusInstance.__editConfig(
        message,
        __tempCaches,
      )
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Edit Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status edit <blank>\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      } else return undefined
    } else if (
      args?.[0]?.toLowerCase()?.trim() === 'delete' &&
      args?.[1]?.trim() !== ''
    ) {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true },
      )
      if (!__permissionsReview) return undefined
      let __tempCaches = {
        slotSelection: args?.[1] ?? undefined,
        skipCapture: {
          column: args?.[2]?.trim(),
          value: args?.[3]?.trim(),
        },
      }
      let __tempResponse = await __gameStatusInstance.__deleteConfig(
        message,
        __tempCaches,
      )
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Setup Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status delete <slot-Id/"all">\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      } else {
        let __tempRawEmbed = {
          title: `**Delete Config Request has been Completed**`,
          description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Status Config :** \`${__cachedPrefix}status setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}status edit <slot-Id/"all">\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}status delete <slot-Id>/"all"\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}status check <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Maintenance Mode Config :** \`${__cachedPrefix}status maintenance <slot-Id/'all'> <"on"/"off">\`\n<:announcements:852963180732350484> **Hide/Unhide Config :** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/'all'>\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
        }
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            message: message,
            channel: message?.channel,
          },
        )
      }
    } else if (
      ['hide', 'unhide'].includes(args?.[0]?.toLowerCase()?.trim()) &&
      args?.[1]?.trim() !== ''
    ) {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true },
      )
      if (!__permissionsReview) return undefined
      let __tempCaches = {
        slotSelection: args?.[1] ?? undefined,
        type: args?.[0]?.toLowerCase()?.trim(),
        skipCapture: {
          column: args?.[2]?.trim(),
        },
      }
      let __tempResponse = await __gameStatusInstance.__hideConfig(
        message,
        __tempCaches,
      )
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Hide/Unhide Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/"all">\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      } else {
        let __tempRawEmbed = {
          title: `**Hide/Unhide Config Request has been Completed**`,
          description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Status Config :** \`${__cachedPrefix}status setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}status edit <slot-Id/"all">\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}status delete <slot-Id>/"all"\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}status check <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Maintenance Mode Config :** \`${__cachedPrefix}status maintenance <slot-Id/'all'> <"on"/"off">\`\n<:announcements:852963180732350484> **Hide/Unhide Config :** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/'all'>\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
        }
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            message: message,
            channel: message?.channel,
          },
        )
      }
    } else if (
      args?.[0]?.toLowerCase()?.trim() === 'check' &&
      args?.[1]?.toLowerCase()?.trim() === 'games'
    ) {
      let __rawData = await __parseBody()
      __rawData = __rawData?.map((cache, index) => {
        return `\`${index + 1}) ${cache?.gameName}\``
      })
      let bookFramework = new bookFrameworkEngine(__rawData, {
        bookType: __rawData?.length > 1 ? 'multiple30' : 'single',
        rawChannel: message?.channel,
        authorMessage: message,
      })
      return await bookFramework.start()
    } else if (args?.[0]?.toLowerCase()?.trim() === 'check') {
      let rawData = await getData(
          message.guild?.id,
          args?.[1]?.trim() ?? undefined,
          undefined,
          true,
        ),
        garbageHideConfigCaches
      if (!(rawData && Array.isArray(rawData) && rawData?.length > 0)) {
        let __tempRawEmbed = {
          title: `**No Game Server Status are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status check <slot-Id/"all">\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      }
      rawData = rawData?.map((cache) => {
        garbageHideConfigCaches = Object.entries({
          'Ip-Address': cache.rawArgs?.hideIp ?? undefined,
          Port: cache.rawArgs?.hidePort ?? undefined,
          Banner: cache.rawArgs?.hideBanner ?? undefined,
          Thumbnail: cache.rawArgs?.hideThumbnail ?? undefined,
          'Profile-Picture': cache.rawArgs?.hidepfp ?? undefined,
          ping: cache.rawArgs?.hidePing ?? undefined,
          'Players-Count': cache.rawArgs?.hidePlayersCount ?? undefined,
          'Players-Names': cache.rawArgs?.hidePlayersNames ?? undefined,
        })
        return `<a:badge_partnershine:854345079602413619> __**Status Slot ID :**__ \`${
          cache.rawArgs?.slotId
        }\`\n> **Status Channel :** <#${
          cache.rawArgs?.channelId
        }>\n> **Status Message Url :** ${
          cache.rawArgs?.messageId && cache.rawArgs?.channelId
            ? `[Click Here](https://discord.com/channels/${message?.guild?.id}/${cache.rawArgs?.channelId}/${cache.rawArgs?.messageId})`
            : '`Not Found`'
        }\n> **Status Host :** \`${
          cache?.rawArgs?.host
        }\`\n> **Status Name :** \`${
          cache.rawArgs?.name
        }\`\n> **Status Description (short) :** \`${
          cache.rawArgs?.description?.slice(0, 200)?.trim() ??
          'Not Found / By-Default Description'
        }\`\n> **Status Game Name :** \`${
          quickCheck({
            rawString: cache.rawArgs?.gameName,
            checkType: 'id',
            returnType: 'all',
          })?.gameName
        }\`\n> **Server Profile Picture (pfp) :** ${
          cache.rawArgs?.pfp
            ? `[Image Link](${cache.rawArgs?.pfp})`
            : '`Not Found`'
        }\n> **Embed Thumbnail :** ${
          cache.rawArgs?.thumbnail
            ? `[Image Link](${cache.rawArgs?.thumbnail})`
            : '`Not Found`'
        }\n> **Embed Banner Image :** ${
          cache.rawArgs?.banner
            ? `[Image Link](${cache.rawArgs?.banner})`
            : '`Not Found`'
        }\n> **Embed Color Code :** \`${
          cache.rawArgs?.color ?? 'Not Found'
        }\`\n> **Status Maintenance Mode :** \`${
          ['true', 'yes'].includes(
            cache?.rawArgs?.maintenance?.toLowerCase()?.trim(),
          )
            ? 'Active'
            : 'Not-Active'
        }\`\n> **Hide Configs :** \` ${
          garbageHideConfigCaches?.filter(
            (data) =>
              data?.[1] &&
              typeof data?.[1] === 'string' &&
              data?.[1]?.trim() !== '',
          )?.length > 0
            ? garbageHideConfigCaches
                ?.map((data) =>
                  data?.[1] && data?.[0] ? data?.[0] : undefined,
                )
                ?.filter(Boolean)
                ?.join(' , ')
            : 'No Coufig Found'
        } \``
      })
      let bookFramework = new bookFrameworkEngine(rawData, {
        bookType: rawData?.length > 1 ? 'multiple3' : 'single',
        rawChannel: message?.channel,
        authorMessage: message,
      })
      return await bookFramework.start()
    } else if (
      args?.[0]?.toLowerCase()?.trim() === 'maintenance' &&
      args?.[1]?.trim() !== '' &&
      !isNaN(Number(args?.[1]?.trim())) &&
      ['on', 'off'].includes(args?.[2]?.toLowerCase()?.trim())
    ) {
      __permissionsReview = await __permissionsManager(
        bot,
        3,
        {
          message: message,
        },
        { checkMember: message?.member, byPassDevs: true },
      )
      if (!__permissionsReview) return undefined
      let __tempCaches = {
        slotSelection: args?.[1] ?? undefined,
        type: args?.[2]?.toLowerCase()?.trim(),
      }
      let __tempResponse = await __gameStatusInstance.__maintenanceModesConfig(
        message,
        __tempCaches,
      )
      if (!__tempResponse) {
        let __tempRawEmbed = {
          title: `**On-going Maintenance Config Process Crashes are Detected**`,
          description: `<a:heartshade:854344829746937876> **Expected Reasons/Solutions**__\n<a:no:797219912963719228> **Please Provide Correct Arguments like -** \`${__cachedPrefix}status maintenance <slot-Id/"all"> <"on"/"off">\`\n<a:no:797219912963719228> **Please Check Weather you gave/select Correct Values during Config Process**\n<a:no:797219912963719228> **Please Check Weather you gave Correct Permissions for the Config Process**\n<a:no:797219912963719228> **You can Ask Jericho's Official Developer \`WolfStreet\` for the Help in Support Server**\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
        }
        return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
          message: message,
          channel: message?.channel,
        })
      } else {
        let __tempRawEmbed = {
          title: `**Maintenance Config Request has been Completed**`,
          description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Status Config :** \`${__cachedPrefix}status setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}status edit <slot-Id/"all">\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}status delete <slot-Id>/"all">\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}status check <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Maintenance Mode Config :** \`${__cachedPrefix}status maintenance <slot-Id/'all'> <"on"/"off">\`\n<:announcements:852963180732350484> **Hide/Unhide Config :** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/'all'>\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
        }
        return await __embedGenerator.__normalPublishEmbed(
          bot,
          __tempRawEmbed,
          {
            message: message,
            channel: message?.channel,
          },
        )
      }
    } else if (args?.[0]?.toLowerCase()?.trim() === 'help') {
      let __tempRawEmbed = {
        title: `**Game Server Status Help Dashboard**`,
        description: `<a:yes:817492826148700211> __**Stats**__\n<:announcements:852963180732350484> **Setting up Status Config :** \`${__cachedPrefix}status setup\`\n<:announcements:852963180732350484> **Editting Saved Config :** \`${__cachedPrefix}status edit <slot-Id/"all">\`\n<:announcements:852963180732350484> **Deleting Saved/Old Config :** \`${__cachedPrefix}status delete <slot-Id>/"all"\`\n<:announcements:852963180732350484> **Check Saved Config :** \`${__cachedPrefix}status check <slot-Id/'all'>\`\n<:announcements:852963180732350484> **Maintenance Mode Config :** \`${__cachedPrefix}status maintenance <slot-Id/'all'> <"on"/"off">\`\n<:announcements:852963180732350484> **Hide/Unhide Config :** \`${__cachedPrefix}status <"unhide"/"hide"> <slot-Id/'all'>\`\n\n<a:sertodletahu:725107717542510682> __**Note :**__ \`Threads Permission is Required for Edit and Setup Commands\``,
      }
      return await __embedGenerator.__normalPublishEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      })
    } else {
      let __tempRawEmbed = {
        title: `**Invalid Command's Arguments are Detected**`,
        description: `**Please Provide Correct Arguments like -** \`${__cachedPrefix}status <mainCommand> <subCommand> <extra-Value-On-Demand>\`\n\n<a:heartshade:854344829746937876> __**Help Section**__\n**Game Server Status Help Command :** \`${__cachedPrefix}help status\` **OR** \`${__cachedPrefix}status help\`\n**Help Command :** \`${__cachedPrefix}help\``,
      }
      return await __embedGenerator.__errorEmbed(bot, __tempRawEmbed, {
        message: message,
        channel: message?.channel,
      })
    }
  },
}
