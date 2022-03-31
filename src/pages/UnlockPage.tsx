import ReactModal from 'react-modal'
import styled from 'styled-components'
import { Button, Container } from '../components/Common'

interface Props {
  isModalOpen: boolean
  onUnlock: () => void
}

function noop() {
  // do nothing.
}

const Page = ({ isModalOpen, onUnlock }: Props) => {
  return (
    <Modal
      isOpen={isModalOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={noop}
      ariaHideApp={false}
    >
      <Container>
        <h1>Voting demo requires an action</h1>
        <p>Please unlock your wallet in order to use this dApp.</p>
        <p>
          (It needs to so it can use your wallet&apos;s specified public crypto-node URL, explorer API URL, and explorer
          URL.)
        </p>
        <Button onClick={() => onUnlock()}>Unlock</Button>
      </Container>
    </Modal>
  )
}

const Modal = styled(ReactModal)`
  width: 500px;
  margin: auto;
  font-family: Arial;
`

export default Page
