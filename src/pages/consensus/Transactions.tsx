import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayContext, DisplayData } from '../../DisplayData'
import { useGetConsensusTransactions } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function Transactions() {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Transactions</h2>
      <CustomDisplayContext.Provider value={{
        fieldPriority: {
          'transactions[*].block': -4,
          'transactions[*].success': -3,
          'transactions[*].method': -2,
          'transactions[*].body': 100,
        },
        fieldDisplay: {
          'transactions[*].block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'transactions[*].method': ({ value }) => {
            return <Link to={`/consensus/transactions?limit=100&offset=0&method=${value}`}>{value}</Link>
          },
          'transactions[*].fee': ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
          },
          'transactions[*].hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
          'transactions[*].sender': ({ value }) => {
            return <Link to={`/consensus/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetConsensusTransactions({ ...searchParams })}></DisplayData>
      </CustomDisplayContext.Provider>
    </>
  )
}
