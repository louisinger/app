import { useContext, useState } from 'react'
import { contractIsClosed } from 'lib/contracts'
import { Contract } from 'lib/types'
import EmptyState from 'components/layout/empty'
import RedeemModal from 'components/modals/redeem'
import { WalletContext } from 'components/providers/wallet'
import ContractRow from './row'
import Spinner from 'components/spinner'
import { ContractsContext } from 'components/providers/contracts'

interface ContractsListProps {
  showActive: boolean
}

const ContractsList = ({ showActive }: ContractsListProps) => {
  const { connected } = useContext(WalletContext)
  const { contracts, loading } = useContext(ContractsContext)

  const [redeem, setReedem] = useState<Contract>()
  const [assetBalance, setAssetBalance] = useState(0)
  const [step, setStep] = useState(0)
  const [data, setData] = useState('')
  const [result, setResult] = useState('')

  const reset = () => {
    setData('')
    setResult('')
  }

  if (!connected)
    return (
      <EmptyState>🔌 Connect your wallet to view your contracts</EmptyState>
    )
  if (loading) return <Spinner />
  if (!contracts) return <EmptyState>Error getting contracts</EmptyState>

  const filteredContracts = contracts.filter((contract) =>
    showActive ? !contractIsClosed(contract) : contractIsClosed(contract),
  )
  if (filteredContracts.length === 0)
    return <EmptyState>No contracts yet</EmptyState>

  return (
    <>
      <RedeemModal
        balance={assetBalance}
        contract={redeem}
        data={data}
        result={result}
        reset={reset}
        step={step}
      />
      {filteredContracts &&
        filteredContracts.map((contract: Contract, index: number) => (
          <ContractRow
            key={index}
            contract={contract}
            setAssetBalance={setAssetBalance}
            setData={setData}
            setResult={setResult}
            setRedeem={setReedem}
            setStep={setStep}
          />
        ))}
    </>
  )
}

export default ContractsList
