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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
function noop() {
    // do nothing.
}
var Page = function (_a) {
    var isModalOpen = _a.isModalOpen, onUnlock = _a.onUnlock, uri = _a.uri;
    var _b = useState('network select'), state = _b[0], setState = _b[1];
    useEffect(function () {
        if (uri !== undefined) {
            setState('pairing');
        }
        else {
            setState('network select');
        }
    }, [uri]);
    return (_jsx(Modal, __assign({ isOpen: isModalOpen, shouldCloseOnEsc: true, shouldCloseOnOverlayClick: true, onRequestClose: noop, ariaHideApp: false }, { children: _jsxs(Container, { children: [_jsx(Header, { children: "This dApp requires an action" }, void 0), state == 'network select' && (_jsx(_Fragment, { children: _jsx(MultiList, { children: _jsx(MultiItem, __assign({ onClick: function () { return onUnlock(); } }, { children: "Connect wallet" }), void 0) }, void 0) }, void 0)), state == 'pairing' && (_jsxs(_Fragment, { children: [_jsx(QRCodeSVG, { value: uri || '', size: 256, includeMargin: true }, void 0), _jsx(Input, { value: uri, readOnly: true }, void 0)] }, void 0))] }, void 0) }), void 0));
};
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  margin-top: 2rem;\n\n  background-image: linear-gradient(-140deg, rgb(255, 93, 81), 67%, rgb(18, 0, 218));\n  letter-spacing: 0.02rem;\n  border-radius: 12px;\n  padding: 4rem;\n  box-shadow: 6px 0px 12px 0 rgba(255, 93, 81, 0.6), 0px 6px 12px 0 rgba(18, 0, 218, 0.3);\n"], ["\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  margin-top: 2rem;\n\n  background-image: linear-gradient(-140deg, rgb(255, 93, 81), 67%, rgb(18, 0, 218));\n  letter-spacing: 0.02rem;\n  border-radius: 12px;\n  padding: 4rem;\n  box-shadow: 6px 0px 12px 0 rgba(255, 93, 81, 0.6), 0px 6px 12px 0 rgba(18, 0, 218, 0.3);\n"])));
var Header = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: rgba(255, 255, 255, 0.84);\n  font-weight: 900;\n  margin-bottom: 2rem;\n"], ["\n  color: rgba(255, 255, 255, 0.84);\n  font-weight: 900;\n  margin-bottom: 2rem;\n"])));
var Input = styled.input(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: rgba(255, 255, 255, 0.67);\n  font-weight: 700;\n  padding: 1.5rem 2rem;\n  margin: 1rem;\n  background: transparent;\n  border: none;\n  border-radius: 12px;\n  box-shadow: -6px -6px 12px 0 rgba(255, 255, 255, 0.1) inset, 6px 6px 12px 0 rgba(0, 0, 0, 0.1) inset;\n  width: 100%;\n"], ["\n  color: rgba(255, 255, 255, 0.67);\n  font-weight: 700;\n  padding: 1.5rem 2rem;\n  margin: 1rem;\n  background: transparent;\n  border: none;\n  border-radius: 12px;\n  box-shadow: -6px -6px 12px 0 rgba(255, 255, 255, 0.1) inset, 6px 6px 12px 0 rgba(0, 0, 0, 0.1) inset;\n  width: 100%;\n"])));
var Modal = styled(ReactModal)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 600px;\n  margin: auto;\n  font-family: Roboto, 'Droid Sans', sans-serif;\n"], ["\n  width: 600px;\n  margin: auto;\n  font-family: Roboto, 'Droid Sans', sans-serif;\n"])));
var MultiList = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n"], ["\n  display: flex;\n  flex-direction: row;\n"])));
var MultiItem = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: rgba(255, 255, 255, 0.7);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 1rem;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgba(255, 255, 255, 0.1) inset, -6px -6px 12px 0 rgba(0, 0, 0, 0.1) inset;\n"], ["\n  color: rgba(255, 255, 255, 0.7);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 1rem;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgba(255, 255, 255, 0.1) inset, -6px -6px 12px 0 rgba(0, 0, 0, 0.1) inset;\n"])));
export default Page;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
