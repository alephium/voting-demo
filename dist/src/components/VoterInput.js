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
import { useState } from 'react';
import { isNotEmpty } from '../util/util';
import { Button } from './Common';
import { Input } from './Inputs';
export var VoterInput = function (_a) {
    var addVoter = _a.addVoter;
    var _b = useState(''), voter = _b[0], setVoter = _b[1];
    var handleOnChange = function (e) {
        setVoter(e.target.value);
    };
    var isAddressValid = isNotEmpty;
    var handleOnClick = function () {
        if (isAddressValid(voter)) {
            addVoter(voter);
            setVoter('');
        }
        else {
            alert('Please enter a valid address');
        }
    };
    return (_jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center' } }, { children: [_jsx(Input, { id: "voterInput", placeholder: "Please enter a voter address", onChange: function (e) { return handleOnChange(e); }, value: voter }, void 0), _jsx(Button, __assign({ onClick: function () { return handleOnClick(); }, style: { marginLeft: '1rem' } }, { children: "+" }), void 0)] }), void 0));
};
export default VoterInput;
