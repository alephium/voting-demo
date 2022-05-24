// eslint-disable-next-line
export function catchAndAlert(action) {
    action.catch(function (e) {
        if (e != undefined && e.error != undefined && e.error.detail != undefined) {
            alert(e.error.detail);
        }
        else {
            alert(e);
        }
    });
}
export function clearIntervalIfConfirmed(fetchedStatus, interval) {
    var status = fetchedStatus;
    if (status.type == 'Confirmed') {
        clearInterval(interval);
        return true;
    }
    return false;
}
export var isNotEmpty = function (s) {
    return s !== '' ? true : false;
};
export function strToHexString(str) {
    return Buffer.from(str).toString('hex');
}
export function hexStringToStr(str) {
    return Buffer.from(str, 'hex').toString();
}
