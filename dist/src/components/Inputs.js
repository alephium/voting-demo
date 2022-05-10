var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
export var Input = function (_a) {
    var id = _a.id, placeholder = _a.placeholder, value = _a.value, onChange = _a.onChange, type = _a.type;
    return (_jsx(StyledInputDiv, { children: _jsx(StyledInput, { id: id, placeholder: placeholder, value: value, type: type ? type : 'text', onChange: function (e) { return onChange(e); } }, void 0) }, void 0));
};
var StyledInputDiv = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 5px;\n  flex-grow: 1;\n\n  text-decoration: none;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 1rem 0rem;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 60%), -6px -6px 12px 0 rgb(0 0 0 / 7%);\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 5px;\n  flex-grow: 1;\n\n  text-decoration: none;\n  color: rgba(0, 0, 0, 0.9);\n  cursor: pointer;\n  padding: 1.2rem 1.6rem;\n  font-weight: 700;\n  margin: 1rem 0rem;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 60%), -6px -6px 12px 0 rgb(0 0 0 / 7%);\n"])));
var StyledInput = styled.input(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-weight: 600;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  transition: all 0.15s ease-out 0s;\n  margin-top: auto;\n  margin-bottom: auto;\n\n  &:-webkit-autofill,\n  &:-webkit-autofill:hover,\n  &:-webkit-autofill:focus,\n  &:-webkit-autofill:active {\n    transition: background-color 600000s 0s, color 600000s 0s;\n  }\n\n  &:active {\n    background-color: transparent;\n  }\n"], ["\n  font-weight: 600;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  transition: all 0.15s ease-out 0s;\n  margin-top: auto;\n  margin-bottom: auto;\n\n  &:-webkit-autofill,\n  &:-webkit-autofill:hover,\n  &:-webkit-autofill:focus,\n  &:-webkit-autofill:active {\n    transition: background-color 600000s 0s, color 600000s 0s;\n  }\n\n  &:active {\n    background-color: transparent;\n  }\n"])));
export default Input;
var templateObject_1, templateObject_2;
