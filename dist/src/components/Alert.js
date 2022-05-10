var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled from 'styled-components';
export var Alert = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: ", ";\n  margin-bottom: 20px;\n  margin-right: 100px;\n  background-color: ", ";\n  width: 100%;\n  height: 50px;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 60%) inset, -6px -6px 12px 0 rgb(0 0 0 / 7%) inset;\n"], ["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: ", ";\n  margin-bottom: 20px;\n  margin-right: 100px;\n  background-color: ", ";\n  width: 100%;\n  height: 50px;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px 0 rgb(255 255 255 / 60%) inset, -6px -6px 12px 0 rgb(0 0 0 / 7%) inset;\n"])), function (_a) {
    var color = _a.color;
    return color;
}, function (_a) {
    var backgroundColor = _a.backgroundColor;
    return backgroundColor;
});
export var ALERT_PROPS = {
    DANGER: {
        color: '#721c24',
        backgroundColor: '#f8d7da'
    },
    WARNING: {
        color: '#7b773e',
        backgroundColor: '#fff6ad'
    },
    SUCCESS: {
        color: '#1e3d1e',
        backgroundColor: 'lightGreen'
    }
};
export default { Alert: Alert, ALERT_PROPS: ALERT_PROPS };
var templateObject_1;
