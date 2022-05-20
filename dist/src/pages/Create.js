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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Container, Button } from '../components/Common';
import { Input } from '../components/Inputs';
import { useContext } from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../App';
import { stringToHex } from 'alephium-web3';
import { votingContract } from '../util/voting';
import { useEffect } from 'react';
import { addressToGroup } from 'alephium-web3';
import { NavLink } from 'react-router-dom';
import { catchAndAlert, clearIntervalIfConfirmed } from '../util/util';
import { emptyCache } from '../util/types';
import VotersTable from '../components/VotersTable';
import VoterInput from '../components/VoterInput';
import { TxStatusSnackBar } from '../components/TxStatusSnackBar';
var totalNumberOfGroups = 4;
var AddressInput = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var AddressGroup = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: rgba(0, 0, 0, 0.9);\n  font-weight: 700;\n  margin: 1rem 0rem 1rem 0rem;\n  border-radius: 12px;\n  width: 3.7rem;\n  height: 3.2rem;\n  text-align: center;\n  line-height: 3.2rem;\n"], ["\n  color: rgba(0, 0, 0, 0.9);\n  font-weight: 700;\n  margin: 1rem 0rem 1rem 0rem;\n  border-radius: 12px;\n  width: 3.7rem;\n  height: 3.2rem;\n  text-align: center;\n  line-height: 3.2rem;\n"])));
export var Create = function () {
    var context = useContext(GlobalContext);
    var _a = useState([]), voters = _a[0], setVoters = _a[1];
    var _b = useState(undefined), admin = _b[0], setAdmin = _b[1];
    var _c = useState(context.cache.createTxResult), txResult = _c[0], setResult = _c[1];
    var _d = useState(undefined), txStatus = _d[0], setStatus = _d[1];
    var _e = useState(undefined), typedStatus = _e[0], setTypedStatus = _e[1];
    var _f = useState(''), title = _f[0], setTitle = _f[1];
    var _g = useState(false), isLoading = _g[0], setIsLoading = _g[1];
    function addressFromString(address) {
        var group = addressToGroup(address, totalNumberOfGroups);
        return { address: address, group: group };
    }
    var updateAdmin = function (address) {
        if (address != '') {
            setAdmin(addressFromString(address));
        }
        else {
            setAdmin(undefined);
        }
    };
    var addVoter = function (voter) {
        if (!voters.map(function (voter) { return voter.address; }).includes(voter)) {
            setVoters(__spreadArray(__spreadArray([], voters, true), [addressFromString(voter)], false));
        }
    };
    var removeVoter = function (voter) {
        var newVoters = voters.filter(function (address) { return voter != address.address; });
        setVoters(newVoters);
    };
    var pollTxStatus = function (interval, txResult) {
        var _a;
        (_a = context.apiClient) === null || _a === void 0 ? void 0 : _a.getTxStatus(txResult === null || txResult === void 0 ? void 0 : txResult.txId).then(function (fetchedStatus) {
            setStatus(fetchedStatus);
            var status = fetchedStatus;
            setTypedStatus(status);
            if (clearIntervalIfConfirmed(fetchedStatus, interval)) {
                context.editCache({ currentContractId: txResult.txId });
            }
        });
    };
    useEffect(function () {
        if (txResult) {
            context.editCache({
                createTxResult: txResult
            });
            var interval_1 = setInterval(function () {
                pollTxStatus(interval_1, txResult);
            }, 1000);
            pollTxStatus(interval_1, txResult);
            return function () { return clearInterval(interval_1); };
        }
    }, [txResult]);
    var clear = function () {
        context.editCache(emptyCache());
        setVoters([]);
        setAdmin(undefined);
        setTitle('');
        setResult(undefined);
        setStatus(undefined);
        setTypedStatus(undefined);
    };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.apiClient) return [3 /*break*/, 5];
                    if (!(title == '')) return [3 /*break*/, 1];
                    return [2 /*return*/, Promise.reject('Please provide a title')];
                case 1:
                    if (!(admin == undefined)) return [3 /*break*/, 2];
                    return [2 /*return*/, Promise.reject('Please Provide an administrator address')];
                case 2:
                    setIsLoading(true);
                    console.log("======== params0 ".concat(JSON.stringify(context.accounts)));
                    console.log("======== ".concat(JSON.stringify(votingContract)));
                    return [4 /*yield*/, votingContract.paramsForDeployment({
                            signerAddress: context.accounts[0].address,
                            initialFields: {
                                title: stringToHex(title),
                                yes: 0,
                                no: 0,
                                isClosed: false,
                                initialized: false,
                                admin: admin === null || admin === void 0 ? void 0 : admin.address,
                                voters: voters.map(function (voter) { return voter.address; })
                            },
                            issueTokenAmount: voters.length
                        })];
                case 3:
                    params = _a.sent();
                    console.log("======== params1, ".concat(JSON.stringify(params)));
                    return [4 /*yield*/, context.apiClient.provider.signDeployContractTx(params)];
                case 4:
                    result = _a.sent();
                    if (result) {
                        setResult(result);
                    }
                    console.log("======= ".concat(JSON.stringify(result)));
                    setIsLoading(false);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(_Fragment, { children: [txStatus && (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && _jsx(TxStatusSnackBar, { txStatus: txStatus, txId: txResult.txId }), (txResult === null || txResult === void 0 ? void 0 : txResult.txId) && typedStatus && typedStatus.type == 'Confirmed' && (_jsxs(_Fragment, { children: [_jsx(Button, { children: _jsx(NavLink, __assign({ to: "/administrate/".concat(txResult.txId) }, { children: "Allocate voting tokens" })) }), _jsx(Button, __assign({ onClick: clear }, { children: "Create another poll" }))] })), !txResult && (_jsxs(Container, { children: [_jsx(Input, { id: "voting-title", placeholder: "Subject to vote on", value: title, onChange: function (e) { return setTitle(e.target.value); } }), _jsxs(AddressInput, { children: [_jsx(Input, { id: "admin-address", placeholder: "The administrator address", value: admin != undefined ? admin.address : '', onChange: function (e) { return updateAdmin(e.target.value); } }), _jsx(AddressGroup, { children: admin !== undefined && admin.address !== '' && 'G' + admin.group })] }), _jsx(VotersTable, { voters: voters, removeVoter: removeVoter, admin: admin }), _jsx(VoterInput, { addVoter: addVoter }), _jsx(Button, __assign({ onClick: function () { return catchAndAlert(submit()); } }, { children: "Create" })), isLoading && _jsx("div", { children: "Waiting for wallet response..." })] }))] }));
};
export default Create;
var templateObject_1, templateObject_2;
