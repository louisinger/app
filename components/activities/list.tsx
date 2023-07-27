import { useContext } from 'react'
import { Activity, ActivityType } from 'lib/types'
import EmptyState from 'components/layout/empty'
import SomeError from 'components/layout/error'
import { WalletContext } from 'components/providers/wallet'
import ActivityRow from './row'
import Spinner from 'components/spinner'
import { ContractsContext } from 'components/providers/contracts'

interface ActivitiesListProps {
  activityType: ActivityType
}

const ActivitiesList = ({ activityType }: ActivitiesListProps) => {
  const { wallets, initializing } = useContext(WalletContext)
  const { activities, loading } = useContext(ContractsContext)

  if (loading || initializing) return <Spinner />
  if (!wallets.length)
    return (
      <EmptyState>🔌 Connect your wallet to view your activities</EmptyState>
    )
  if (!activities) return <SomeError>Error getting activities</SomeError>

  const filteredActivities = activities.filter((a) => a.type === activityType)
  if (filteredActivities.length === 0)
    return <EmptyState>No activities yet</EmptyState>

  return (
    <div className="activity-list is-box has-pink-border">
      {filteredActivities &&
        filteredActivities.map((activity: Activity, index: number) => (
          <ActivityRow key={index} activity={activity} />
        ))}
      <style jsx>{`
        .activity-list {
          background-color: #fff;
          margin-top: 20px;
          padding: 20px;
        }
      `}</style>
    </div>
  )
}

export default ActivitiesList
