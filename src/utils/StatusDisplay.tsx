import { CustomDisplayProvider, DisplayData } from '../DisplayData'
import { useGetStatus, useGetRuntimeStatus, Runtime, Layer, Status, RuntimeStatus } from '../oasis-indexer/generated/api'

export function StatusDisplay({ layer }: { layer: Layer }) {
  const consensusResult = useGetStatus({ query: { enabled: layer === 'consensus' } })
  const runtimeResult = useGetRuntimeStatus(layer as Runtime, { query: { enabled: layer !== 'consensus' } })
  const result = layer === 'consensus' ? consensusResult : runtimeResult
  console.log(layer, consensusResult, runtimeResult)
  consensusResult.dataUpdatedAt

  return (
    <div style={{minHeight: '5em'}}>
      <CustomDisplayProvider<Status | RuntimeStatus> value={{
        fieldPriority: {},
        fieldDisplay: {
          'latest_block_time': ({ value }) => {
            const outdated = result.dataUpdatedAt - new Date(value).getTime() > 10 * 60 * 1000
            return <span style={outdated ? {color: 'red'} : {}}>{value}</span>
          },
          'latest_update_age_ms': ({ value }) => {
            const outdated = value > 10 * 60 * 1000
            return <span style={outdated ? {color: 'red'} : {}}>{value}</span>
          },
          'latest_block': ({ value, parentValue }) => {
            if ('latest_node_block' in parentValue) {
              if ((parentValue.latest_node_block - value) > 10 * 60 / 6) {
                return <span style={{color: 'red'}}>{value}</span>
              }
            }
            return <span>{value}</span>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </div>
  )
}
