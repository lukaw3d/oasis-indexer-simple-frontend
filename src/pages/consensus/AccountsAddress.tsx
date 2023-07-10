import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DisplayData } from '../../DisplayData'
import { useGetConsensusAccountsAddress, Account } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function AccountsAddress() {
  const address = useParams().address!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Accounts</h2>
      <DisplayData<Account>
        result={useGetConsensusAccountsAddress(address, { ...searchParams })}
        customDisplay={{
          fieldPriority: {
          },
          fieldDisplay: {
            'address': ({ value }) => {
              return <span>
                <Link to={`/consensus/accounts/${value}`}>{value}</Link>
                ,&nbsp;
                <Link to={`/consensus/transactions?offset=0&limit=100&rel=${value}`}>transactions</Link>
                ,&nbsp;
                <Link to={`/consensus/events?offset=0&limit=100&rel=${value}`}>events</Link>
              </span>
            },
            'available': ({ value }) => {
              return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
            },
            'debonding': ({ value }) => {
              return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
            },
            'debonding_delegations_balance': ({ value }) => {
              if (value == null) return null
              return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
            },
            'delegations_balance': ({ value }) => {
              if (value == null) return null
              return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
            },
            'escrow': ({ value }) => {
              return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
            },
          },
        }}
      />
    </>
  )
}
