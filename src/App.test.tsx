import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import Client from './util/client'

jest.mock('./util/client')
window.alert = jest.fn()

test('renders the home page', () => {
  render(<App />)
  const elements = ['Create', 'Vote', 'Administrate', 'Settings', 'Unlock Wallet']
  elements.forEach((text) => {
    const element = screen.getByText(text)
    expect(element).toBeInTheDocument()
  })
})

test('navigates to Vote', () => {
  render(<App />)
  userEvent.click(screen.getByText('Vote'))
  expect(screen.getByText('Load Contract')).toBeInTheDocument()
})

test('navigates to Administrate', () => {
  render(<App />)
  userEvent.click(screen.getByText('Administrate'))
  expect(screen.getByText('Allocate Tokens')).toBeInTheDocument()
})

test('navigates to settings', () => {
  render(<App />)
  userEvent.click(screen.getByText('Settings'))
  expect(screen.getByText('Wallet Settings')).toBeInTheDocument()
})

test('unlock wallet', () => {
  window.alert.mockClear()
  Client.mockClear()
  const walletUnlock = jest.fn().mockResolvedValue(() => Promise.resolve('dummy result'))
  Client.mockImplementation(() => {
    return {
      walletUnlock: walletUnlock
    }
  })
  render(<App />)
  userEvent.click(screen.getByText('Unlock Wallet'))
  expect(walletUnlock).toHaveBeenCalledTimes(1)
})
