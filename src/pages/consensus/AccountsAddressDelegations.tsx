import { useParams, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetConsensusAccountsAddressDelegations, DelegationList } from '../../oasis-indexer/generated/api'

export function AccountsAddressDelegations() {
  const address = useParams().address!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>AccountsAddressDelegations</h2>
      <CustomDisplayProvider<DelegationList> value={{
        fieldPriority: {},
        fieldDisplay: {},
      }}>
        <DisplayData result={useGetConsensusAccountsAddressDelegations(address, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
