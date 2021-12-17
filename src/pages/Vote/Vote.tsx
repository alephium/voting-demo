import { useContext, useState } from 'react'
import { GlobalContext } from '../../App'
import { Container, Button } from '../../components/Common'
import { Input } from '../../components/Inputs'
import { VotingRef } from '../../util/client'
import { useParams } from 'react-router-dom'
import { Bool } from 'alephium-js/dist/api/api-alephium'
import { catchAndAlert } from '../../util/util'
import Results from './Results'
import SubmitVote from './SubmitVote'

type Params = {
  txId?: string
}

const Vote = () => {
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

export default Vote
