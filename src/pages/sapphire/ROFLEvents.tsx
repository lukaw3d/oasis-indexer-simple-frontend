/* eslint-disable @typescript-eslint/no-unused-vars */
import * as oasis from '@oasisprotocol/client'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeEvents } from '../../oasis-indexer/generated/api'
import TryCborDecode from '../../utils/TryCborDecode'

export function ROFLEvents() {
  const paratime = 'sapphire'
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const results = [
    useGetRuntimeEvents(paratime, { type: 'rofl.app_created', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'rofl.app_updated', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'rofl.app_removed', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'rofl.instance_registered', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.provider_created', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.provider_updated', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.provider_removed', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_created', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_updated', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_accepted', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_cancelled', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_removed', ...searchParams }),
    useGetRuntimeEvents(paratime, { type: 'roflmarket.instance_command_queued', ...searchParams }),
  ]

  console.log(results)

  const result = {
    error: results.some(r => r.error),
    isLoading: results.some(r => r.isLoading),
    data: {
      ...results[0].data!,
      data: {
        transactions: results
          .flatMap(r => r.data?.data?.events)
          .map(o => {
            const {
              tx_index,
              ...t
            } = {...o}
            return t
          })
          .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      }
    }
  }

  return (
    <>
      <h2>ROFL events of every type</h2>
      <CustomDisplayProvider<typeof result.data.data> value={{
        fieldPriority: {
          'transactions.0.tx_hash': -5,
          'transactions.0.timestamp': -4,
          'transactions.0.type': -2,
          'transactions.0.body': 100,
        },
        fieldDisplay: {
          'transactions.0.type': ({ value }) => {
            return <span>{value}</span>
          },
          'transactions.0.tx_hash': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value?.slice(0, 5)}..</Link>
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
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.body.address': ({ value }) => {
            if (value.startsWith('oasis1')) {
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
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          'transactions.0.body.offers.0.id': ({ value }) => {
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
