import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetRuntimeEvents, RuntimeEventList, Runtime } from '../../oasis-indexer/generated/api'
import { useState } from 'react'

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
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
