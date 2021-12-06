import {
  Api,
  ApiConfig,
  CompileResult,
  TxResult,
  BuildContractResult,
  HttpResponse,
  ServiceUnavailable,
  InternalServerError,
  NotFound,
  Unauthorized,
  BadRequest,
  Addresses,
  BuildScriptResult,
  TxStatus,
  Confirmed,
  ContractStateResult
} from 'alephium-js/dist/api/api-alephium'

export interface VotingRef {
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
    state?: string,
    issueTokenAmount?: string
  ): Promise<BuildContractResult> => {
    return this.fetch(
      this.api.contracts.postContractsBuildContract({
        fromPublicKey: await this.getPublicKey(),
        code: compileResult.code,
        gas: gas,
        state: state,
        issueTokenAmount: issueTokenAmount
      })
    )
  }

  buildScript = async (compileResult: CompileResult, gas: number = CONTRACTGAS): Promise<BuildScriptResult> => {
    return this.fetch(
      this.api.contracts.postContractsBuildScript({
        fromPublicKey: await this.getPublicKey(),
        code: compileResult.code,
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

  async contractSubmissionPipeline(
    contract: string,
    gas: number,
    state: string,
    issueTokenAmount: string
  ): Promise<TxResult> {
    return this.compileContract(contract)
      .then((compileResult) => this.buildContract(compileResult, gas, state, issueTokenAmount))
      .then(async (buildContract: BuildContractResult) => {
        const signature = await this.sign(buildContract.hash)
        return this.submit(buildContract.unsignedTx, signature)
      })
  }

  async scriptSubmissionPipeline(script: string): Promise<TxResult> {
    return this.compileScript(script)
      .then(this.buildScript)
      .then(async (buildScriptResult: BuildScriptResult) => {
        const signature = await this.sign(buildScriptResult.hash)
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

  getVotingMetaData = async (txId: string): Promise<VotingRef> => {
    const txStatus = await this.fetch(
      this.api.transactions.getTransactionsStatus({
        txId: txId
      })
    )
    if ('blockHash' in txStatus) {
      const confirmed = txStatus as Confirmed
      const block = await this.fetch(this.api.blockflow.getBlockflowBlocksBlockHash(confirmed.blockHash))
      const tx = block.transactions.find((tx) => tx.id === txId)
      if (tx) {
        const contractOutput = tx.outputs.find((output) => !('locktime' in output))
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
          }
        } else {
          console.log('No token found')
        }
      } else {
        console.log('no contract found')
      }
    } else {
      console.log('not confirmed yet')
    }
    return Promise.reject()
  }

  getContractState = async (txId: string): Promise<ContractStateResult> => {
    const votingRef = await this.getVotingMetaData(txId)
    const group = await this.fetch(this.api.addresses.getAddressesAddressGroup(votingRef.contractAddress))
    return this.fetch(this.api.contracts.getContractsAddressState(votingRef.contractAddress, { group: group.group }))
  }
}

export default Client
