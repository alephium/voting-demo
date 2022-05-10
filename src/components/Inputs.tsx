import React, { ChangeEvent } from 'react'
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
  margin-bottom: 5px;
  flex-grow: 1;

  text-decoration: none;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  font-weight: 700;
  margin: 1rem 0rem;
  border-radius: 12px;
  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 60%), -6px -6px 12px 0 rgb(0 0 0 / 7%);
`
const StyledInput = styled.input`
  font-weight: 600;
  border: none;
  outline: none;
  background-color: transparent;
  transition: all 0.15s ease-out 0s;
  margin-top: auto;
  margin-bottom: auto;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 600000s 0s, color 600000s 0s;
  }

  &:active {
    background-color: transparent;
  }
`

export default Input
