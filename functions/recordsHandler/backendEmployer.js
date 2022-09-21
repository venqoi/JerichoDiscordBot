const databaseManager = require("../coreHandler/externalHandler/databaseCore");

class backendEmployer {
  async __setupConfig(rawMessage, rawSavedData) {
    if (!rawSavedData || !rawMessage) return undefined;
    let databaseCache =
      (await databaseManager.fetch("universalGuildSettings", {
        guildId: rawMessage?.guild?.id,
        fetchCache: true,
        category: "records",
        subCategory: "server",
        returnIndex: 0,
      })) ?? undefined;
    if (databaseCache) return undefined;
    let __tempRawArgs, __tempCachedData;
    __tempCachedData =
      (await databaseManager.fetch("universalGuildSettings", {
        fetchCache: true,
      })) ?? [];
    __tempRawArgs = databaseManager.__customParser({
      structures: {
        channelId: rawSavedData?.channelId,
      },
      tableName: "universalGuildSettings",
      categoryName: "records",
    });
    if (!__tempRawArgs) return undefined;
    await databaseManager.__query(
      `INSERT INTO universalGuildSettings VALUES(${await databaseManager.__getuId(
        "universalGuildSettings"
      )},"records","server","${
        rawMessage?.guild?.id ?? rawMessage?.guildId
      }","${__tempRawArgs}")`,
      undefined,
      false,
      undefined,
      "universalGuildSettings"
    );
    return true;
  }
  
  async __editConfig(rawMessage, rawSavedData) {
    if (!rawSavedData || !rawMessage) return undefined;
    let databaseCache =
      (await databaseManager.fetch("universalGuildSettings", {
        guildId: rawMessage?.guild?.id,
        fetchCache: true,
        category: "records",
        subCategory: "server",
        returnIndex: 0,
      })) ?? undefined;
    if (!databaseCache) return undefined;
    let __tempRawArgs =
      databaseManager.__customParser(undefined, {
        rawArgs: databaseCache?.rawArgs,
        tableName: "universalGuildSettings",
        categoryName: "records",
      }) ?? databaseCache?.rawArgs;
    __tempRawArgs["channelId"] = rawSavedData?.channelId;
    await databaseManager.__query(
      `UPDATE universalGuildSettings SET rawArgs = "${databaseManager.__customParser(
        {
          structures: __tempRawArgs,
          tableName: "universalGuildSettings",
          categoryName: "records",
        }
      )}" WHERE guildId = "${
        rawMessage?.guild?.id ?? rawSavedData?.guildId
      }" AND category = "records" AND subCategory = "server"`,
      undefined,
      false,
      undefined,
      "universalGuildSettings"
    );
    return true;
  }

  async __deleteConfig(rawMessage) {
    if (!rawMessage) return undefined;
    let databaseCache =
      (await databaseManager.fetch("universalGuildSettings", {
        guildId: rawMessage?.guild?.id,
        fetchCache: true,
        category: "records",
        subCategory: "server",
        returnIndex: 0,
      })) ?? undefined;
    if (!databaseCache) return undefined;
    return await databaseManager.__query(
      `DELETE FROM universalGuildSettings WHERE guildId = "${
        rawMessage?.guild?.id ?? rawSavedData?.guildId
      }" AND category = "records" AND subCategory = "server"`,
      undefined,
      false,
      undefined,
      "universalGuildSettings"
    );
  }
}

module.exports = backendEmployer;
