import { useState } from 'react'
import { Container, Button } from '../components/Common'
import { Input } from '../components/Inputs'
import { useContext } from 'react'
import { GlobalContext } from '../App'
import { createContract, initContractState } from '../util/voting'
import { CONTRACTGAS } from '../util/client'
import { useEffect } from 'react'
import { TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import addressToGroup from 'alephium-js/dist/lib/address'
import { NavLink } from 'react-router-dom'
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util'
import { Address, TypedStatus } from '../util/types'
import VotersTable from '../components/VotersTable'
import VoterInput from '../components/VoterInput'
import { TxStatusSnackBar } from '../components/TxStatusSnackBar'
const totalNumberOfGroups = 4

export const Create = () => {
  const [voters, setVoters] = useState<Address[]>([])
  const [admin, setAdmin] = useState<Address | undefined>(undefined)
  const [txResult, setResult] = useState<TxResult | undefined>(undefined)
  const [txStatus, setStatus] = useState<TxStatus | undefined>(undefined)
  const [typedStatus, setTypedStatus] = useState<TypedStatus | undefined>(undefined)

  const context = useContext(GlobalContext)

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
    console.log(voter)
    if (!voters.map((voter) => voter.address).includes(voter)) {
      setVoters([...voters, addressFromString(voter)])
    }
  }

  const removeVoter = (voter: string) => {
    const newVoters = voters.filter((address) => voter != address.address)
    setVoters(newVoters)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (txResult) {
        context.apiClient?.getTxStatus(txResult?.txId).then((fetchedStatus) => {
          setStatus(fetchedStatus)
          const status = fetchedStatus as TypedStatus
          setTypedStatus(status)
          if (clearIntervalIfConfirmed(fetchedStatus, interval)) {
            context.setCurrentContractId(txResult.txId)
          }
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txResult])

  const submit = async () => {
    if (context.apiClient) {
      if (admin == undefined) {
        console.log('Please Provide an administrator address')
        return Promise.resolve()
      } else {
        const result = await context.apiClient.contractSubmissionPipeline(
          createContract(voters.length),
          CONTRACTGAS,
          initContractState(
            admin?.address,
            voters.map((voter) => voter.address)
          ),
          voters.length.toString()
        )
        if (result) {
          setResult(result)
        }
      }
    }
  }

  return (
    <div>
      <div>
        {txStatus && txResult?.txId && <TxStatusSnackBar txStatus={txStatus} txId={txResult.txId} />}
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
          <h2>
            <label htmlFor="admin-address">Administrator Address</label>
          </h2>
          <Input
            id="admin-address"
            placeholder="Please enter the administrator address"
            value={admin != undefined ? admin.address : ''}
            onChange={(e) => updateAdmin(e.target.value)}
          />
          <span style={{ marginLeft: '10px', marginTop: '10px' }}>
            {admin !== undefined && admin.address !== '' && 'Group: ' + admin.group}
          </span>
          <h2>Voters</h2>
          <VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />
          <VoterInput addVoter={addVoter} />
          <Button onClick={() => catchAndAlert(submit())}>Submit</Button>
        </Container>
      )}
    </div>
  )
}

export default Create
