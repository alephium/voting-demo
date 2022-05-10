import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { GlobalContext } from '../App'
import { Button, Container } from '../components/Common'
import { Input } from '../components/Inputs'
import { TxStatusSnackBar } from '../components/TxStatusSnackBar'
import { tokenAllocationScript, closingScript } from '../util/voting'
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util'
import { Action, TypedStatus } from '../util/types'
import { SignScriptTxResult } from 'alephium-web3'

type Params = {
  txId?: string
}

const Administrate = () => {
  const { txId } = useParams<Params>()
  const context = useContext(GlobalContext)
  const getInitTxId = () => {
    let initTxId = txId ? txId : ''
    if (context.cache.currentContractId) {
      initTxId = context.cache.currentContractId
    }
    return initTxId
  }
  const [contractTxId, setContractTxId] = useState<string>(getInitTxId())
  const [txResult, setResult] = useState<SignScriptTxResult | undefined>(context.cache.administrateTxResult)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)
  const [lastAction, setLastAction] = useState<Action | undefined>(context.cache.administrateAction)

  const pollTxStatus = (interval: NodeJS.Timeout, txResult: SignScriptTxResult) => {
    context.apiClient?.getTxStatus(txResult.txId).then((fetchedStatus) => {
      setTxStatus(fetchedStatus)
      const status = fetchedStatus as TypedStatus
      setTypedStatus(status)
      clearIntervalIfConfirmed(fetchedStatus, interval)
    })
  }

  useEffect(() => {
    if (txResult) {
      context.editCache({ administrateTxResult: txResult })
      const interval = setInterval(() => {
        pollTxStatus(interval, txResult)
      }, 1000)
      pollTxStatus(interval, txResult)
      return () => clearInterval(interval)
    }
  }, [txResult])

  const allocateTokens = async () => {
    if (context.apiClient) {
      const contractRef = await context.apiClient.getContractRef(contractTxId).catch((e) => console.log(e))
      if (contractRef) {
        const params = await tokenAllocationScript.paramsForDeployment({
          signerAddress: context.accounts[0].address,
          templateVariables: { contractId: contractRef.tokenId }
        })
        const result = await context.apiClient.provider.signScriptTx(params)
        setResult(result)
        setLastAction(Action.Allocate)
        context.editCache({ currentContractId: contractTxId, administrateAction: Action.Allocate })
      }
    }
  }
  const close = async () => {
    if (context.apiClient) {
      const contractRef = await context.apiClient.getContractRef(contractTxId).catch((e) => console.log(e))
      if (contractRef) {
        const params = await closingScript.paramsForDeployment({
          signerAddress: context.accounts[0].address,
          templateVariables: { contractId: contractRef.tokenId }
        })
        const result = await context.apiClient.provider.signScriptTx(params)
        setResult(result)
        setLastAction(Action.Close)
        context.editCache({ currentContractId: contractTxId, administrateAction: Action.Close })
      }
    }
  }

  return (
    <>
      {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
      {txResult?.txId && typedStatus && typedStatus.type === 'Confirmed' && lastAction === Action.Allocate && (
        <Container>
          <div style={{ flexDirection: 'row' }}>
            Share this<NavLink to={`/vote/${contractTxId}`}> link </NavLink> to the voters.
          </div>
        </Container>
      )}
      {(!txResult || (typedStatus && typedStatus.type === 'Confirmed')) && (
        <Container>
          <Input
            id="tx-id"
            placeholder="The contract transaction ID"
            value={contractTxId}
            onChange={(e) => setContractTxId(e.target.value)}
          />
          <Button onClick={() => catchAndAlert(allocateTokens())}>Allocate Tokens</Button>
          <Button onClick={() => catchAndAlert(close())}>Close voting</Button>
        </Container>
      )}
    </>
  )
}

export default Administrate
