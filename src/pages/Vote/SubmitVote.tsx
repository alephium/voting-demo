import { TxStatus, TxResult } from 'alephium-js/dist/api/api-alephium'
import { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../../App'
import { Container, Button } from '../../components/Common'
import TxStatusSnackBar from '../../components/TxStatusSnackBar'
import { ContractRef, CONTRACTGAS } from '../../util/client'
import { TypedStatus } from '../../util/types'
import { clearIntervalIfConfirmed, catchAndAlert } from '../../util/util'
import { createVotingScript } from '../../util/voting'

interface SubmitVoteProps {
  contractRef?: ContractRef
  contractTxId?: string
  title: string
}

const SubmitVote = ({ contractRef, contractTxId, title }: SubmitVoteProps) => {
  const context = useContext(GlobalContext)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(context.cache.voteTxResult)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)

  const pollTxStatus = (interval: NodeJS.Timeout, txResult: TxResult) => {
    context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
      setTxStatus(fetchedStatus)
      setTypedStatus(fetchedStatus as TypedStatus)
      clearIntervalIfConfirmed(fetchedStatus, interval)
    })
  }

  useEffect(() => {
    if (txResult) {
      context.editCache({ voteTxResult: txResult })
      const interval = setInterval(() => {
        pollTxStatus(interval, txResult)
      }, 1000)
      pollTxStatus(interval, txResult)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const vote = async (choice: boolean) => {
    if (contractRef && context.apiClient && contractTxId) {
      const nVoters = await context.apiClient.getNVoters(contractTxId)
      const txScript = createVotingScript(choice, contractRef, nVoters)
      catchAndAlert(context.apiClient.deployScript(context.accounts[0], txScript, CONTRACTGAS).then(setResult))
    }
  }
  return (
    <div>
      {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
      {txResult?.txId && typedStatus && typedStatus.type == 'Confirmed' && (
        <Container style={{ maxWidth: '400px', textAlign: 'center', lineHeight: '1.5' }}>
          <p>Thanks for voting!</p>
          <p>Reload the contract when the administrator has closed the vote to see the results.</p>
        </Container>
      )}
      {!txResult && (
        <Container>
          <p>{title}</p>
          <Button onClick={() => vote(true)}>Yes</Button>
          <Button onClick={() => vote(false)}>No</Button>
        </Container>
      )}
    </div>
  )
}
export default SubmitVote
