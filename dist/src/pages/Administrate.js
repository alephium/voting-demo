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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { GlobalContext } from '../App';
import { Button, Container } from '../components/Common';
import { Input } from '../components/Inputs';
import { TxStatusSnackBar } from '../components/TxStatusSnackBar';
import { tokenAllocationScript, closingScript } from '../util/voting';
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util';
import { Action } from '../util/types';
var Administrate = function () {
    var txId = useParams().txId;
    var context = useContext(GlobalContext);
    var getInitTxId = function () {
        var initTxId = txId ? txId : '';
        if (context.cache.currentContractId) {
            initTxId = context.cache.currentContractId;
        }
        return initTxId;
    };
    var _a = useState(getInitTxId()), contractTxId = _a[0], setContractTxId = _a[1];
    var _b = useState(context.cache.administrateTxResult), txResult = _b[0], setResult = _b[1];
    var _c = useState(undefined), txStatus = _c[0], setTxStatus = _c[1];
    var _d = useState(undefined), typedStatus = _d[0], setTypedStatus = _d[1];
    var _e = useState(context.cache.administrateAction), lastAction = _e[0], setLastAction = _e[1];
    var pollTxStatus = function (interval, txResult) {
        var _a;
        (_a = context.apiClient) === null || _a === void 0 ? void 0 : _a.getTxStatus(txResult.txId).then(function (fetchedStatus) {
            setTxStatus(fetchedStatus);
            var status = fetchedStatus;
            setTypedStatus(status);
            clearIntervalIfConfirmed(fetchedStatus, interval);
        });
    };
    useEffect(function () {
        if (txResult) {
            context.editCache({ administrateTxResult: txResult });
            var interval_1 = setInterval(function () {
                pollTxStatus(interval_1, txResult);
            }, 1000);
            pollTxStatus(interval_1, txResult);
            return function () { return clearInterval(interval_1); };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txResult]);
    var allocateTokens = function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractRef, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.apiClient) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.apiClient.getContractRef(contractTxId).catch(function (e) { return console.log(e); })];
                case 1:
                    contractRef = _a.sent();
                    if (!contractRef) return [3 /*break*/, 4];
                    return [4 /*yield*/, tokenAllocationScript.paramsForDeployment({
                            signerAddress: context.accounts[0].address,
                            templateVariables: { contractId: contractRef.tokenId }
                        })];
                case 2:
                    params = _a.sent();
                    return [4 /*yield*/, context.apiClient.provider.signScriptTx(params)];
                case 3:
                    result = _a.sent();
                    setResult(result);
                    setLastAction(Action.Allocate);
                    context.editCache({ currentContractId: contractTxId, administrateAction: Action.Allocate });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var close = function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractRef, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.apiClient) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.apiClient.getContractRef(contractTxId).catch(function (e) { return console.log(e); })];
                case 1:
                    contractRef = _a.sent();
                    if (!contractRef) return [3 /*break*/, 4];
                    return [4 /*yield*/, closingScript.paramsForDeployment({
                            signerAddress: context.accounts[0].address,
                            templateVariables: { contractId: contractRef.tokenId }
                        })];
                case 2:
                    params = _a.sent();
                    return [4 /*yield*/, context.apiClient.provider.signScriptTx(params)];
                case 3:
                    result = _a.sent();
                    setResult(result);
                    setLastAction(Action.Close);
                    context.editCache({ currentContractId: contractTxId, administrateAction: Action.Close });
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(_Fragment, { children: [txStatus && (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && _jsx(TxStatusSnackBar, { txStatus: txStatus, txId: txResult.txId }, void 0), (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && typedStatus && typedStatus.type === 'Confirmed' && lastAction === Action.Allocate && (_jsx(Container, { children: _jsxs("div", __assign({ style: { flexDirection: 'row' } }, { children: ["Share this", _jsx(NavLink, __assign({ to: "/vote/" + contractTxId }, { children: " link " }), void 0), " to the voters."] }), void 0) }, void 0)), (!txResult || (typedStatus && typedStatus.type === 'Confirmed')) && (_jsxs(Container, { children: [_jsx(Input, { id: "tx-id", placeholder: "The contract transaction ID", value: contractTxId, onChange: function (e) { return setContractTxId(e.target.value); } }, void 0), _jsx(Button, __assign({ onClick: function () { return catchAndAlert(allocateTokens()); } }, { children: "Allocate Tokens" }), void 0), _jsx(Button, __assign({ onClick: function () { return catchAndAlert(close()); } }, { children: "Close voting" }), void 0)] }, void 0))] }, void 0));
};
export default Administrate;
