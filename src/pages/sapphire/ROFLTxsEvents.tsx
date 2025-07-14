import * as oasis from '@oasisprotocol/client'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData, RecursiveValue } from '../../DisplayData'
import { useGetRuntimeTransactions, useGetRuntimeEvents, useGetConsensusEpochs } from '../../oasis-indexer/generated/api'
import TryCborDecode from '../../utils/TryCborDecode'

export function ROFLTxsEvents() {
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
  const events = [
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
  const error = [...results, ...events].find(r => r.error)
  const isLoading = [...results, ...events].some(r => r.isLoading)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.toString()}</div>

  const countTxsByType = Object.fromEntries(results.map(a => [(a.queryKey[1] as any).method, a.data?.data.transactions.length + '/' + searchParams.limit]))
  const countEventsByType = Object.fromEntries(events.map(a => [(a.queryKey[1] as any).type, a.data?.data.events.length + '/' + searchParams.limit]))
  const eventsByTx = Object.groupBy(events.flatMap(r => r.data?.data?.events), (e) => e?.tx_hash!)

  const txs = results.flatMap(r => r.data?.data?.transactions).map((t) => {
    const events = eventsByTx[t!.hash]
    delete eventsByTx[t!.hash!]
    return { ...t, events }
  })
  const remainingEventsAsTxs = Object.values(eventsByTx).map(events => ({
    events: events,
    timestamp: events![0]!.timestamp,
    hash: events![0]!.tx_hash,
    success: true,
  })) as typeof txs

  const result = {
    error: error,
    isLoading: isLoading,
    data: {
      ...results[0].data!,
      data: {
        transactions: [...txs, ...remainingEventsAsTxs]
          .sort((a, b) => new Date(b!.timestamp!).getTime() - new Date(a!.timestamp!).getTime())
      }
    }
  }

  return (
    <>
      <h2>ROFL transactions+events of every type (sorted by timestamp but there are holes in the timeline)</h2>
      <div style={{display: 'flex'}}>
        <RecursiveValue value={{transactions: countTxsByType}} path='' parentValue={{}}></RecursiveValue>
        <RecursiveValue value={{events: countEventsByType}} path='' parentValue={{}}></RecursiveValue>
      </div>
      <br />
      <CustomDisplayProvider<typeof result.data.data> value={{
        fieldPriority: {
          'transactions.0.hash': -5,
          'transactions.0.timestamp': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.body': 100,
          'transactions.0.events': 101,
          'transactions.0.error': 102,

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

          'transactions.0.events.0.type': -2,
          'transactions.0.events.0.body': 100,
          'transactions.0.events.0.body.ect': 1000,
          'transactions.0.events.0.body.extra_keys': 1000,
          'transactions.0.events.0.timestamp': 'hide',
          'transactions.0.events.0.round': 'hide',
          'transactions.0.events.0.tx_hash': 'hide',
          'transactions.0.events.0.tx_index': 'hide',
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
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`} className="tiny">{value}..</Link>
          },
          'transactions.0.signers': ({ value }) => {
            if (!value) return null
            return <span>{value.map((v) => {
              return <span key={v.address}>
                <Link to={`https://explorer.dev.oasis.io/search?q=${v.address_eth || v.address}`} className="tiny">{v.address_eth || v.address}</Link>
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
          'transactions.0.body.nodes.0': ({ value }) => {
            const nodeIdAsAddress = oasis.staking.addressToBech32(oasis.staking.addressFromPublicKey(oasis.misc.fromBase64(value)))
            return <span key={value}>
              {value}
              <br />
              <Link to={`https://explorer.dev.oasis.io/search?q=${nodeIdAsAddress}`}>{nodeIdAsAddress}</Link>
              <br />
            </span>
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
            return <span>{value.toString()} MB</span>
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
            return <span>{value.toString()} MB</span>
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


          // Events
          'transactions.0.events.0.type': ({ value }) => {
            return <span>{value}</span>
          },
          'transactions.0.events.0.tx_hash': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`} className="tiny">{value}..</Link>
          },
          'transactions.0.events.0.body.ect': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'transactions.0.events.0.body.extra_keys': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'transactions.0.events.0.body.admin': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.deployment.app_id': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.scheduler_app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.app_id': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.address': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.provider': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.payment_address.native': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'transactions.0.events.0.body.offer': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          'transactions.0.events.0.body.offers.0.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          // roflmarket.InstanceExecuteCmds
          'transactions.0.events.0.body.cmds.0': ({ value }) => {
            return <TryCborDecode base64Value={value}></TryCborDecode>
          },
          'transactions.0.events.0.body.rak.PublicKey': ({ value }) => {
            const schedulerAsAddress = oasis.staking.addressToBech32(oasis.staking.addressFromPublicKey(oasis.misc.fromBase64(value)))
            return <span>
              {value}
              <br />
              <Link to={`https://explorer.dev.oasis.io/search?q=${schedulerAsAddress}`}>{schedulerAsAddress}</Link>
            </span>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
