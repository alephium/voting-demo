import { ChangeEvent, useState } from 'react'
import { Container, Button } from '../components/Common'
import styled from 'styled-components'

export const Create = () => {
  const [voters, setVoters] = useState<string[]>([])
  const [admin, setAdmin] = useState<string>('')
  const addVoter = (voter: string) => {
    console.log(voter)
    setVoters([...voters, voter])
  }
  return (
    <Container>
      <p>Administrator Address</p>
      <input
        placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
        value={admin}
        onChange={(e) => setAdmin(e.target.value)}
      ></input>
      <p>Voters</p>
      <ul>
        {voters.map((voter, index) => (
          <li key={index}>{voter}</li>
        ))}
      </ul>
      <VoterInput addVoter={addVoter} />
      <Button>Submit</Button>
    </Container>
  )
}

interface VoterInputProps {
  addVoter: (voter: string) => void
}

const VoterInput = ({ addVoter }: VoterInputProps) => {
  const [voter, setVoter] = useState('')
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoter(e.target.value)
  }

  const isAddressValid = (address: string) => {
    if (address !== '') {
      return true
    } else {
      return false
    }
  }

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAddressValid(voter)) {
      addVoter(voter)
      setVoter('')
    } else {
      alert('Please enter a valid address')
    }
  }

  return (
    <VoterInputDiv>
      <input placeholder="Enter voter address" onChange={handleOnChange} value={voter}></input>
      <Button onClick={handleOnClick}>+</Button>
    </VoterInputDiv>
  )
}

export const VoterInputDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export default Create
