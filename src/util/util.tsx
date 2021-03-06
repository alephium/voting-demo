import { TxStatus } from 'alephium-js/dist/api/api-alephium'
import { TypedStatus } from './types'

// eslint-disable-next-line
export function catchAndAlert(action: Promise<any>) {
  action.catch((e) => {
    if (e != undefined && e.error != undefined && e.error.detail != undefined) {
      alert(e.error.detail)
    } else {
      alert(e)
    }
  })
}

export function clearIntervalIfConfirmed(fetchedStatus: TxStatus, interval: NodeJS.Timeout): boolean {
  const status = fetchedStatus as TypedStatus
  if (status.type == 'Confirmed') {
    clearInterval(interval)
    return true
  }
  return false
}

export const isNotEmpty = (s: string): boolean => {
  return s !== '' ? true : false
}

export function strToHexString(str: string) {
  return Buffer.from(str).toString('hex')
}

export function hexStringToStr(str: string) {
  return Buffer.from(str, 'hex').toString()
}
