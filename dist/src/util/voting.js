import { Contract, Script } from 'alephium-web3';
import votingArtifact from '../artifacts/voting.ral.json';
import tokenAllocationArtifact from '../artifacts/token_allocation.ral.json';
import votingScriptArtifact from '../artifacts/voting_script.ral.json';
import closingScriptArtifact from '../artifacts/closing_script.ral.json';
export var votingContract = Contract.fromJson(votingArtifact);
export var tokenAllocationScript = Script.fromJson(tokenAllocationArtifact);
export var votingScript = Script.fromJson(votingScriptArtifact);
export var closingScript = Script.fromJson(closingScriptArtifact);
