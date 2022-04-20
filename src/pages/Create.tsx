import { useState } from 'react'
import { Container, Button } from '../components/Common'
import { Input } from '../components/Inputs'
import { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../App'
import { createContract, initialContractState } from '../util/voting'
import { CONTRACTGAS } from '../util/client'
import { useEffect } from 'react'
import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import { addressToGroup } from 'alephium-js/dist/lib/address'
import { NavLink } from 'react-router-dom'
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util'
import { Address, emptyCache, TypedStatus } from '../util/types'
import VotersTable from '../components/VotersTable'
import VoterInput from '../components/VoterInput'
import { TxStatusSnackBar } from '../components/TxStatusSnackBar'
const totalNumberOfGroups = 4

const AddressInput = styled.div`
  display: flex;
`

const AddressGroup = styled.div`
  color: rgba(0, 0, 0, 0.9);
  font-weight: 700;
  margin: 1rem 0rem 1rem 0rem;
  border-radius: 12px;
  width: 3.7rem;
  height: 3.2rem;
  text-align: center;
  line-height: 3.2rem;
`

export const Create = () => {
  const context = useContext(GlobalContext)
  const [voters, setVoters] = useState<Address[]>([])
  const [admin, setAdmin] = useState<Address | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(context.cache.createTxResult)
  const [txStatus, setStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState('')

  function addressFromString(address: string): Address {
    const group = addressToGroup(address, totalNumberOfGroups)
    return { address, group }
  }

  const updateAdmin = (address: string) => {
    if (address != '') {
      setAdmin(addressFromString(address))
    } else {
      setAdmin(undefined)
    }
  }

  const addVoter = (voter: string) => {
    if (!voters.map((voter) => voter.address).includes(voter)) {
      setVoters([...voters, addressFromString(voter)])
    }
  }

  const removeVoter = (voter: string) => {
    const newVoters = voters.filter((address) => voter != address.address)
    setVoters(newVoters)
  }

  const pollTxStatus = (interval: NodeJS.Timeout, txResult: TxResult) => {
    context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
      setStatus(fetchedStatus)
      const status = fetchedStatus as TypedStatus
      setTypedStatus(status)
      if (clearIntervalIfConfirmed(fetchedStatus, interval)) {
        context.editCache({ currentContractId: txResult.txId })
      }
    })
  }

  useEffect(() => {
    if (txResult) {
      context.editCache({
        createTxResult: txResult
      })
      const interval = setInterval(() => {
        pollTxStatus(interval, txResult)
      }, 1000)
      pollTxStatus(interval, txResult)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const clear = () => {
    context.editCache(emptyCache())
    setVoters([])
    setAdmin(undefined)
    setTitle('')
    setResult(undefined)
    setStatus(undefined)
    setTypedStatus(undefined)
  }

  const submit = async () => {
    if (context.apiClient) {
      if (title == '') {
        return Promise.reject('Please provide a title')
      } else if (admin == undefined) {
        return Promise.reject('Please Provide an administrator address')
      } else {
        setIsLoading(true)
        const result = await context.apiClient.deployContract(
          context.accounts[0],
          createContract(voters.length),
          CONTRACTGAS,
          initialContractState(
            title,
            admin?.address,
            voters.map((voter) => voter.address)
          ),
          voters.length.toString()
        )
        if (result) {
          setContractAddress(result.contractAddress)
          setResult(result)
        }
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
      {txResult?.txId && typedStatus && typedStatus.type == 'Confirmed' && (
        <>
          <Container>
            <div style={{ flexDirection: 'row' }}>
              Click <NavLink to={`/administrate/${txResult.txId}`}>here</NavLink> to allocate the tokens to the voters.
            </div>
          </Container>
          <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'center' }}>{contractAddress}</div>
          <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'center' }}>
            <Button onClick={clear}>Create a new voting contract</Button>
          </div>
        </>
      )}
      {!txResult && (
        <Container>
          <Input
            id="voting-title"
            placeholder="Subject to vote on"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <AddressInput>
            <Input
              id="admin-address"
              placeholder="The administrator address"
              value={admin != undefined ? admin.address : ''}
              onChange={(e) => updateAdmin(e.target.value)}
            />
            <AddressGroup>{admin !== undefined && admin.address !== '' && 'G' + admin.group}</AddressGroup>
          </AddressInput>
          <VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />
          <VoterInput addVoter={addVoter} />
          <Button onClick={() => catchAndAlert(submit())}>Create</Button>
          {isLoading && <div>Waiting for wallet response...</div>}
        </Container>
      )}
    </>
  )
}

export default Create
