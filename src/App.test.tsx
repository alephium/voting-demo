import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Confirmed, ContractStateResult, TxResult, TxStatus } from 'alephium-js/dist/api/api-alephium'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import Client, { CONTRACTGAS, VotingRef } from './util/client'
import {
  allocateTokenScript,
  closeVotingScript,
  createContract,
  createVotingScript,
  initContractState
} from './util/voting'

jest.mock('./util/client')
window.alert = jest.fn()

describe('functional tests that should', () => {
  const dummyTxResult: TxResult = {
    txId: '8d01198f2ec74b1e5cfd8c8a37d6542d16ee692df47700ce2293e0a22b6d4c22',
    fromGroup: 0,
    toGroup: 0
  }
  const dummyConfirmed: Confirmed = {
    blockHash: '929102',
    txIndex: 0,
    chainConfirmations: 0,
    fromGroupConfirmations: 0,
    toGroupConfirmations: 0
  }

  const dummyTxStatus: TxStatus = {
    type: 'confirmed',
    ...dummyConfirmed
  }
  const dummyVotingRef = {
    contractAddress: dummyTxResult.txId,
    tokenId: '109b05391a240a0d21671720f62fe39138aaca562676053900b348a51e11ba25'
  }
  const adminAddress = '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH'
  const voters = [
    '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH',
    '2DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH',
    '3DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH'
  ]
  const nVoters = voters.length

  beforeEach(() => {
    jest.useFakeTimers()
    window.alert.mockClear()
    Client.prototype.walletUnlock = jest.fn().mockResolvedValue(Promise.resolve())
    Client.prototype.scriptSubmissionPipeline = jest.fn().mockResolvedValue(Promise.resolve<TxResult>(dummyTxResult))
    Client.prototype.contractSubmissionPipeline = jest.fn().mockResolvedValue(Promise.resolve<TxResult>(dummyTxResult))
    Client.prototype.getTxStatus = jest.fn().mockResolvedValue(Promise.resolve(dummyTxStatus))
    Client.prototype.getVotingMetaData = jest.fn().mockResolvedValue(Promise.resolve<VotingRef>(dummyVotingRef))
    Client.prototype.getNVoters = jest.fn().mockResolvedValue(Promise.resolve(nVoters))
  })

  afterEach(() => {
    // Running all pending timers and switching to real timers using Jest
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.resetModules()
  })

  describe('open the create page and', () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      )
    })

    it('render the page', () => {
      const elements = ['Create', 'Vote', 'Administrate', 'Settings', 'Unlock Wallet']
      elements.forEach((text) => {
        const element = screen.getByText(text)
        expect(element).toBeInTheDocument()
      })
    })

    it('navigate correctly', () => {
      fireEvent.click(screen.getByText('Vote'))
      expect(screen.getByText('Load Contract')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Administrate'))
      expect(screen.getByText('Allocate Tokens')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Settings'))
      expect(screen.getByText('Wallet SettingsPage')).toBeInTheDocument()
    })

    it('unlock the wallet', () => {
      fireEvent.click(screen.getByText('Unlock Wallet'))
      expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1)
    })

    it('deploy the voting contract', async () => {
      const adminInput = screen.queryByTestId('adminAddressInput') as HTMLElement
      const voterInput = screen.queryByTestId('voterAddressInput') as HTMLElement
      const addVoterBtn = screen.queryByTestId('addVoterBtn') as HTMLElement
      const submitVotersBtn = screen.queryByTestId('submitVotersBtn') as HTMLElement

      fireEvent.click(screen.getByText('Unlock Wallet'))
      await waitFor(() => expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1))
      fireEvent.change(adminInput, { target: { value: adminAddress } })
      voters.forEach((voter) => {
        fireEvent.change(voterInput, { target: { value: voter } })
        fireEvent.click(addVoterBtn)
      })
      fireEvent.click(submitVotersBtn)
      await waitFor(() => {
        expect(Client.prototype.contractSubmissionPipeline).toHaveBeenCalledWith(
          createContract(voters.length),
          CONTRACTGAS,
          initContractState(adminAddress, voters),
          voters.length.toString()
        )
        expect(Client.prototype.contractSubmissionPipeline).toHaveBeenCalledTimes(1)
        expect(Client.prototype.getTxStatus).toHaveBeenCalledTimes(1)
        expect(screen.getByText('confirmed !')).toBeInTheDocument()
      })
      fireEvent.click(screen.getByText('here'))
      const closeVotingBtn = screen.getByTestId('closeVotingBtn') as HTMLElement
      await (() => expect(closeVotingBtn).toBeInTheDocument())
    })
  })

  describe('open the voting page and', () => {
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={['/vote']}>
          <App />
        </MemoryRouter>
      )
    })

    it('deploy the voting script', async () => {
      Client.prototype.getContractState = jest.fn().mockResolvedValue(
        Promise.resolve<ContractStateResult>({
          fields: [
            { value: '0' },
            { value: '0' },
            { value: false },
            { value: true },
            { value: adminAddress },
            { value: voters[0] },
            { value: voters[1] },
            { value: voters[2] }
          ]
        })
      )

      fireEvent.click(screen.getByText('Unlock Wallet'))
      await waitFor(() => expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1))
      const txInput = screen.queryByTestId('votingTxInput') as HTMLElement
      fireEvent.change(txInput, { target: { value: dummyTxResult.txId } })
      const loadBtn = screen.queryByTestId('loadContractBtn') as HTMLElement
      fireEvent.click(loadBtn)
      await waitFor(() => expect(screen.queryByTestId('voteYesBtn') as HTMLElement).toBeInTheDocument())
      fireEvent.click(screen.queryByTestId('voteYesBtn') as HTMLElement)
      await waitFor(() => {
        expect(Client.prototype.scriptSubmissionPipeline).toHaveBeenCalledWith(
          createVotingScript(true, dummyVotingRef, nVoters)
        )
        expect(Client.prototype.scriptSubmissionPipeline).toHaveBeenCalledTimes(1)
        expect(screen.getByText('confirmed !')).toBeInTheDocument()
      })
    })

    it('show the voting results', async () => {
      Client.prototype.getContractState = jest.fn().mockResolvedValue(
        Promise.resolve<ContractStateResult>({
          fields: [
            { value: '1' },
            { value: '1' },
            { value: true },
            { value: true },
            { value: adminAddress },
            { value: voters[0] },
            { value: voters[1] },
            { value: voters[2] }
          ]
        })
      )

      fireEvent.click(screen.getByText('Unlock Wallet'))
      await waitFor(() => expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1))
      const txInput = screen.queryByTestId('votingTxInput') as HTMLElement
      fireEvent.change(txInput, { target: { value: dummyTxResult.txId } })
      const loadBtn = screen.queryByTestId('loadContractBtn') as HTMLElement
      fireEvent.click(loadBtn)
      await waitFor(() => {
        expect(screen.getByText('Yes: 1')).toBeInTheDocument()
        expect(screen.getByText('No: 1')).toBeInTheDocument()
      })
    })
  })

  describe('open the administrate page and', () => {
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={['/administrate']}>
          <App />
        </MemoryRouter>
      )
    })

    it('allocate tokens', async () => {
      Client.prototype.getContractState = jest.fn().mockResolvedValue(
        Promise.resolve<ContractStateResult>({
          fields: [
            { value: '1' },
            { value: '1' },
            { value: true },
            { value: false },
            { value: adminAddress },
            { value: voters[0] },
            { value: voters[1] },
            { value: voters[2] }
          ]
        })
      )

      fireEvent.click(screen.getByText('Unlock Wallet'))
      await waitFor(() => expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1))
      const allocationBtn = screen.queryByTestId('allocateTokensBtn') as HTMLElement
      fireEvent.click(allocationBtn)
      await waitFor(() => {
        expect(Client.prototype.scriptSubmissionPipeline).toHaveBeenCalledWith(
          allocateTokenScript(dummyVotingRef, nVoters)
        )
        expect(screen.getByText('confirmed !')).toBeInTheDocument()
        expect(screen.getByText('link')).toBeInTheDocument()
      })
      fireEvent.click(screen.getByText('link'))
      const loadContractBtn = screen.getByTestId('loadContractBtn') as HTMLElement
      await waitFor(() => expect(loadContractBtn).toBeInTheDocument())
    })

    it('close voting', async () => {
      Client.prototype.getContractState = jest.fn().mockResolvedValue(
        Promise.resolve<ContractStateResult>({
          fields: [
            { value: '1' },
            { value: '1' },
            { value: false },
            { value: true },
            { value: adminAddress },
            { value: voters[0] },
            { value: voters[1] },
            { value: voters[2] }
          ]
        })
      )

      fireEvent.click(screen.getByText('Unlock Wallet'))
      await waitFor(() => expect(Client.prototype.walletUnlock).toHaveBeenCalledTimes(1))
      const txInput = screen.queryByTestId('closingTxInput') as HTMLElement
      fireEvent.change(txInput, { target: { value: dummyTxResult.txId } })
      const closeBtn = screen.queryByTestId('closeVotingBtn') as HTMLElement
      fireEvent.click(closeBtn)
      await waitFor(() => {
        expect(Client.prototype.getVotingMetaData).toHaveBeenCalledWith(dummyTxResult.txId)
        expect(Client.prototype.scriptSubmissionPipeline).toHaveBeenCalledWith(
          closeVotingScript(dummyVotingRef, nVoters)
        )
        expect(screen.getByText('confirmed !')).toBeInTheDocument()
      })
    })
  })
})
