import { TxStatus } from 'alephium-js/dist/api/api-alephium'
import { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../App'
import { TypedStatus } from '../util/types'

interface TxStatusSnackBarProps {
  txStatus: TxStatus
  txId: string
}

export const TxStatusSnackBar = ({ txStatus, txId }: TxStatusSnackBarProps) => {
  const context = useContext(GlobalContext)
  const status = txStatus as TypedStatus
  const getMessage = () => {
    if (!(txStatus && txId)) {
      return null
    } else if (status.type === 'confirmed') {
      return (
        <div>
          <TxStatusSnackBarDiv style={{ backgroundColor: 'lightgreen' }}>
            <p>
              <a
                href={`${context.settings.explorerURL}/#/transactions/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Transaction{' '}
              </a>
              confirmed!
            </p>
          </TxStatusSnackBarDiv>
        </div>
      )
    } else if (status.type === 'mem-pooled') {
      return (
        <TxStatusSnackBarDiv style={{ backgroundColor: 'lightyellow' }}>
          <p>
            Pending{' '}
            <a
              href={`${context.settings.explorerURL}/#/transactions/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              transaction.
            </a>{' '}
            Please wait..
          </p>
        </TxStatusSnackBarDiv>
      )
    } else {
      return <TxStatusSnackBarDiv>Transaction not found</TxStatusSnackBarDiv>
    }
  }
  return getMessage()
}

export const TxStatusSnackBarDiv = styled.div`
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  overflow: hidden;
  font-family: Arial;
  padding-left: 10px;
  padding-right: 10px;
`

export default TxStatusSnackBar
