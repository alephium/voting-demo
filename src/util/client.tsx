import {
  Api,
  ApiConfig,
  CompileResult,
  TxResult,
  BuildContractDeployScriptTxResult,
  HttpResponse,
  ServiceUnavailable,
  InternalServerError,
  NotFound,
  Unauthorized,
  BadRequest,
  Addresses,
  BuildScriptTxResult,
  TxStatus,
  Confirmed,
  ContractState,
  Val
} from 'alephium-js/dist/api/api-alephium'
import { NetworkType } from './types'

export interface ContractRef {
  contractAddress: string
  tokenId: string
}

export const CONTRACTGAS = 80000

class Client {
  api: Api<unknown>
  walletName: string
  password: string

  constructor(baseUrl: string, walletName: string, password: string) {
    const apiConfig: ApiConfig = {
      baseUrl: baseUrl
    }
    this.api = new Api(apiConfig)
    this.walletName = walletName
    this.password = password
  }

  resetClient(walletName: string, password: string): void {
    this.walletName = walletName
    this.password = password
  }

  async walletUnlock() {
    return this.fetch(
      this.api.wallets.postWalletsWalletNameUnlock(this.walletName, {
        password: this.password
      })
    )
  }

  async getPublicKey(): Promise<string> {
    const addresses: Addresses = await this.fetch(this.api.wallets.getWalletsWalletNameAddresses(this.walletName))
    const addressInfo = await this.fetch(
      this.api.wallets.getWalletsWalletNameAddressesAddress(this.walletName, addresses.activeAddress)
    )
    return addressInfo.publicKey
  }

  async getActiveAddress(): Promise<string> {
    return (await this.fetch(this.api.wallets.getWalletsWalletNameAddresses(this.walletName))).activeAddress
  }

  async compileContract(code: string): Promise<CompileResult> {
    return this.fetch(
      this.api.contracts.postContractsCompileContract({
        code: code
      })
    )
  }

  async compileScript(code: string): Promise<CompileResult> {
    return this.fetch(
      this.api.contracts.postContractsCompileScript({
        code: code
      })
    )
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

  buildContract = async (
    compileResult: CompileResult,
    gas: number = CONTRACTGAS,
    state?: Val[],
    issueTokenAmount?: string
  ): Promise<BuildContractDeployScriptTxResult> => {
    return this.fetch(
      this.api.contracts.postContractsUnsignedTxBuildContract({
        fromPublicKey: await this.getPublicKey(),
        bytecode: compileResult.bytecode,
        gas: gas,
        initialFields: state ?? [],
        issueTokenAmount: issueTokenAmount
      })
    )
  }

  buildScript = async (compileResult: CompileResult, gas: number = CONTRACTGAS): Promise<BuildScriptTxResult> => {
    return this.fetch(
      this.api.contracts.postContractsUnsignedTxBuildContract({
        fromPublicKey: await this.getPublicKey(),
        bytecode: compileResult.bytecode,
        initialFields: [],
        gas: gas
      })
    )
  }

  async sign(data: string): Promise<string> {
    return this.fetch(this.api.wallets.postWalletsWalletNameSign(this.walletName, { data: data })).then((result) => {
      return result.signature
    })
  }

  async submit(unsignedTx: string, signature: string): Promise<TxResult> {
    return this.fetch(
      this.api.transactions.postTransactionsSubmit({
        unsignedTx: unsignedTx,
        signature: signature
      })
    )
  }

  async deployContract(contract: string, gas: number, state: Val[], issueTokenAmount: string): Promise<TxResult> {
    return this.compileContract(contract)
      .then((compileResult) => this.buildContract(compileResult, gas, state, issueTokenAmount))
      .then(async (buildContract: BuildContractDeployScriptTxResult) => {
        const signature = await this.sign(buildContract.txId)
        return this.submit(buildContract.unsignedTx, signature)
      })
  }

  async deployScript(script: string): Promise<TxResult> {
    return this.compileScript(script)
      .then(this.buildScript)
      .then(async (buildScriptResult: BuildScriptTxResult) => {
        const signature = await this.sign(buildScriptResult.txId)
        return this.submit(buildScriptResult.unsignedTx, signature)
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
