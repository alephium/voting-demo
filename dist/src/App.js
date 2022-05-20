var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import WalletConnectClient, { CLIENT_EVENTS } from '@walletconnect/client';
import WalletConnectProvider from 'alephium-walletconnect-provider';
import React, { useCallback, useReducer, useState } from 'react';
import logo from './images/alephium-logo-gradient-stroke.svg';
import styled from 'styled-components';
import { Switch, Route, NavLink } from 'react-router-dom';
import Create from './pages/Create';
import Vote from './pages/Vote/Vote';
import Administrate from './pages/Administrate';
import UnlockPage from './pages/UnlockPage';
import { getStorage } from 'alephium-js';
import Client from './util/client';
import { loadSettingsOrDefault } from './util/settings';
import { emptyCache } from './util/types';
import { NetworkBadge } from './components/NetworkBadge';
var NETWORK = 'Custom';
var NETWORK_ID = 4;
var NODE_HOST = 'http://127.0.0.1:22973/';
var EXPLORER_HOST = 'http://127.0.0.1:3000/';
var initialContext = {
    settings: loadSettingsOrDefault(),
    setSettings: function () { return null; },
    apiClient: undefined,
    setApiClient: function () { return null; },
    cache: emptyCache(),
    editCache: function () { return null; },
    accounts: []
};
export var GlobalContext = React.createContext(initialContext);
export var Storage = getStorage();
function noop() {
    /* do nothing. */
}
var App = function () {
    var _a = useState(true), isUnlockOpen = _a[0], setUnlockOpen = _a[1];
    var _b = useState(undefined), uri = _b[0], setUri = _b[1];
    var _c = useState(loadSettingsOrDefault()), settings = _c[0], setSettings = _c[1];
    var _d = useState(undefined), apiClient = _d[0], setApiClient = _d[1];
    var editCacheReducer = function (prevCache, edits) { return (__assign(__assign({}, prevCache), edits)); };
    var _e = useReducer(editCacheReducer, emptyCache()), cache = _e[0], editCache = _e[1];
    var networkType = useState(undefined)[0];
    var _f = useState([]), accounts = _f[0], setAccounts = _f[1];
    var handleUnlockWallet = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var walletConnect, provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, WalletConnectClient.init({
                        // TODO: configurable project Id
                        projectId: '6e2562e43678dd68a9070a62b6d52207',
                        relayUrl: 'wss://relay.walletconnect.com',
                        metadata: {
                            name: 'Voting demo',
                            description: 'A demonstration of voting on Alephium',
                            url: 'https://walletconnect.com/',
                            icons: ['https://walletconnect.com/walletconnect-logo.png']
                        }
                    })];
                case 1:
                    walletConnect = _a.sent();
                    provider = new WalletConnectProvider({
                        networkId: NETWORK_ID,
                        chainGroup: -1,
                        client: walletConnect
                    });
                    walletConnect.on(CLIENT_EVENTS.pairing.proposal, function (proposal) { return __awaiter(void 0, void 0, void 0, function () {
                        var uri;
                        return __generator(this, function (_a) {
                            uri = proposal.signal.params.uri;
                            setUri(uri);
                            return [2 /*return*/];
                        });
                    }); });
                    walletConnect.on(CLIENT_EVENTS.session.deleted, noop);
                    walletConnect.on(CLIENT_EVENTS.session.sync, function () {
                        setUnlockOpen(false);
                        setUri(undefined);
                    });
                    provider.on('accountsChanged', function (accounts) {
                        setUnlockOpen(false);
                        setUri(undefined);
                        console.log("========= ".concat(JSON.stringify(accounts)));
                        setAccounts(accounts);
                    });
                    return [4 /*yield*/, provider.connect()];
                case 2:
                    _a.sent();
                    setSettings({
                        network: NETWORK,
                        nodeHost: NODE_HOST,
                        explorerURL: EXPLORER_HOST
                    });
                    setApiClient(new Client(NODE_HOST, walletConnect, provider));
                    setUnlockOpen(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var onDisconnect = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (apiClient === null || apiClient === void 0 ? void 0 : apiClient.provider.disconnect())];
                case 1:
                    _a.sent();
                    setAccounts([]);
                    setUnlockOpen(true);
                    return [2 /*return*/];
            }
        });
    }); }, [apiClient]);
    var stylePressedIn = {
        boxShadow: '-6px -6px 12px 0 rgb(255 255 255 / 60%) inset, 6px 6px 12px 0 rgb(0 0 0 / 7%) inset'
    };
    return (_jsx(GlobalContext.Provider, __assign({ value: {
            settings: settings,
            setSettings: setSettings,
            apiClient: apiClient,
            setApiClient: setApiClient,
            cache: cache,
            editCache: editCache,
            accounts: accounts
        } }, { children: _jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, { children: [_jsxs("div", __assign({ style: { position: 'fixed', left: '1rem', top: '1rem' } }, { children: [_jsx(Logo, { src: logo }), networkType !== undefined && _jsx(NetworkBadge, { networkType: networkType })] })), _jsxs(ContentContainer, { children: [_jsx(NavBarContainer, { children: _jsxs(NavBar, { children: [_jsx(NavBarItem, __assign({ exact: true, to: "/", activeStyle: stylePressedIn }, { children: "Create" })), _jsx(NavBarItem, __assign({ to: "/administrate", activeStyle: stylePressedIn }, { children: "Administrate" })), _jsx(NavBarItem, __assign({ to: "/vote", activeStyle: stylePressedIn }, { children: "Vote" })), _jsx(RedButton, __assign({ onClick: onDisconnect }, { children: "\u23FB" }))] }) }), _jsx(Address, { children: accounts[0] ? accounts[0].address : 'Unknown address' }), _jsxs(Switch, { children: [_jsx(Route, __assign({ exact: true, path: "/" }, { children: _jsx(Create, {}) })), _jsx(Route, __assign({ exact: true, path: "/vote/:txId" }, { children: _jsx(Vote, {}) })), _jsx(Route, __assign({ path: "/vote" }, { children: _jsx(Vote, {}) })), _jsx(Route, __assign({ exact: true, path: "/administrate/:txId" }, { children: _jsx(Administrate, {}) })), _jsx(Route, __assign({ path: "/administrate" }, { children: _jsx(Administrate, {}) }))] }), _jsx(UnlockPage, { isModalOpen: isUnlockOpen, onUnlock: handleUnlockWallet, uri: uri })] })] })) })));
};
/* Styles */
var Logo = styled.img(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: auto;\n  height: 50px;\n"], ["\n  width: auto;\n  height: 50px;\n"])));
var ContentContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 20px;\n  padding-bottom: 20px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  font-family: Arial;\n  width: 39rem;\n"], ["\n  padding-top: 20px;\n  padding-bottom: 20px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  font-family: Arial;\n  width: 39rem;\n"])));
var NavBarContainer = styled.nav(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  justify-content: space-between;\n  display: flex;\n  flex-direction: row;\n  width: auto;\n  align-items: center;\n  margin-top: 3.5rem;\n  margin-bottom: 0rem;\n"], ["\n  justify-content: space-between;\n  display: flex;\n  flex-direction: row;\n  width: auto;\n  align-items: center;\n  margin-top: 3.5rem;\n  margin-bottom: 0rem;\n"])));
var NavBar = styled.nav(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  font-weight: 700;\n  width: 100%;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 80%), -6px -6px 19px 0 rgb(0 0 0 / 15%);\n"], ["\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  font-weight: 700;\n  width: 100%;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 80%), -6px -6px 19px 0 rgb(0 0 0 / 15%);\n"])));
var NavBarItem = styled(NavLink)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  text-decoration: none;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 0.4rem;\n  border-radius: 12px;\n  box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%), 6px 6px 12px 0 rgb(0 0 0 / 7%);\n"], ["\n  text-decoration: none;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 0.4rem;\n  border-radius: 12px;\n  box-shadow: -6px -6px 12px 0 rgb(255 255 255 / 60%), 6px 6px 12px 0 rgb(0 0 0 / 7%);\n"])));
var RedButton = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: rgb(255 255 255 / 88%);\n  background-color: rgb(255 0 0);\n  line-height: 2.3rem;\n  width: 2.3rem;\n  text-align: center;\n  height: 2.3rem;\n  cursor: pointer;\n  font-weight: 700;\n  margin: 1rem;\n  border-radius: 12px;\n  box-shadow: -7px -7px 20px 0 rgb(0 0 0 / 36%) inset, 7px 7px 24px 0 rgb(255 104 76 / 87%) inset,\n    -2px -2px 24px 0 rgb(255 104 76 / 87%);\n\n  &:active {\n    box-shadow: 7px 7px 20px 0 rgb(0 0 0 / 36%) inset, -7px -7px 24px 0 rgb(255 104 76 / 87%) inset;\n  }\n"], ["\n  color: rgb(255 255 255 / 88%);\n  background-color: rgb(255 0 0);\n  line-height: 2.3rem;\n  width: 2.3rem;\n  text-align: center;\n  height: 2.3rem;\n  cursor: pointer;\n  font-weight: 700;\n  margin: 1rem;\n  border-radius: 12px;\n  box-shadow: -7px -7px 20px 0 rgb(0 0 0 / 36%) inset, 7px 7px 24px 0 rgb(255 104 76 / 87%) inset,\n    -2px -2px 24px 0 rgb(255 104 76 / 87%);\n\n  &:active {\n    box-shadow: 7px 7px 20px 0 rgb(0 0 0 / 36%) inset, -7px -7px 24px 0 rgb(255 104 76 / 87%) inset;\n  }\n"])));
var Address = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 10rem;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  font-weight: 600;\n  position: fixed;\n  right: 1rem;\n  top: 1rem;\n"], ["\n  width: 10rem;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  font-weight: 600;\n  position: fixed;\n  right: 1rem;\n  top: 1rem;\n"])));
export default App;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
