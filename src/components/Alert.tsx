import styled from 'styled-components'

export interface AlertProps {
  color: string
  backgroundColor: string
}

export const Alert = styled.span<AlertProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color};
  margin-bottom: 20px;
  margin-right: 100px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: 100%;
  height: 50px;
  border: 1px solid;
  border-radius: 6px;
`

export const ALERT_PROPS = {
  DANGER: {
    color: '#721c24',
    backgroundColor: '#f8d7da'
  },
  WARNING: {
    color: '#7b773e',
    backgroundColor: '#fff6ad'
  },
  SUCCESS: {
    color: '#1e3d1e',
    backgroundColor: 'lightGreen'
  }
}

export default { Alert, ALERT_PROPS }
