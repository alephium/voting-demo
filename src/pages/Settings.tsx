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

const Settings = ({ isModalOpen, handleCloseModal }: SettingsProps) => {
  const context = useContext(GlobalContext)

  const [tmpWalletName, setTmpWalletName] = useState(context.walletName ? context.walletName : 'wallet-1')
  const [tmpPassword, setTmpPassword] = useState(context.password ? context.password : 'my-secret-password')
  const [tmpNodeHost, setTmpNodeHost] = useState(context.nodeHost ? context.nodeHost : 'http://127.0.0.1:12973')
  const [tmpExplorerURL, setTmpExplorerURL] = useState(
    context.explorerURL ? context.explorerURL : 'http://127.0.0.1:3000'
  )

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

  const handleOnClick = async (
    setGlobalWalletName: (s: string) => void,
    setGloabalPassword: (s: string) => void,
    setGlobalNodeHost: (s: string) => void,
    setGlobalExplorerURL: (s: string) => void
  ) => {
    if (isWalletNameValid(tmpWalletName) && isPasswordValid(tmpPassword)) {
      setGlobalWalletName(tmpWalletName)
      setGloabalPassword(tmpPassword)
      setGlobalNodeHost(tmpNodeHost)
      setGlobalExplorerURL(tmpExplorerURL)
    }
  }

  return (
    <GlobalContext.Consumer>
      {({ setWalletName, setPassword, nodeHost, setNodeHost, explorerURL, setExplorerURL }) => (
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
            <input placeholder={nodeHost} value={tmpNodeHost} onChange={(e) => setTmpNodeHost(e.target.value)}></input>

            <p>Explorer URL</p>
            <input
              placeholder={explorerURL}
              value={tmpExplorerURL}
              onChange={(e) => setTmpExplorerURL(e.target.value)}
            ></input>
            <Button onClick={() => handleOnClick(setWalletName, setPassword, setNodeHost, setExplorerURL)}>Save</Button>
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
