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
          'transactions.0.hash': -5,
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
          'transactions.0.success': ({ value }) => {
            if (value == null) return <span style={{color: 'red'}}>unknown</span>
            return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'transactions.0.method': ({ value, parentValue }) => {
            if (parentValue.is_likely_native_token_transfer) {
              return <span>{value} (transfer?)</span>
            }
            if (value === 'consensus.Withdraw') {
              return <span>
                {value}
                ,&nbsp;
                <Link to={`/${paratime}/events?offset=0&limit=100&block=${parentValue.round + 1}&rel=${parentValue.sender_0}`}>event in next block</Link>
              </span>
            }
            if (value === 'consensus.Deposit') {
              return <span>
                {value}
                ,&nbsp;
                <Link to={`/${paratime}/events?offset=0&limit=100&block=${parentValue.round + 1}&rel=${parentValue.to}`}>event in next block</Link>
              </span>
            }
            return <span>{value}</span>
          },
          'transactions.0.amount': ({ value }) => {
            if (value == null) return null
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'transactions.0.charged_fee': ({ value }) => {
            if (value == null) return null
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'transactions.0.fee': ({ value }) => {
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
            return <Link to={`/${paratime}/transactions/${value}`}>0x{value}</Link>
          },
          'transactions.0.sender_0': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
          'transactions.0.sender_0_eth': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
          'transactions.0.to': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
          'transactions.0.to_eth': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeTransactionsTxHash(paratime, txHash, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
