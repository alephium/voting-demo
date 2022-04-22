import WalletConnectClient from '@walletconnect/client'
import AlephiumProvider from '@alephium/walletconnect-provider'

import {
  Api,
  ApiConfig,
  TxResult,
  HttpResponse,
  ServiceUnavailable,
  InternalServerError,
  NotFound,
  Unauthorized,
  BadRequest,
  TxStatus,
  Confirmed,
  ContractState,
  Val
} from 'alephium-js/dist/api/api-alephium'
import { loadSettingsOrDefault, Settings } from './settings'
import { NetworkType } from './types'

export interface ContractRef {
  contractAddress: string
  tokenId: string
}

export const CONTRACTGAS = 6000000

class Client {
  api: Api<unknown>
  walletConnect: WalletConnectClient
  provider: AlephiumProvider
  accounts: string[]
  settings: Settings

  constructor(baseUrl: string, walletConnect: WalletConnectClient, provider: AlephiumProvider) {
    const apiConfig: ApiConfig = {
      baseUrl: baseUrl
    }
    this.api = new Api(apiConfig)
    this.accounts = []
    this.walletConnect = walletConnect
    this.provider = provider
    this.settings = loadSettingsOrDefault()
  }

  async getActiveAddress(): Promise<string> {
    return this.accounts[0] || Promise.reject('No active address')
  }

  fetch = async <T, E extends BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>(
    query: Promise<HttpResponse<T, E>>
  ): Promise<T> => {
    const result = await query
    if (result.error) {
      return Promise.reject(new Error(result.error.detail))
    }
    return result.data
  }

  async deployContract(
    fromAddress: string,
    contract: string,
    gas: number,
    state: Val[],
    issueTokenAmount: string
  ): Promise<TxResult & { contractAddress: string }> {
    return this.provider.request({
      method: 'alephium_signAndSubmitTx',
      params: {
        fromAddress,
        contract,
        gas,
        state,
        issueTokenAmount
      }
    })
  }

  async deployScript(fromAddress: string, script: string, gas: number): Promise<TxResult> {
    return this.provider.request({
      method: 'alephium_signAndSubmitTx',
      params: {
        fromAddress,
        script,
        gas
      }
    })
  }

  async getTxStatus(txId: string): Promise<TxStatus> {
    return await this.fetch(
      this.api.transactions.getTransactionsStatus({
        txId: txId
      })
    )
  }

  getContractRef = async (txId: string): Promise<ContractRef> => {
    const txStatus = await this.fetch(
      this.api.transactions.getTransactionsStatus({
        txId: txId
      })
    )
    if ('blockHash' in txStatus) {
      const confirmed = txStatus as Confirmed
      const block = await this.fetch(this.api.blockflow.getBlockflowBlocksBlockHash(confirmed.blockHash))
      const tx = block.transactions.find((tx) => tx.unsigned.txId === txId)
      if (tx) {
        const contractOutput = tx.generatedOutputs.find((output) => !('locktime' in output))
        if (contractOutput) {
          console.log(contractOutput, 'output')
          const contractAddress = contractOutput.address
          const tokenId = contractOutput.tokens[0].id
          console.log(contractAddress)
          if (contractAddress) {
            return {
              contractAddress: contractAddress,
              tokenId: tokenId
            }
          } else {
            return Promise.reject<ContractRef>('The contract address is undefined')
          }
        } else {
          return Promise.reject<ContractRef>('No token found')
        }
      } else {
        return Promise.reject<ContractRef>('No contract found')
      }
    } else {
      return Promise.reject<ContractRef>('Not confirmed yet')
    }
  }

  getContractState = async (txId: string): Promise<ContractState> => {
    const contractRef = await this.getContractRef(txId)
    const group = await this.fetch(this.api.addresses.getAddressesAddressGroup(contractRef.contractAddress))
    return this.fetch(this.api.contracts.getContractsAddressState(contractRef.contractAddress, { group: group.group }))
  }

  getNVoters = async (txId: string): Promise<number> => {
    return this.getContractState(txId).then((result: ContractState) => {
      return result.fields.length - 6
    })
  }

  async getNetworkType(): Promise<NetworkType> {
    return this.fetch(this.api.infos.getInfosChainParams()).then((tResult) => {
      if (tResult.networkId == 0) {
        return NetworkType.MAINNET
      } else if (tResult.networkId == 1) {
        return NetworkType.TESTNET
      } else {
        return NetworkType.UNKNOWN
      }
    })
  }
}

export default Client
