export interface Settings {
  walletName: string
  password: string
  nodeHost: string
  explorerURL: string
}

export function defaultSettings(): Settings {
  return {
    walletName: 'wallet-1',
    password: 'my-secret-password',
    nodeHost: 'http://127.0.0.1:12973',
    explorerURL: 'https://testnet.alephium.org'
  }
}

export function loadSettings(): Settings | null {
  const str = window.localStorage.getItem('voting-demo-settings')
  if (str) {
    return JSON.parse(str)
  } else {
    return null
  }
}

export function loadSettingsOrDefault(): Settings {
  const settings = loadSettings()
  if (!settings) {
    return defaultSettings()
  } else {
    return settings
  }
}

export function saveSettings(settings: Settings) {
  const str = JSON.stringify(settings)
  window.localStorage.setItem('voting-demo-settings', str)
}
