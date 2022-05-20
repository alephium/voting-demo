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
import { Alert, ALERT_PROPS } from './Alert';
import { Button } from './Common';
export var VotersTable = function (_a) {
    var voters = _a.voters, removeVoter = _a.removeVoter, admin = _a.admin;
    return voters.length > 0 ? (_jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' } }, { children: [_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), _jsx("th", { children: "Address" }), _jsx("th", { children: "Group" }), _jsx("th", {})] }) }), _jsx("tbody", __assign({ style: { fontSize: '14px' } }, { children: voters.map(function (voter, index) { return (_jsxs("tr", { children: [_jsx("td", { children: index + 1 }), _jsx("td", { children: voter.address }), _jsx("td", { children: _jsx("span", __assign({ style: { color: admin === undefined || (admin && voter.group === admin.group) ? 'black' : 'red' } }, { children: voter.group })) }), _jsxs("td", { children: [' ', _jsx(Button, __assign({ style: {
                                                marginLeft: '10px',
                                                fontSize: '10px'
                                            }, onClick: function () { return removeVoter(voter.address); } }, { children: '\u274C' }))] })] }, index)); }) }))] }), admin && voters.filter(function (voter) { return voter.group !== admin.group; }).length > 0 ? (_jsx("div", { children: _jsxs(Alert, __assign({ color: ALERT_PROPS.DANGER.color, backgroundColor: ALERT_PROPS.DANGER.backgroundColor }, { children: ["Voters addresses should be in the administrator address Group ", admin.group] })) })) : null] }))) : null;
};
export default VotersTable;
