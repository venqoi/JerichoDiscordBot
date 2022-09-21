require("dotenv").config();
const { createConnection, Connection } = require("mysql2/promise");
const { __internalErrorManager } = require("../../../Utilities/__cacheUtils");
const {
  database_Host,
  database_Port,
  database_Password,
  database_DatabaseName,
  database_Username,
} = process.env;

class DatabaseCore {
  static __defaultCredentials = {
    tables: {
      guildSettings: {
        dbName: "universalGuildSettings",
        actualResponseStructure: {
          uId: true,
          category: true,
          subCategory: true,
          guildId: true,
          rawArgs: {
            chatting: { channelId: true, language: true },
            prefix: { prefix: true },
            status: {
              slotId: true,
              channelId: true,
              messageId: true,
              name: true,
              pfp: true,
              host: true,
              description: true,
              color: true,
              thumbnail: true,
              banner: true,
              gameName: true,
              maintenance: true,
              maintenanceDescription: true,
              hideIp: true,
              hidePort: true,
              hideThumbnail: true,
              hideBanner: true,
              hidepfp: true,
              hidePing: true,
              hidePlayersCount: true,
              hidePlayersNames: true,
            },
          },
        },
      },
      intervalSettings: {
        dbName: "universalIntervalSettings",
        actualResponseStructure: {
          uId: true,
          category: true,
          subCategory: true,
          rawArgs: {},
        },
      },
      userSettings: {
        dbName: "universalUserSettings",
        actualResponseStructure: {
          uId: true,
          category: true,
          subCategory: true,
          userId: true,
          rawArgs: {},
        },
      },
    },
    seperator: "<//>",
    __cacheObjectEntries: {},
  };
  /**
   * @type {Connection}
   */
  static connection;
  static status = {
    connectionPing: 9999,
    queryPing: 9999,
    destroyedPoint: false,
  };
  static refreshAllBoolean = false;
  static cache = {};
  static async __connect() {
    if (DatabaseCore.connection) return DatabaseCore.connection;

    let __garbageTime = new Date().getTime();

    DatabaseCore.connection = await createConnection({
      host: database_Host,
      user: database_Username,
      database: database_DatabaseName,
      password: database_Password,
      port: database_Port,
      namedPlaceholders: true,
    }).catch(async () => await DatabaseCore.__destroy(true));
    DatabaseCore.status.destroyedPoint = false;
    if (DatabaseCore.connection) {
      DatabaseCore.status.connectionPing = new Date().getTime() - __garbageTime;
      console.log(`🏺 - Mysql | Maria DB Connection has been Established`);
    }
    return DatabaseCore.connection;
  }
  static async __destroy(resetConnection = false) {
    try {
      if (!DatabaseCore.connection || DatabaseCore.status?.destroyedPoint)
        return undefined;
      DatabaseCore.status.destroyedPoint = true;
      try {
        await DatabaseCore.connection?.end()?.catch(() => undefined);
      } catch {
        console.log(
          `🏺 - Mysql | Maria DB Connection has been Died Out with Closed Operation`
        );
      }
      console.log(`🏺 - Mysql | Maria DB Connection has been Destroyed`);
      DatabaseCore.connection = undefined;
      if (resetConnection) {
        await DatabaseCore.__connect();
        await DatabaseCore.refreshAll();
        return DatabaseCore.connection;
      } else return undefined;
    } catch (error) {
      __internalErrorManager(error, {
        category: "DatabaseCore.__destroy Function",
      });
      return undefined;
    }
  }
  static async __query(
    sql,
    rawValues,
    forceReturn = true,
    defaultValue = [],
    refreshTable
  ) {
    try {
      if (!DatabaseCore.connection) await DatabaseCore.__connect();
      let rawRows,
        rawFeilds,
        __garbageTime = new Date().getTime();
      if (rawValues)
        [rawRows, rawFeilds] = await DatabaseCore.connection.query(
          sql?.replace(/[\u0800-\uFFFF]/g, ""),
          rawValues
        );
      else [rawRows, rawFeilds] = await DatabaseCore.connection.query(sql);
      DatabaseCore.status.queryPing = new Date().getTime() - __garbageTime;
      if (refreshTable && typeof refreshTable === "string")
        await DatabaseCore.refresh(refreshTable, true, true);
      return forceReturn ? rawRows : true;
    } catch (error) {
      await DatabaseCore.__destroy(true);
      __internalErrorManager(error, {
        category: "DatabaseCore.__query Function",
      });
      return forceReturn ? defaultValue : undefined;
    }
  }
  static async refreshAll() {
    try {
      if (!DatabaseCore.connection) await DatabaseCore.__connect();
      var __tempObject = DatabaseCore.#__customObjectsManulpulator(
        DatabaseCore.__defaultCredentials?.tables
      );
      const rawPromisedData = await Promise.all(
        __tempObject?.values?.map(async (tableName) => {
          return await DatabaseCore.refresh(tableName, true, false);
        })
      );
      DatabaseCore.refreshAllBoolean = true;
      return rawPromisedData;
    } catch (error) {
      __internalErrorManager(error, {
        category: "DatabaseCore.refreshAll Function",
      });
      return undefined;
    }
  }
  static async refresh(
    rawtableName,
    cache = true,
    extraCheck = true,
    defaultValue = []
  ) {
    try {
      if (!DatabaseCore.connection) await DatabaseCore.__connect();
      const __tempTableSearch = extraCheck
        ? DatabaseCore.#__customObjectsManulpulator(undefined, undefined, {
            value: rawtableName,
            structure: DatabaseCore.__defaultCredentials?.tables,
            checkType: "all",
            returnType: "value",
          })
        : rawtableName;
      let cookedDBValue = await DatabaseCore.__query(
        `SELECT * FROM ${__tempTableSearch}`,
        undefined,
        true
      );
      if (cache && cookedDBValue) {
        let __tempKeySearch = DatabaseCore.#__customObjectsManulpulator(
          undefined,
          undefined,
          {
            value: __tempTableSearch,
            structure: DatabaseCore.__defaultCredentials?.tables,
            checkType: "all",
            returnType: "key",
          }
        );
        if (!__tempKeySearch) return cookedDBValue ?? defaultValue;
        DatabaseCore.cache[__tempKeySearch] = cookedDBValue;
        return cookedDBValue ?? defaultValue;
      } else return cookedDBValue ?? defaultValue;
    } catch (error) {
      __internalErrorManager(error, {
        category: "DatabaseCore.refresh Function",
      });
      return defaultValue;
    }
  }
  static __customParser(parseArgs, parseSQLRawArgs, filterCaches) {
    if (
      parseArgs?.structures &&
      parseArgs?.tableName &&
      parseArgs?.categoryName
    ) {
      let __tempTableName = DatabaseCore.#__customObjectsManulpulator(
        undefined,
        undefined,
        {
          value: parseArgs?.tableName,
          structure: DatabaseCore.__defaultCredentials?.tables,
          checkType: "all",
          returnType: "key",
        }
      );
      if (!__tempTableName) return undefined;
      let __cookedCache = [],
        __tempObjectEntries =
          DatabaseCore.__defaultCredentials?.__cacheObjectEntries?.[
            __tempTableName?.trim() +
              parseArgs?.categoryName?.trim() +
              "rawArgs"
          ] ??
          Object.keys(
            DatabaseCore.__defaultCredentials?.tables?.[__tempTableName]
              ?.actualResponseStructure?.rawArgs?.[
              parseArgs?.categoryName ?? "default"
            ]
          );
      DatabaseCore.__defaultCredentials.__cacheObjectEntries[
        __tempTableName?.trim() + parseArgs?.categoryName?.trim() + "rawArgs"
      ] ??= __tempObjectEntries;
      if (!__tempObjectEntries) return undefined;
      for (
        let keyCount = 0, len = __tempObjectEntries?.length;
        keyCount < len;
        keyCount++
      ) {
        if (parseArgs?.structures[__tempObjectEntries[keyCount]])
          __cookedCache.push(
            parseArgs?.structures[__tempObjectEntries[keyCount]] ?? "Null"
          );
        else if (
          parseArgs?.rawArgs &&
          parseArgs?.rawArgs[__tempObjectEntries[keyCount]]
        )
          __cookedCache.push(
            parseArgs?.rawArgs[__tempObjectEntries[keyCount]] ?? "Null"
          );
        else if (parseArgs[__tempObjectEntries[keyCount]])
          __cookedCache.push(
            parseArgs[__tempObjectEntries[keyCount]] ?? "Null"
          );
        else __cookedCache.push("Null");
      }
      return __cookedCache?.length > 0
        ? __cookedCache.join(DatabaseCore.__defaultCredentials?.seperator)
        : undefined;
    } else if (
      parseSQLRawArgs?.rawArgs &&
      typeof parseSQLRawArgs?.rawArgs === "string" &&
      parseSQLRawArgs?.tableName &&
      parseSQLRawArgs?.categoryName
    ) {
      let __tempTableName = DatabaseCore.#__customObjectsManulpulator(
        undefined,
        undefined,
        {
          value: parseSQLRawArgs?.tableName,
          structure: DatabaseCore.__defaultCredentials?.tables,
          checkType: "all",
          returnType: "key",
        }
      );
      let __tempArgs = parseSQLRawArgs?.rawArgs?.split(
        parseSQLRawArgs?.seperator?.trim() ??
          DatabaseCore.__defaultCredentials?.seperator?.trim()
      );
      if (!__tempArgs[0]) return undefined;
      let __cookedCache = {},
        __tempObjectEntries =
          DatabaseCore.__defaultCredentials?.__cacheObjectEntries?.[
            __tempTableName?.trim() +
              parseSQLRawArgs?.categoryName?.trim() +
              "rawArgs"
          ] ??
          Object.keys(
            DatabaseCore.__defaultCredentials?.tables?.[__tempTableName]
              ?.actualResponseStructure?.rawArgs?.[
              parseSQLRawArgs?.categoryName ?? "default"
            ]
          );
      DatabaseCore.__defaultCredentials.__cacheObjectEntries[
        __tempTableName?.trim() +
          parseSQLRawArgs?.categoryName?.trim() +
          "rawArgs"
      ] ??= __tempObjectEntries;
      if (!__tempObjectEntries) return undefined;
      for (
        let keyCount = 0, len = __tempObjectEntries.length;
        keyCount < len;
        ++keyCount
      ) {
        __cookedCache[__tempObjectEntries[keyCount]] =
          (__tempArgs[keyCount] &&
          !["null", "undefined", "false"].includes(
            __tempArgs[keyCount]?.toLowerCase()?.trim()
          )
            ? __tempArgs[keyCount]
            : undefined) ?? undefined;
      }
      return __cookedCache !== {} ? __cookedCache : undefined;
    } else if (filterCaches?.tableName) {
      let __tempTableName = DatabaseCore.#__customObjectsManulpulator(
        undefined,
        undefined,
        {
          value: filterCaches?.tableName,
          structure: DatabaseCore.__defaultCredentials?.tables,
          checkType: "all",
          returnType: "key",
        }
      );
      if (!DatabaseCore?.cache?.[__tempTableName]) return undefined;
      let __tempCookedData = this.#__customObjectsManulpulator(
        undefined,
        undefined,
        undefined,
        {
          valueArray: DatabaseCore.cache[__tempTableName],
          filters: filterCaches?.filters,
        }
      );

      return __tempCookedData &&
        (filterCaches?.filters?.returnIndex ||
          filterCaches?.filters?.returnIndex === 0)
        ? __tempCookedData[Number(filterCaches?.filters?.returnIndex)]
        : __tempCookedData;
    } else return undefined;
  }
  static async fetch(tableName, filters) {
    try {
      if (!DatabaseCore.connection) await DatabaseCore.__connect();
      let __tableName = DatabaseCore.#__customObjectsManulpulator(
        undefined,
        undefined,
        {
          value: tableName,
          structure: DatabaseCore.__defaultCredentials?.tables,
          checkType: "all",
          returnType: "key",
        }
      );
      if (!__tableName) return undefined;
      else if (filters?.fetchCache) {
        return DatabaseCore.__customParser(undefined, undefined, {
          tableName:
            DatabaseCore.__defaultCredentials?.tables?.[__tableName]?.dbName,
          filters: filters,
        });
      }
      let __tempRawData,
        __cookedFilters = [];
      if (
        filters?.guildId &&
        DatabaseCore.__defaultCredentials?.tables[__tableName]
          ?.actualResponseStructure?.guildId
      )
        __cookedFilters.push(`guildId = ${filters?.guildId}`);
      if (
        filters?.userId &&
        DatabaseCore.__defaultCredentials?.tables[__tableName]
          ?.actualResponseStructure?.userId
      )
        ___cookedFilters.push(`userId = ${filters?.userId}`);
      if (
        filters?.category &&
        DatabaseCore.__defaultCredentials?.tables[__tableName]
          ?.actualResponseStructure?.category
      )
        __cookedFilters.push(`category = ${filters?.category}`);
      if (
        filters?.subCategory &&
        DatabaseCore.__defaultCredentials?.tables[__tableName]
          ?.actualResponseStructure?.subCategory
      )
        __cookedFilters.push(`subCategory = ${filters?.subCategory}`);
      __tempRawData = await DatabaseCore.__query(
        `SELECT * FROM ${DatabaseCore.__defaultCredentials?.tables?.[__tableName]?.dbName}` +
          (__cookedFilters && __cookedFilters?.length > 0
            ? __cookedFilters.join(" AND ")
            : ""),
        undefined,
        true
      );
      return filters?.returnIndex
        ? __tempRawData[Number(filters?.returnIndex)]
        : __tempRawData;
    } catch (error) {
      __internalErrorManager(error, {
        category: "DatabaseCore.fetch Function",
      });
      return undefined;
    }
  }
  static #__customObjectsManulpulator(
    rawStructure,
    revRequest,
    findQuery,
    databaseParse
  ) {
    if (revRequest?.keys && revRequest?.values) {
      var cookedStructure = {};
      for (let count = 0, len = revRequest?.keys.length; count < len; count++) {
        cookedStructure[revRequest?.keys[count]] = revRequest?.values[count];
      }
      return cookedStructure;
    } else if (
      findQuery?.value &&
      findQuery?.structure &&
      findQuery?.checkType &&
      findQuery?.returnType
    ) {
      let rawObjectEntries = Object.entries(findQuery?.structure);
      for (let count = 0, len = rawObjectEntries.length; count < len; ++count) {
        if (
          rawObjectEntries[count][0]?.toLowerCase()?.trim() ===
            findQuery?.value?.toLowerCase().trim() &&
          ["all", "key"].includes(findQuery?.checkType?.toLowerCase()?.trim())
        )
          return ["key"].includes(findQuery?.returnType?.toLowerCase()?.trim())
            ? rawObjectEntries[count][0]
            : rawObjectEntries[count][1]?.dbName;
        else if (
          rawObjectEntries[count][1]?.dbName?.toLowerCase()?.trim() ===
            findQuery?.value?.toLowerCase().trim() &&
          ["all", "value"].includes(findQuery?.checkType?.toLowerCase()?.trim())
        )
          return ["key"].includes(findQuery?.returnType?.toLowerCase()?.trim())
            ? rawObjectEntries[count][0]
            : rawObjectEntries[count][1]?.dbName;
      }
      return undefined;
    } else if (rawStructure) {
      let rawObjectEntries = Object.entries(rawStructure);
      var cookedValueArray = [];
      var cookedkeyArray = [];
      for (let count = 0, len = rawObjectEntries.length; count < len; ++count) {
        cookedkeyArray.push(rawObjectEntries[count][0]);
        cookedValueArray.push(rawObjectEntries[count][1]?.dbName);
      }
      return { keys: cookedkeyArray, values: cookedValueArray };
    } else if (
      databaseParse?.valueArray &&
      Array.isArray(databaseParse.valueArray) &&
      databaseParse?.valueArray?.length > 0
    ) {
      if (!databaseParse?.filters) return databaseParse?.valueArray;
      let __tempGarbage = databaseParse?.valueArray.filter((indexValue) => {
        if (
          (databaseParse?.filters?.uId &&
            databaseParse?.filters?.uId?.trim() !== indexValue?.uId?.trim()) ||
          (databaseParse?.filters?.guildId &&
            databaseParse?.filters?.guildId?.trim() !==
              indexValue?.guildId?.trim()) ||
          (databaseParse?.filters?.category &&
            databaseParse?.filters?.category?.toLowerCase()?.trim() !==
              indexValue?.category?.toLowerCase()?.trim()) ||
          (databaseParse?.filters?.subCategory &&
            databaseParse?.filters?.subCategory?.toLowerCase()?.trim() !==
              indexValue?.subCategory?.toLowerCase()?.trim())
        )
          return undefined;
        else return indexValue;
      });
      if (!(__tempGarbage && __tempGarbage?.length > 0)) return undefined;
      else __tempGarbage = __tempGarbage.filter(Boolean);
      return __tempGarbage;
    } else return undefined;
  }
  static async __getuId(tableName) {
    if (!(tableName && typeof tableName === "string" && tableName !== ""))
      return undefined;
    tableName = DatabaseCore.#__customObjectsManulpulator(
      undefined,
      undefined,
      {
        value: tableName,
        structure: DatabaseCore.__defaultCredentials?.tables,
        checkType: "all",
        returnType: "key",
      }
    );
    if (!tableName) return undefined;
    let cachedData =
      (await DatabaseCore.fetch(tableName, {
        fetchCache: true,
      })) ?? [];
    if (!(cachedData && Array.isArray(cachedData) && cachedData?.length > 0))
      return 1;

    cachedData = cachedData?.map((data) =>
      !isNaN(Number(data?.uId?.trim())) ? parseInt(data?.uId?.trim()) : 0
    );
    return Math.max(...cachedData) + 1;
  }
  static async __inifinitePingAliveConnection() {
    try {
      if (!DatabaseCore.connection) await DatabaseCore.__connect();
      return await DatabaseCore.__query("select current_timestamp;", undefined);
    } catch (error) {
      __internalErrorManager(error, {
        category: "DatabaseCore.__inifinitePingAliveConnection Function",
      });
      return undefined;
    }
  }
}

module.exports = DatabaseCore;
