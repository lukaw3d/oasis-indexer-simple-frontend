import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetConsensusTransactionsTxHash, Transaction } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function TransactionsHash() {
  const txHash = useParams().txHash!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Transactions</h2>
      <DisplayData<Transaction>
        result={useGetConsensusTransactionsTxHash(txHash, { ...searchParams })}
        customDisplay={{
          fieldPriority: {
            'hash': -5,
            'block': -4,
            'success': -3,
            'method': -2,
            'body': 100,
          },
          fieldDisplay: {
            'block': ({ value }) => {
              return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
            },
            'success': ({ value }) => {
              return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
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
        }}
      />
    </>
  )
}
