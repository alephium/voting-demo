import { ChangeEvent, useState } from 'react'
import { isNotEmpty } from '../util/util'
import { Button } from './Common'
import { Input } from './Inputs'

interface VoterInputProps {
  addVoter: (voter: string) => void
}

export const VoterInput = ({ addVoter }: VoterInputProps) => {
  const [voter, setVoter] = useState('')
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoter(e.target.value)
  }

  const isAddressValid = isNotEmpty

  const handleOnClick = () => {
    if (isAddressValid(voter)) {
      addVoter(voter)
      setVoter('')
    } else {
      alert('Please enter a valid address')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Input
        id="voterInput"
        placeholder="Please enter the voter address"
        onChange={(e) => handleOnChange(e)}
        value={voter}
      />
      <Button onClick={() => handleOnClick()}>+</Button>
    </div>
  )
}

export default VoterInput
