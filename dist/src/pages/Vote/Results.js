import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import { GlobalContext } from '../../App';
import { Container } from '../../components/Common';
import { hexStringToStr } from '../../util/util';
var Results = function (_a) {
    var contractTxId = _a.contractTxId;
    var context = useContext(GlobalContext);
    var _b = useState(''), title = _b[0], setTitle = _b[1];
    var _c = useState(''), yes = _c[0], setYes = _c[1];
    var _d = useState(''), no = _d[0], setNo = _d[1];
    if (context.apiClient) {
        context.apiClient.getContractState(contractTxId).then(function (state) {
            var title = hexStringToStr(state.fields[0].value);
            var tmpYes = state.fields[1];
            var tmpNo = state.fields[2];
            setYes(tmpYes.value);
            setNo(tmpNo.value);
            setTitle(title);
        });
    }
    return (_jsxs(Container, { children: [_jsx("p", { children: "The vote is already closed, here are the results:" }, void 0), _jsx("p", { children: title }, void 0), _jsxs("p", { children: ["Yes: ", yes] }, void 0), _jsxs("p", { children: ["No: ", no] }, void 0)] }, void 0));
};
export default Results;
