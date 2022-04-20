import { useContext, useState } from 'react'
import { GlobalContext } from '../../App'
import { Container, Button } from '../../components/Common'
import { Input } from '../../components/Inputs'
import { ContractRef } from '../../util/client'
import { useParams } from 'react-router-dom'
import { ValBool, ValByteVec } from 'alephium-js/dist/api/api-alephium'
import { catchAndAlert, hexStringToStr } from '../../util/util'
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
    if (context.cache.currentContractId) {
      initTxId = context.cache.currentContractId
    }
    return initTxId
  }

  const [contractTxId, setContractTxId] = useState<string>(getInitTxId())
  const [isClosed, setIsClosed] = useState<boolean | undefined>(undefined)
  const [contractRef, setContractRef] = useState<ContractRef | undefined>(undefined)
  const [title, setTitle] = useState<string>('')

  const load = async () => {
    if (context.apiClient) {
      context.editCache({ currentContractId: contractTxId })
      const contractRef = await context.apiClient.getContractRef(contractTxId)
      if (contractRef) {
        setContractRef(contractRef)
        context.apiClient.getContractState(contractTxId).then((state) => {
          const encodedTitle = (state.fields[0] as ValByteVec).value
          setTitle(hexStringToStr(encodedTitle))
          const isClosed = (state.fields[3] as ValBool).value
          setIsClosed(isClosed)
        })
      }
    }
  }

  let content = (
    <Container>
      <Input
        id="txId"
        placeholder="The contract transaction ID"
        value={contractTxId}
        onChange={(e) => setContractTxId(e.target.value)}
      />
      <Button onClick={() => catchAndAlert(load())}>Load Contract</Button>
    </Container>
  )

  if (isClosed === true) {
    if (context.apiClient) {
      content = <Results contractTxId={contractTxId} />
    }
  } else if (isClosed === false) {
    content = <SubmitVote contractRef={contractRef} contractTxId={context.cache.currentContractId} title={title} />
  }
  return content
}

export default Vote
