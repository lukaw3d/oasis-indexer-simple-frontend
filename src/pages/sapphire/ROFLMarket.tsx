import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { RoflMarketProviderList, useGetRuntimeRoflmarketProviders } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import * as oasis from '@oasisprotocol/client'
import RuntimeAccountBalance from '../../utils/RuntimeAccountBalance'
import RuntimeSchedulerReplicas from '../../utils/RuntimeSchedulerReplicas'

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
            return <RuntimeSchedulerReplicas address={value} paratime={paratime} />
          },
          'providers.0.payment_address.native': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'providers.0.nodes.0': ({ value }) => {
            const nodeIdAsAddress = oasis.staking.addressToBech32(oasis.staking.addressFromPublicKey(oasis.misc.fromBase64(value)))
            return <span key={value}>
              {value}
              <br />
              <Link to={`https://explorer.dev.oasis.io/search?q=${nodeIdAsAddress}`}>{nodeIdAsAddress}</Link>
              <br />
              <RuntimeAccountBalance address={nodeIdAsAddress} paratime={paratime} />
              <br />
            </span>
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
