import { ContractRef } from './client'
import { strToHexString } from './util'
import { node, Contract, Script } from 'alephium-web3'

import votingArtifact from '../artifacts/voting.ral.json'
import tokenAllocationArtifact from '../artifacts/token_allocation.ral.json'
import votingScriptArtifact from '../artifacts/voting_script.ral.json'
import closingScriptArtifact from '../artifacts/closing_script.ral.json'

export const votingContract = Contract.fromJson(votingArtifact)
export const tokenAllocationScript = Script.fromJson(tokenAllocationArtifact)
export const votingScript = Script.fromJson(votingScriptArtifact)
export const closingScript = Script.fromJson(closingScriptArtifact)
