import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../App'
import { Container, Button } from '../components/Common'
import { Input } from '../components/Inputs'
import { createVotingScript } from '../util/voting'
import { VotingRef } from '../util/client'
import { useParams } from 'react-router-dom'
import { Bool, TxResult, TxStatus, U256 } from 'alephium-js/dist/api/api-alephium'
import { SnackBar } from './Create'
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util'

interface SubmitVoteProps {
  votingRef?: VotingRef
  contractTxId?: string
}

const SubmitVote = ({ votingRef, contractTxId }: SubmitVoteProps) => {
  const context = useContext(GlobalContext)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setTxStatus(fetchedStatus)
          clearIntervalIfConfirmed(fetchedStatus, interval)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const vote = async (choice: boolean) => {
    if (votingRef && context.apiClient && contractTxId) {
      const nVoters = await context.apiClient.getNVoters(contractTxId)
      const txScript = createVotingScript(choice, votingRef, nVoters)
      catchAndAlert(context.apiClient.scriptSubmissionPipeline(txScript).then(setResult))
    }
  }
  return (
    <div>
      {txStatus && txResult?.txId && <SnackBar txStatus={txStatus} txId={txResult.txId} />}
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
  contractTxId: string
}
const Results = ({ contractTxId }: ResultsProps) => {
  const context = useContext(GlobalContext)

  const [yes, setYes] = useState('')
  const [no, setNo] = useState('')

  if (context.apiClient) {
    context.apiClient.getContractState(contractTxId).then((state) => {
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
  const context = useContext(GlobalContext)
  const { txId } = useParams<Params>()
  const getInitTxId = () => {
    let initTxId = txId ? txId : ''
    if (context.currentContractId) {
      initTxId = context.currentContractId
    }
    return initTxId
  }

  const [contractAddress, setContractAddress] = useState<string>(getInitTxId())
  const [isClosed, setIsClosed] = useState<boolean | undefined>(undefined)
  const [votingRef, setVotingRef] = useState<VotingRef | undefined>(undefined)

  const load = async () => {
    if (context.apiClient) {
      context.setCurrentContractId(contractAddress)
      const votingRef = await context.apiClient.getVotingMetaData(contractAddress)
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
      <h2>
        <label htmlFor="txId"> Contract transaction ID</label>
      </h2>
      <Input
        id="txId"
        placeholder="Please enter the contract deployment transaction ID"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <Button onClick={() => catchAndAlert(load())}>Load Contract</Button>
    </Container>
  )

  if (isClosed === true) {
    if (context.apiClient) {
      content = <Results contractTxId={contractAddress} />
    }
  } else if (isClosed === false) {
    content = <SubmitVote votingRef={votingRef} contractTxId={context.currentContractId} />
  }
  return content
}

export default LoadVote
