import WalletConnectClient from '@walletconnect/client'

import { convertHttpResponse, Fields, node } from 'alephium-web3'
import WalletConnectProvider from 'alephium-walletconnect-provider'
import {
  SignDeployContractTxParams,
  SignDeployContractTxResult,
  SignExecuteScriptTxParams,
  SignExecuteScriptTxResult,
  Val,
  Contract,
  Number256
} from 'alephium-web3'
import { loadSettingsOrDefault, Settings } from './settings'
import { NetworkType } from './types'

export interface ContractRef {
  contractAddress: string
  tokenId: string
}

export const CONTRACTGAS = 6000000

class Client {
  api: node.Api<unknown>
  walletConnect: WalletConnectClient
  provider: WalletConnectProvider
  accounts: string[]
  settings: Settings

  constructor(baseUrl: string, walletConnect: WalletConnectClient, provider: WalletConnectProvider) {
    const apiConfig: node.ApiConfig = {
      baseUrl: baseUrl
    }
    this.api = new node.Api(apiConfig)
    this.accounts = []
    this.walletConnect = walletConnect
    this.provider = provider
    this.settings = loadSettingsOrDefault()
  }

  async getActiveAddress(): Promise<string> {
    return this.accounts[0] || Promise.reject('No active address')
  }

  // fetch = async <T, E extends BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>(
  //   query: Promise<HttpResponse<T, E>>
  // ): Promise<T> => {
  //   const result = await query
  //   if (result.error) {
  //     return Promise.reject(new Error(result.error.detail))
  //   }
  //   return result.data
  // }

  async deployContract(
    fromAddress: string,
    contract: Contract,
    fields: Fields,
    issueTokenAmount: Number256
  ): Promise<SignDeployContractTxResult> {
    const params = await contract.paramsForDeployment({
      signerAddress: fromAddress,
      initialFields: fields,
      issueTokenAmount: issueTokenAmount
    })
    return this.provider.signDeployContractTx(params)
  }

  async deployScript(fromAddress: string, bytecode: string): Promise<SignExecuteScriptTxResult> {
    const params: SignExecuteScriptTxParams = {
      signerAddress: fromAddress,
      bytecode: bytecode,
      submitTx: true
    }
    return this.provider.signExecuteScriptTx(params)
  }

  async getTxStatus(txId: string): Promise<node.TxStatus> {
    return this.api.transactions.getTransactionsStatus({
      txId: txId
    })
  }

  getContractRef = async (txId: string): Promise<ContractRef> => {
    const txStatus = await this.api.transactions.getTransactionsStatus({
      txId: txId
    })
    if ('blockHash' in txStatus) {
      const confirmed = txStatus as node.Confirmed
      const block = await this.api.blockflow.getBlockflowBlocksBlockHash(confirmed.blockHash)
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

  getContractState = async (txId: string): Promise<node.ContractState> => {
    const contractRef = await this.getContractRef(txId)
    const group = await this.api.addresses.getAddressesAddressGroup(contractRef.contractAddress)
    return this.api.contracts.getContractsAddressState(contractRef.contractAddress, { group: group.group })
  }

  getNVoters = async (txId: string): Promise<number> => {
    return this.getContractState(txId).then((result: node.ContractState) => {
      return result.fields.length - 6
    })
  }

  async getNetworkType(): Promise<NetworkType> {
    const tResult = await this.api.infos.getInfosChainParams()
    if (tResult.networkId == 0) {
      return NetworkType.MAINNET
    } else if (tResult.networkId == 1) {
      return NetworkType.TESTNET
    } else {
      return NetworkType.UNKNOWN
    }
  }
}

export default Client
