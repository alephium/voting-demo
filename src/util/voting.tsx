import { Val } from 'alephium-web3/dist/api/api-alephium'
import { ContractRef } from './client'
import { strToHexString } from './util'
import { Contract, Script } from 'alephium-web3'

import votingArtifact from '../artifacts/voting.ral.json'
import tokenAllocationArtifact from '../artifacts/token_allocation.ral.json'
import votingScriptArtifact from '../artifacts/voting_script.ral.json'
import closingScriptArtifact from '../artifacts/closing_script.ral.json'

export const votingContract = Contract.fromJson(votingArtifact)
export const tokenAllocationScript = Script.fromJson(tokenAllocationArtifact)
export const votingScript = Script.fromJson(votingScriptArtifact)
export const closingScript = Script.fromJson(closingScriptArtifact)

export function initialContractState(title: string, adminAddress: string, voters: string[]): Val[] {
  console.log(voters)
  return [
    { type: 'ByteVec', value: `${strToHexString(title)}` },
    { type: 'U256', value: '0' },
    { type: 'U256', value: '0' },
    { type: 'Bool', value: false },
    { type: 'Bool', value: false },
    { type: 'Address', value: `${adminAddress}` },
    { type: 'Array', value: voters.map((voter) => ({ type: 'Address', value: `${voter}` })) }
  ]
}
