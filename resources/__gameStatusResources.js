const { __rawFetchBody, __fileFunctions } = require("../Utilities/__miscUtils");
class __gameServerStatusResources {
  static cache = { parsedGamesList: [], keys: { basicModel: undefined } };
  static __gameListTextUrl =
    "https://raw.githubusercontent.com/gamedig/node-gamedig/master/games.txt";
  static defaultCredentials = {
    defaultFileCachePath: { path: "__rawGamesList.txt", encodingType: "utf8" },
    basicModel: {
      gameId: true,
      gameName: true,
      protocol: true,
      port: true,
      queryPort: true,
      portOffset: true,
      raw: true,
    },
    defaultProtocolsRawString: [
      "protocol-ase|Protocol Ase|protocol-ase",
      "protocol-battlefield|Protocol Battlefield|protocol-battlefield",
      "protocol-doom3|Protocol Doom3|protocol-doom3",
      "protocol-gamespy1|Protocol GameSpy1|protocol-gamespy1",
      "protocol-gamespy2|Protocol GameSpy2|protocol-gamespy2",
      "protocol-gamespy3|Protocol GameSpy3|protocol-gamespy3",
      "protocol-nadeo|Protocol Nadeo|protocol-nadeo",
      "protocol-nadeo2|Protocol Nadeo2|protocol-nadeo2",
      "protocol-nadeo3|Protocol Nadeo3|protocol-nadeo3",
      "protocol-unreal2|Protocol Unreal2|protocol-unreal2",
      "protocol-valve|Protocol Value|protocol-valve",
    ],
  };
  static get cachedfileText() {
    return __fileFunctions("read", undefined, {
      filePath:
        __gameServerStatusResources.defaultCredentials?.defaultFileCachePath
          ?.path,
      encodingType:
        __gameServerStatusResources.defaultCredentials?.defaultFileCachePath
          ?.encodingType,
    });
  }
  static set cachedfileText(rawData) {
    return __fileFunctions("write", rawData, {
      filePath:
        __gameServerStatusResources.defaultCredentials?.defaultFileCachePath
          ?.path,
      encodingType:
        __gameServerStatusResources.defaultCredentials?.defaultFileCachePath
          ?.encodingType,
    });
  }
  static async __parseBody() {
    if (
      __gameServerStatusResources?.cache?.parsedGamesList &&
      Array.isArray(__gameServerStatusResources?.cache?.parsedGamesList) &&
      __gameServerStatusResources?.cache?.parsedGamesList?.length > 0
    )
      return __gameServerStatusResources?.cache?.parsedGamesList;
    let __rawBody =
      __gameServerStatusResources.cachedfileText ??
      (await __rawFetchBody(__gameServerStatusResources.__gameListTextUrl, {
        returnObject: "data",
      }));
    if (!__gameServerStatusResources.cachedfileText)
      __gameServerStatusResources.cachedfileText = __rawBody;
    let __rawPhaseOne =
        __rawBody && __rawBody?.includes("\r")
          ? __rawBody
              ?.split("\r\n")
              ?.filter(
                (raw) =>
                  raw &&
                  typeof raw === "string" &&
                  raw?.toLowerCase()?.trim() !== ""
              )
          : __rawBody
              ?.split("\n")
              ?.filter(
                (raw) =>
                  raw &&
                  typeof raw === "string" &&
                  raw?.toLowerCase()?.trim() !== ""
              ),
      __rawPhaseTwo = [];
    if (__rawPhaseOne?.[0]?.trim()?.startsWith("#")) __rawPhaseOne.shift();
    __rawPhaseOne = __rawPhaseOne.concat(
      __gameServerStatusResources.defaultCredentials?.defaultProtocolsRawString
    );
    __rawPhaseTwo = __rawPhaseOne
      .map((rawValue) => {
        return __gameServerStatusResources.#__customParser({
          rawString: rawValue,
          basicModel:
            __gameServerStatusResources.defaultCredentials?.basicModel,
        });
      })
      .filter(Boolean);
    __gameServerStatusResources.cache.parsedGamesList = __rawPhaseTwo ?? [];
    return __rawPhaseTwo;
  }
  static get(gameAliases, checkType = "all", returnType = "all") {
    if (!gameAliases) return undefined;
    return __gameServerStatusResources.quickCheck({
      rawString: gameAliases,
      checkType: checkType,
      returnType: returnType,
    });
  }
  static getClose(gameAliases, closeType = "close", returnType = "all") {
    if (!gameAliases) return undefined;
    return __gameServerStatusResources.quickCheck({
      rawString: gameAliases,
      checkType: closeType,
      returnType: returnType,
    });
  }
  static quickCheck(rawGameAliases) {
    if (
      !(
        rawGameAliases?.rawString &&
        typeof rawGameAliases?.rawString === "string"
      ) ||
      !(
        __gameServerStatusResources?.cache?.parsedGamesList &&
        __gameServerStatusResources?.cache?.parsedGamesList?.length > 0
      ) ||
      !rawGameAliases?.checkType ||
      !rawGameAliases?.returnType
    )
      return undefined;
    let __tempParsedData = __gameServerStatusResources?.cache?.parsedGamesList,
      __garbageCache = [],
      __tempCookedData = __tempParsedData?.find((parseData) => {
        if (
          rawGameAliases?.checkType &&
          typeof rawGameAliases?.checkType === "string" &&
          rawGameAliases?.rawString &&
          ["all", "name"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          parseData?.gameName &&
          parseData?.gameName?.toLowerCase()?.trim() ===
            rawGameAliases?.rawString?.toLowerCase()?.trim()
        )
          return rawGameAliases?.returnType &&
            rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
            ? rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
              ? parseData?.gameId && Array.isArray(parseData?.gameId)
                ? parseData?.gameId[0]
                : parseData?.gameId
              : parseData?.gameName
            : parseData;
        else if (
          rawGameAliases?.checkType &&
          typeof rawGameAliases?.checkType === "string" &&
          rawGameAliases?.rawString &&
          ["all", "id"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          ((parseData?.gameId &&
            typeof parseData?.gameId === "string" &&
            parseData?.gameId?.toLowerCase()?.trim() ===
              rawGameAliases?.rawString?.toLowerCase()?.trim()) ||
            (parseData?.gameId &&
              Array.isArray(parseData?.gameId) &&
              parseData?.gameId?.includes(
                rawGameAliases?.rawString?.toLowerCase()?.trim()
              )))
        )
          return rawGameAliases?.returnType &&
            rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
            ? rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
              ? parseData?.gameId && Array.isArray(parseData?.gameId)
                ? parseData?.gameId[0]
                : parseData?.gameId
              : parseData?.gameName
            : parseData;
        else if (
          rawGameAliases?.checkType &&
          rawGameAliases?.rawString &&
          ["closeid"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          ((parseData?.gameId &&
            typeof parseData?.gameId === "string" &&
            parseData?.gameId?.toLowerCase()?.trim() ===
              rawGameAliases?.rawString?.toLowerCase()?.trim()) ||
            (parseData?.gameId &&
              Array.isArray(parseData?.gameId) &&
              parseData?.gameId?.find(
                (id) =>
                  id &&
                  id
                    ?.toLowerCase()
                    ?.trim()
                    ?.includes(rawGameAliases?.rawString?.toLowerCase()?.trim())
              )))
        )
          __garbageCache.push(
            rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
              ? rawGameAliases?.returnType &&
                rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
                ? parseData?.gameId && Array.isArray(parseData?.gameId)
                  ? parseData?.gameId[0]
                  : parseData?.gameId
                : parseData?.gameName
              : parseData
          );
        else if (
          rawGameAliases?.checkType &&
          rawGameAliases?.rawString &&
          ["closename"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          parseData?.gameName &&
          parseData?.gameName
            ?.toLowerCase()
            ?.trim()
            .startsWith(
              rawGameAliases?.rawString?.substring(0, 2)?.toLowerCase()?.trim()
            )
        )
          __garbageCache.push(
            rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
              ? rawGameAliases?.returnType &&
                rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
                ? parseData?.gameId && Array.isArray(parseData?.gameId)
                  ? parseData?.gameId[0]
                  : parseData?.gameId
                : parseData?.gameName
              : parseData
          );
        else if (
          rawGameAliases?.checkType &&
          rawGameAliases?.rawString &&
          ["closestart"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          ((parseData?.gameId &&
            typeof parseData?.gameId === "string" &&
            parseData?.gameId?.substring(0, 2)?.toLowerCase()?.trim() ===
              rawGameAliases?.rawString
                ?.substring(0, 2)
                ?.toLowerCase()
                ?.trim()) ||
            (parseData?.gameId &&
              Array.isArray(parseData?.gameId) &&
              parseData?.gameId?.find(
                (id) =>
                  id &&
                  id
                    ?.substring(0, 2)
                    ?.toLowerCase()
                    ?.trim()
                    ?.includes(
                      rawGameAliases?.rawString
                        ?.substring(0, 2)
                        ?.toLowerCase()
                        ?.trim()
                    )
              )) ||
            (parseData?.gameName &&
              parseData?.gameName
                ?.substring(0, 2)
                ?.toLowerCase()
                ?.trim()
                .startsWith(
                  rawGameAliases?.rawString
                    ?.substring(0, 2)
                    ?.toLowerCase()
                    ?.trim()
                )))
        )
          __garbageCache.push(
            rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
              ? rawGameAliases?.returnType &&
                rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
                ? parseData?.gameId && Array.isArray(parseData?.gameId)
                  ? parseData?.gameId[0]
                  : parseData?.gameId
                : parseData?.gameName
              : parseData
          );
        else if (
          rawGameAliases?.checkType &&
          rawGameAliases?.rawString &&
          ["close"].includes(
            rawGameAliases?.checkType?.toLowerCase()?.trim()
          ) &&
          ((parseData?.gameId &&
            typeof parseData?.gameId === "string" &&
            parseData?.gameId?.toLowerCase()?.trim() ===
              rawGameAliases?.rawString
                ?.substring(0, 2)
                ?.toLowerCase()
                ?.trim()) ||
            (parseData?.gameId &&
              Array.isArray(parseData?.gameId) &&
              parseData?.gameId?.find(
                (id) =>
                  id &&
                  id
                    ?.toLowerCase()
                    ?.trim()
                    ?.includes(
                      rawGameAliases?.rawString
                        ?.substring(0, 2)
                        ?.toLowerCase()
                        ?.trim()
                    )
              )) ||
            (parseData?.gameName &&
              parseData?.gameName
                ?.toLowerCase()
                ?.trim()
                .startsWith(
                  rawGameAliases?.rawString
                    ?.substring(0, 2)
                    ?.toLowerCase()
                    ?.trim()
                )))
        )
          __garbageCache.push(
            rawGameAliases?.returnType &&
              rawGameAliases?.returnType?.toLowerCase()?.trim() !== "all"
              ? rawGameAliases?.returnType &&
                rawGameAliases?.returnType?.toLowerCase()?.trim() === "id"
                ? parseData?.gameId && Array.isArray(parseData?.gameId)
                  ? parseData?.gameId[0]
                  : parseData?.gameId
                : parseData?.gameName
              : parseData
          );

        return undefined;
      });
    return __garbageCache && __garbageCache?.length > 0
      ? __garbageCache
      : __tempCookedData;
  }
  static #__customParser(parseGameTxtStringLine) {
    if (
      parseGameTxtStringLine?.rawString &&
      parseGameTxtStringLine?.basicModel
    ) {
      let __tempArray = parseGameTxtStringLine?.rawString?.trim()?.split("|"),
        __tempObjectKeys =
          __gameServerStatusResources.cache?.keys?.basicModel ??
          Object.keys(parseGameTxtStringLine?.basicModel),
        __cookedStructure = {},
        count = 0,
        __garbageCache;
      __gameServerStatusResources.cache.keys.basicModel ??= __tempObjectKeys;
      __cookedStructure["raw"] = parseGameTxtStringLine?.rawString;
      __tempArray?.filter((raw, indexNumber) => {
        if (indexNumber === 0) count = 0;
        if (
          raw &&
          typeof raw === "string" &&
          [""].includes(raw?.toLowerCase()?.trim())
        )
          return ++count;
        else if (
          raw &&
          typeof raw === "string" &&
          raw.includes(",") &&
          !raw?.includes("=")
        )
          __cookedStructure[__tempObjectKeys[count]] = raw
            ?.split(",")
            ?.filter((rawValue) => rawValue?.trim());
        else if (
          raw &&
          typeof raw === "string" &&
          !raw.includes(",") &&
          !raw?.includes("=")
        )
          __cookedStructure[__tempObjectKeys[count]] = raw?.trim();
        else if (
          raw &&
          typeof raw === "string" &&
          !raw.includes(",") &&
          raw?.includes("=")
        ) {
          __garbageCache = raw?.split("=");
          if (
            __garbageCache[0] &&
            __garbageCache[0]?.toLowerCase()?.trim()?.includes("port") &&
            !isNaN(Number(__garbageCache[1]))
          )
            __cookedStructure[
              __garbageCache[0] &&
              __garbageCache[0]?.toLowerCase()?.trim().includes("port")
                ? __garbageCache[0] &&
                  __garbageCache[0]?.toLowerCase()?.trim().includes("query")
                  ? "queryPort"
                  : "port"
                : "portOffset"
            ] = parseInt(__garbageCache[1]);
          else __cookedStructure[__garbageCache[0]] = __garbageCache[1];
        } else if (
          raw &&
          typeof raw === "string" &&
          raw.includes(",") &&
          raw?.includes("=")
        ) {
          __garbageCache = raw?.split(",");
          if (
            __garbageCache?.[0] &&
            __garbageCache?.find(
              (cache) => cache && cache?.toLowerCase()?.trim().includes("port")
            )
          ) {
            __garbageCache.map((value, index) => {
              __cookedStructure[
                value && value?.toLowerCase()?.trim().includes("port")
                  ? value && value?.toLowerCase()?.trim().includes("query")
                    ? "queryPort"
                    : "port"
                  : "portOffset"
              ] = parseInt(value?.split("=")?.[1]);
            });
          }
        }
        ++count;
      });
      return __cookedStructure;
    } else return undefined;
  }
  static async gameSlotParse(returnType = "array") {
    let caches =
      __gameServerStatusResources?.cache?.parsedGamesList?.length > 0
        ? __gameServerStatusResources?.cache?.parsedGamesList
        : await __gameServerStatusResources.__parseBody();

    switch (returnType?.toLowerCase()?.trim()) {
      case "array":
        return caches;
      case "components":
        return caches?.map((gameCreds) => {
          return {
            label: Array.isArray(gameCreds?.gameName)
              ? gameCreds?.gameName?.[0]
              : gameCreds?.gameName,
            emoji: "<a:XTN90:725107292768305172>",
            description:
              (Array.isArray(gameCreds?.gameName)
                ? gameCreds?.gameName?.[0]
                : gameCreds?.gameName) +
              "'s Default Query Port Number -> " +
              (gameCreds?.queryPort ?? gameCreds?.port),
            value: Array.isArray(gameCreds?.gameId)
              ? gameCreds?.gameId?.[0]
              : gameCreds?.gameId,
          };
        });
      default:
        return caches;
    }
  }
}
__gameServerStatusResources.__parseBody();
module.exports = __gameServerStatusResources;
