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
import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../App';
import { Container, Button } from '../../components/Common';
import TxStatusSnackBar from '../../components/TxStatusSnackBar';
import { clearIntervalIfConfirmed } from '../../util/util';
import { votingScript } from '../../util/voting';
var SubmitVote = function (_a) {
    var contractRef = _a.contractRef, contractTxId = _a.contractTxId, title = _a.title;
    var context = useContext(GlobalContext);
    var _b = useState(undefined), txStatus = _b[0], setTxStatus = _b[1];
    var _c = useState(context.cache.voteTxResult), txResult = _c[0], setResult = _c[1];
    var _d = useState(undefined), typedStatus = _d[0], setTypedStatus = _d[1];
    var pollTxStatus = function (interval, txResult) {
        var _a;
        (_a = context.apiClient) === null || _a === void 0 ? void 0 : _a.getTxStatus(txResult === null || txResult === void 0 ? void 0 : txResult.txId).then(function (fetchedStatus) {
            setTxStatus(fetchedStatus);
            setTypedStatus(fetchedStatus);
            clearIntervalIfConfirmed(fetchedStatus, interval);
        });
    };
    useEffect(function () {
        if (txResult) {
            context.editCache({ voteTxResult: txResult });
            var interval_1 = setInterval(function () {
                pollTxStatus(interval_1, txResult);
            }, 1000);
            pollTxStatus(interval_1, txResult);
            return function () { return clearInterval(interval_1); };
        }
    }, [txResult]);
    var vote = function (choice) { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(contractRef && context.apiClient && contractTxId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, votingScript.paramsForDeployment({
                            signerAddress: context.accounts[0].address,
                            initialFields: { contractId: contractRef.tokenId, tokenId: contractRef.tokenId, choice: choice }
                        })];
                case 1:
                    params = _a.sent();
                    return [4 /*yield*/, context.apiClient.provider.signExecuteScriptTx(params)];
                case 2:
                    result = _a.sent();
                    setResult(result);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { children: [txStatus && (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && _jsx(TxStatusSnackBar, { txStatus: txStatus, txId: txResult.txId }), (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && typedStatus && typedStatus.type == 'Confirmed' && (_jsxs(Container, __assign({ style: { maxWidth: '400px', textAlign: 'center', lineHeight: '1.5' } }, { children: [_jsx("p", { children: "Thanks for voting!" }), _jsx("p", { children: "Reload the contract when the administrator has closed the vote to see the results." })] }))), !txResult && (_jsxs(Container, { children: [_jsx("p", { children: title }), _jsx(Button, __assign({ onClick: function () { return vote(true); } }, { children: "Yes" })), _jsx(Button, __assign({ onClick: function () { return vote(false); } }, { children: "No" }))] }))] }));
};
export default SubmitVote;
