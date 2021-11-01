import { VotingRef } from './client'
export function createContract(nVoters: number): string {
  const voters: string[] = []
  for (let i = 0; i < nVoters; i++) {
    voters[i] = `voter${i}: Address`
  }
  const votersVariables = voters.join(', ')
  return `TxContract Voting(mut yes: U256, mut no: U256, mut isClosed: Bool, mut initialized: Bool, owner: Address, ${votersVariables}) {
        pub payable fn allocateTokens() -> () {
           assert!(initialized == false)
           assert!(txCaller!(txCallerSize!() - 1) == owner)
           ${voters.map((voter) => `transferTokenFromSelf!(${voter.split(':')[0]}, selfTokenId!(), 1)`).join('\n')}
           initialized = true
        }

         pub payable fn vote(choice: Bool, voter: Address) -> () {
            assert!(isClosed == false)
            transferTokenToSelf!(voter, selfTokenId!(), 1)
            if (choice == true) {
               yes = yes + 1
            } else {
               no = no + 1
            }
         }

         pub payable fn yes(voter: Address) -> () {
           approveToken!(voter, selfTokenId!(), 1)
           vote(true, voter)
         }

         pub payable fn no(voter: Address) -> () {
           approveToken!(voter, selfTokenId!(), 1)
           vote(false, voter)
         }

         pub fn close() -> () {
           assert!(isClosed == false)
           assert!(txCaller!(txCallerSize!() - 1) == owner)
           isClosed = true
         }
       }
       `
}

export function createVotingScript(choice: boolean, votingRef: VotingRef, nVoters: number): string {
  return `TxScript VotingScript {
      pub payable fn main() -> () {
        let caller = txCaller!(txCallerSize!() - 1)
        approveToken!(caller, #${votingRef.tokenId}, 1)
        let voting = Voting(#${votingRef.tokenId})
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
      voting.allocateTokens()
    }
  }
  ${createContract(nVoters)}
  `
}

export function closeVotingScript(votingRef: VotingRef, nVoters: number): string {
  return `TxScript TokenAllocation {
    pub payable fn main() -> () {
      let voting = Voting(#${votingRef.tokenId})
      voting.close()
    }
  }
  ${createContract(nVoters)}
  `
}
