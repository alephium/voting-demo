import { strToHexString } from './util';
import { Contract, Script } from 'alephium-web3';
import votingArtifact from '../artifacts/voting.ral.json';
import tokenAllocationArtifact from '../artifacts/token_allocation.ral.json';
import votingScriptArtifact from '../artifacts/voting_script.ral.json';
import closingScriptArtifact from '../artifacts/closing_script.ral.json';
export var votingContract = Contract.fromJson(votingArtifact);
export var tokenAllocationScript = Script.fromJson(tokenAllocationArtifact);
export var votingScript = Script.fromJson(votingScriptArtifact);
export var closingScript = Script.fromJson(closingScriptArtifact);
export function initialContractState(title, adminAddress, voters) {
    console.log(voters);
    return [
        { type: 'ByteVec', value: "" + strToHexString(title) },
        { type: 'U256', value: '0' },
        { type: 'U256', value: '0' },
        { type: 'Bool', value: false },
        { type: 'Bool', value: false },
        { type: 'Address', value: "" + adminAddress },
        { type: 'Array', value: voters.map(function (voter) { return ({ type: 'Address', value: "" + voter }); }) }
    ];
}
