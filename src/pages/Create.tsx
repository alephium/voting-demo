import { ChangeEvent, useState } from 'react'
import { Container, Button } from '../components/Common'
import styled from 'styled-components'
import { useContext } from 'react'
import { GlobalContext } from '../App'
import { createContract } from '../util/voting'
import { CONTRACTGAS } from '../util/client'
import { useEffect } from 'react'
import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import { NavLink } from 'react-router-dom'
import { catchAndAlert } from '../util/util'

interface TxStatusSnackbar {
  txStatus: TxStatus
  txId: string
}
export interface TypedStatus {
  type: string
  blockHash?: string
  txIndex?: number
  chainConfirmations?: number
  fromGroupConfirmations?: number
  toGroupConfirmations?: number
}

export const SnackBar = ({ txStatus, txId }: TxStatusSnackbar) => {
  const context = useContext(GlobalContext)
  const status = txStatus as TypedStatus
  const getMessage = () => {
    if (!(txStatus && txId)) {
      return null
    } else if (status.type === 'confirmed') {
      return (
        <div>
          <SnackBarDiv style={{ backgroundColor: 'lightgreen' }}>
            <p>
              <a
                href={`${context.settings.explorerURL}/#/transactions/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Transaction{' '}
              </a>
              confirmed !
            </p>
          </SnackBarDiv>
        </div>
      )
    } else if (status.type === 'mem-pooled') {
      return (
        <SnackBarDiv style={{ backgroundColor: 'lightyellow' }}>
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
        </SnackBarDiv>
      )
    } else {
      return <SnackBarDiv>Transaction not found</SnackBarDiv>
    }
  }
  return getMessage()
}
export const Create = () => {
  const [voters, setVoters] = useState<string[]>([])
  const [admin, setAdmin] = useState<string>('')
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  const [txStatus, setStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)

  const context = useContext(GlobalContext)
  const addVoter = (voter: string) => {
    console.log(voter)
    if (!voters.includes(voter)) {
      setVoters([...voters, voter])
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setStatus(fetchedStatus)
          const status = fetchedStatus as TypedStatus
          setTypedStatus(status)
          if (status.type == 'confirmed') {
            context.setCurrentContractId(txResult.txId)
            clearInterval(interval)
          }
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const submit = async () => {
    if (context.apiClient) {
      const result = await context.apiClient.contractSubmissionPipeline(
        createContract(voters.length),
        CONTRACTGAS,
        `[ 0, 0, false, false, @${await context.apiClient.getActiveAddress()},[${voters
          .map((voter) => `@${voter}`)
          .join(', ')}]]`,
        voters.length.toString()
      )
      if (result) {
        setResult(result)
      }
    }
  }

  return (
    <div>
      <div>
        {txStatus && txResult?.txId && <SnackBar txStatus={txStatus} txId={txResult.txId} />}
        {txResult?.txId && typedStatus && typedStatus.type == 'confirmed' && (
          <Container>
            <div style={{ flexDirection: 'row' }}>
              Click <NavLink to={`/administrate/${txResult.txId}`}>here </NavLink>to allocate the tokens to the voters.
            </div>
          </Container>
        )}
      </div>
      {!txResult && (
        <Container>
          <p>Administrator Address</p>
          <input
            placeholder="T1BYxbazdyYqzMm7yp6VQTPXuQmrTnguLBuVNoAaLM44sZ"
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
          ></input>
          <p>Voters</p>
          <ul>
            {voters.map((voter, index) => (
              <li key={index}>{voter}</li>
            ))}
          </ul>
          <VoterInput addVoter={addVoter} />
          <Button onClick={() => catchAndAlert(submit())}>Submit</Button>
        </Container>
      )}
    </div>
  )
}

interface VoterInputProps {
  addVoter: (voter: string) => void
}

const VoterInput = ({ addVoter }: VoterInputProps) => {
  const [voter, setVoter] = useState('')
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoter(e.target.value)
  }

  const isAddressValid = (address: string) => {
    if (address !== '') {
      return true
    } else {
      return false
    }
  }

  const handleOnClick = () => {
    if (isAddressValid(voter)) {
      addVoter(voter)
      setVoter('')
    } else {
      alert('Please enter a valid address')
    }
  }

  return (
    <VoterInputDiv>
      <input placeholder="Enter voter address" onChange={handleOnChange} value={voter}></input>
      <Button onClick={() => handleOnClick()}>+</Button>
    </VoterInputDiv>
  )
}

export const VoterInputDiv = styled.div`
  display: flex;
  flex-direction: column;
`
export const SnackBarDiv = styled.div`
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
export default Create
