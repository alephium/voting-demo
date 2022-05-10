export var Action;
(function (Action) {
    Action[Action["Allocate"] = 0] = "Allocate";
    Action[Action["Close"] = 1] = "Close";
})(Action || (Action = {}));
export function emptyCache() {
    return {
        currentContractId: '',
        createTxResult: undefined,
        voteTxResult: undefined,
        administrateTxResult: undefined,
        administrateAction: undefined
    };
}
export var NetworkType;
(function (NetworkType) {
    NetworkType[NetworkType["MAINNET"] = 0] = "MAINNET";
    NetworkType[NetworkType["TESTNET"] = 1] = "TESTNET";
    NetworkType[NetworkType["UNKNOWN"] = 2] = "UNKNOWN";
    NetworkType[NetworkType["UNREACHABLE"] = 3] = "UNREACHABLE";
})(NetworkType || (NetworkType = {}));
