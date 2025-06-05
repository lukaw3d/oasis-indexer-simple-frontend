/* eslint-disable @typescript-eslint/no-unused-vars */
import * as oasis from '@oasisprotocol/client'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeTransactions, useGetConsensusEpochs } from '../../oasis-indexer/generated/api'
import TryCborDecode from '../../utils/TryCborDecode'

export function ROFLTxs() {
  const paratime = 'sapphire'
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const currentEpochQuery = useGetConsensusEpochs({limit: 1})
  const currentEpoch = currentEpochQuery.data?.data?.epochs?.[0]?.id
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
    error: results.find(r => r.error),
    isLoading: results.some(r => r.isLoading),
    data: {
      ...results[0].data!,
      data: {
        transactions: results
          .flatMap(r => r.data?.data?.transactions)
          .sort((a, b) => new Date(b!.timestamp!).getTime() - new Date(a!.timestamp!).getTime())
      }
    }
  }

  return (
    <>
      <h2>ROFL transactions of every type</h2>
      <CustomDisplayProvider<typeof result.data.data> value={{
        fieldPriority: {
          'transactions.0.hash': -5,
          'transactions.0.timestamp': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.body': 100,
          'transactions.0.error': 101,

          'transactions.0.body.ect': 1000,
          'transactions.0.body.extra_keys': 1000,
          'transactions.0.body.secrets': 1000,
          'transactions.0.body.policy.enclaves': 1000,

          'transactions.0.eth_hash': 'hide',
          'transactions.0.amount': 'hide',
          'transactions.0.round': 'hide',
          'transactions.0.charged_fee': 'hide',
          'transactions.0.fee': 'hide',
          'transactions.0.fee_symbol': 'hide',
          'transactions.0.gas_limit': 'hide',
          'transactions.0.gas_used': 'hide',
          'transactions.0.index': 'hide',
          'transactions.0.nonce_0': 'hide',
          'transactions.0.sender_0': 'hide',
          'transactions.0.sender_0_eth': 'hide',
          'transactions.0.is_likely_native_token_transfer': 'hide',
          'transactions.0.size': 'hide',
          'transactions.0.fee_proxy_id': 'hide',
          'transactions.0.fee_proxy_module': 'hide',
        },
        fieldDisplay: {
          'transactions.0.success': ({ value }) => {
            if (value == null) return <span style={{color: 'red'}}>unknown</span>
            return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'transactions.0.error.message': ({ value }) => {
            return <span style={{color: 'red'}}>{(value ?? 'no message').toString()}</span>
          },
          'transactions.0.method': ({ value }) => {
            return <pre>{value?.split('.').join('.\n')}</pre>
          },
          'transactions.0.hash': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value?.slice(0, 5)}..</Link>
          },
          'transactions.0.signers': ({ value }) => {
            if (!value) return null
            return <span>{value.map((v) => {
              return <span key={v.address}>
                <Link to={`https://explorer.dev.oasis.io/search?q=${v.address_eth || v.address}`}>{v.address_eth || v.address}</Link>
                <br />
              </span>
            })}</span>
          },
          'transactions.0.body.ect': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'transactions.0.body.extra_keys': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'transactions.0.body.secrets': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'transactions.0.body.policy.enclaves': ({ value }) => {
            return JSON.stringify(value, null, 2)
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
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
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
          'transactions.0.body.expiration': ({ value }) => {
            if (currentEpoch && typeof value === 'number' && value < currentEpoch) {
              return <span style={{color: 'red'}}>{value} (epoch now: {currentEpoch})</span>
            }
            return value
          },
          'transactions.0.body.offer': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            if (value.length === 16) return '0x' + value
            return value
          },
          'transactions.0.body.offers.0.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            if (value.length === 16) return '0x' + value
            return value
          },
          'transactions.0.body.remove.0': ({ value }) => {
            if (value.length === 16) return '0x' + value
            return value
          },
          'transactions.0.body.add.0.id': ({ value }) => {
            if (value.length === 16) return 'offer TBD, unused value: ' + value
            return value
          },
          'transactions.0.body.add.0.resources.memory': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'transactions.0.body.add.0.resources.storage': ({ value }) => {
            return <span>{value.toString()} MB 👈</span>
          },
          'transactions.0.body.add.0.resources.tee': ({ value }) => {
            // https://github.com/oasisprotocol/oasis-sdk/blob/2d67fa02e292182314267db9ce6223056aee5ffa/client-sdk/go/modules/roflmarket/types.go#L177-L180
            const map = { 1: 'SGX ⚠️', 2: 'TDX' }
            return <span>{value.toString()} (means: {map[value as 1]})</span>
          },
          'transactions.0.body.update.0.id': ({ value }) => {
            if (value.length === 16) return '0x' + value
            return value
          },
          'transactions.0.body.update.0.resources.memory': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'transactions.0.body.update.0.resources.storage': ({ value }) => {
            return <span>{value.toString()} MB 👈</span>
          },
          'transactions.0.body.update.0.resources.tee': ({ value }) => {
            // https://github.com/oasisprotocol/oasis-sdk/blob/2d67fa02e292182314267db9ce6223056aee5ffa/client-sdk/go/modules/roflmarket/types.go#L177-L180
            const map = { 1: 'SGX ⚠️', 2: 'TDX' }
            return <span>{value.toString()} (means: {map[value as 1]})</span>
          },
          'transactions.0.body.cmds.0': ({ value }) => {
            // roflmarket.InstanceExecuteCmds
            return <TryCborDecode base64Value={value}></TryCborDecode>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
