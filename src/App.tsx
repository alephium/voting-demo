import React, { useState } from 'react'
import logo from './images/alephium-logo-gradient-stroke.svg'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Create from './pages/Create'
import LoadVote from './pages/Vote'
import CloseVote from './pages/Close'
import { Button, Container } from './components/Common'
import { walletOpen, getStorage, Wallet } from 'alephium-js'

ReactModal.setAppElement('#root')

const SubmitVote = () => {
  return (
    <Container>
      <p>Voting title?</p>
      <Button>Yes</Button>
      <Button>No</Button>
    </Container>
  )
}

interface Context {
  walletName: string
  setWalletName: (w: string) => void
  password: string
  setPassword: (p: string) => void
  wallet?: Wallet
  setWallet: (w: Wallet | undefined) => void
}

const initialContext: Context = {
  walletName: '',
  setWalletName: () => null,
  password: '',
  setPassword: () => null,
  wallet: undefined,
  setWallet: () => null
}

interface SettingsProps {
  isModalOpen: boolean
  handleCloseModal: () => void
}

const Settings = ({ isModalOpen, handleCloseModal }: SettingsProps) => {
  const [tmpWalletName, setTmpWalletName] = useState('')
  const [tmpPassword, setTmpPassword] = useState('')
  const [tmpWallet, setTmpWallet] = useState(undefined)

  const isWalletNameValid = (address: string) => {
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
    setGlobalWallet: (w: Wallet | undefined) => void
  ) => {
    if (isWalletNameValid(tmpWalletName) && isPasswordValid(tmpPassword)) {
      setGlobalWalletName(tmpWalletName)
      setGloabalPassword(tmpPassword)
      console.log('try to connect')
      const walletEncrypted = Storage.load(tmpWalletName)
      const plainWallet = await walletOpen(tmpPassword, walletEncrypted)

      if (plainWallet) {
        setGlobalWallet(plainWallet)
      }
    }
  }

  return (
    <GlobalContext.Consumer>
      {({ walletName, setWalletName, password, setPassword, wallet, setWallet }) => (
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
              placeholder="my-secret-password"
              value={tmpPassword}
              onChange={(e) => setTmpPassword(e.target.value)}
            ></input>
            <p>Node Address</p>
            <input placeholder="http://localhost:12973"></input>
            <Button onClick={() => handleOnClick(setWalletName, setPassword, setWallet)}>Connect wallet</Button>
          </Container>
        </Modal>
      )}
    </GlobalContext.Consumer>
  )
}

const GlobalContext = React.createContext<Context>(initialContext)
const Storage = getStorage()

const App = () => {
  const [isModalOpened, setModal] = useState(false)
  const [walletName, setWalletName] = useState('')
  const [password, setPassword] = useState('')
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)

  const handleCloseModal = () => {
    setModal(false)
  }

  const handleConnectWallet = () => {
    setModal(true)
  }

  return (
    <GlobalContext.Provider
      value={{
        walletName,
        setWalletName,
        password,
        setPassword,
        wallet,
        setWallet
      }}
    >
      <Router>
        <MainContainer>
          <ContentContainer>
            <NavBarContainer>
              <Logo src={logo}></Logo>
              <NavBar>
                <NavBarItem exact to="/" activeStyle={{ backgroundColor: '#ebcdff', fontWeight: 'bold' }}>
                  Create
                </NavBarItem>
                <NavBarItem to="/vote" activeStyle={{ backgroundColor: '#ebcdff', fontWeight: 'bold' }}>
                  Vote
                </NavBarItem>
                <NavBarItem to="/close" activeStyle={{ backgroundColor: '#ebcdff', fontWeight: 'bold' }}>
                  Close
                </NavBarItem>
              </NavBar>
              <Button onClick={handleConnectWallet}>Connect wallet</Button>
            </NavBarContainer>
            <Switch>
              <Route exact path="/">
                <Create />
              </Route>
              <Route path="/vote">
                <LoadVote />
              </Route>
              <Route path="/close">
                <CloseVote />
              </Route>
              <Route path="/submitVote">
                <SubmitVote />
              </Route>
            </Switch>
            <Settings isModalOpen={isModalOpened} handleCloseModal={handleCloseModal} />
          </ContentContainer>
        </MainContainer>
      </Router>
    </GlobalContext.Provider>
  )
}

/* Styles */
const MainContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  background-image: linear-gradient(#f9f4fc, #f8effc);
`

const Logo = styled.img`
  width: auto;
  height: 50px;
`

const Modal = styled(ReactModal)`
  width: 500px;
  margin: auto;
  font-family: Arial;
`
const ContentContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  overflow: hidden;
  font-family: Arial;
`

const NavBarContainer = styled.nav`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  width: 90%;
`

const NavBar = styled.nav`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: white;
  border-radius: 16px;
  padding: 5px;
`

const NavBarItem = styled(NavLink)`
  border-radius: 16px;
  // background-color:#f1eded;
  color: unset;
  font-size: 20px;
  color: #555454;
  margin: 5px;
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  text-decoration: none;
`

export default App
