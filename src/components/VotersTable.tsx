import { Address } from '../util/types'
import { Alert, ALERT_PROPS } from './Alert'
import { Button } from './Common'

interface VotersTableProps {
  voters: Address[]
  removeVoter: (voter: string) => void
  admin?: Address
}
export const VotersTable = ({ voters, removeVoter, admin }: VotersTableProps) => {
  return voters.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Group</th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '14px' }}>
          {voters.map((voter, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{voter.address}</td>
              <td>
                <span
                  style={{ color: admin === undefined || (admin && voter.group === admin.group) ? 'black' : 'red' }}
                >
                  {voter.group}
                </span>
              </td>
              <td>
                {' '}
                <Button
                  style={{
                    marginLeft: '10px',
                    fontSize: '10px'
                  }}
                  onClick={() => removeVoter(voter.address)}
                >
                  {'\u274C'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {admin && voters.filter((voter) => voter.group !== admin.group).length > 0 ? (
        <div>
          <Alert color={ALERT_PROPS.DANGER.color} backgroundColor={ALERT_PROPS.DANGER.backgroundColor}>
            Voters addresses should be in the administrator address Group {admin.group}
          </Alert>
        </div>
      ) : null}
    </div>
  ) : null
}

export default VotersTable
