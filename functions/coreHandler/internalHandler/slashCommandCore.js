const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { commands } = require("../../../resources/__slashCommandMetadata");
const { CommandInteraction } = require("discord.js");

class slashCommandEngine {
  static async __capture(bot, interaction) {
    if (!(interaction && interaction instanceof CommandInteraction))
      return undefined;
    const command =
      bot.commands.get(interaction?.commandName?.toLowerCase()?.trim()) ??
      bot.commands.find((cmd) =>
        cmd?.aliases?.includes(interaction?.commandName?.toLowerCase()?.trim())
      );
    if (!command) return undefined;
    return await command.slashCommand(bot, interaction, {}, undefined);
  }
  static async __configure(bot) {
    const rest = new REST({ version: "9" }).setToken(process.env.discordToken);
    try {
      console.log("🍅 - Slash Command |  Refreshing Application Commands");
      await rest
        .put(Routes.applicationCommands(bot?.user?.id), {
          body: commands,
        })
        ?.catch((error) =>
          console.log(
            `🍅 - Slash Command Error | ` + error?.message ?? `${error}`
          )
        );
      console.log(
        "🍅 - Slash Command |  Successfullt Refreshed Application Commands"
      );
      return undefined;
    } catch {
      return undefined;
    }
  }
}

module.exports = slashCommandEngine;
