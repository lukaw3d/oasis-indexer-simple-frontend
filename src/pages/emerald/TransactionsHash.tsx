import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeTransactionsTxHash, Runtime, RuntimeTransactionList } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function TransactionsHash({ paratime = 'emerald' as Runtime }) {
  const txHash = useParams().txHash!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Transactions</h2>
      <CustomDisplayProvider<RuntimeTransactionList> value={{
        fieldPriority: {
          'transactions.0.round': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.amount': -1,
          'transactions.0.body': 100,
        },
        fieldDisplay: {
          'transactions.0.round': ({ value }) => {
            return <Link to={`/${paratime}/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'transactions.0.amount': ({ value }) => {
            if (value == null) return
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'transactions.0.charged_fee': ({ value }) => {
            if (value == null) return
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'transactions.0.fee': ({ value }) => {
            if (value == null) return
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'transactions.0.hash': ({ value }) => {
            return <span>
              <Link to={`/${paratime}/transactions/${value}`}>{value}</Link>
              ,&nbsp;
              <Link to={`/${paratime}/events?offset=0&limit=100&tx_hash=${value}`}>events</Link>
            </span>
          },
          'transactions.0.eth_hash': ({ value }) => {
            if (value == null) return null
            return <span>0x{value}</span>
          },
          'transactions.0.sender_0': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
          'transactions.0.to': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeTransactionsTxHash(paratime, txHash, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
