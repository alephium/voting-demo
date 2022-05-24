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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useContext } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { Button, Container } from '../components/Common';
import { Input } from '../components/Inputs';
import { GlobalContext } from '../App';
import { isNotEmpty } from '../util/util';
var SettingsPage = function (_a) {
    var isModalOpen = _a.isModalOpen, handleCloseModal = _a.handleCloseModal;
    var _b = useContext(GlobalContext), settings = _b.settings, setSettings = _b.setSettings;
    var _c = useState({
        network: settings.network,
        nodeHost: settings.nodeHost,
        explorerURL: settings.explorerURL
    }), tempSettings = _c[0], setTempSettings = _c[1];
    var isNetworkNameValid = isNotEmpty;
    var isNodeHostValid = isNotEmpty;
    var isExplorerURLValid = isNotEmpty;
    var handleOnClick = function () {
        if (isNetworkNameValid(tempSettings.network) &&
            isNodeHostValid(tempSettings.nodeHost) &&
            isExplorerURLValid(tempSettings.explorerURL)) {
            setSettings(tempSettings);
            alert('Settings saved!');
        }
        else {
            alert('Invalid settings.');
        }
    };
    var editSettings = function (partial) {
        var newSettings = __assign(__assign({}, tempSettings), partial);
        setTempSettings(newSettings);
    };
    return (_jsx(Modal, __assign({ isOpen: isModalOpen, shouldCloseOnEsc: true, shouldCloseOnOverlayClick: true, onRequestClose: handleCloseModal, ariaHideApp: false }, { children: _jsxs(Container, { children: [_jsx("h1", { children: "Wallet SettingsPage" }), _jsx("label", __assign({ htmlFor: "network" }, { children: "Network" })), _jsx(Input, { id: "network", placeholder: "mainnet", value: tempSettings.network, onChange: function (e) { return editSettings({ network: e.target.value }); } }), _jsx("label", __assign({ htmlFor: "nodeHost" }, { children: "Node Address" })), _jsx(Input, { id: "nodeHost", placeholder: tempSettings.nodeHost, value: tempSettings.nodeHost, onChange: function (e) { return editSettings({ nodeHost: e.target.value }); } }), _jsx("label", __assign({ htmlFor: "explorerUrl" }, { children: "Explorer URL" })), _jsx(Input, { id: "explorerUrl", placeholder: tempSettings.explorerURL, value: tempSettings.explorerURL, onChange: function (e) { return editSettings({ explorerURL: e.target.value }); } }), _jsx(Button, __assign({ onClick: function () { return handleOnClick(); } }, { children: "Save" }))] }) })));
};
var Modal = styled(ReactModal)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 500px;\n  margin: auto;\n  font-family: Arial;\n"], ["\n  width: 500px;\n  margin: auto;\n  font-family: Arial;\n"])));
export default SettingsPage;
var templateObject_1;
