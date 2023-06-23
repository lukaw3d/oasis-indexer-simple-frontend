import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayContext, DisplayData } from '../../DisplayData'
import { useGetConsensusEvents } from '../../oasis-indexer/generated/api'

export function Events() {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Events</h2>
      <CustomDisplayContext.Provider value={{
        fieldPriority: {
          'events[*].block': -4,
          'events[*].type': -3,
          'events[*].body': 100,
        },
        fieldDisplay: {
          'events[*].block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'events[*].type': ({ value }) => {
            return <Link to={`/consensus/events/?limit=100&offset=0&type=${value}`}>{value}</Link>
          },
          'events[*].tx_hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetConsensusEvents({ ...searchParams })}></DisplayData>
      </CustomDisplayContext.Provider>
    </>
  )
}
