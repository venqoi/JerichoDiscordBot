require("dotenv").config();

const { readdirSync } = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { discordToken } = process.env;
const __interactUtils = require("./Utilities/__interactionUtils");
const __eventsIntervalManager = require("./functions/coreHandler/internalHandler/__eventHolder");

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  /*
  shards: Cluster.data.SHARD_LIST,
	shardCount: Cluster.data.TOTAL_SHARDS
  */
  restWsBridgeTimeout: 10 * 1000,
  restTimeOffset: 10 * 1000,
  restGlobalRateLimit: 45,
  shards: "auto",
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

// Variables

// Rest Work

require("events").EventEmitter.defaultMaxListeners = Infinity;

bot.commands = new Collection();

const cacheCommandFiles = readdirSync("./commands/__mainCommands").filter(
  (file) => file?.endsWith(".js")
);

for (const file of cacheCommandFiles) {
  const command = require(`./commands/__mainCommands/${file}`);
  bot.commands.set(command?.name, command);
}

// Events Manupulation and Methods

bot.on("ready", async () => {
  __eventsIntervalManager.__randomizedActivity(bot);
  await __eventsIntervalManager.__capture(bot);
  console.info(
    `🚧 - Discord Client | I am Ready and I will logged as - ${bot.user.tag}`
  );
});

bot.on(
  "messageCreate",
  async (message) =>
    await __eventsIntervalManager.__messageCapture(bot, message)
);

bot.on(
  "interactionCreate",
  async (rawInteract) => await __interactUtils.__capture(bot, rawInteract)
);

bot.on(
  "guildCreate",
  async (guild) =>
    await __eventsIntervalManager.__guildCapture(bot, guild, "create")
);

bot.on(
  "guildDelete",
  async (guild) =>
    await __eventsIntervalManager.__guildCapture(bot, guild, "delete")
);

/*
bot.on("error", (error) => {
  console.error(`Error Event got triggered by -`, error.message ?? error);
});

 bot.on('debug', (...args) => console.log('Debug -> ', ...args));
 bot.rest.on('rateLimited', (...args) => console.log('RateLimit -> ', ...args))

process.on("warning", (warning) => {
  console.log(`Warning Name - ${warning.name}`);
  console.log(`Warning Message - ${warning.message}`);
  console.log(`Warning Path - ${warning.stack}`);
});

process.on("unhandledRejection", (error) =>
  console.log(`UnhandledRejection Error at - ${error.message ?? error}`)
);
*/

bot.login(discordToken);
