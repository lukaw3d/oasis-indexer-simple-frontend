import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { RoflAppList, useGetRuntimeRoflApps } from '../../oasis-indexer/generated/api'
import { Link } from 'react-router-dom'

export function ROFLApps() {
  const paratime = 'sapphire'
  const originalResult = useGetRuntimeRoflApps(paratime, { limit: 1000 })

  let result = originalResult
  if (originalResult.data?.data.rofl_apps) {
    result = {
      ...originalResult,
      data: {
        ...originalResult.data,
        data: {
          ...originalResult.data.data,
          rofl_apps: originalResult.data.data.rofl_apps.toSorted((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        }
      }
    }
  }
  return (
    <>
      <h2>ROFL Market providers</h2>
      <CustomDisplayProvider<RoflAppList> value={{
        fieldPriority: {
          "rofl_apps.0.date_created": -10,
          "rofl_apps.0.removed": -9,
          "rofl_apps.0.num_active_instances": -8,
          "rofl_apps.0.secrets": 'hide',
          "rofl_apps.0.policy.quotes": 'hide',
          "rofl_apps.0.policy.max_expiration": 'hide',
          "rofl_apps.0.policy.endorsements": 'hide',
          "rofl_apps.0.policy.fees": 'hide',
          "rofl_apps.0.metadata.net.oasis.rofl.version": 'hide',
          "rofl_apps.0.metadata.net.oasis.rofl.description": 'hide',
        },
        fieldDisplay: {
          'rofl_apps.0.removed': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'rofl_apps.0.num_active_instances': ({ value }) => {
            return <span style={value <= 0 ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'rofl_apps.0.admin_eth': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
