import { useState } from 'react'
import { Container, Button } from '../components/Common'
import { Link } from 'react-router-dom'

const LoadVote = () => {
  const [contractAddress, setContractAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  return (
    <div>
      <Container>
        <p>Contract Address</p>
        <input
          placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        ></input>
        <p>Token Id</p>
        <input
          placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        ></input>
        <Link to="submitVote">
          <Button>Load</Button>
        </Link>
      </Container>
    </div>
  )
}

export default LoadVote
