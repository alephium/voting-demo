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
import styled from 'styled-components';
import { NetworkType } from '../util/types';
export var NetworkBadge = function (_a) {
    var networkType = _a.networkType;
    var networkTypeToText = function (networkType) {
        if (networkType === NetworkType.MAINNET) {
            return 'Mainnet';
        }
        else if (networkType === NetworkType.TESTNET) {
            return 'Testnet';
        }
        else if (networkType === NetworkType.UNKNOWN) {
            return 'Unknown network';
        }
        else {
            return 'Unreachable node';
        }
    };
    return (_jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'row', alignItems: 'center' } }, { children: [_jsx(Badge, { children: networkTypeToText(networkType) }, void 0), networkType !== NetworkType.TESTNET && _jsx(DangerLogo, {}, void 0)] }), void 0));
};
var DangerLogo = function () {
    return _jsx(DangerLogoSpan, { children: "\u26A0" }, void 0);
};
var DangerLogoSpan = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: red;\n  font-size: 25px;\n  margin-left: 10px;\n"], ["\n  color: red;\n  font-size: 25px;\n  margin-left: 10px;\n"])));
var Badge = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: white;\n  border-radius: 15px;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #e7e7e7;\n  padding-left: 10px;\n  padding-right: 10px;\n  margin-left: 20px;\n  padding-top: 0px;\n  height: 30px;\n"], ["\n  background-color: white;\n  border-radius: 15px;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #e7e7e7;\n  padding-left: 10px;\n  padding-right: 10px;\n  margin-left: 20px;\n  padding-top: 0px;\n  height: 30px;\n"])));
var templateObject_1, templateObject_2;
