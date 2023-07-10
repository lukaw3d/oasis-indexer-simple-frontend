import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetRuntimeAccountsAddress, Runtime, RuntimeAccount } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import { getEthAccountAddress } from '../../utils/getEthAccountAddress'

export function AccountsAddress({ paratime = 'emerald' as Runtime }) {
  const address = useParams().address!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Accounts</h2>
      <DisplayData<RuntimeAccount>
        result={useGetRuntimeAccountsAddress(paratime, address, { ...searchParams })}
        customDisplay={{
          fieldPriority: {
          },
          fieldDisplay: {
            'address': ({ value, parentValue }) => {
              return <span>
                {getEthAccountAddress(parentValue.address_preimage)
                  ? <>
                      {getEthAccountAddress(parentValue.address_preimage)}
                      &nbsp;(<Link to={`/${paratime}/accounts/${value}`}>{value}</Link>)
                    </>
                  : <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
                }
                ,&nbsp;
                <Link to={`/${paratime}/transactions?offset=0&limit=100&rel=${value}`}>transactions</Link>
                ,&nbsp;
                <Link to={`/${paratime}/events?offset=0&limit=100&rel=${value}`}>events</Link>
              </span>
            },
            'balances.0.balance': ({ value, parentValue }) => {
              return <span>{new BigNumber(value).shiftedBy(-parentValue.token_decimals).toFixed()}</span>
            },
            'evm_balances.0.balance': ({ value, parentValue }) => {
              return <span>{new BigNumber(value).shiftedBy(-parentValue.token_decimals).toFixed()}</span>
            },
            'evm_balances.0.token_contract_addr': ({ value }) => {
              return <Link to={`/${paratime}/accounts/${value}`}>{value}</Link>
            },
            'stats.total_received': ({ value }) => {
              return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
            },
            'stats.total_sent': ({ value }) => {
              return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
            },
          },
        }}
      />
    </>
  )
}
