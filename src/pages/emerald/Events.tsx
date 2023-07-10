import { Link, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetRuntimeEvents, RuntimeEventList, Runtime } from '../../oasis-indexer/generated/api'

export function Events({ paratime = 'emerald' as Runtime }) {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Events</h2>
      <DisplayData<RuntimeEventList>
        result={useGetRuntimeEvents(paratime, { ...searchParams })}
        customDisplay={{
          fieldPriority: {
            'events.0.round': -4,
            'events.0.type': -3,
            'events.0.evm_log_name': -2,
            'events.0.evm_log_params': -1,
            'events.0.body': 100,
          },
          fieldDisplay: {
            'events.0.round': ({ value }) => {
              return <Link to={`/${paratime}/blocks?limit=1&to=${value}`}>{value}</Link>
            },
            'events.0.type': ({ value }) => {
              return <Link to={`/${paratime}/events/?limit=100&offset=0&type=${value}`}>{value}</Link>
            },
            'events.0.tx_hash': ({ value }) => {
              return <Link to={`/${paratime}/transactions/${value}`}>{value}</Link>
            },
          },
        }}
      />
    </>
  )
}
