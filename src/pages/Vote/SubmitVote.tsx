import { TxStatus, TxResult } from 'alephium-js/dist/api/api-alephium'
import { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../../App'
import { Container, Button } from '../../components/Common'
import TxStatusSnackBar from '../../components/TxStatusSnackBar'
import { VotingRef } from '../../util/client'
import { clearIntervalIfConfirmed, catchAndAlert } from '../../util/util'
import { createVotingScript } from '../../util/voting'

interface SubmitVoteProps {
  votingRef?: VotingRef
  contractTxId?: string
}

const SubmitVote = ({ votingRef, contractTxId }: SubmitVoteProps) => {
  const context = useContext(GlobalContext)
  const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setTxStatus(fetchedStatus)
          clearIntervalIfConfirmed(fetchedStatus, interval)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const vote = async (choice: boolean) => {
    if (votingRef && context.apiClient && contractTxId) {
      const nVoters = await context.apiClient.getNVoters(contractTxId)
      const txScript = createVotingScript(choice, votingRef, nVoters)
      catchAndAlert(context.apiClient.scriptSubmissionPipeline(txScript).then(setResult))
    }
  }
  return (
    <div>
      {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
      {!txResult && (
        <Container>
          <p>Voting title?</p>
          <Button onClick={() => vote(true)}>Yes</Button>
          <Button onClick={() => vote(false)}>No</Button>
        </Container>
      )}
    </div>
  )
}
export default SubmitVote
