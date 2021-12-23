import { TxResult } from 'alephium-js/dist/api/api-alephium'

export interface Address {
  address: string
  group: number
}

export interface TypedStatus {
  type: string
  blockHash?: string
  txIndex?: number
  chainConfirmations?: number
  fromGroupConfirmations?: number
  toGroupConfirmations?: number
}

export enum Action {
  Allocate,
  Close
}

export interface Cache {
  currentContractId: string
  createTxResult?: TxResult
  voteTxResult?: TxResult
  administrateTxResult?: TxResult
  administrateAction?: Action
}

export function emptyCache(): Cache {
  return {
    currentContractId: '',
    createTxResult: undefined,
    voteTxResult: undefined,
    administrateTxResult: undefined,
    administrateAction: undefined
  }
}
