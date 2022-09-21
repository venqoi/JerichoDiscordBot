var moment = require('moment')
const { da } = require('translate-google/languages')
const { __fileFunctions } = require('../../Utilities/__miscUtils')

class __customPlayTimeAddon {
  static __caches = {}
  static fileCachespath = '__cachedTimeData.txt'
  static directoryPath = '../resources/__solidCaches'
  static encodingType = 'utf8'
  constructor(rawArray, uniqueIndentifier) {
    this.uniqueIndentifier = uniqueIndentifier
    this.rawArray =
      rawArray
        ?.map((data) => {
          if (
            data?.name &&
            typeof data?.name === 'string' &&
            !['', 'null', 'undefined'].includes(
              data?.name?.toLowerCase()?.trim(),
            ) &&
            !/\u00A7[0-9A-FK-OR]/gi.test(data?.name?.toLowerCase()?.trim())
          )
            return {
              ...data,
              playTime: 0,
              dateTime: this.getTimeData(data?.name, true),
            }
          else undefined
        })
        ?.filter(Boolean) ?? []
    __customPlayTimeAddon.__caches[this.uniqueIndentifier] = this
  }
  parse(rawArray = []) {
    let caches,
      cachedData = rawArray?.map((data) => {
        if (
          !(
            data?.name &&
            typeof data?.name === 'string' &&
            !['', 'null', 'undefined'].includes(
              data?.name?.toLowerCase()?.trim(),
            ) &&
            !/\u00A7[0-9A-FK-OR]/gi.test(data?.name?.toLowerCase()?.trim())
          )
        )
          return {
            ...data,
            playTime: 0,
            dateTime: 0,
          }
        caches =
          this.rawArray?.find(
            (e) =>
              e?.name?.toLowerCase()?.trim() ===
              data?.name?.toLowerCase()?.trim(),
          ) ?? {}
        caches.dateTime = caches?.dateTime ?? this.getTimeData(data?.name, true)

        caches = {
          ...data,
          name: data?.name,
          playTime: moment(new Date().getTime()).diff(
            moment(parseInt(caches?.dateTime)),
          ),
          dateTime: caches?.dateTime,
        }
        return caches
      })
    this.#__reverseBigData(cachedData?.map((data) => data?.name))
    cachedData = cachedData?.sort((oldObject, newObject) => {
      if (!oldObject?.playTime && !newObject?.playTime) return 0
      else if (
        (oldObject?.playTime || oldObject?.playTime === 0) &&
        oldObject?.playTime - newObject?.playTime < 0
      )
        return 1
      else if (
        (newObject?.playTime || newObject?.playTime === 0) &&
        newObject?.playTime - oldObject?.playTime < 0
      )
        return -1
      else return 0
    })
    this.rawArray = cachedData
    return cachedData
  }
  getTimeData(playerName, forceWrite = false) {
    let cachedData,
      data =
        __fileFunctions('read', undefined, {
          filePath: __customPlayTimeAddon.fileCachespath,
          directoryPath: __customPlayTimeAddon.directoryPath,
          encodingType: __customPlayTimeAddon?.encodingType,
        }) ?? ''
    cachedData = data
      ?.trim()
      ?.split('\n')
      ?.find(
        (d) =>
          d &&
          typeof d === 'string' &&
          d?.trim() !== '' &&
          d?.split('<//>')?.[0]?.trim() ===
            '__customStatusPlayerStats : ' + this.uniqueIndentifier &&
          d?.split('<//>')?.[1]?.trim() === playerName?.trim(),
      )
      ?.split('<//>')?.[2]
    if (!cachedData || forceWrite) {
      __fileFunctions(
        'write',
        this.#__parseBigData(data?.trim()?.split('\n'), playerName) + '\n',
        {
          filePath: __customPlayTimeAddon.fileCachespath,
          directoryPath: __customPlayTimeAddon.directoryPath,
          encodingType: __customPlayTimeAddon?.encodingType,
        },
      )
      data =
        __fileFunctions('read', undefined, {
          filePath: __customPlayTimeAddon.fileCachespath,
          directoryPath: __customPlayTimeAddon.directoryPath,
          encodingType: __customPlayTimeAddon?.encodingType,
        }) ?? ''
      cachedData = data
        ?.trim()
        ?.split('\n')
        ?.find(
          (d) =>
            d &&
            typeof d === 'string' &&
            d?.trim() !== '' &&
            d?.split('<//>')?.[0]?.trim() ===
              '__customStatusPlayerStats : ' + this.uniqueIndentifier &&
            d?.split('<//>')?.[1]?.trim() === playerName?.trim(),
        )
        ?.split('<//>')?.[2]
    }

    return cachedData?.trim()
  }
  #__parseBigData(rawData = [], playerName) {
    if (!(rawData && Array.isArray(rawData) && rawData?.length > 0))
      rawData = []
    let fetchedData = rawData?.find(
      (d) =>
        d &&
        typeof d === 'string' &&
        d?.trim() !== '' &&
        d?.split('<//>')?.[0]?.trim() ===
          '__customStatusPlayerStats : ' + this.uniqueIndentifier &&
        d?.split('<//>')?.[1]?.trim() === playerName?.trim(),
    )
    if (fetchedData)
      rawData[rawData?.indexOf(fetchedData)] =
        '__customStatusPlayerStats : ' +
        this.uniqueIndentifier +
        '<//>' +
        playerName +
        '<//>' +
        Date.now()
    else
      rawData.push(
        '__customStatusPlayerStats : ' +
          this.uniqueIndentifier +
          '<//>' +
          playerName +
          '<//>' +
          Date.now(),
      )
    return rawData?.join('\n')
  }
  #__reverseBigData(playerNames = []) {
    if (!(playerNames && Array.isArray(playerNames) && playerNames?.length > 0))
      return undefined
    let rawData =
      __fileFunctions('read', undefined, {
        filePath: __customPlayTimeAddon.fileCachespath,
        directoryPath: __customPlayTimeAddon.directoryPath,
        encodingType: __customPlayTimeAddon?.encodingType,
      }) ?? ''
    rawData = rawData
      ?.split('\n')
      ?.map((data) => {
        if (data && typeof data === 'string' && data?.trim() !== '') return data
        else if (
          data?.split('<//>')?.[0]?.trim() !==
          '__customStatusPlayerStats : ' + this.uniqueIndentifier
        )
          return data
        else if (
          data?.split('<//>')?.[0]?.trim() ===
            '__customStatusPlayerStats : ' + this.uniqueIndentifier &&
          playerNames.includes(data?.split('<//>')?.[1]?.trim())
        )
          return data
        else if (
          data?.split('<//>')?.[0]?.trim() ===
            '__customStatusPlayerStats : ' + this.uniqueIndentifier &&
          !playerNames.includes(data?.split('<//>')?.[1]?.trim())
        )
          return undefined
      })
      ?.filter(Boolean)
      ?.join('\n')
    return __fileFunctions('write', rawData + '\n', {
      filePath: __customPlayTimeAddon.fileCachespath,
      directoryPath: __customPlayTimeAddon.directoryPath,
      encodingType: __customPlayTimeAddon?.encodingType,
    })
  }
  static getInstance(uniqueIndentifier) {
    if (
      uniqueIndentifier &&
      typeof uniqueIndentifier === 'string' &&
      uniqueIndentifier !== ''
    )
      return __customPlayTimeAddon?.__caches[uniqueIndentifier]
    else return undefined
  }
}

module.exports = __customPlayTimeAddon
