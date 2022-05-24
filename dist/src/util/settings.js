export function defaultSettings() {
    return {
        network: 'testnet',
        nodeHost: 'http://127.0.0.1:12973',
        explorerURL: 'https://testnet.alephium.org'
    };
}
export function loadSettings() {
    var str = window.localStorage.getItem('voting-demo-settings');
    if (str) {
        return JSON.parse(str);
    }
    else {
        return null;
    }
}
export function loadSettingsOrDefault() {
    var settings = loadSettings();
    if (!settings) {
        return defaultSettings();
    }
    else {
        return settings;
    }
}
export function saveSettings(settings) {
    var str = JSON.stringify(settings);
    window.localStorage.setItem('voting-demo-settings', str);
}
