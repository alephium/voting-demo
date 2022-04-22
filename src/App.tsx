import WalletConnectClient, { CLIENT_EVENTS } from '@walletconnect/client'
import AlephiumProvider from '@alephium/walletconnect-provider'
import { PairingTypes } from '@walletconnect/types'

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
import { loadSettingsOrDefault, Settings } from './util/settings'
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
  const [uri, setUri] = useState<string | undefined>(undefined)
  const [settings, setSettings] = useState<Settings>(loadSettingsOrDefault())
  const [apiClient, setApiClient] = useState<Client | undefined>(undefined)
  const editCacheReducer: Reducer<Cache, Partial<Cache>> = (prevCache: Cache, edits: Partial<Cache>) => ({
    ...prevCache,
    ...edits
  })
  const [cache, editCache] = useReducer(editCacheReducer, emptyCache())
  const [networkType] = useState<NetworkType | undefined>(undefined)
  const [accounts, setAccounts] = useState<string[]>([])

  const handleUnlockWallet = useCallback(async () => {
    const walletConnect = await WalletConnectClient.init({
      // TODO: configurable project Id
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
      chains: ['mainnet', 'testnet', 'devnet'],
      client: walletConnect
    })

    walletConnect.on(CLIENT_EVENTS.pairing.proposal, async (proposal: PairingTypes.Proposal) => {
      const { uri } = proposal.signal.params
      setUri(uri)
    })

    walletConnect.on(CLIENT_EVENTS.session.deleted, noop)
    walletConnect.on(CLIENT_EVENTS.session.sync, () => {
      setUnlockOpen(false)
      setUri(undefined)
    })

    provider.on('accountsChanged', (accounts: string[]) => {
      setUnlockOpen(false)
      setUri(undefined)
      setAccounts(accounts)
    })

    await provider.connect()

    const settingsWallet: any = await provider.request({
      method: 'alephium_getServices',
      params: {}
    })

    setSettings({
      network: '',
      nodeHost: settingsWallet.nodeHost,
      explorerURL: settingsWallet.explorerUrl
    })

    setApiClient(new Client(settings.nodeHost, walletConnect, provider))
    setUnlockOpen(false)
  }, [])

  const onDisconnect = useCallback(async () => {
    await apiClient?.provider.disconnect()
    setAccounts([])
    setUnlockOpen(true)
  }, [apiClient])

  const stylePressedIn = {
    boxShadow: '-6px -6px 12px 0 rgb(255 255 255 / 60%) inset, 6px 6px 12px 0 rgb(0 0 0 / 7%) inset'
  }

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'fixed', left: '1rem', top: '1rem' }}>
          <Logo src={logo}></Logo>
          {networkType !== undefined && <NetworkBadge networkType={networkType} />}
        </div>
        <ContentContainer>
          <NavBarContainer>
            <NavBar>
              <NavBarItem exact to="/" activeStyle={stylePressedIn}>
                Create
              </NavBarItem>
              <NavBarItem to="/administrate" activeStyle={stylePressedIn}>
                Administrate
              </NavBarItem>
              <NavBarItem to="/vote" activeStyle={stylePressedIn}>
                Vote
              </NavBarItem>
              <RedButton onClick={onDisconnect}>⏻</RedButton>
            </NavBar>
          </NavBarContainer>
          <Address>{accounts[0]}</Address>
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
          <UnlockPage isModalOpen={isUnlockOpen} onUnlock={handleUnlockWallet} uri={uri} />
        </ContentContainer>
      </div>
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
  width: 39rem;
`

const NavBarContainer = styled.nav`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  width: auto;
  align-items: center;
  margin-top: 3.5rem;
  margin-bottom: 0rem;
`

const NavBar = styled.nav`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  font-weight: 700;
  width: 100%;
  border-radius: 12px;
  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 80%), -6px -6px 19px 0 rgb(0 0 0 / 15%);
`

const NavBarItem = styled(NavLink)`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  font-weight: 700;
  margin: 0.4rem;
  border-radius: 12px;
  box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%), 6px 6px 12px 0 rgb(0 0 0 / 7%);
`

const RedButton = styled.div`
  color: rgb(255 255 255 / 88%);
  background-color: rgb(255 0 0);
  line-height: 2.3rem;
  width: 2.3rem;
  text-align: center;
  height: 2.3rem;
  cursor: pointer;
  font-weight: 700;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: -7px -7px 20px 0 rgb(0 0 0 / 36%) inset, 7px 7px 24px 0 rgb(255 104 76 / 87%) inset,
    -2px -2px 24px 0 rgb(255 104 76 / 87%);

  &:active {
    box-shadow: 7px 7px 20px 0 rgb(0 0 0 / 36%) inset, -7px -7px 24px 0 rgb(255 104 76 / 87%) inset;
  }
`

const Address = styled.div`
  width: 10rem;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
  position: fixed;
  right: 1rem;
  top: 1rem;
`
export default App
