import React, { useState } from 'react'
import { Container, Button } from '../components/Common'
import { Input } from '../components/Inputs'
import { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../App'
import { SignContractCreationTxResult, SignResult, stringToHex } from 'alephium-web3'
import { votingContract } from '../util/voting'
import { useEffect } from 'react'
import { node } from 'alephium-web3'
import { addressToGroup } from 'alephium-web3'
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
  const [txResult, setResult] = useState<SignContractCreationTxResult | undefined>(context.cache.createTxResult)
  const [txStatus, setStatus] = useState<node.TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  const pollTxStatus = (interval: NodeJS.Timeout, txResult: SignResult) => {
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
        console.log(`======== params0 ${JSON.stringify(context.accounts)}`)
        console.log(`======== ${JSON.stringify(votingContract)}`)
        const params = await votingContract.paramsForDeployment({
          signerAddress: context.accounts[0].address,
          initialFields: [stringToHex(title), 0, 0, false, false, admin?.address, voters.map((voter) => voter.address)],
          issueTokenAmount: voters.length
        })
        console.log(`======== params1, ${JSON.stringify(params)}`)
        const result = await context.apiClient.provider.signContractCreationTx(params)
        if (result) {
          setResult(result)
        }
        console.log(`======= ${JSON.stringify(result)}`)
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
      {txResult?.txId && typedStatus && typedStatus.type == 'Confirmed' && (
        <>
          <Button>
            <NavLink to={`/administrate/${txResult.txId}`}>Allocate voting tokens</NavLink>
          </Button>
          <Button onClick={clear}>Create another poll</Button>
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
