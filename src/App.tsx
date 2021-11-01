import React, { useState } from 'react'
import logo from './images/alephium-logo-gradient-stroke.svg'
import styled from 'styled-components'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Create from './pages/Create'
import LoadVote from './pages/Vote'
import Administrate from './pages/Administrate'
import Settings from './pages/Settings'
import { Button } from './components/Common'
import { getStorage, Wallet } from 'alephium-js'
import Client from './util/client'

interface Context {
  walletName: string
  setWalletName: (w: string) => void
  password: string
  setPassword: (p: string) => void
  apiClient?: Client
  setApiClient: (w: Client | undefined) => void
}

const initialContext: Context = {
  walletName: '',
  setWalletName: () => null,
  password: '',
  setPassword: () => null,
  apiClient: undefined,
  setApiClient: () => null
}

export const GlobalContext = React.createContext<Context>(initialContext)
export const Storage = getStorage()

const App = () => {
  const [isModalOpened, setModal] = useState(false)
  const [walletName, setWalletName] = useState('')
  const [password, setPassword] = useState('')
  const [apiClient, setApiClient] = useState<Client | undefined>(undefined)

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
        apiClient,
        setApiClient
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
                <NavBarItem to="/administrate" activeStyle={{ backgroundColor: '#ebcdff', fontWeight: 'bold' }}>
                  Administrate
                </NavBarItem>
              </NavBar>
              <Button onClick={handleConnectWallet}>Unlock wallet</Button>
            </NavBarContainer>
            <Switch>
              <Route exact path="/">
                <Create />
              </Route>
              <Route exact path="/vote/:txId/:nVoters">
                <LoadVote />
              </Route>
              <Route path="/vote">
                <LoadVote />
              </Route>
              <Route exact path="/administrate/:txId/:nVoters">
                <Administrate />
              </Route>
              <Route path="/administrate">
                <Administrate />
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
