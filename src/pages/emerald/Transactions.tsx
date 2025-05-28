import * as oasis from '@oasisprotocol/client'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeTransactions, Runtime, RuntimeTransactionList } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import TryCborDecode from '../../utils/TryCborDecode'

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
      <ul style={{maxHeight: 400, maxWidth: 400, overflow: 'auto'}}>
        {/* https://github.com/oasisprotocol/nexus/blob/5db62e2/api/spec/v1.yaml#L3296-L3313 */}
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=accounts.Transfer`}>accounts.Transfer</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=evm.Call`}>evm.Call</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=evm.Create`}>evm.Create</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=consensus.Deposit`}>consensus.Deposit</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=consensus.Withdraw`}>consensus.Withdraw</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=consensus.Delegate`}>consensus.Delegate</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=consensus.Undelegate`}>consensus.Undelegate</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=rofl.Create`}>rofl.Create</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=rofl.Register`}>rofl.Register</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=rofl.Remove`}>rofl.Remove</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=rofl.Update`}>rofl.Update</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.ProviderCreate`}>roflmarket.ProviderCreate</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.ProviderUpdate`}>roflmarket.ProviderUpdate</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.ProviderRemove`}>roflmarket.ProviderRemove</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.InstanceCreate`}>roflmarket.InstanceCreate</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.InstanceTopUp`}>roflmarket.InstanceTopUp</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.InstanceCancel`}>roflmarket.InstanceCancel</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=roflmarket.InstanceExecuteCmds`}>roflmarket.InstanceExecuteCmds</Link></li>
        <li><Link to={`/${paratime}/transactions?size=100&page=1&method=`}>Unknown</Link></li>
      </ul>
      <label><input type="checkbox" checked={removeSpam} onChange={(e) => setRemoveSpam(e.target.checked)} /> remove spam (nonce&gt;1000)</label>
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
            const link = <Link to={`/${paratime}/transactions?limit=100&offset=0&method=${value}`}>{value}</Link>
            if (parentValue.is_likely_native_token_transfer) {
              return <span>{link} (transfer?)</span>
            }
            return <span>{link}</span>
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
          'transactions.0.body.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          // roflmarket.InstanceExecuteCmds
          'transactions.0.body.cmds.0': ({ value }) => {
            return <TryCborDecode base64Value={value}></TryCborDecode>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
