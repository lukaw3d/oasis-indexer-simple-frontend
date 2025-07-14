
import { Link } from 'react-router-dom'
import { useGetRuntimeRoflAppsId, Runtime } from '../oasis-indexer/generated/api'

export default function RuntimeSchedulerReplicas(params: {paratime: Runtime, address: `rofl1${string}` | string}) {
  const request = useGetRuntimeRoflAppsId(params.paratime, params.address)
  return <span>
    <Link to={`https://explorer.dev.oasis.io/search?q=${params.address}`}>{params.address}</Link>
    {' '}
    <span style={request.data?.data && request.data?.data.num_active_instances <= 0 ? {color: 'red'} : {}}>
      active replicas: {request.data?.data.num_active_instances}
    </span>
  </span>
}
