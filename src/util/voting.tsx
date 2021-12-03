import { VotingRef } from './client'

const utxoFee = '50000000000000'
export function createContract(nVoters: number): string {
  const votersTransfers: string[] = []
  for (let i = 0; i < nVoters; i++) {
    votersTransfers.push(`transferAlph!(admin, voters[${i}], ${utxoFee})`)
    votersTransfers.push(`transferTokenFromSelf!(voters[${i}], selfTokenId!(), 1)`)
  }
  return `
   TxContract Voting(
     mut yes: U256,
     mut no: U256,
     mut isClosed: Bool,
     mut initialized: Bool,
     admin: Address,
     voters: [Address; ${nVoters}]
   ) {
     pub payable fn allocateTokens() -> () {
        assert!(initialized == false)
        assert!(txCaller!(txCallerSize!() - 1) == admin)
        ${votersTransfers.join('\n')}
        yes = 0
        no = 0
        initialized = true
     }

     pub payable fn vote(choice: Bool, voter: Address) -> () {
       assert!(initialized == true && isClosed == false)
       transferAlph!(voter, admin, ${utxoFee})
       transferTokenToSelf!(voter, selfTokenId!(), 1)
       if (choice == true) {
          yes = yes + 1
       } else {
          no = no + 1
       }
     }

      pub fn close() -> () {
        assert!(initialized == true && isClosed == false)
        assert!(txCaller!(txCallerSize!() - 1) == admin)
        isClosed = true
      }
    }`
}

export function createVotingScript(choice: boolean, votingRef: VotingRef, nVoters: number): string {
  return `TxScript VotingScript {
      pub payable fn main() -> () {
        let caller = txCaller!(txCallerSize!() - 1)
        approveToken!(caller, #${votingRef.tokenId}, 1)
        let voting = Voting(#${votingRef.tokenId})
        approveAlph!(caller, ${utxoFee})
        voting.vote(${choice}, caller)
      }
    }
    ${createContract(nVoters)}
    `
}

export function allocateTokenScript(votingRef: VotingRef, nVoters: number): string {
  return `TxScript TokenAllocation {
    pub payable fn main() -> () {
      let voting = Voting(#${votingRef.tokenId})
      let caller = txCaller!(txCallerSize!() - 1)
      approveAlph!(caller, ${utxoFee} * ${nVoters})
      voting.allocateTokens()
    }
  }
  ${createContract(nVoters)}
  `
}

export function closeVotingScript(votingRef: VotingRef, nVoters: number): string {
  return `TxScript ClosingScript {
    pub payable fn main() -> () {
      let voting = Voting(#${votingRef.tokenId})
      voting.close()
    }
  }
  ${createContract(nVoters)}
  `
}
