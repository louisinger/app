import { NetworkString } from 'marina-provider'
import { defaultPayout, oracleURL } from './constants'
import { fetchURL } from './fetch'
import { Asset, Investment, Offer, Oracle, Stock } from './types'

// ASSETS

export enum TICKERS {
  fbmn = 'FBMN',
  fuji = 'FUSD',
  lbtc = 'L-BTC',
  usdt = 'USDt',
}

const assetHashByTicker: Record<string, Record<NetworkString, string>> = {
  [TICKERS.fbmn]: {
    liquid: '',
    regtest: '',
    testnet: '',
  },
  [TICKERS.fuji]: {
    liquid: '',
    regtest: '',
    testnet: '0d86b2f6a8c3b02a8c7c8836b83a081e68b7e2b4bcdfc58981fc5486f59f7518',
  },
  [TICKERS.lbtc]: {
    liquid: '',
    regtest: '',
    testnet: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
  },
  [TICKERS.usdt]: {
    liquid: '',
    regtest: '',
    testnet: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
  },
}

const lbtc: Asset = {
  icon: '/images/assets/lbtc.svg',
  id: '',
  isSynthetic: false,
  isAvailable: false,
  name: 'Liquid BTC',
  precision: 8,
  quantity: 0,
  ratio: 150,
  ticker: TICKERS.lbtc,
  value: 40000,
}

const usdt: Asset = {
  icon: '/images/assets/usdt.svg',
  id: '',
  isSynthetic: false,
  isAvailable: false,
  name: 'Tether USD',
  precision: 8,
  quantity: 0,
  ratio: 150,
  ticker: TICKERS.usdt,
  value: 1,
}

const fuji: Asset = {
  icon: '/images/assets/fusd.svg',
  id: '',
  isSynthetic: true,
  isAvailable: true,
  name: 'FUJI USD',
  precision: 8,
  quantity: 0,
  ticker: TICKERS.fuji,
  value: 1,
}

const fbmn: Asset = {
  icon: '/images/assets/fbmn.svg',
  id: '',
  isSynthetic: true,
  isAvailable: false,
  name: 'FUJI BMN',
  precision: 8,
  quantity: 0,
  ticker: TICKERS.fbmn,
  value: 309415.05,
}

const assets: Asset[] = [lbtc, usdt, fuji, fbmn]

const assetsWithNetworkHash = (network: NetworkString) =>
  assets.map((asset) => ({
    ...asset,
    id: assetHashByTicker[asset.ticker][network],
  }))

export const apiAssets = async (network: NetworkString): Promise<Asset[]> => {
  lbtc.value = await getBTCvalue()
  return assetsWithNetworkHash(network)
}

export const findAssetByTicker = async (
  ticker: string,
  network: NetworkString,
): Promise<Asset> => {
  const asset = (await apiAssets(network)).find(
    (a) => a.ticker.toLowerCase() === ticker.toLowerCase(),
  )
  if (!asset) throw new Error(`Asset with ticker ${ticker} not found`)
  return asset
}

// ORACLES

const oraclePubkeyById: Record<string, Record<NetworkString, string>> = {
  id0: {
    liquid: '',
    regtest: '',
    testnet:
      '0xc304c3b5805eecff054c319c545dc6ac2ad44eb70f79dd9570e284c5a62c0f9e',
  },
  id1: {
    liquid: '',
    regtest: '',
    testnet: '',
  },
  id2: {
    liquid: '',
    regtest: '',
    testnet: '',
  },
}

const oracles: Oracle[] = [
  { disabled: false, id: 'id0', name: 'Fuji.Money' },
  { disabled: true, id: 'id1', name: 'Bitfinex' },
  { disabled: true, id: 'id2', name: 'Blockstream' },
]

export const apiOracles = (network: NetworkString): Oracle[] =>
  oracles.map((oracle) => ({
    ...oracle,
    pubkey: oraclePubkeyById[oracle.id][network],
  }))

// INVESTMENTS

export const apiInvestments = (): Investment[] => [
  {
    asset: fbmn,
    delta: -0.1125,
    quantity: 0.001,
  },
]

// OFFERS

export const apiOffers = async (network: NetworkString): Promise<Offer[]> => [
  {
    id: 'lbtcfusd',
    collateral: await findAssetByTicker(TICKERS.lbtc, network),
    oracles: [oracles[0].id],
    payout: defaultPayout,
    synthetic: await findAssetByTicker(TICKERS.fuji, network),
    isAvailable: true,
  },
  {
    id: 'usdtfbmn',
    collateral: await findAssetByTicker(TICKERS.usdt, network),
    oracles: [oracles[0].id],
    payout: defaultPayout,
    synthetic: await findAssetByTicker(TICKERS.fbmn, network),
    isAvailable: false,
  },
]

// STOCKS

export const apiStocks = (network: NetworkString): Stock[] =>
  assetsWithNetworkHash(network)
    .filter((asset) => asset.isSynthetic)
    .map((asset) => ({ asset, delta: 0.159 }))

export const getBTCvalue = async (): Promise<number> => {
  const data = await fetchURL(oracleURL)
  return data ? Number(data.lastPrice) : 0
}
