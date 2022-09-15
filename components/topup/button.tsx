import { WalletContext } from 'components/providers/wallet'
import { useContext } from 'react'

interface TopupButtonProps {
  minRatio: number
  oracles: string[]
  ratio: number
  setDeposit: (arg0: boolean) => void
  topup: number
}

const TopupButton = ({
  minRatio,
  oracles,
  ratio,
  setDeposit,
  topup,
}: TopupButtonProps) => {
  const { connected } = useContext(WalletContext)

  const enabled =
    connected && topup > 0 && ratio >= minRatio && oracles.length > 0

  return (
    <div className="has-text-centered">
      <button
        className="button is-primary is-cta"
        disabled={!enabled}
        onClick={() => setDeposit(true)}
      >
        Proceed to topup
      </button>
    </div>
  )
}

export default TopupButton
