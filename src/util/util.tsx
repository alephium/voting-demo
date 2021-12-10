// eslint-disable-next-line
export function catchAndAlert(action: Promise<any>) {
  action.catch((e) => {
    if (e.error != undefined && e.error.detail != undefined) {
      alert(e.error.detail)
    } else {
      alert(e)
    }
  })
}
