import { useState, useContext } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { Button, Container } from '../components/Common'
import { Input } from '../components/Inputs'
import { GlobalContext } from '../App'
import { Settings } from '../util/settings'

interface SettingsPageProps {
  isModalOpen: boolean
  handleCloseModal: () => void
}

const SettingsPage = ({ isModalOpen, handleCloseModal }: SettingsPageProps) => {
  const { settings, setSettings } = useContext(GlobalContext)

  const [tempSettings, setTempSettings] = useState<Settings>({
    walletName: settings.walletName,
    password: settings.password,
    nodeHost: settings.nodeHost,
    explorerURL: settings.explorerURL
  })

  const isWalletNameValid = (walletName: string) => {
    if (walletName !== '') {
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

  const handleOnClick = () => {
    if (isWalletNameValid(tempSettings.walletName) && isPasswordValid(tempSettings.password)) {
      setSettings(tempSettings)
    }
  }

  const editSettings = (partial: Partial<Settings>) => {
    const newSettings = { ...tempSettings, ...partial }
    setTempSettings(newSettings)
  }

  return (
    <Modal
      isOpen={isModalOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      <Container>
        <h1>Wallet SettingsPage</h1>

        <label htmlFor="walletName">Wallet Name</label>
        <Input
          id="walletName"
          placeholder="my wallet"
          value={tempSettings.walletName}
          onChange={(e) => editSettings({ walletName: e.target.value })}
        />

        <label htmlFor="walletPassword">Wallet password</label>
        <Input
          id="walletPassword"
          type="password"
          placeholder="my-secret-password"
          value={tempSettings.password}
          onChange={(e) => editSettings({ password: e.target.value })}
        />

        <label htmlFor="nodeHost">Node Address</label>
        <Input
          id="nodeHost"
          placeholder={tempSettings.nodeHost}
          value={tempSettings.nodeHost}
          onChange={(e) => editSettings({ nodeHost: e.target.value })}
        />

        <label htmlFor="explorerUrl">Explorer URL</label>
        <Input
          id="explorerUrl"
          placeholder={tempSettings.explorerURL}
          value={tempSettings.explorerURL}
          onChange={(e) => editSettings({ explorerURL: e.target.value })}
        />
        <Button onClick={() => handleOnClick()}>Save</Button>
      </Container>
    </Modal>
  )
}

const Modal = styled(ReactModal)`
  width: 500px;
  margin: auto;
  font-family: Arial;
`

export default SettingsPage
