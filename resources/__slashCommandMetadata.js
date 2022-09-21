class slashCommandsCaches {
  static commands = [
    {
      name: "ping",
      description: "🐐 Network Stats for Jericho's WebSocket and Database",
    },
    {
      name: "prefix",
      description:
        "🥭 Custom Prefix Feature for Jericho for Base Commands Usage for Discord Server",
      options: [
        {
          name: "set",
          type: 3,
          description:
            "🏞️ Setting/Edit New Custom Prefix for the Discord Server",
        },
        {
          name: "get",
          type: 5,
          description: "🏢 Get Custom Prefix for the Discord Server",
        },
        {
          name: "delete",
          type: 5,
          description: "🎠 Deleting Saved Custom Prefix of the Discord Server",
        },
      ],
    },
    {
      name: "donate",
      description:
        "💲 Donate Developer to Support Jericho's Development and Workflow and show love for the Bot",
    },
  ];
}

module.exports = slashCommandsCaches;
