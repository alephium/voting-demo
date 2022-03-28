import { TxStatus } from 'alephium-js/dist/api/api-alephium'
import { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../App'
import { TypedStatus } from '../util/types'
import { Alert, ALERT_PROPS } from './Alert'
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
    } else if (status.type === 'Confirmed') {
      return (
        <StyledDiv>
          <Alert color={ALERT_PROPS.SUCCESS.color} backgroundColor={ALERT_PROPS.SUCCESS.backgroundColor}>
            <a
              href={`${context.settings.explorerURL}/#/transactions/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Transaction
            </a>
            &nbsp; Confirmed!
          </Alert>
        </StyledDiv>
      )
    } else if (status.type === 'MemPooled') {
      return (
        <StyledDiv>
          <Alert color={ALERT_PROPS.WARNING.color} backgroundColor={ALERT_PROPS.WARNING.backgroundColor}>
            Pending&nbsp;
            <a
              href={`${context.settings.explorerURL}/#/transactions/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              transaction.
            </a>
            &nbsp; Please wait..
          </Alert>
        </StyledDiv>
      )
    } else {
      return (
        <StyledDiv>
          <Alert color={ALERT_PROPS.DANGER.color} backgroundColor={ALERT_PROPS.DANGER.backgroundColor}>
            Transaction not found
          </Alert>
        </StyledDiv>
      )
    }
  }
  return getMessage()
}

const StyledDiv = styled.div`
  margin-top: 50px;
`

export default TxStatusSnackBar
