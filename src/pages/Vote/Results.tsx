import { U256 } from 'alephium-js/dist/api/api-alephium'
import { useContext, useState } from 'react'
import { GlobalContext } from '../../App'
import { Container } from '../../components/Common'

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

export default Results
