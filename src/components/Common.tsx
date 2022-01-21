import styled from 'styled-components'

const Button = styled.button`
  background-color: white;
  border-radius: 5px;
  border-style: solid;
  border-color: #e7e7e7;
  padding-top: 0px;
  margin-top: 15px;
  height: 30px;
  &:hover {
    border-color: #7e7d7d;
  }

  &:active {
    background-color: #d6d6d6;
  }
`

const Container = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 20px;
  display: flex;
  box-shadow: 0px 2px 5px 1px #c4c2c2;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  min-width: 20%;
  padding: 20px;
`

export { Button, Container }
