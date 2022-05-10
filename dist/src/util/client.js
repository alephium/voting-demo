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
// import {
//   Api,
//   ApiConfig,
//   TxResult,
//   HttpResponse,
//   ServiceUnavailable,
//   InternalServerError,
//   NotFound,
//   Unauthorized,
//   BadRequest,
//   TxStatus,
//   Confirmed,
//   ContractState
// } from 'alephium-web3/dist/api/api-alephium'
import { convertHttpResponse, node } from 'alephium-web3';
import { loadSettingsOrDefault } from './settings';
import { NetworkType } from './types';
export var CONTRACTGAS = 6000000;
var Client = /** @class */ (function () {
    function Client(baseUrl, walletConnect, provider) {
        var _this = this;
        this.getContractRef = function (txId) { return __awaiter(_this, void 0, void 0, function () {
            var txStatus, _a, confirmed, block, _b, tx, contractOutput, contractAddress, tokenId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = convertHttpResponse;
                        return [4 /*yield*/, this.api.transactions.getTransactionsStatus({
                                txId: txId
                            })];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
                    case 2:
                        txStatus = _c.sent();
                        if (!('blockHash' in txStatus)) return [3 /*break*/, 4];
                        confirmed = txStatus;
                        _b = convertHttpResponse;
                        return [4 /*yield*/, this.api.blockflow.getBlockflowBlocksBlockHash(confirmed.blockHash)];
                    case 3:
                        block = _b.apply(void 0, [_c.sent()]);
                        tx = block.transactions.find(function (tx) { return tx.unsigned.txId === txId; });
                        if (tx) {
                            contractOutput = tx.generatedOutputs.find(function (output) { return !('locktime' in output); });
                            if (contractOutput) {
                                console.log(contractOutput, 'output');
                                contractAddress = contractOutput.address;
                                tokenId = contractOutput.tokens[0].id;
                                console.log(contractAddress);
                                if (contractAddress) {
                                    return [2 /*return*/, {
                                            contractAddress: contractAddress,
                                            tokenId: tokenId
                                        }];
                                }
                                else {
                                    return [2 /*return*/, Promise.reject('The contract address is undefined')];
                                }
                            }
                            else {
                                return [2 /*return*/, Promise.reject('No token found')];
                            }
                        }
                        else {
                            return [2 /*return*/, Promise.reject('No contract found')];
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, Promise.reject('Not confirmed yet')];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getContractState = function (txId) { return __awaiter(_this, void 0, void 0, function () {
            var contractRef, group, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getContractRef(txId)];
                    case 1:
                        contractRef = _c.sent();
                        _a = convertHttpResponse;
                        return [4 /*yield*/, this.api.addresses.getAddressesAddressGroup(contractRef.contractAddress)];
                    case 2:
                        group = _a.apply(void 0, [_c.sent()]);
                        _b = convertHttpResponse;
                        return [4 /*yield*/, this.api.contracts.getContractsAddressState(contractRef.contractAddress, { group: group.group })];
                    case 3: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
                }
            });
        }); };
        this.getNVoters = function (txId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getContractState(txId).then(function (result) {
                        return result.fields.length - 6;
                    })];
            });
        }); };
        var apiConfig = {
            baseUrl: baseUrl
        };
        this.api = new node.Api(apiConfig);
        this.accounts = [];
        this.walletConnect = walletConnect;
        this.provider = provider;
        this.settings = loadSettingsOrDefault();
    }
    Client.prototype.getActiveAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.accounts[0] || Promise.reject('No active address')];
            });
        });
    };
    // fetch = async <T, E extends BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>(
    //   query: Promise<HttpResponse<T, E>>
    // ): Promise<T> => {
    //   const result = await query
    //   if (result.error) {
    //     return Promise.reject(new Error(result.error.detail))
    //   }
    //   return result.data
    // }
    Client.prototype.deployContract = function (fromAddress, contract, state, issueTokenAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contract.paramsForDeployment({
                            signerAddress: fromAddress,
                            initialFields: state,
                            issueTokenAmount: issueTokenAmount
                        })];
                    case 1:
                        params = _a.sent();
                        return [2 /*return*/, this.provider.signContractCreationTx(params)];
                }
            });
        });
    };
    Client.prototype.deployScript = function (fromAddress, bytecode) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    signerAddress: fromAddress,
                    bytecode: bytecode,
                    submitTx: true
                };
                return [2 /*return*/, this.provider.signScriptTx(params)];
            });
        });
    };
    Client.prototype.getTxStatus = function (txId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = convertHttpResponse;
                        return [4 /*yield*/, this.api.transactions.getTransactionsStatus({
                                txId: txId
                            })];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Client.prototype.getNetworkType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tResult, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = convertHttpResponse;
                        return [4 /*yield*/, this.api.infos.getInfosChainParams()];
                    case 1:
                        tResult = _a.apply(void 0, [_b.sent()]);
                        if (tResult.networkId == 0) {
                            return [2 /*return*/, NetworkType.MAINNET];
                        }
                        else if (tResult.networkId == 1) {
                            return [2 /*return*/, NetworkType.TESTNET];
                        }
                        else {
                            return [2 /*return*/, NetworkType.UNKNOWN];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Client;
}());
export default Client;
