import { useState } from 'react'
import { Button, Container } from '../components/Common'

const CloseVote = () => {
  const [contractAddress, setContractAddress] = useState('')

  return (
    <Container>
      <p>Contract address</p>
      <input
        placeholder="Voting title"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      ></input>
      <Button>Close</Button>
    </Container>
  )
}

export default CloseVote
