import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  isModalOpen: boolean
  onUnlock: (a: 'mainnet' | 'testnet' | 'localhost') => void
  uri?: string
}

function noop() {
  // do nothing.
}

type State = 'network select' | 'pairing'

const Page = ({ isModalOpen, onUnlock, uri }: Props) => {
  const [state, setState] = useState<State>('network select')
  useEffect(() => {
    if (uri !== undefined) {
      setState('pairing')
    } else {
      setState('network select')
    }
  }, [uri])

  return (
    <Modal
      isOpen={isModalOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={noop}
      ariaHideApp={false}
    >
      <Container>
        <Header>This dApp requires an action</Header>
        {state == 'network select' && (
          <>
            <Text>Select the network which your wallet is using</Text>
            <MultiList>
              <MultiItem onClick={() => onUnlock('mainnet')}>Mainnet</MultiItem>
              <MultiItem onClick={() => onUnlock('testnet')}>Testnet</MultiItem>
              <MultiItem onClick={() => onUnlock('localhost')}>Localhost</MultiItem>
            </MultiList>
          </>
        )}
        {state == 'pairing' && (
          <>
            <QRCodeSVG value={uri || ''} size={256} includeMargin={true} />
            <Input value={uri} />
          </>
        )}
      </Container>
    </Modal>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;

  background-image: linear-gradient(-140deg, rgb(255, 93, 81), 67%, rgb(18, 0, 218));
  letter-spacing: 0.02rem;
  border-radius: 12px;
  padding: 4rem;
  box-shadow: 6px 0px 12px 0 rgba(255, 93, 81, 0.6), 0px 6px 12px 0 rgba(18, 0, 218, 0.3);
`

const Header = styled.h1`
  color: rgba(255, 255, 255, 0.84);
  font-weight: 900;
  margin-bottom: 2rem;
`

const Text = styled.p`
  color: rgba(255, 255, 255, 0.67);
  font-weight: 700;
  padding: 1.5rem 2rem;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: -6px -6px 12px 0 rgba(255, 255, 255, 0.1), 6px 6px 12px 0 rgba(0, 0, 0, 0.1);
`

const Input = styled.input`
  color: rgba(255, 255, 255, 0.67);
  font-weight: 700;
  padding: 1.5rem 2rem;
  margin: 1rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  box-shadow: -6px -6px 12px 0 rgba(255, 255, 255, 0.1) inset, 6px 6px 12px 0 rgba(0, 0, 0, 0.1) inset;
  width: 100%;
`

const Modal = styled(ReactModal)`
  width: 600px;
  margin: auto;
  font-family: Roboto, 'Droid Sans', sans-serif;
`

const MultiList = styled.div`
  display: flex;
  flex-direction: row;
`

const MultiItem = styled.div`
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  font-weight: 700;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 6px 6px 12px 0 rgba(255, 255, 255, 0.1) inset, -6px -6px 12px 0 rgba(0, 0, 0, 0.1) inset;
`

export default Page
