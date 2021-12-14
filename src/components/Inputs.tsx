import { ChangeEvent } from 'react'
import styled from 'styled-components'

interface InputProps {
  id: string
  placeholder: string
  value: string
  type?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({ id, placeholder, value, onChange, type }: InputProps) => {
  return (
    <StyledInputDiv>
      <StyledInput
        id={id}
        placeholder={placeholder}
        value={value}
        type={type ? type : 'text'}
        onChange={(e) => onChange(e)}
      ></StyledInput>
    </StyledInputDiv>
  )
}

const StyledInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  height: 30px;
  border: 1px solid rgba(145, 145, 145, 0.685);
  border-radius: 8px;
  background-color: rgb(247, 248, 250);
  color: rgba(15, 15, 15, 0.95);
  margin-top: 5px;
`
const StyledInput = styled.input`
  border: none;
  width: 90%;
  height: 60%;
  outline: none;
  background-color: rgb(247, 247, 247);
  transition: all 0.15s ease-out 0s;
  margin-top: auto;
  margin-bottom: auto;
`

export default Input
