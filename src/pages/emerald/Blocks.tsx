import { Link, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetRuntimeBlocks, Runtime, RuntimeBlockList } from '../../oasis-indexer/generated/api'

export function Blocks({ paratime = 'emerald' as Runtime }) {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Blocks</h2>
      <DisplayData<RuntimeBlockList>
        result={useGetRuntimeBlocks(paratime, { ...searchParams })}
        customDisplay={{
          fieldPriority: {
            'blocks.0.round': -4,
          },
          fieldDisplay: {
            'blocks.0.round': ({ value }) => {
              return <span>
                <Link to={`/${paratime}/blocks?limit=1&to=${value}`}>{value}</Link>
                ,&nbsp;
                <Link to={`/${paratime}/events?offset=0&limit=100&block=${value}`}>events</Link>
              </span>
            },
            'blocks.0.num_transactions': ({ value, parentValue }) => {
              return <Link to={`/${paratime}/transactions/?offset=0&limit=100&block=${parentValue.round}`}>{value}</Link>
            },
            'blocks.0.timestamp': ({ value }) => {
              return <span>
                {value}
                &nbsp;
                <Link to={`/${paratime}/transactions?offset=0&limit=100&after=${value}&before=${new Date(new Date(value).getTime() + 1).toISOString()}`}>txs</Link>
              </span>
            },
          },
        }}
      />
    </>
  )
}
