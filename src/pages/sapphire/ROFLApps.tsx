import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { RoflAppList, useGetRuntimeRoflApps } from '../../oasis-indexer/generated/api'
import { Link } from 'react-router-dom'

export function ROFLApps() {
  const paratime = 'sapphire'
  const result = useGetRuntimeRoflApps(paratime, { limit: 1000, sort_by: 'created_at_desc' })

  return (
    <>
      <h2>ROFL Market providers</h2>
      <CustomDisplayProvider<RoflAppList> value={{
        fieldPriority: {
          "rofl_apps.0.date_created": -10,
          "rofl_apps.0.removed": -9,
          "rofl_apps.0.num_active_instances": -8,
          "rofl_apps.0.metadata": -7,
          "rofl_apps.0.admin_eth": -6,
          "rofl_apps.0.id": -5,
          "rofl_apps.0.policy": -4,
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
          'rofl_apps.0.id': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
