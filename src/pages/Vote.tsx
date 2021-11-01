import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../App'
import { Container, Button } from '../components/Common'
import { createVotingScript } from '../util/voting'
import { VotingRef } from '../util/client'
import { useParams } from 'react-router-dom'
import { Bool, TxResult, TxStatus, U256 } from 'alephium-js/dist/api/api-alephium'
import { SnackBar, TypedStatus } from './Create'

interface SubmitVoteProps {
  votingRef?: VotingRef
  nVoters: number
}
const SubmitVote = ({ votingRef, nVoters }: SubmitVoteProps) => {
  const context = useContext(GlobalContext)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setTxStatus(fetchedStatus)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [txResult])

  const vote = async (choice: boolean) => {
    if (votingRef && context.apiClient) {
      const txScript = createVotingScript(choice, votingRef, nVoters)
      context.apiClient.scriptSubmissionPipeline(txScript).then(setResult)
    }
  }
  return (
    <div>
      {txStatus && txResult?.txId && <SnackBar txStatus={txStatus} txId={txResult.txId} nVoters={nVoters} />}
      {!txResult && (
        <Container>
          <p>Voting title?</p>
          <Button onClick={() => vote(true)}>Yes</Button>
          <Button onClick={() => vote(false)}>No</Button>
        </Container>
      )}
    </div>
  )
}

interface ResultsProps {
  contracTxId: string
}
const Results = ({ contracTxId }: ResultsProps) => {
  const context = useContext(GlobalContext)

  const [yes, setYes] = useState('')
  const [no, setNo] = useState('')
  const [isClosed, setIsClosed] = useState(false)

  if (context.apiClient) {
    context.apiClient.getContractState(contracTxId).then((state) => {
      const tmpYes = state.fields[0] as U256
      const tmpNo = state.fields[1] as U256
      setYes(tmpYes.value)
      setNo(tmpNo.value)
    })
  }
  return (
    <Container>
      <p>The voting is already closed</p>
      <p>Results</p>
      <p>Yes: {yes}</p>
      <p>No: {no}</p>
    </Container>
  )
}

type Params = {
  txId?: string
  nVoters?: string
}
const LoadVote = () => {
  const { txId, nVoters } = useParams<Params>()
  const initNVoters = nVoters ? Number.parseInt(nVoters) : 0
  const initTxId = txId ? txId : ''
  const [contractAddress, setContractAddress] = useState<string>(initTxId)
  const [numberVoters, setNVoters] = useState<number>(initNVoters)
  const [isClosed, setIsClosed] = useState<boolean | undefined>(undefined)
  const [votingRef, setVotingRef] = useState<VotingRef | undefined>(undefined)

  const context = useContext(GlobalContext)
  const load = async () => {
    if (context.apiClient) {
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress).catch((e) => console.log(e))
      console.log(votingRef)
      if (votingRef) {
        setVotingRef(votingRef)
        context.apiClient.getContractState(contractAddress).then((state) => {
          const isClosed = (state.fields[2] as Bool).value
          setIsClosed(isClosed)
        })
      }
    }
  }
  let content = (
    <Container>
      <p>Contract transaction ID</p>
      <input
        placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      ></input>
      <p>Number of voters</p>
      <input placeholder="5" value={numberVoters} onChange={(e) => setNVoters(parseInt(e.target.value))}></input>
      <Button onClick={() => load()}>Load Contract</Button>
    </Container>
  )

  if (isClosed === true) {
    if (context.apiClient) {
      content = <Results contracTxId={contractAddress} />
    }
  } else if (isClosed === false) {
    content = <SubmitVote votingRef={votingRef} nVoters={numberVoters} />
  }
  return content
}

export default LoadVote
