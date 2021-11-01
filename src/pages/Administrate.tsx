import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { GlobalContext } from '../App'
import { Button, Container } from '../components/Common'
import { allocateTokenScript, closeVotingScript } from '../util/voting'
import { SnackBar, TypedStatus } from './Create'
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
  const initNVoters = nVoters ? Number.parseInt(nVoters) : 0
  const initTxId = txId ? txId : ''
  const [contractAddress, setContractAddress] = useState<string>(initTxId)
  const [numberVoters, setNVoters] = useState<number>(initNVoters)
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)
  const [lastAction, setLastAction] = useState<Action | undefined>(undefined)
  const context = useContext(GlobalContext)

  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setTxStatus(fetchedStatus)
          setTypedStatus(fetchedStatus as TypedStatus)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [txResult])

  const allocateTokens = async () => {
    if (context.apiClient) {
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress).catch((e) => console.log(e))
      if (votingRef) {
        await context.apiClient.scriptSubmissionPipeline(allocateTokenScript(votingRef, numberVoters)).then(setResult)
        setLastAction(Action.Allocate)
      }
    }
  }
  const close = async () => {
    if (context.apiClient) {
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress).catch((e) => console.log(e))
      if (votingRef) {
        await context.apiClient.scriptSubmissionPipeline(closeVotingScript(votingRef, numberVoters)).then(setResult)
        setLastAction(Action.Close)
      }
    }
  }

  return (
    <div>
      {txStatus && txResult?.txId && <SnackBar txStatus={txStatus} txId={txResult.txId} nVoters={numberVoters} />}
      {txResult?.txId && typedStatus && typedStatus.type === 'confirmed' && lastAction === Action.Allocate && (
        <Container>
          <div style={{ flexDirection: 'row' }}>
            Share this<NavLink to={`/vote/${contractAddress}/${nVoters}`}> link </NavLink> to the voters.
          </div>
        </Container>
      )}
      {!txResult && (
        <Container>
          <p>Contract transaction ID</p>
          <input
            placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          ></input>
          <p>Number of voters</p>
          <input placeholder="5" value={numberVoters} onChange={(e) => setNVoters(parseInt(e.target.value))}></input>
          <Button onClick={() => allocateTokens()}>Allocate Tokens</Button>
          <Button onClick={() => close()}>Close voting</Button>
        </Container>
      )}
    </div>
  )
}

export default Administrate
