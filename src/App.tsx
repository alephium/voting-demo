import WalletConnectClient, { CLIENT_EVENTS } from '@walletconnect/client'
import AlephiumProvider from '@walletconnect/alephium-provider'
import { PairingTypes } from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'

import React, { Reducer, useCallback, useReducer, useState } from 'react'
import logo from './images/alephium-logo-gradient-stroke.svg'
import styled from 'styled-components'
import { Switch, Route, NavLink } from 'react-router-dom'
import Create from './pages/Create'
import Vote from './pages/Vote/Vote'
import Administrate from './pages/Administrate'
import UnlockPage from './pages/UnlockPage'
import { getStorage } from 'alephium-js'
import Client from './util/client'
import { loadSettingsOrDefault, saveSettings, Settings } from './util/settings'
import { emptyCache, Cache, NetworkType } from './util/types'
import { NetworkBadge } from './components/NetworkBadge'

export interface Context {
  settings: Settings
  setSettings: (s: Settings) => void
  apiClient?: Client
  setApiClient: (w: Client | undefined) => void
  cache: Cache
  editCache: React.Dispatch<Partial<Cache>>
  accounts: string[]
}

const initialContext: Context = {
  settings: loadSettingsOrDefault(),
  setSettings: () => null,
  apiClient: undefined,
  setApiClient: () => null,
  cache: emptyCache(),
  editCache: () => null,
  accounts: []
}

export const GlobalContext = React.createContext<Context>(initialContext)
export const Storage = getStorage()

function noop() {
  /* do nothing. */
}

const App = () => {
  const [isUnlockOpen, setUnlockOpen] = useState(true)
  const [settings, setSettings] = useState<Settings>(loadSettingsOrDefault())
  const [apiClient, setApiClient] = useState<Client | undefined>(undefined)
  const editCacheReducer: Reducer<Cache, Partial<Cache>> = (prevCache: Cache, edits: Partial<Cache>) => ({
    ...prevCache,
    ...edits
  })
  const [cache, editCache] = useReducer(editCacheReducer, emptyCache())
  const [networkType, setNetworkType] = useState<NetworkType | undefined>(undefined)
  const [accounts, setAccounts] = useState<string[]>([])

  const handleUnlockWallet = useCallback(async () => {
    const walletConnect = await WalletConnectClient.init({
      // TODO: configurable
      projectId: '6e2562e43678dd68a9070a62b6d52207',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Voting demo',
        description: 'A demonstration of voting on Alephium',
        url: 'https://walletconnect.com/',
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    })

    const provider = new AlephiumProvider({
      // TODO: Configurable from UnlockPage
      chains: ['localhost'],
      client: walletConnect
    })

    walletConnect.on(CLIENT_EVENTS.pairing.proposal, async (proposal: PairingTypes.Proposal) => {
      const { uri } = proposal.signal.params

      // TODO: Must be replaced with our own modal, this one has wallets which are not applicable.
      QRCodeModal.open(uri, noop)
    })

    walletConnect.on(CLIENT_EVENTS.session.deleted, noop)
    walletConnect.on(CLIENT_EVENTS.session.sync, () => QRCodeModal.close())

    provider.on('accountsChanged', (accounts: string[]) => {
      QRCodeModal.close()
      setAccounts(accounts)
    })

    await provider.connect()

    const settingsWallet: any = await provider.request({
      method: 'alephium_getServices',
      params: {}
    })

    setSettings({
      network: 'localhost',
      nodeHost: settingsWallet.nodeHost,
      explorerURL: settingsWallet.explorerUrl
    })

    setApiClient(new Client(settings.nodeHost, walletConnect, provider))
    setUnlockOpen(false)
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        settings,
        setSettings,
        apiClient,
        setApiClient,
        cache: cache,
        editCache,
        accounts
      }}
    >
      <ContentContainer>
        <NavBarContainer>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Logo src={logo}></Logo>
            {networkType !== undefined && <NetworkBadge networkType={networkType} />}
          </div>
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
          <div>{accounts.length > 0 && <div>{accounts[0]}</div>}</div>
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
        <UnlockPage isModalOpen={isUnlockOpen} onUnlock={handleUnlockWallet} />
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
