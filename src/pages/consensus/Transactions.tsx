import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetConsensusTransactions, TransactionList } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import { useState } from 'react'

export function Transactions() {
  const [removeSpam, setRemoveSpam] = useState(false)
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const originalResult = useGetConsensusTransactions({ ...searchParams })

  let result = originalResult
  if (removeSpam && originalResult.data?.data.transactions) {
    result = {
      ...originalResult,
      data: {
        ...originalResult.data,
        data: {
          ...originalResult.data.data,
          transactions: originalResult.data.data.transactions.filter(a => {
            // @ts-expect-error Bad method types
            return a.nonce <= 1000 && a.method !== 'consensus.Meta'
          })
        }
      }
    }
  }

  return (
    <>
      <h2>Transactions</h2>
      <label><input type="checkbox" checked={removeSpam} onChange={(e) => setRemoveSpam(e.target.checked)} /> remove spam (nonce&gt;1000 and not consensus.Meta (always has nonce 0))</label>
      <CustomDisplayProvider<TransactionList> value={{
        fieldPriority: {
          'transactions.0.hash': -5,
          'transactions.0.block': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.body': 100,
        },
        fieldDisplay: {
          'transactions.0.block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'transactions.0.success': ({ value }) => {
            return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'transactions.0.method': ({ value }) => {
            return <Link to={`/consensus/transactions?limit=100&offset=0&method=${value}`}>{value}</Link>
          },
          'transactions.0.fee': ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
          },
          'transactions.0.hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
          'transactions.0.sender': ({ value }) => {
            return <Link to={`/consensus/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
