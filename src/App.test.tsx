import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the home page', () => {
  render(<App />)
  const elements = ['Create', 'Vote', 'Administrate', 'Settings', 'Unlock Wallet']
  elements.forEach((text) => {
    const element = screen.getByText(text)
    expect(element).toBeInTheDocument()
  })
})
