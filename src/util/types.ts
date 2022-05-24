import { TxResult } from 'alephium-js/dist/api/api-alephium'
import { SignDeployContractTxResult, SignExecuteScriptTxResult } from 'alephium-web3'

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
  createTxResult?: SignDeployContractTxResult
  voteTxResult?: SignExecuteScriptTxResult
  administrateTxResult?: SignExecuteScriptTxResult
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

export enum NetworkType {
  MAINNET,
  TESTNET,
  UNKNOWN,
  UNREACHABLE
}
