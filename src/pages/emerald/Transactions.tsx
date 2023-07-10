import { Link, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetRuntimeTransactions, Runtime, RuntimeTransactionList } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import { useState } from 'react'

export function Transactions({ paratime = 'emerald' as Runtime }) {
  const [removeSpam, setRemoveSpam] = useState(false)
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const originalResult = useGetRuntimeTransactions(paratime, { ...searchParams })

  let result = originalResult
  if (removeSpam && originalResult.data?.data.transactions) {
    result = {
      ...originalResult,
      data: {
        ...originalResult.data,
        data: {
          ...originalResult.data.data,
          transactions: originalResult.data.data.transactions.filter(a => a.nonce_0 <= 1000)
        }
      }
    }
  }

  return (
    <>
      <h2>Transactions</h2>
      <label><input type="checkbox" checked={removeSpam} onChange={(e) => setRemoveSpam(e.target.checked)} /> remove spam (nonce&gt;1000)</label>
      <DisplayData<RuntimeTransactionList>
        result={result}
        customDisplay={{
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
              if (value === 'evm.Call' && !parentValue.body?.data && parentValue.amount !== "0") {
                return <span>{value} (transfer?)</span>
              }
              // erc-20 from: 0x0  mint
              // erc-20 to:   0x0  burn
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
              return <Link to={`/${paratime}/transactions/${value}`}>{value}</Link>
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
        }}
      />
    </>
  )
}
