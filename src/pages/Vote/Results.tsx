import { ValByteVec, ValU256 } from 'alephium-web3/dist/api/api-alephium'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../App'
import { Container } from '../../components/Common'
import { hexStringToStr } from '../../util/util'

interface ResultsProps {
  contractTxId: string
}

const Results = ({ contractTxId }: ResultsProps) => {
  const context = useContext(GlobalContext)
  const [title, setTitle] = useState('')
  const [yes, setYes] = useState('')
  const [no, setNo] = useState('')

  if (context.apiClient) {
    context.apiClient.getContractState(contractTxId).then((state) => {
      const title = hexStringToStr((state.fields[0] as ValByteVec).value)
      const tmpYes = state.fields[1] as ValU256
      const tmpNo = state.fields[2] as ValU256
      setYes(tmpYes.value)
      setNo(tmpNo.value)
      setTitle(title)
    })
  }
  return (
    <Container>
      <p>The vote is already closed, here are the results:</p>
      <p>{title}</p>
      <p>Yes: {yes}</p>
      <p>No: {no}</p>
    </Container>
  )
}

export default Results
