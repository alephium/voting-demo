import styled from 'styled-components'

const Button = styled.div`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  font-weight: 700;
  margin: 1rem 0rem;
  border-radius: 12px;
  box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%), 6px 6px 12px 0 rgb(0 0 0 / 7%);
  text-align: center;

  & > * {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.9);
  }

  &:hover {
  }

  &:active {
    box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%) inset, 6px 6px 12px 0 rgb(0 0 0 / 7%) inset;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 3.2rem);
  text-decoration: none;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  font-weight: 700;
  margin: 2rem;
  border-radius: 12px;
  box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%), 6px 6px 12px 0 rgb(0 0 0 / 7%);
`

export { Button, Container }
