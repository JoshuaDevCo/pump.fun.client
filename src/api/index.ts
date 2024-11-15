import axios from 'axios'
import {
  Candle,
  JWTTokensPair,
  Token,
  TokenBalance,
  TokenMetadata,
  TokenTrade,
  TokenWinner,
  UserAccount,
  UserComment
} from "../types.ts";
import {appConfig} from "../config.ts";

const baseURL = appConfig.apiUrl

const client = axios.create({
  baseURL
})

export interface JwtParams {
  accessToken: string
}

export const getNonce = async (address: string) => {
  const { data } = await client.post<{ nonce: number }>('/user/nonce', {
    address
  })
  return data.nonce
}

export const verifySignature = async (address: string, signature: string) => {
  const { data } = await client.post<JWTTokensPair>('/user/verify', {
    address,
    signature
  })
  return data
}

export const createUser = async (params: { address: string } & JwtParams) => {
  const {data} = await client.post<UserAccount>('/user', {
    address: params.address
  }, {
    headers: {
      'Authorization': `Bearer ${params.accessToken}`
    }
  })
  return data
}

export const signIn = async (params: JwtParams) => {
  const {data} = await client.get<{
    user: UserAccount;
    tokens: JWTTokensPair;
  }>('/user/sign-in', {
    headers: {
      'Authorization': `Bearer ${params.accessToken}`
    }
  })
  return data
}

export const getUserByAddress = async (params: { address: string }) => {
  const {data} = await client.get<UserAccount>(`/user/${params.address}`)
  return data
}

export const getUserTokenCreated = async (params: { address: string }) => {
  const {data} = await client.get<Token[]>(`/user/${params.address}/tokens/created`)
  return data
}

export interface GetTokensParams {
  search?: string
  limit?: number
  offset?: number
}

export const getTokens = async (params: GetTokensParams = {}) => {
  const {limit = 100, offset = 0, search = ''} = params

  const {data} = await client.get<Token[]>('/tokens', {
    params: {
      search,
      limit,
      offset
    }
  })
  return data
}

export const getTokenBalances = async (params: {
  tokenAddress?: string
  userAddress?: string
  limit?: number
  offset?: number
}) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<TokenBalance[]>('/balances', {
    params: {
      ...params,
      offset,
      limit
    }
  })
  return data
}

export const getTokenWinners = async (params: {
  limit?: number
  offset?: number
} = {}) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<TokenWinner[]>('/winners', {
    params: {
      ...params,
      offset,
      limit
    }
  })
  return data
}

export interface GetCommentsParams {
  tokenAddress: string
  limit?: number
  offset?: number
}

export const getTokenComments = async (params: GetCommentsParams) => {
  const {limit = 100, offset = 0, tokenAddress} = params

  const {data} = await client.get<UserComment[]>('/comments', {
    params: {
      tokenAddress,
      limit,
      offset
    }
  })
  return data
}

export interface PostCommentParams {
  tokenAddress: string
  text: string
}

export const addComment = async (params: PostCommentParams, jwt: JwtParams) => {
  const {data} = await client.post<number>('/comment', params, {
    headers: {
      'Authorization': `Bearer ${jwt.accessToken}`
    }
  })
  return data
}

export const addTokenMetadata = async (payload: TokenMetadata, jwt: JwtParams) => {
  const {data} = await client.post<UserAccount>('/metadata', payload, {
    headers: {
      'Authorization': `Bearer ${jwt.accessToken}`
    }
  })
  return data
}

export interface GetTradeParams {
  tokenAddress?: string
  offset?: number
  limit?: number
}

export const getTrades = async (params: GetTradeParams) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<TokenTrade[]>('/trades', {
    params: {
      ...params,
      limit,
      offset
    }
  })
  return data
}

export interface GetCandlesParams {
  tokenAddress: string
  offset?: number
  limit?: number
}

export const getCandles = async (params: GetCandlesParams) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<Candle[]>('/candles', {
    params: {
      ...params,
      limit,
      offset
    }
  })
  return data
}
