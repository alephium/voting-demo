import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { GlobalContext } from '../App'
import { Button, Container } from '../components/Common'
import { Input } from '../components/Inputs'
import { allocateTokenScript, closeVotingScript } from '../util/voting'
import { SnackBar } from './Create'
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util'
import { TypedStatus } from '../util/types'

type Params = {
  txId?: string
  nVoters?: string
}
enum Action {
  Allocate,
  Close
}

const Administrate = () => {
  const { txId, nVoters } = useParams<Params>()
  const context = useContext(GlobalContext)
  const getInitTxId = () => {
    let initTxId = txId ? txId : ''
    if (context.currentContractId) {
      initTxId = context.currentContractId
    }
    return initTxId
  }
  const [contractAddress, setContractAddress] = useState<string>(getInitTxId())
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)
  const [lastAction, setLastAction] = useState<Action | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setTxStatus(fetchedStatus)
          const status = fetchedStatus as TypedStatus
          setTypedStatus(status)
          clearIntervalIfConfirmed(fetchedStatus, interval)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const allocateTokens = async () => {
    if (context.apiClient) {
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress).catch((e) => console.log(e))
      if (votingRef) {
        const numberVoters = await context.apiClient.getNVoters(contractAddress)
        await context.apiClient.scriptSubmissionPipeline(allocateTokenScript(votingRef, numberVoters)).then(setResult)

        setLastAction(Action.Allocate)
        context.setCurrentContractId(contractAddress)
      }
    }
  }
  const close = async () => {
    if (context.apiClient) {
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress).catch((e) => console.log(e))
      if (votingRef) {
        const numberVoters = await context.apiClient.getNVoters(contractAddress)
        await context.apiClient.scriptSubmissionPipeline(closeVotingScript(votingRef, numberVoters)).then(setResult)
        setLastAction(Action.Close)
        context.setCurrentContractId(contractAddress)
      }
    }
  }

  return (
    <div>
      {txStatus && txResult?.txId && <SnackBar txStatus={txStatus} txId={txResult.txId} />}
      {txResult?.txId && typedStatus && typedStatus.type === 'confirmed' && lastAction === Action.Allocate && (
        <Container>
          <div style={{ flexDirection: 'row' }}>
            Share this<NavLink to={`/vote/${contractAddress}/${nVoters}`}> link </NavLink> to the voters.
          </div>
        </Container>
      )}
      {!txResult && (
        <Container>
          <h2>
            <label htmlFor="tx-id">Contract transaction ID</label>
          </h2>
          <Input
            id="tx-id"
            placeholder="Please enter the contract deployment transaction ID"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <Button onClick={() => catchAndAlert(allocateTokens())}>Allocate Tokens</Button>
          <Button onClick={() => catchAndAlert(close())}>Close voting</Button>
        </Container>
      )}
    </div>
  )
}

export default Administrate
