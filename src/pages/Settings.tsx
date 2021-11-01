import { useState, useContext } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { Button, Container } from '../components/Common'
import { GlobalContext } from '../App'
import Client from '../util/client'
import { useEffect } from 'react'

interface SettingsProps {
  isModalOpen: boolean
  handleCloseModal: () => void
}

ReactModal.setAppElement('#root')

const Settings = ({ isModalOpen, handleCloseModal }: SettingsProps) => {
  const context = useContext(GlobalContext)
  const [tmpWalletName, setTmpWalletName] = useState('wallet-1')
  const [tmpPassword, setTmpPassword] = useState('my-secret-password')

  const unlockWallet = () => {
    context.setApiClient(new Client('http://localhost:12973', tmpWalletName, tmpPassword))
  }

  useEffect(() => {
    if (context.apiClient) {
      context.apiClient.walletUnlock().then(() => alert('Wallet succesfully unlocked!'))
    }
  }, [context.apiClient])

  const isWalletNameValid = (address: string) => {
    //TODO: Check address format
    if (address !== '') {
      return true
    } else {
      return false
    }
  }

  const isPasswordValid = (password: string) => {
    if (password !== '') {
      return true
    } else {
      return false
    }
  }

  const handleOnClick = async (setGlobalWalletName: (s: string) => void, setGloabalPassword: (s: string) => void) => {
    if (isWalletNameValid(tmpWalletName) && isPasswordValid(tmpPassword)) {
      setGlobalWalletName(tmpWalletName)
      setGloabalPassword(tmpPassword)
      console.log('Try to unlock wallet')
      unlockWallet()
    }
  }

  return (
    <GlobalContext.Consumer>
      {({ walletName, setWalletName, password, setPassword, apiClient, setApiClient }) => (
        <Modal
          isOpen={isModalOpen}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
          onRequestClose={handleCloseModal}
        >
          <Container>
            <h1>Wallet Settings</h1>
            <p>Wallet Name</p>
            <input
              placeholder="my wallet"
              value={tmpWalletName}
              onChange={(e) => setTmpWalletName(e.target.value)}
            ></input>
            <p>Wallet password</p>
            <input
              type="password"
              placeholder="my-secret-password"
              value={tmpPassword}
              onChange={(e) => setTmpPassword(e.target.value)}
            ></input>

            <p>Node Address</p>
            <input placeholder="http://localhost:12973"></input>
            <Button onClick={() => handleOnClick(setWalletName, setPassword)}>Unlock wallet</Button>
          </Container>
        </Modal>
      )}
    </GlobalContext.Consumer>
  )
}

const Modal = styled(ReactModal)`
  width: 500px;
  margin: auto;
  font-family: Arial;
`

export default Settings
