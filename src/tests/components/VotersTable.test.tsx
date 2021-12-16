import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { useState } from 'react'
import VotersTable from '../../components/VotersTable'
import { Address } from '../../util/types'

describe('VotersTable component should', () => {
  it('display voters correctly', () => {
    const voters = [
      { address: 'foo', group: 0 },
      { address: 'bar', group: 0 },
      { address: 'foobar', group: 0 }
    ]
    const admin = voters[0]
    const removeVoter = jest.fn()
    render(<VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />)
    const removeButtons = screen.getAllByRole('button', { name: '\u274C' })
    expect(removeButtons.length).toBe(voters.length)
    voters.forEach((v, index) => {
      fireEvent.click(removeButtons[index])
      expect(screen.getByText(v.address)).toBeInTheDocument()
      expect(removeVoter).toHaveBeenLastCalledWith(v.address)
    })
  })

  it('should be blank when voters list is empty', () => {
    const voters: Address[] = []
    const admin = { address: 'foo', group: 0 }
    const removeVoter = jest.fn()
    const { container } = render(<VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />)
    expect(container.childElementCount).toBe(0)
  })

  it('remove voters correctly', () => {
    const voters = [
      { address: 'foo', group: 0 },
      { address: 'bar', group: 0 },
      { address: 'foobar', group: 0 }
    ]
    const admin = voters[0]
    const removeVoter = jest.fn()
    render(<VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />)
    const removeButtons = screen.getAllByRole('button', { name: '\u274C' })
    voters.forEach((v, index) => {
      fireEvent.click(removeButtons[index])
      expect(removeVoter).toHaveBeenLastCalledWith(v.address)
    })
  })

  it('detect invalid group', () => {
    let voters = [
      { address: 'foo', group: 0 },
      { address: 'bar', group: 1 }
    ]
    const admin = voters[0]
    const removeVoter = jest.fn()
    render(<VotersTable voters={voters} removeVoter={removeVoter} admin={admin} />)
    screen.getByText(`Voters addresses should be in the administrator address Group ${admin.group}`)
  })
})
