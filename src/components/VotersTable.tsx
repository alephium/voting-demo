import styled from 'styled-components'
import { Address } from '../util/types'
import { Button } from './Common'

interface VotersTableProps {
  voters: Address[]
  removeVoter: (voter: string) => void
  admin?: Address
}
export const VotersTable = ({ voters, removeVoter, admin }: VotersTableProps) => {
  return voters.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <AlertSpan>Voters addresses should be in the administrator address Group {admin.group}</AlertSpan>
      ) : null}
    </div>
  ) : null
}

const AlertSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #721c24;
  margin-bottom: 20px;
  background-color: #f8d7da;
  width: 100%;
  height: 50px;
  border: 1px solid;
  border-radius: 6px;
`
export default VotersTable
