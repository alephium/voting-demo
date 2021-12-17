import { screen, render, fireEvent } from '@testing-library/react'
import VoterInput from '../../components/VoterInput'

window.alert = jest.fn()
const addVoter = jest.fn()

describe('VoterInputs test that should', () => {
  beforeEach(() => {
    render(<VoterInput addVoter={addVoter} />)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('call addVoter on click', () => {
    const voters = ['foo', 'bar', 'foobar']

    const input = screen.getByPlaceholderText('Please enter the voter address')
    voters.forEach((v, index) => {
      fireEvent.change(input, { target: { value: v } })
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      expect(addVoter).toBeCalledTimes(index + 1)
      expect(addVoter).toBeCalledWith(v)
    })
  })

  it('reject empty input on click', () => {
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    expect(window.alert).toBeCalledTimes(1)
    expect(window.alert).toBeCalledWith('Please enter a valid address')
  })
})
