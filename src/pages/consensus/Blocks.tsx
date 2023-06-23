import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayContext, DisplayData } from '../../DisplayData'
import { useGetConsensusBlocks, BlockList } from '../../oasis-indexer/generated/api'

export function Blocks() {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Blocks</h2>
      <CustomDisplayContext.Provider value={{
        fieldPriority: {
          'blocks[*].height': -4,
        },
        fieldDisplay: {
          'blocks[*].height': ({ value }) => {
            return <span>
              <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
              ,&nbsp;
              <Link to={`/consensus/events?offset=0&limit=100&block=${value}`}>events</Link>
            </span>
          },
          'blocks[*].num_transactions': ({ value, parentValue }: { value: number, parentValue: BlockList['blocks'][number] }) => {
            return <Link to={`/consensus/transactions/?offset=0&limit=100&block=${parentValue.height}`}>{value}</Link>
          },
          'blocks[*].timestamp': ({ value }) => {
            return <span>
              {value}
              &nbsp;
              <Link to={`/consensus/transactions?offset=0&limit=100&after=${value}&before=${new Date(new Date(value).getTime() + 1).toISOString()}`}>txs</Link>
            </span>
          },
        },
      }}>
        <DisplayData result={useGetConsensusBlocks({ ...searchParams })}></DisplayData>
      </CustomDisplayContext.Provider>
    </>
  )
}
