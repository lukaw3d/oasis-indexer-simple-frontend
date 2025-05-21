/* eslint-disable @typescript-eslint/no-unused-vars */
import * as oasis from '@oasisprotocol/client'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeTransactions } from '../../oasis-indexer/generated/api'
import TryCborDecode from '../../utils/TryCborDecode'

export function ROFL() {
  const paratime = 'sapphire'
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const results = [
    useGetRuntimeTransactions(paratime, { method: 'rofl.Create', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'rofl.Register', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'rofl.Remove', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'rofl.Update', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.ProviderCreate', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.ProviderUpdate', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.ProviderRemove', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.ProviderUpdateOffers', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.InstanceCreate', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.InstanceTopUp', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.InstanceCancel', ...searchParams }),
    useGetRuntimeTransactions(paratime, { method: 'roflmarket.InstanceExecuteCmds', ...searchParams }),
  ]
  const result = {
    error: results.some(r => r.error),
    isLoading: results.some(r => r.isLoading),
    data: {
      data: {
        transactions: results
          .flatMap(r => r.data?.data?.transactions)
          .map(o => {
            const {
              eth_hash,
              amount,
              round,
              charged_fee,
              fee,
              fee_symbol,
              gas_limit,
              gas_used,
              index,
              nonce_0,
              sender_0,
              sender_0_eth,
              is_likely_native_token_transfer,
              size,
              fee_proxy_id,
              fee_proxy_module,
              ...t
            } = {...o}
            if (t.error) t.body = '...'
            return t
          })
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }
    }
  }

  return (
    <>
      <h2>ROFL</h2>
      <CustomDisplayProvider<typeof result.data.data> value={{
        fieldPriority: {
          'transactions.0.hash': -5,
          'transactions.0.timestamp': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.body': 100,
          'transactions.0.error': 101,
        },
        fieldDisplay: {
          'transactions.0.success': ({ value }) => {
            if (value == null) return <span style={{color: 'red'}}>unknown</span>
            return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'transactions.0.method': ({ value }) => {
            return <span>{value}</span>
          },
          'transactions.0.hash': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value?.slice(0, 5)}..</Link>
          },
          'transactions.0.signers': ({ value }) => {
            if (!value) return null
            console.log(value, value.map((v) => v.address_eth || v.address).join(','))
            return <span>{value.map((v) => {
              return <span key={v.address}>
                <Link to={`https://explorer.dev.oasis.io/search?q=${v.address_eth || v.address}`}>{v.address_eth || v.address}</Link>
                <br />
              </span>
            })}</span>
          },
          'transactions.0.body.ect': () => {
            return '...'
          },
          'transactions.0.body.extra_keys': () => {
            return '...'
          },
          'transactions.0.body.admin': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.deployment.app_id': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.scheduler_app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return 'offer' + oasis.misc.toHex(new Uint8Array(value))
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.provider': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.payment_address.native': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.offer': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return 'offer' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          'transactions.0.body.offers.0.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return 'offer' + oasis.misc.toHex(new Uint8Array(value))
            return 'offer'+value
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
