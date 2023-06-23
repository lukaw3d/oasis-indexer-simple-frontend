import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CustomDisplayContext, DisplayData } from '../../DisplayData'
import { useGetConsensusTransactionsTxHash } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function TransactionsHash() {
  const txHash = useParams().txHash!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Transactions</h2>
      <CustomDisplayContext.Provider value={{
        fieldPriority: {
          'block': -4,
          'success': -3,
          'method': -2,
          'body': 100,
        },
        fieldDisplay: {
          'block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'method': ({ value }) => {
            return <Link to={`/consensus/transactions?limit=100&offset=0&method=${value}`}>{value}</Link>
          },
          'fee': ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
          },
          'hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
          'sender': ({ value }) => {
            return <Link to={`/consensus/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetConsensusTransactionsTxHash(txHash, { ...searchParams })}></DisplayData>
      </CustomDisplayContext.Provider>
    </>
  )
}
