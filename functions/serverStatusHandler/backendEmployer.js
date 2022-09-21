const { Message, BaseChannel, EmbedBuilder } = require('discord.js')
const databaseManager = require('../coreHandler/externalHandler/databaseCore')
const questionEnv = require('../coreHandler/internalHandler/threadModals')
const gameServerStatusResources = require('../../resources/__gameStatusResources')
const bookFrameworkEngine = require('../coreHandler/internalHandler/__bookFramework')

class statusBackend {
  static cachedOptions = { maxSlots: 1000 }
  static rawQuestionEmbed = {
    channelEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Channel Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select Text Channel from the below in-built Menu List for the Server**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **Please Select \`1 Option\` from the Below List**\n\n__**Extra Side Operation**__\n> **You can mention Channel like : \`#general\` OR You can give Channel Id Or Channel Name as \`56123xxxxxxx.... OR general\` from Developer Role to Channel Settings**`,
      maxTime: 2 * 60 * 1000,
      image: "https://i.imgur.com/j8YWsUM.jpg",
      components: {
        minValues: 1,
        maxValues: 1,
      },
    },
    nameEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Server Name Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Custom Server Name\` for the Status to Display at the Top**\n<a:twitch100:805342901256192021> **You can give any Name like you wish like : \`Tropical Realm Smp\` Or \`Ark Survival World\`**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/lCIiYEA.jpg',
      captureDefault: 'Null',
    },
    gameNameEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Server Game Name Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Server Game Name\` for the Status to Work on!!**\n<a:twitch100:805342901256192021> **You can give any Game Name supported by Steam Protocols or some common Steam Protocols like you wish like : \`Minecraft (2009)\` Or \`Ark Survival Evolved\`**\n<a:twitch100:805342901256192021> **Please Give Response within \`10 minutes\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**`,
      maxTime: 10 * 60 * 1000,
    },
    profileEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Server Profile Image Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Custom Server Profile Image\` for the Status to Display at the Top**\n<a:twitch100:805342901256192021> **You can give any Profile Image like you wish**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**\n\n__**Extra Side Operation**__\n> **You should give \`Image Link\` like : \`png,jpeg,jpg,gif..\`** , Because Thread will be Deleted and if you give \`Attachment\` will get deleted from Discord Caches , so it will get Invalid after some time , You can use ** [Imgur Website[(https://imgur.com/) **For Storing your image and get valid image url to give Jericho**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/xqesL2D.jpg',
      captureDefault: 'Null',
    },
    descriptionEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Server Custom Description Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Custom Server Custom Description\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You can give any Description like you wish like : \`>: Fast and Active Smp with Forge's Mods :<\`**\n<a:twitch100:805342901256192021> **Please Give Response within \`5 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/fAbuCHn.jpg',
      captureDefault: 'Null',
    },
    colorEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Status Embed Color Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Status Embed Color\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You can give any Color like you wish like : \`#3AFF91\` from [Embed Color Collection](https://htmlcolorcodes.com/)**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**`,
      maxTime: 2 * 60 * 1000,
      captureDefault: '#3AFF91',
    },
    hostEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Server Host Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Server Host\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You have to give \`Ip-Address\` and \`Port\` in single line like : \`192.168.0.12:1337\` , Where \`192.168.0.12\` is the Ip and \`1337\` is the Port**\n<a:twitch100:805342901256192021> **Please give a \`valid Ip and Port\` for the Status And Please try to provide the \`Server's Query Port\` for better Status Analysis**\n<a:twitch100:805342901256192021> **You can give whole domain/subdomain affiliated with Ip and Port in the Ip section and leave Port as blank like : \`smp.titan.xyz:\`**\n<a:twitch100:805342901256192021> **Please don't try to give ~~\`localhost\`~~ Or ~~\`127.0.0.1\`~~ Or ~~\`192.168.x.x\`~~ , Because these Ips are \`Private Ips\` and can be accessed only by your private network or network service Provider**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/FiZn6Yx.jpg',
      skipHalt: true,
      skipDefault: true,
    },
    bannerEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Status Embed Banner/Image Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Status Embed Banner/Image\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You can give any Banner/Image like you wish like -> [Example Banner/Image](https://imgs.search.brave.com/y3H9AzuqjYPyRRLoYVtnwJXBdumPHqdCB2I9nw2kWDU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAwLzY3/NS8wODEvb3JpZ2lu/YWwvbWluaW1hbC1i/YW5uZXItZGVzaWdu/LXZlY3Rvci5qcGc)**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**\n\n__**Extra Side Operation**__\n> **You should give \`Image Link\` like : \`png,jpeg,jpg,gif..\`** , Because Thread will be Deleted and if you give \`Attachment\` will get deleted from Discord Caches , so it will get Invalid after some time , You can use ** [Imgur Website[(https://imgur.com/) **For Storing your image and get valid image url to give Jericho**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/rowV6OU.jpg',
      captureDefault: 'Null',
    },
    thumbnailEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Status Embed Thumbnail Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Status Embed Thumbnail\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You can give any Thumbnail like you wish like -> [Example Thumbnail](https://imgs.search.brave.com/y3H9AzuqjYPyRRLoYVtnwJXBdumPHqdCB2I9nw2kWDU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAwLzY3/NS8wODEvb3JpZ2lu/YWwvbWluaW1hbC1i/YW5uZXItZGVzaWdu/LXZlY3Rvci5qcGc)**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**\n\n__**Extra Side Operation**__\n> **You should give \`Image Link\` like : \`png,jpeg,jpg,gif..\`** , Because Thread will be Deleted and if you give \`Attachment\` will get deleted from Discord Caches , so it will get Invalid after some time , You can use ** [Imgur Website[(https://imgur.com/) **For Storing your image and get valid image url to give Jericho**`,
      maxTime: 2 * 60 * 1000,
      image: 'https://i.imgur.com/DPTGUfZ.jpg',
      captureDefault: 'Null',
    },
    maintenanceDescriptionEmbed: {
      title:
        '**<:announcements:852963180732350484> Game Server Status - Maintenance Mode Custom Description**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **\`Maintenance - Custom Description\` for the Embeded Status**\n<a:twitch100:805342901256192021> **You can give any Description like you wish like : \`>: Fast and Active Smp with Forge's Mods :<\`**\n<a:twitch100:805342901256192021> **Please Give Response within \`5 minutes\`**\n<a:twitch100:805342901256192021> **You can leave default value for the Config Process by writing : \`null\` Or \`default\`**\n<a:twitch100:805342901256192021> **You can end the Config Process by writing : \`end\`**\n\n__**Extra Side Operation**__\n> **You can give : \`save\`** for fetching from already saved maintenance description from database**`,
      maxTime: 5 * 60 * 1000,
      captureDefault: 'Null',
      image: 'https://i.imgur.com/w7hmxNE.jpg',
    },
    hideEmbed: {
      title:
        "**<:announcements:852963180732350484> Game Server Status - Hide Config's Selection**",
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select the Options from the below in-built Menu List for the Hide Config**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **You can even Skip the Part to remain as what it is**`,
      maxTime: 2 * 60 * 1000,
      components: {
        minValues: 1,
        maxValues: 1,
        options: [
          {
            label: '🎭 Ip-Address',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Ip-Address for Status Server',
            value: 'hideIp',
          },
          {
            label: '🎭 Port Number',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Port Number for Status Server',
            value: 'hidePort',
          },
          {
            label: '🎭 Embed Banner Image',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Embed Banner Image for Status Server',
            value: 'hideBanner',
          },
          {
            label: '🎭 Embed Thumbnail Image',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Embed Thumbnail Image for Status Server',
            value: 'hideThumbnail',
          },
          {
            label: '🎭 Embed Profile Image',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Embed Profile Image for Status Server',
            value: 'hidepfp',
          },
          {
            label: '🎭 Status Ping',
            emoji: '<a:XTN90:725107292768305172>',
            description: 'Hide/Unhide Status Ping for Status Server',
            value: 'hidePing',
          },
          {
            label: "🎭 Status Player's Count",
            emoji: '<a:XTN90:725107292768305172>',
            description: "Hide/Unhide Status Player's Count for Status Server",
            value: 'hidePlayersCount',
          },
          {
            label: "🎭 Status Player's Names",
            emoji: '<a:XTN90:725107292768305172>',
            description: "Hide/Unhide Status Player's Names for Status Server",
            value: 'hidePlayersNames',
          },
        ],
      },
      optionsListforBackend: [
        'hideIp',
        'hidePort',
        'hideBanner',
        'hideThumbnail',
        'hidepfp',
        'hidePing',
        'hidePlayersCount',
        'hidePlayersNames',
      ],
    },
    endEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Completed**',
      embedDescription: `**Config Process is Ended and Completed with no Errors**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Status Config by -** \`je!status check <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Edit Saved Status Config by -** \`je!status edit <slotId/"all"> <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Status Config by -** \`je!status delete <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Hide/Unhide Config by -** \`je!status <"hide"/"unhide"> <slot-Id/"all">\`\n**<a:turuncu:852965555018399775> You can Setup Another Config by -** \`je!status setup\`\n**<a:turuncu:852965555018399775> You can Change Maintenance Mode by -** \`je!status maintenance <slot-Id/"all"> <"on"/"off">\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    crashEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Crashed**',
      embedDescription: `**Config Process is Ended and Crashed**\n**Please Retry after Sometime or Reach Developer at Support Server**\n\n__**Reasons**__\n<a:turuncu:852965555018399775>  **Process is Stopped Because of Answer Collecting Timeout, Please Give Answer within specified Time**\n<a:turuncu:852965555018399775>  **Process is Crashed Because of Wrong Type Value**\n<a:turuncu:852965555018399775>  **Please Check the given Value is Correct and as Requested by the Jericho**\n<a:turuncu:852965555018399775>  **If you think its a mistake then Please show the proof the the Main Developer in the Support Server**\n<a:turuncu:852965555018399775>  **Api Error during Api Calls and Thread Customization during the Process**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Status Config by -** \`je!status check <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Edit Saved Status Config by -** \`je!status edit <slotId/"all"> <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Status Config by -** \`je!status delete <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Hide/Unhide Config by -** \`je!status <"hide"/"unhide"> <slot-Id/"all">\`\n**<a:turuncu:852965555018399775> You can Setup Another Config by -** \`je!status setup\`\n**<a:turuncu:852965555018399775> You can Change Maintenance Mode by -** \`je!status maintenance >slot-Id/"all"> <"on"/"off">\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    haltEmbed: {
      embedTitle:
        '**<:announcements:852963180732350484> Config Process is Halted Mid-Way**',
      embedDescription: `**Config Process is Halted and Ended with no Issue**\n\n__**Extra Config Help**__\n**<a:turuncu:852965555018399775> You can check Saved Status Config by -** \`je!status check <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Edit Saved Status Config by -** \`je!status edit <slotId/"all"> <options/Blank> <optionValue/Blank>\`\n**<a:turuncu:852965555018399775> You can Delete Saved Status Config by -** \`je!status delete <slotId/"all">\`\n**<a:turuncu:852965555018399775> You can Hide/Unhide Config by -** \`je!status <"hide"/"unhide"> <slot-Id/"all">\`\n**<a:turuncu:852965555018399775> You can Setup Another Config by -** \`je!status setup\`\n**<a:turuncu:852965555018399775> You can Change Maintenance Mode by -** \`je!status maintenance <slot-Id/"all"> <"on"/"off">\`\n\n<a:onlineGif:854345313409302538> __**Note**__ **: Command's Prefix may vary for Servers who use Custom Prefix on Jericho**`,
    },
    editEmbed: {
      title:
        '**<:announcements:852963180732350484> Editting Status Config Option Selection**',
      description: `__**Selection Query Acceptance Info**__\n<a:twitch100:805342901256192021> **Select Respective Option from the below in-built Menu List for the Server**\n<a:twitch100:805342901256192021> **Please Give Response within \`2 minutes\`**\n<a:twitch100:805342901256192021> **Please Select 1 Option from the Below List even the Menus are greater than 1**`,
      maxTime: 2 * 60 * 1000,
      components: {
        minValues: 1,
        maxValues: 1,
        options: [
          {
            label: '🏇 Channel',
            emoji: '<a:redstar:796503787292459088>',
            description:
              'Change Config for Server Text Channel for Status Server',
            value: 'Channel',
          },
          {
            label: '🚴 Name',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Name Config for Status Server',
            value: 'Name',
          },
          {
            label: '⚾ Game Name',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Server Game Name Config for Status Server',
            value: 'gameName',
          },
          {
            label: '🏓 color',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change color Config for Status Embed',
            value: 'Color',
          },
          {
            label: '🥋 Description',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Description Config for Status Embed',
            value: 'Description',
          },
          {
            label: '🎭 Host',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Host Config for Status Embed',
            value: 'Host',
          },
          {
            label: '🎸 Maintenance Description',
            emoji: '<a:redstar:796503787292459088>',
            description:
              'Change Maintenance Description Config for Status Embed',
            value: 'maintenanceDescription',
          },
          {
            label: '🎻 Embed Profile Pic',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Profile Pic Config for Status Embed',
            value: 'pfp',
          },
          {
            label: '🎼 Embed Banner',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Banner Pic Config for Status Embed',
            value: 'banner',
          },
          {
            label: '🥁 Embed Thumbnail',
            emoji: '<a:redstar:796503787292459088>',
            description: 'Change Thumbnail Pic Config for Status Embed',
            value: 'thumbnail',
          },
        ],
      },
    },
  }
  async __setupConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'status',
          subCategory: 'server',
        })) ?? []
      if (
        !(
          databaseCredentials &&
          Array.isArray(databaseCredentials) &&
          databaseCredentials?.length <
            (statusBackend.cachedOptions?.maxSlots ?? 1000)
        )
      )
        return undefined
      const filter = (upcomingMessage) =>
        upcomingMessage?.author?.id ===
        (rawMessage?.author?.id ?? rawMessage?.user?.id)
      let __tempLogs = {}
      __tempLogs['slotId'] =
        statusBackend.getParseSlot(undefined, {
          rawArray: databaseCredentials,
          returnType: 'single',
        }) ?? '1'
      __tempLogs['channelId'] =
        configFilters?.skipCapture?.channelId ??
        (await this.__fetchChannelId(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.channelEmbed,
        ))
      __tempLogs['name'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.nameEmbed,
      )
      __tempLogs['gameName'] = await this.__fetchGameName(rawMessage, filter)
      if (!__tempLogs['gameName'])
        return await this.__destroyHandler('crashend')
      __tempLogs['pfp'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.profileEmbed,
      )
      __tempLogs['color'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.colorEmbed,
      )
      __tempLogs['description'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.descriptionEmbed,
      )
      __tempLogs['host'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.hostEmbed,
      )
      __tempLogs['banner'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.bannerEmbed,
      )
      __tempLogs['thumbnail'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.thumbnailEmbed,
      )
      __tempLogs['maintenanceDescription'] = await this.__fetchString(
        rawMessage,
        filter,
        statusBackend.rawQuestionEmbed?.maintenanceDescriptionEmbed,
      )
      if (
        __tempLogs['maintenanceDescription'] &&
        __tempLogs['maintenanceDescription']?.toLowerCase()?.trim() === 'save'
      )
        __tempLogs['maintenanceDescription'] =
          statusBackend.rawQuestionEmbed?.maintenanceDescriptionEmbed?.captureDefault
      return await this.__databaseDelivery(rawMessage, {
        ...__tempLogs,
        selection: 'setup',
        guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
      })
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __editConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'status',
          subCategory: 'server',
        })) ?? []
      if (
        !(
          databaseCredentials &&
          Array.isArray(databaseCredentials) &&
          databaseCredentials?.length > 0
        )
      )
        return undefined
      else if (
        !(
          (configFilters?.slotSelection &&
            !isNaN(Number(configFilters.slotSelection)) &&
            parseInt(configFilters.slotSelection) > 0 &&
            parseInt(configFilters.slotSelection) <=
              statusBackend.cachedOptions.maxSlots &&
            statusBackend.getParseSlot({
              rawArray: databaseCredentials,
              slotId: `${configFilters.slotSelection}`,
            })) ||
          (configFilters?.slotSelection &&
            typeof configFilters?.slotSelection === 'string' &&
            configFilters?.slotSelection?.toLowerCase()?.trim() === 'all')
        )
      )
        return undefined
      const filter = (upcomingMessage) =>
        upcomingMessage?.author?.id ===
        (rawMessage?.author?.id ?? rawMessage?.user?.id)
      let __tempLogs = {}
      let __tempCaptureParent = await this.__fetchInteractionOption(
        rawMessage,
        statusBackend.rawQuestionEmbed?.editEmbed,
      )
      if (
        !__tempCaptureParent ||
        __tempCaptureParent?.toLowerCase()?.trim() === 'end'
      )
        return undefined
      if (__tempCaptureParent?.toLowerCase()?.trim() === 'channel') {
        __tempLogs['column'] = 'channelId'
        __tempLogs['value'] = await this.__fetchChannelId(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.channelEmbed,
        )

        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'name') {
        __tempLogs['column'] = 'name'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.nameEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'gamename') {
        __tempLogs['column'] = 'gameName'
        __tempLogs['value'] = await this.__fetchGameName(rawMessage, filter)
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'host') {
        __tempLogs['column'] = 'host'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.hostEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'banner') {
        __tempLogs['column'] = 'banner'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.bannerEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'pfp') {
        __tempLogs['column'] = 'pfp'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.profileEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'description') {
        __tempLogs['column'] = 'description'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.descriptionEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'thumbnail') {
        __tempLogs['column'] = 'thumbnail'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.thumbnailEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (
        __tempCaptureParent?.toLowerCase()?.trim() === 'maintenancedescription'
      ) {
        __tempLogs['column'] = 'maintenanceDescription'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.maintenanceDescriptionEmbed,
        )
        if (
          __tempLogs['value'] &&
          __tempLogs['value']?.toLowerCase()?.trim() === 'save'
        )
          __tempLogs['value'] = statusBackend.getParseSlot({
            rawArray: databaseCredentials,
            slotId: configFilters?.slotSelection?.trim(),
          })
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else if (__tempCaptureParent?.toLowerCase()?.trim() === 'color') {
        __tempLogs['column'] = 'color'
        __tempLogs['value'] = await this.__fetchString(
          rawMessage,
          filter,
          statusBackend.rawQuestionEmbed?.colorEmbed,
        )
        return await this.__databaseDelivery(rawMessage, {
          ...__tempLogs,
          selection: 'edit',
          slotSelection: configFilters?.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
      } else return undefined
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __hideConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'status',
          subCategory: 'server',
        })) ?? []
      if (
        !(
          databaseCredentials &&
          Array.isArray(databaseCredentials) &&
          databaseCredentials?.length > 0
        )
      )
        return undefined
      else if (
        !(
          (configFilters?.slotSelection &&
            !isNaN(Number(configFilters.slotSelection)) &&
            parseInt(configFilters.slotSelection) > 0 &&
            parseInt(configFilters.slotSelection) <=
              statusBackend.cachedOptions.maxSlots &&
            statusBackend.getParseSlot({
              rawArray: databaseCredentials,
              slotId: `${configFilters.slotSelection}`,
            })) ||
          (configFilters?.slotSelection &&
            typeof configFilters?.slotSelection === 'string' &&
            configFilters?.slotSelection?.toLowerCase()?.trim() === 'all')
        )
      )
        return undefined
      let __tempCaptureParent,
        __tempLogs = {}

      __tempCaptureParent = await this.__fetchInteractionOption(rawMessage, {
        ...statusBackend.rawQuestionEmbed?.hideEmbed,
        title: statusBackend.rawQuestionEmbed?.hideEmbed?.title?.replace(
          'Hide',
          configFilters?.type?.toLowerCase()?.trim() === 'unhide'
            ? 'Unhide'
            : 'Hide',
        ),
        description: statusBackend.rawQuestionEmbed?.hideEmbed?.description?.replace(
          'Hide',
          configFilters?.type?.toLowerCase()?.trim() === 'unhide'
            ? 'Unhide'
            : 'Hide',
        ),
      })

      if (
        !__tempCaptureParent ||
        (typeof __tempCaptureParent === 'string' &&
          __tempCaptureParent?.toLowerCase()?.trim() === 'end')
      )
        return undefined
      else if (__tempCaptureParent?.toLowerCase()?.trim() === 'all')
        __tempLogs = {
          column:
            statusBackend.rawQuestionEmbed?.hideEmbed?.optionsListforBackend,
          value: Array(
            statusBackend.rawQuestionEmbed?.hideEmbed?.optionsListforBackend
              ?.length,
          ).fill(
            configFilters?.type?.toLowerCase()?.trim() === 'unhide'
              ? 'false'
              : 'true',
          ),
        }
      else
        __tempLogs = {
          column: __tempCaptureParent,
          value:
            configFilters?.type?.toLowerCase()?.trim() === 'unhide'
              ? 'false'
              : 'true',
        }
      return await this.__databaseDelivery(rawMessage, {
        ...__tempLogs,
        selection: 'edit',
        slotSelection: configFilters?.slotSelection,
        guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
      })
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __maintenanceModesConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'status',
          subCategory: 'server',
        })) ?? []
      if (
        !(
          databaseCredentials &&
          Array.isArray(databaseCredentials) &&
          databaseCredentials?.length > 0
        )
      )
        return undefined
      else if (
        !(
          (configFilters?.slotSelection &&
            !isNaN(Number(configFilters.slotSelection)) &&
            parseInt(configFilters.slotSelection) > 0 &&
            parseInt(configFilters.slotSelection) <=
              statusBackend.cachedOptions.maxSlots &&
            statusBackend.getParseSlot({
              rawArray: databaseCredentials,
              slotId: `${configFilters.slotSelection}`,
            })) ||
          (configFilters?.slotSelection &&
            typeof configFilters?.slotSelection === 'string' &&
            configFilters?.slotSelection?.toLowerCase()?.trim() === 'all')
        )
      )
        return undefined
      let __tempLogs = {
        column: 'maintenance',
        value:
          configFilters?.type?.toLowerCase()?.trim() === 'on'
            ? 'true'
            : 'false',
      }

      return await this.__databaseDelivery(rawMessage, {
        ...__tempLogs,
        selection: 'edit',
        slotSelection: configFilters?.slotSelection,
        guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
      })
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __deleteConfig(rawMessage, configFilters) {
    try {
      if (!(rawMessage && rawMessage instanceof Message)) return undefined
      let databaseCredentials =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId: rawMessage?.guild?.id,
          fetchCache: true,
          category: 'status',
          subCategory: 'server',
        })) ?? []
      if (
        !(
          databaseCredentials &&
          Array.isArray(databaseCredentials) &&
          databaseCredentials?.length > 0
        )
      )
        return undefined
      else if (
        !(
          (configFilters?.slotSelection &&
            !isNaN(Number(configFilters.slotSelection)) &&
            parseInt(configFilters.slotSelection) > 0 &&
            parseInt(configFilters.slotSelection) <=
              statusBackend.cachedOptions.maxSlots &&
            statusBackend.getParseSlot({
              rawArray: databaseCredentials,
              slotId: `${configFilters.slotSelection}`,
            })) ||
          (configFilters?.slotSelection &&
            typeof configFilters?.slotSelection === 'string' &&
            configFilters?.slotSelection?.toLowerCase()?.trim() === 'all')
        )
      )
        return undefined
      else
        return await this.__databaseDelivery(rawMessage, {
          selection: 'delete',
          slotSelection: configFilters?.slotSelection,
          guildId: rawMessage?.guild?.id ?? rawMessage?.guildId,
        })
    } catch {
      return await this.__destroyHandler('error')
    }
  }
  async __fetchInteractionOption(rawMessage, rawQuestionEmbed) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      {
        ...rawQuestionEmbed,
        components: {
          ...rawQuestionEmbed?.components,
        },
        caches: { cachedMessage: rawMessage },
      },
      undefined,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['interaction'],
        readAuthorId: rawMessage?.author?.id,
        returnType: 'string',
      },
    )
    if (!__tempResponse) return undefined
    else return __tempResponse
  }
  async __fetchGameName(rawMessage, filter) {
    try {
      let __rawData = await gameServerStatusResources.__parseBody()
      __rawData = __rawData?.map((cache, index) => {
        return `\`${index + 1}) ${cache?.gameName}\``
      })
      let bookFramework = new bookFrameworkEngine(__rawData, {
        bookType: __rawData?.length > 1 ? 'multiple30' : 'single',
        rawChannel: this.threadChannel,
        authorMessage: rawMessage,
      })
      await bookFramework.start()
      let response = await this.__fetchString(rawMessage, filter, {
          ...statusBackend.rawQuestionEmbed?.gameNameEmbed,
        }),
        tempGameId
      if (response && isNaN(Number(response)))
        tempGameId = gameServerStatusResources.cache.parsedGamesList?.find(
          (game) =>
            game?.gameName
              ?.toLowerCase()
              ?.trim()
              ?.includes(response?.toLowerCase()?.trim()),
        )?.gameId
      else if (response && !isNaN(Number(response)))
        tempGameId =
          gameServerStatusResources.cache.parsedGamesList?.[
            parseInt(response?.trim()) - 1
          ]?.gameId
      if (tempGameId && Array.isArray(tempGameId) && tempGameId?.length > 0)
        return tempGameId?.[0]
      else return tempGameId
    } catch {
      return undefined
    }
  }
  async __fetchChannelId(
    rawMessage,
    filter,
    rawQuestionEmbed,
    ifresolve = false,
  ) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    const cacheChannels = await rawMessage?.guild?.channels?.fetch()
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      {
        ...rawQuestionEmbed,
        components: {
          ...rawQuestionEmbed?.components,
          options: cacheChannels
            ?.map((channel) => {
              if (
                ![
                  'GUILD_VOICE',
                  'GROUP_DM',
                  'DM',
                  'GUILD_CATEGORY',
                  'GUILD_STORE',
                  'GUILD_NEWS_THREAD',
                  'GUILD_PUBLIC_THREAD',
                  'GUILD_PRIVATE_THREAD',
                  'GUILD_STAGE_VOICE',
                  'UNKNOWN',
                ].includes(channel?.type)
              )
                return {
                  label: channel?.name,
                  description:
                    'Channel Name : ' +
                    channel?.name +
                    ' For Game Server Status Setup/Feature',
                  emoji: '<a:yes:817492826148700211>',
                  value: channel?.id,
                }
            })
            ?.filter(Boolean),
        },
        caches: { cachedMessage: rawMessage },
      },
      filter,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['interaction', 'string', 'mentions'],
        readAuthorId: rawMessage?.author?.id,
        returnType: 'channel',
      },
    )
    if (!__tempResponse) return await this.__destroyHandler('crashend')
    else if (__tempResponse instanceof BaseChannel) return __tempResponse?.id
    else if (__tempResponse?.mentions?.channels)
      return ifresolve
        ? __tempResponse?.mentions?.channels?.first()
        : __tempResponse?.mentions?.channels?.first()?.id
    else if (
      !rawQuestionEmbed?.skipHalt &&
      ((typeof __tempResponse?.content === 'string' &&
        __tempResponse?.content?.toLowerCase()?.trim() === 'end') ||
        (typeof __tempResponse === 'string' &&
          __tempResponse?.toLowerCase()?.trim() === 'end'))
    )
      return await this.__destroyHandler('halt')
    else if (__tempResponse?.content)
      return ifresolve
        ? this.threadChannel.guild.channels.resolve(__tempResponse?.content) ??
            undefined
        : this.threadChannel.guild.channels.resolve(__tempResponse?.content)?.id
    else return await this.__destroyHandler('crashend')
  }
  async __fetchString(rawMessage, filter, rawQuestionEmbed) {
    let __tempThreadChannel = !this.__threadEnv
      ? await this.#__questionProcessCreator(rawMessage)
      : this.threadChannel
    if (!__tempThreadChannel)
      throw new Error('Internal Thread Issue with DiscordAPI')
    let __tempResponse = await this.__threadEnv.__fetchArmontaryResponse(
      rawQuestionEmbed,
      filter,
      {
        time: rawQuestionEmbed?.maxTime ?? rawQuestionEmbed?.time,
        fetchType: ['string'],
      },
    )
    if (!__tempResponse) return await this.__destroyHandler('crashend')
    else if (
      !rawQuestionEmbed?.skipHalt &&
      ((typeof __tempResponse?.content === 'string' &&
        __tempResponse?.content?.toLowerCase()?.trim() === 'end') ||
        (typeof __tempResponse === 'string' &&
          __tempResponse?.toLowerCase()?.trim() === 'end'))
    )
      return await this.__destroyHandler('halt')
    else if (
      typeof __tempResponse?.content === 'string' &&
      ['default', 'null'].includes(
        __tempResponse?.content?.toLowerCase()?.trim(),
      )
    )
      return rawQuestionEmbed?.captureDefault ?? undefined
    else if (
      typeof __tempResponse?.content === 'string' &&
      __tempResponse?.content?.trim() !== ''
    )
      return __tempResponse?.content
    else return await this.__destroyHandler('crashend')
  }
  async __databaseDelivery(rawMessage, rawSavedData) {
    if (!rawMessage?.channel || !rawSavedData) return undefined
    let __tempRawArgs, __tempCachedData
    if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('setup')
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          fetchCache: true,
        })) ?? []
      __tempRawArgs = databaseManager.__customParser({
        structures: {
          ...rawSavedData,
          slotId: rawSavedData?.slotId?.trim(),
          channelId: rawSavedData?.channelId?.trim(),
          name: rawSavedData?.name?.trim()?.replace(/[&,+$~%'"*?{}]/g, ''),
          host: rawSavedData?.host?.trim()?.replace(/[&,+$~%'"*?{}]/g, ''),
          thumbnail: rawSavedData?.thumbnail
            ?.trim()
            ?.replace(/[&,+$~%'"*?{}]/g, ''),
          banner: rawSavedData?.banner?.trim()?.replace(/[&,+$~%'"*?{}]/g, ''),
          description: rawSavedData?.description
            ?.trim()
            ?.replace(/[&,+$~%'"*?{}]/g, ''),
          color: rawSavedData?.color?.trim()?.replace(/[&,+$~%'"*?{}]/g, ''),
          gameName: rawSavedData?.gameName?.trim(),
          maintenance: 'false',
          maintenanceDescription: rawSavedData?.maintenanceDescription
            ?.trim()
            ?.replace(/[&,+$~%'"*?{}]/g, ''),
        },
        tableName: 'universalGuildSettings',
        categoryName: 'status',
      })
      if (!__tempRawArgs) return undefined
      await databaseManager.__query(
        `INSERT INTO universalGuildSettings VALUES(${await databaseManager.__getuId(
          'universalGuildSettings',
        )},"status","server","${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }","${__tempRawArgs}")`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      return await this.__destroyHandler('end')
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('edit') &&
      rawSavedData?.slotSelection?.toLowerCase()?.trim()?.includes('all')
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId:
            rawMessage?.guild?.id ??
            rawSavedData?.guildId ??
            this.threadChannel?.guild?.id,
          category: 'status',
          fetchCache: true,
          subCategory: 'server',
        })) ?? []
      if (__tempCachedData?.find((r) => !r.rawArgs)) return undefined
      __tempCachedData = statusBackend.getParseSlot(undefined, undefined, {
        rawArray: __tempCachedData,
        slotId: 'all',
        column: rawSavedData.column,
        value: rawSavedData.value?.replace(/[&,+$~%'"*?{}]/g, ''),
      })

      await databaseManager.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "status" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      await databaseManager.__query(
        `INSERT universalGuildSettings VALUES${__tempCachedData
          ?.map(
            (data) =>
              `(${data?.uId},"status","server","${
                data?.guildId ??
                rawMessage?.guild?.id ??
                rawSavedData?.guildId ??
                this.threadChannel?.guild?.id
              }","${databaseManager.__customParser({
                structures: data?.rawArgs,
                tableName: 'universalGuildSettings',
                categoryName: 'status',
              })}")`,
          )
          ?.join(',')};`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      return await this.__destroyHandler('end')
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('edit') &&
      !isNaN(Number(rawSavedData?.slotSelection?.trim()))
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId:
            rawMessage?.guild?.id ??
            rawSavedData?.guildId ??
            this.threadChannel?.guild?.id,
          category: 'status',
          fetchCache: true,
          subCategory: 'server',
        })) ?? []

      if (!rawSavedData?.column) return undefined
      __tempCachedData = statusBackend.getParseSlot(undefined, undefined, {
        rawArray: __tempCachedData,
        slotId: rawSavedData?.slotSelection?.trim(),
        column: rawSavedData.column,
        value: rawSavedData.value?.replace(/[&,+$~%'"*?{}]/g, ''),
      })?.[0]
      await databaseManager.__query(
        `UPDATE universalGuildSettings SET rawArgs = "${databaseManager.__customParser(
          {
            structures: __tempCachedData?.rawArgs,
            tableName: 'universalGuildSettings',
            categoryName: 'status',
          },
        )}" WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "status" AND subCategory = "server" AND uId = "${
          __tempCachedData?.uId
        }"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
      return await this.__destroyHandler('end')
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('delete') &&
      rawSavedData?.slotSelection?.toLowerCase()?.trim()?.includes('all')
    ) {
      return await databaseManager.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "status" AND subCategory = "server"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
    } else if (
      rawSavedData?.selection &&
      rawSavedData?.selection?.toLowerCase()?.trim()?.includes('delete') &&
      !isNaN(Number(rawSavedData?.slotSelection?.trim()))
    ) {
      __tempCachedData =
        (await databaseManager.fetch('universalGuildSettings', {
          guildId:
            rawMessage?.guild?.id ??
            rawSavedData?.guildId ??
            this.threadChannel?.guild?.id,
          category: 'status',
          fetchCache: true,
          subCategory: 'server',
        })) ?? []
      __tempCachedData = statusBackend.getParseSlot({
        rawArray: __tempCachedData,
        slotId: rawSavedData?.slotSelection?.trim(),
      })
      if (!__tempCachedData?.rawArgs) return undefined
      return await databaseManager.__query(
        `DELETE FROM universalGuildSettings WHERE guildId = "${
          rawMessage?.guild?.id ??
          rawSavedData?.guildId ??
          this.threadChannel?.guild?.id
        }" AND category = "status" AND subCategory = "server" AND uId = "${
          __tempCachedData?.uId
        }"`,
        undefined,
        false,
        undefined,
        'universalGuildSettings',
      )
    } else return undefined
  }
  async __destroyHandler(errorType = 'error') {
    if (!this.threadChannel || !this.__threadEnv || this.__threadEnv?.destroyed)
      return true
    if (errorType?.toLowerCase()?.trim() === 'halt') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          statusBackend.rawQuestionEmbed?.haltEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Halted!',
      )
      throw new Error('Question Process has been Halted!')
    } else if (errorType?.toLowerCase()?.trim() === 'crash') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          statusBackend.rawQuestionEmbed?.crashEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Crashed un-Expectedly!',
      )
      throw new Error('Question Process has been Crashed Expectedly!')
    } else if (errorType?.toLowerCase()?.trim() === 'crashend') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          statusBackend.rawQuestionEmbed?.crashEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Completed!',
      )
      throw new Error('Question Process has been Completed!')
    } else if (errorType?.toLowerCase()?.trim() === 'end') {
      await this.threadChannel.send(
        this.#__customUtils(
          undefined,
          statusBackend.rawQuestionEmbed?.endEmbed,
        ),
      )
      await this.__threadEnv.destroy(
        10 * 1000,
        'Question Process has been Completed!',
      )
      return true
    } else return true
  }
  static getParseSlot(
    parseforRequestedSlotId,
    getRemaingingSlotId,
    editSlotWise,
  ) {
    if (
      parseforRequestedSlotId?.rawArray &&
      Array.isArray(parseforRequestedSlotId?.rawArray) &&
      parseforRequestedSlotId?.rawArray?.length > 0 &&
      parseforRequestedSlotId?.slotId &&
      !isNaN(Number(parseforRequestedSlotId?.slotId?.trim()))
    ) {
      let collectionArray = parseforRequestedSlotId?.rawArray?.map((data) => {
        data.rawArgs =
          databaseManager.__customParser(undefined, {
            rawArgs: data?.rawArgs,
            tableName: 'universalGuildSettings',
            categoryName: 'status',
          }) ?? data?.rawArgs
        return data
      })
      return (
        collectionArray?.find(
          (data) =>
            `${data?.rawArgs?.['slotId']}`.trim() ===
            `${parseforRequestedSlotId?.slotId}`.trim(),
        ) ?? undefined
      )
    } else if (
      getRemaingingSlotId?.rawArray &&
      Array.isArray(getRemaingingSlotId?.rawArray) &&
      getRemaingingSlotId?.rawArray?.length > 0
    ) {
      let collectionArray = getRemaingingSlotId?.rawArray?.map((data) => {
          data.rawArgs =
            databaseManager.__customParser(undefined, {
              rawArgs: data?.rawArgs,
              tableName: 'universalGuildSettings',
              categoryName: 'status',
            }) ?? data?.rawArgs
          return data
        }),
        requestedSlots = []

      if (collectionArray?.length >= statusBackend.cachedOptions?.maxSlots)
        return undefined
      let tempSlotIds = collectionArray?.map((data) =>
        data?.rawArgs?.slotId?.trim(),
      )
      for (
        let garbageCounting = 1;
        garbageCounting <= statusBackend.cachedOptions.maxSlots &&
        requestedSlots?.length < 10;
        ++garbageCounting
      ) {
        if (!tempSlotIds?.includes(`${garbageCounting}`))
          requestedSlots.push(`${garbageCounting}`)
      }
      if (!requestedSlots?.[0]) return undefined
      else if (
        getRemaingingSlotId?.returnType?.toLowerCase()?.trim() === 'array'
      )
        return requestedSlots
      else if (
        !getRemaingingSlotId?.returnType ||
        getRemaingingSlotId?.returnType?.toLowerCase()?.trim() === 'single'
      )
        return requestedSlots?.[0]
      else return undefined
    } else if (
      editSlotWise?.rawArray &&
      Array.isArray(editSlotWise?.rawArray) &&
      editSlotWise?.rawArray?.length > 0 &&
      editSlotWise?.column &&
      editSlotWise?.value &&
      editSlotWise?.slotId
    ) {
      let collectionArray = editSlotWise?.rawArray?.map((data) => {
          data.rawArgs =
            databaseManager.__customParser(undefined, {
              rawArgs: data?.rawArgs,
              tableName: 'universalGuildSettings',
              categoryName: 'status',
            }) ?? data?.rawArgs
          return data
        }),
        garbageObject = {}
      if (
        !editSlotWise?.slotId ||
        (editSlotWise?.slotId &&
          typeof editSlotWise?.slotId === 'string' &&
          editSlotWise?.slotId?.toLowerCase()?.trim() === 'all')
      )
        return collectionArray
          ?.map((data) => {
            if (!editSlotWise?.column || !data.rawArgs) return data
            else if (typeof editSlotWise?.column === 'string')
              data.rawArgs[editSlotWise.column] = editSlotWise?.value ?? 'Null'
            else if (
              Array.isArray(editSlotWise?.column) &&
              editSlotWise?.column?.length > 0
            )
              editSlotWise?.column?.map((key, index) => {
                data.rawArgs[key] = editSlotWise?.value[index]
              })
            return data
          })
          ?.filter(Boolean)
      else if (!isNaN(Number(editSlotWise?.slotId?.trim())))
        return (
          collectionArray
            ?.map((data) => {
              if (
                data?.rawArgs?.['slotId']?.trim() ===
                  editSlotWise?.slotId?.trim() &&
                typeof editSlotWise.column === 'string'
              )
                data.rawArgs[editSlotWise.column] =
                  editSlotWise?.value ?? 'Null'
              else if (
                data?.rawArgs?.['slotId']?.trim() ===
                  editSlotWise?.slotId?.trim() &&
                Array.isArray(editSlotWise?.column) &&
                editSlotWise?.column?.length > 0
              )
                editSlotWise?.column?.map((key, index) => {
                  data.rawArgs[key] = editSlotWise?.value[index]
                })
              else return undefined
              return data
            })
            ?.filter(Boolean) ?? undefined
        )
      else return undefined
    } else return undefined
  }
  #__customUtils(parseColumnResponse, customSendQueryParser) {
    if (
      parseColumnResponse?.value &&
      typeof parseColumnResponse?.value === 'string'
    ) {
      if (
        parseColumnResponse?.ignoreValues &&
        Array.isArray(parseColumnResponse?.ignoreValues) &&
        parseColumnResponse?.ignoreValues?.length > 0 &&
        parseColumnResponse?.ignoreValues.includes(
          parseColumnResponse?.value?.toLowerCase()?.trim(),
        )
      )
        return parseColumnResponse?.value
      else if (
        parseColumnResponse?.value?.toLowerCase()?.trim().startsWith('embed')
      )
        return (
          `embed` +
          parseColumnResponse?.value[5]?.toUpperCase() +
          parseColumnResponse?.value
            .substring(6, parseColumnResponse?.value?.length)
            ?.toLowerCase()
        )
      else
        return (
          `embed` +
          parseColumnResponse?.value[0]?.toUpperCase() +
          parseColumnResponse?.value
            .substring(1, parseColumnResponse?.value?.length)
            ?.toLowerCase()
        )
    } else if (customSendQueryParser) {
      let cookedEmbed = new EmbedBuilder()
        .setTitle(customSendQueryParser?.embedTitle ?? '')
        .setDescription(customSendQueryParser?.embedDescription ?? '')
        .setTimestamp()
        .setColor(customSendQueryParser?.embedColor ?? 'RANDOM')
      if (customSendQueryParser?.embedImage)
        cookedEmbed.setImage(customSendQueryParser?.embedImage)
      if (customSendQueryParser?.embedThumbnail)
        cookedEmbed.setThumbnail(customSendQueryParser?.embedThumbnail)
      return { embeds: [cookedEmbed] }
    } else return undefined
  }
  async #__questionProcessCreator(rawMessage) {
    if (!rawMessage) return undefined
    this.__threadEnv = new questionEnv()
    this.threadChannel = await this.__threadEnv.__create({
      rawMessage: rawMessage,
      options: {
        name: '🍁 Game Server Status Auditor 🍁',
        reason: '🍁 Auditor Process for Game Server Status for Server 🍁',
        messageId: rawMessage?.id,
      },
    })
    return this.threadChannel
  }
}

module.exports = statusBackend
