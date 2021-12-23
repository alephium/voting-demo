import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Context, GlobalContext as GlobalCtx } from '../App'
import SettingsPage from '../pages/SettingsPage'
import { loadSettingsOrDefault, Settings } from '../util/settings'
import { emptyCache } from '../util/types'

window.alert = jest.fn()

afterEach(() => {
  jest.resetModules()
})

it('should call setSettings on save', async () => {
  const initialContext = setup()
  const newSettings: Settings = {
    walletName: 'new-wallet',
    password: 'new-password',
    nodeHost: 'http://newURL.org',
    explorerURL: 'http://newExplorer.org'
  }

  expect(readSettings()).toEqual(initialContext.settings)
  writeSettings(newSettings)
  await waitFor(() => expect(readSettings()).toEqual(newSettings))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => {
    expect(initialContext.setSettings).toHaveBeenCalledTimes(1)
    expect(initialContext.setSettings).toHaveBeenCalledWith(newSettings)
    expect(window.alert).toHaveBeenCalledTimes(1)
    expect(window.alert).toHaveBeenCalledWith('Settings saved!')
  })
})

it('should reject fields on save', async () => {
  const initialContext = setup()
  expect(readSettings()).toEqual(initialContext.settings)

  async function checkSaveFailed(newFields: Partial<Settings>, callCount: number) {
    const newSettings: Settings = { ...initialContext.settings, ...newFields }
    writeSettings(newSettings)
    await waitFor(() => expect(readSettings()).toEqual(newSettings))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => {
      expect(initialContext.setSettings).not.toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledTimes(callCount)
      expect(window.alert).toHaveBeenCalledWith('Invalid settings.')
    })
  }

  await checkSaveFailed({ walletName: '' }, 1)
  await checkSaveFailed({ password: '' }, 2)
  await checkSaveFailed({ nodeHost: '' }, 3)
  await checkSaveFailed({ explorerURL: '' }, 4)
})

function readSettings(): Settings {
  return {
    walletName: (screen.getByLabelText('Wallet Name') as HTMLInputElement).value,
    password: (screen.getByLabelText('Wallet Password') as HTMLInputElement).value,
    nodeHost: (screen.getByLabelText('Node Address') as HTMLInputElement).value,
    explorerURL: (screen.getByLabelText('Explorer URL') as HTMLInputElement).value
  }
}

function writeSettings(s: Settings) {
  fireEvent.change(screen.getByLabelText('Wallet Name'), { target: { value: s.walletName } })
  fireEvent.change(screen.getByLabelText('Wallet Password'), { target: { value: s.password } })
  fireEvent.change(screen.getByLabelText('Node Address'), { target: { value: s.nodeHost } })
  fireEvent.change(screen.getByLabelText('Explorer URL'), { target: { value: s.explorerURL } })
}

function setup() {
  const initialContext: Context = {
    settings: loadSettingsOrDefault(),
    setSettings: jest.fn(),
    apiClient: undefined,
    setApiClient: jest.fn(),

    cache: emptyCache(),
    editCache: jest.fn()
  }
  const handleCloseModal = jest.fn()
  const settings = initialContext.settings
  const setSettings = initialContext.setSettings
  const apiClient = initialContext.apiClient
  const setApiClient = initialContext.setApiClient

  const cache = initialContext.cache
  const editCache = initialContext.editCache
  const GlobalContext = GlobalCtx

  render(
    <GlobalContext.Provider
      value={{
        settings,
        setSettings,
        apiClient,
        setApiClient,
        cache: cache,
        editCache: editCache
      }}
    >
      <SettingsPage isModalOpen={true} handleCloseModal={() => handleCloseModal()} />
    </GlobalContext.Provider>
  )
  return initialContext
}
