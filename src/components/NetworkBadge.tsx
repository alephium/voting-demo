import styled from 'styled-components'
import { NetworkType } from '../util/types'

interface NetworkBadgeProps {
  networkType: NetworkType
}

export const NetworkBadge = ({ networkType }: NetworkBadgeProps) => {
  const networkTypeToText = (networkType: NetworkType) => {
    if (networkType === NetworkType.MAINNET) {
      return 'Mainnet'
    } else if (networkType === NetworkType.TESTNET) {
      return 'Testnet'
    } else if (networkType === NetworkType.UNKNOWN) {
      return 'Unknown network'
    } else {
      return 'Unreachable node'
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Badge>{networkTypeToText(networkType)}</Badge>
      {networkType !== NetworkType.TESTNET && <DangerLogo />}
    </div>
  )
}

const DangerLogo = () => {
  return <DangerLogoSpan>&#9888;</DangerLogoSpan>
}

const DangerLogoSpan = styled.span`
  color: red;
  font-size: 25px;
  margin-left: 10px;
`

const Badge = styled.button`
  background-color: white;
  border-radius: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: #e7e7e7;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 20px;
  padding-top: 0px;
  height: 30px;
`
