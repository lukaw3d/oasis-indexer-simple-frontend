import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { RoflMarketProviderList, useGetRuntimeRoflmarketProviders } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export function ROFLMarket() {
  const paratime = 'sapphire'
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>ROFL Market providers</h2>
      <CustomDisplayProvider<RoflMarketProviderList> value={{
        fieldPriority: {
          'providers.0.address': -5,
          'providers.0.removed': -4,
          'providers.0.offers_count': -3,
          'providers.0.instances_count': -2,
          'providers.0.offers_next_id': 'hide',
          'providers.0.instances_next_id': 'hide',
        },
        fieldDisplay: {
          'providers.0.address': ({ value }) => {
            return <Link to={`/${paratime}/rofl-market/${value}?limit=100&offset=0`}>{value}</Link>
          },
          'providers.0.stake': ({ value }) => {
            if (value == null) return null
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'providers.0.scheduler': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'providers.0.payment_address.native': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'providers.0.removed': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'providers.0.offers_next_id': ({ value }) => '0x'+value,
          'providers.0.instances_next_id': ({ value }) => '0x'+value,
        },
      }}>
        <DisplayData result={useGetRuntimeRoflmarketProviders(paratime, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
