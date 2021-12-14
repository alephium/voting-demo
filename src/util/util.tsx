import { TxStatus } from 'alephium-js/dist/api/api-alephium'
import { TypedStatus } from '../pages/Create'

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

export function clearIntervalIfConfirmed(fetchedStatus: TxStatus, interval: NodeJS.Timeout): boolean {
  const status = fetchedStatus as TypedStatus
  if (status.type == 'confirmed') {
    clearInterval(interval)
    return true
  }
  return false
}
