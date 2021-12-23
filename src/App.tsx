import React, { Reducer, useEffect, useReducer, useState } from 'react'
import logo from './images/alephium-logo-gradient-stroke.svg'
import styled from 'styled-components'
import { Switch, Route, NavLink } from 'react-router-dom'
import Create from './pages/Create'
import Vote from './pages/Vote/Vote'
import Administrate from './pages/Administrate'
import SettingsPage from './pages/SettingsPage'
import { Button } from './components/Common'
import { getStorage } from 'alephium-js'
import Client from './util/client'
import { loadSettingsOrDefault, saveSettings, Settings } from './util/settings'
import { emptyCache, Cache } from './util/types'

export interface Context {
  settings: Settings
  setSettings: (s: Settings) => void
  apiClient?: Client
  setApiClient: (w: Client | undefined) => void
  cache: Cache
  editCache: React.Dispatch<Partial<Cache>>
}

const initialContext: Context = {
  settings: loadSettingsOrDefault(),
  setSettings: () => null,
  apiClient: undefined,
  setApiClient: () => null,
  cache: emptyCache(),
  editCache: () => null
}

export const GlobalContext = React.createContext<Context>(initialContext)
export const Storage = getStorage()

const App = () => {
  const [isModalOpened, setModal] = useState(false)
  const [settings, setSettings] = useState<Settings>(loadSettingsOrDefault())
  const [apiClient, setApiClient] = useState<Client | undefined>(undefined)
  const editCacheReducer: Reducer<Cache, Partial<Cache>> = (prevCache: Cache, edits: Partial<Cache>) => ({
    ...prevCache,
    ...edits
  })
  const [cache, editCache] = useReducer(editCacheReducer, emptyCache())

  const handleCloseModal = () => {
    setModal(false)
  }

  const handleConnectWallet = () => {
    setModal(true)
  }

  useEffect(() => {
    setApiClient(new Client(settings.nodeHost, settings.walletName, settings.password))
    saveSettings(settings)
  }, [settings])

  const walletUnlock = () => {
    if (apiClient) {
      apiClient.walletUnlock().then(
        () => alert('Wallet successfully unlocked'),
        (reason) => alert(`An error occured during walletUnlock: ${reason}`)
      )
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        settings,
        setSettings,
        apiClient,
        setApiClient,
        cache: cache,
        editCache
      }}
    >
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
          <div>
            <Button onClick={() => walletUnlock()}>Unlock Wallet</Button>
            <Button onClick={handleConnectWallet}>Settings</Button>
          </div>
        </NavBarContainer>
        <Switch>
          <Route exact path="/">
            <Create />
          </Route>
          <Route exact path="/vote/:txId">
            <Vote />
          </Route>
          <Route path="/vote">
            <Vote />
          </Route>
          <Route exact path="/administrate/:txId">
            <Administrate />
          </Route>
          <Route path="/administrate">
            <Administrate />
          </Route>
        </Switch>
        <SettingsPage isModalOpen={isModalOpened} handleCloseModal={handleCloseModal} />
      </ContentContainer>
    </GlobalContext.Provider>
  )
}

/* Styles */
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
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
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
