import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeEvents, RuntimeEventList, Runtime } from '../../oasis-indexer/generated/api'
import { useState } from 'react'
import TryCborDecode from '../../utils/TryCborDecode'
import * as oasis from '@oasisprotocol/client'

const FEE_ACCUMULATOR_ADDRESS = 'oasis1qp3r8hgsnphajmfzfuaa8fhjag7e0yt35cjxq0u4'

export function Events({ paratime = 'emerald' as Runtime }) {
  const [removeGas, setRemoveGas] = useState(false)
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const originalResult = useGetRuntimeEvents(paratime, { ...searchParams })

  let result = originalResult
  if (removeGas && originalResult.data?.data.events) {
    result = {
      ...originalResult,
      data: {
        ...originalResult.data,
        data: {
          ...originalResult.data.data,
          events: originalResult.data.data.events.filter(a => {
            if (a.type === 'core.gas_used') return false
            if (a.type === 'accounts.transfer' && a.body?.to === FEE_ACCUMULATOR_ADDRESS) return false
            return true
          })
        }
      }
    }
  }

  return (
    <>
      <h2>Events</h2>
      <ul style={{maxHeight: 400, maxWidth: 400, overflow: 'auto'}}>
        {/* https://github.com/oasisprotocol/nexus/blob/5db62e2/api/spec/v1.yaml#L3040-L3062 */}
        <li><Link to={`/${paratime}/events?size=100&page=1&type=accounts.transfer`}>accounts.transfer</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=accounts.burn`}>accounts.burn</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=accounts.mint`}>accounts.mint</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=consensus_accounts.deposit`}>consensus_accounts.deposit</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=consensus_accounts.withdraw`}>consensus_accounts.withdraw</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=consensus_accounts.delegate`}>consensus_accounts.delegate</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=consensus_accounts.undelegate_start`}>consensus_accounts.undelegate_start</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=consensus_accounts.undelegate_done`}>consensus_accounts.undelegate_done</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=core.gas_used`}>core.gas_used</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=evm.log`}>evm.log</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=rofl.app_created`}>rofl.app_created</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=rofl.app_updated`}>rofl.app_updated</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=rofl.app_removed`}>rofl.app_removed</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=rofl.instance_registered`}>rofl.instance_registered</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.provider_created`}>roflmarket.provider_created</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.provider_updated`}>roflmarket.provider_updated</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.provider_removed`}>roflmarket.provider_removed</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_created`}>roflmarket.instance_created</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_updated`}>roflmarket.instance_updated</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_accepted`}>roflmarket.instance_accepted</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_cancelled`}>roflmarket.instance_cancelled</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_removed`}>roflmarket.instance_removed</Link></li>
        <li><Link to={`/${paratime}/events?size=100&page=1&type=roflmarket.instance_command_queued`}>roflmarket.instance_command_queued</Link></li>
      </ul>
      <label><input type="checkbox" checked={removeGas} onChange={(e) => setRemoveGas(e.target.checked)} /> remove used gas and fees events</label>
      <CustomDisplayProvider<RuntimeEventList> value={{
        fieldPriority: {
          'events.0.round': -4,
          'events.0.type': -3,
          'events.0.evm_log_name': -2,
          'events.0.evm_log_params': -1,
          'events.0.body': 100,
        },
        fieldDisplay: {
          'events.0.round': ({ value }) => {
            return <Link to={`/${paratime}/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'events.0.type': ({ value, parentValue }) => {
            return <span>
              <Link to={`/${paratime}/events/?limit=100&offset=0&type=${value}`}>{value}</Link>
              {value === 'accounts.transfer' && parentValue.body?.to === FEE_ACCUMULATOR_ADDRESS && ' (gas fee)'}
            </span>
          },
          'events.0.tx_hash': ({ value }) => {
            return <Link to={`/${paratime}/transactions/${value}`}>{value}</Link>
          },
          'events.0.eth_tx_hash': ({ value }) => {
            return <Link to={`/${paratime}/transactions/${value}`}>{value}</Link>
          },

          'events.0.body.ect': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'events.0.body.extra_keys': ({ value }) => {
            return JSON.stringify(value, null, 2)
          },
          'events.0.body.admin': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.deployment.app_id': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.scheduler_app': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.app_id': ({ value }) => {
            if (value.startsWith('rofl1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.address': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.provider': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.payment_address.native': ({ value }) => {
            if (value.startsWith('oasis1')) {
              return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
            }
            return value
          },
          'events.0.body.offer': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          'events.0.body.offers.0.id': ({ value }) => {
            if (Array.isArray(value) && value.length === 8) return '0x' + oasis.misc.toHex(new Uint8Array(value))
            return value
          },
          // roflmarket.InstanceExecuteCmds
          'events.0.body.cmds.0': ({ value }) => {
            return <TryCborDecode base64Value={value}></TryCborDecode>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
