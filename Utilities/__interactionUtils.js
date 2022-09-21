const { BaseInteraction } = require("discord.js");
const {
  __statsEmbedGenerator,
} = require("../functions/coreHandler/internalHandler/__internalStats");
const {
  __gameServerStatusEmbedHandler,
} = require("../functions/serverStatusHandler/frontendEmployer");
const {
  __paperButtonsManager,
} = require("../functions/coreHandler/internalHandler/__bookFramework");
const {
  __capture,
} = require("../functions/coreHandler/internalHandler/slashCommandCore");

class interactionUtils {
  static async __capture(bot, rawInteract) {
    if (!(rawInteract && rawInteract instanceof BaseInteraction)) return undefined;
    // Button Department to Short Out with Custom Id Parsers
    if (rawInteract?.isButton()) {
      await __statsEmbedGenerator(bot, rawInteract?.message, rawInteract);
      await __paperButtonsManager(bot, rawInteract);
      return await __gameServerStatusEmbedHandler(
        bot,
        rawInteract?.message,
        rawInteract
      );
    } else if (rawInteract?.isCommand()) {
      return await __capture(bot, rawInteract);
    } else return undefined;
  }
}

module.exports = interactionUtils;
