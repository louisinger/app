import Result from 'components/result'
import Spinner from 'components/spinner'
import Modal from './modal'

interface MarinaDepositModalProps {
  data: string
  result: string
  reset: () => void
  step: number
}

const MarinaDepositModal = ({
  data,
  result,
  reset,
  step,
}: MarinaDepositModalProps) => {
  const mainMessage = [
    'Preparing transaction...',
    'Waiting for confirmation...',
  ][step]
  const secondaryMessage = [
    'Waiting for Fuji approval',
    'Confirm this transaction in your Marina wallet',
  ][step]
  return (
    <Modal id="marina-deposit-modal" reset={reset}>
      {result && <Result data={data} result={result} reset={reset} />}
      {!result && (
        <>
          <Spinner />
          <h3 className="mt-4">{mainMessage}</h3>
          <p className="confirm">{secondaryMessage}</p>
        </>
      )}
    </Modal>
  )
}

export default MarinaDepositModal
