import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayContext, DisplayData } from '../../DisplayData'
import { EvmTokenList, Runtime, useGetRuntimeEvmTokens } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function Tokens({ paratime = 'emerald' as Runtime }) {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Events</h2>
      <CustomDisplayContext.Provider value={{
        fieldPriority: {
          'evm_tokens[*].type': -5,
          'evm_tokens[*].total_supply': -4,
          'evm_tokens[*].name': -3,
          'evm_tokens[*].num_holders': -2,
          'evm_tokens[*].symbol': -1,
          'evm_tokens[*].decimals': 100,
        },
        fieldDisplay: {
          'evm_tokens[*].contract_addr': ({ value }) => {
            return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
          },
          'evm_tokens[*].evm_contract_addr': ({ value }) => {
            if (value == null) return null
            return <span>0x{value}</span>
          },
          'evm_tokens[*].total_supply': ({ value, parentValue }: { value: number, parentValue: EvmTokenList['evm_tokens'][number] }) => {
            return <span>{new BigNumber(value).shiftedBy(-(parentValue.decimals ?? 0)).toFixed()}</span>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeEvmTokens(paratime, { ...searchParams })}></DisplayData>
      </CustomDisplayContext.Provider>
    </>
  )
}
