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
import { useContext } from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../App';
import { Alert, ALERT_PROPS } from './Alert';
export var TxStatusSnackBar = function (_a) {
    var txStatus = _a.txStatus, txId = _a.txId;
    var context = useContext(GlobalContext);
    var status = txStatus;
    var getMessage = function () {
        if (!(txStatus && txId)) {
            return null;
        }
        else if (status.type === 'Confirmed') {
            return (_jsx(StyledDiv, { children: _jsxs(Alert, __assign({ color: ALERT_PROPS.SUCCESS.color, backgroundColor: ALERT_PROPS.SUCCESS.backgroundColor }, { children: [_jsx("a", __assign({ href: context.settings.explorerURL + "/#/transactions/" + txId, target: "_blank", rel: "noopener noreferrer" }, { children: "Transaction" }), void 0), "\u00A0 Confirmed!"] }), void 0) }, void 0));
        }
        else if (status.type === 'MemPooled') {
            return (_jsx(StyledDiv, { children: _jsxs(Alert, __assign({ color: ALERT_PROPS.WARNING.color, backgroundColor: ALERT_PROPS.WARNING.backgroundColor }, { children: ["Pending\u00A0", _jsx("a", __assign({ href: context.settings.explorerURL + "/#/transactions/" + txId, target: "_blank", rel: "noopener noreferrer" }, { children: "transaction." }), void 0), "\u00A0 Please wait.."] }), void 0) }, void 0));
        }
        else {
            return (_jsx(StyledDiv, { children: _jsx(Alert, __assign({ color: ALERT_PROPS.DANGER.color, backgroundColor: ALERT_PROPS.DANGER.backgroundColor }, { children: "Transaction not found" }), void 0) }, void 0));
        }
    };
    return getMessage();
};
var StyledDiv = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 50px;\n"], ["\n  margin-top: 50px;\n"])));
export default TxStatusSnackBar;
var templateObject_1;
