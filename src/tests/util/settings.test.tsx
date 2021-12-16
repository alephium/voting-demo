import { defaultSettings, loadSettingsOrDefault, saveSettings, Settings } from '../../util/settings'

it('load default settings', () => {
  expect(loadSettingsOrDefault()).toEqual(defaultSettings())
})

it('save and load settings in window storage', () => {
  const newSettings: Settings = {
    walletName: 'new-wallet',
    password: 'new-password',
    nodeHost: 'http://newURL.org',
    explorerURL: 'http://newExplorer.org'
  }
  saveSettings(newSettings)
  expect(loadSettingsOrDefault()).toEqual(newSettings)
})
