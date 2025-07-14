import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { RoflMarketProvider, RoflMarketInstanceList, RoflMarketOfferList, useGetRuntimeRoflmarketProvidersAddress, useGetRuntimeRoflmarketProvidersAddressOffers, useGetRuntimeRoflmarketInstances } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import TryCborDecode from '../../utils/TryCborDecode'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import RuntimeAccountBalance from '../../utils/RuntimeAccountBalance'
import RuntimeSchedulerReplicas from '../../utils/RuntimeSchedulerReplicas'

export function ROFLMarketAddress() {
  const paratime = 'sapphire'
  const address = useParams().address!
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>ROFL Market provider</h2>
      <CustomDisplayProvider<RoflMarketProvider> value={{
        fieldPriority: {
          'address': -5,
          'removed': -4,
          'offers_count': -3,
          'instances_count': -2,
          'offers_next_id': 'hide',
          'instances_next_id': 'hide',
        },
        fieldDisplay: {
          'offers_next_id': ({ value }) => '0x'+value,
          'instances_next_id': ({ value }) => '0x'+value,
          'address': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'stake': ({ value }) => {
            if (value == null) return null
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()}</span>
          },
          'scheduler': ({ value }) => {
            return <RuntimeSchedulerReplicas address={value} paratime={paratime} />
          },
          'payment_address.native': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'removed': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'nodes.0': ({ value }) => {
            const nodeIdAsAddress = oasis.staking.addressToBech32(oasis.staking.addressFromPublicKey(oasis.misc.fromBase64(value)))
            return <span>
              {value}
              {' '}
              <Link to={`https://explorer.dev.oasis.io/search?q=${nodeIdAsAddress}`}>{nodeIdAsAddress}</Link>
              {' '}
              <RuntimeAccountBalance address={nodeIdAsAddress} paratime={paratime} />
              {' '}
            </span>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeRoflmarketProvidersAddress(paratime, address, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>

      <h2>Offers</h2>
      <CustomDisplayProvider<RoflMarketOfferList> value={{
        fieldPriority: {
          'offers.0.provider': 'hide',
        },
        fieldDisplay: {
          'offers.0.id': ({ value }) => '0x'+value,
          'offers.0.removed': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'offers.0.resources.tee': ({ value }) => {
            // https://github.com/oasisprotocol/oasis-sdk/blob/2d67fa02e292182314267db9ce6223056aee5ffa/client-sdk/go/modules/roflmarket/types.go#L177-L180
            const map = { 1: 'SGX ⚠️', 2: 'TDX' }
            return <span>{value.toString()} (means: {map[value as 1]})</span>
          },
          'offers.0.resources.memory': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'offers.0.resources.storage': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'offers.0.payment.native.denomination': ({ value }) => {
            if (value === '') return <span>"" (ROSE)</span>
            return <span>value</span>
          },
          [`offers.0.payment.native.terms.${oasisRT.types.RoflmarketTerm.HOUR}`]: ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()} / hour</span>
          },
          [`offers.0.payment.native.terms.${oasisRT.types.RoflmarketTerm.MONTH}`]: ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()} / month</span>
          },
          [`offers.0.payment.native.terms.${oasisRT.types.RoflmarketTerm.YEAR}`]: ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-18).toFixed()} / year</span>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeRoflmarketProvidersAddressOffers(paratime, address, { ...searchParams })}></DisplayData>
      </CustomDisplayProvider>

      <h2>Machines (Instances)</h2>
      <CustomDisplayProvider<RoflMarketInstanceList> value={{
        fieldPriority: {
          'instances.0.id': -10,
          'instances.0.status': -9,
          'instances.0.removed': -8,
          'instances.0.paid_until': -7,
          'instances.0.metadata': -6,
          'instances.0.resources': -5,
          'instances.0.deployment': -4,
          'instances.0.admin': -3,
          'instances.0.provider': 'hide',
          'instances.0.cmd_count': 'hide',
          'instances.0.payment': 'hide',
        },
        fieldDisplay: {
          'instances.0.id': ({ value }) => '0x'+value,
          'instances.0.cmd_next_id': ({ value }) => '0x'+value,
          'instances.0.offer_id': ({ value }) => '0x'+value,
          'instances.0.admin': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'instances.0.creator': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'instances.0.deployment.app_id': ({ value }) => {
            return <Link to={`https://explorer.dev.oasis.io/search?q=${value}`}>{value}</Link>
          },
          'instances.0.resources.tee': ({ value }) => {
            // https://github.com/oasisprotocol/oasis-sdk/blob/2d67fa02e292182314267db9ce6223056aee5ffa/client-sdk/go/modules/roflmarket/types.go#L177-L180
            const map = { 1: 'SGX ⚠️', 2: 'TDX' }
            return <span>{value.toString()} (means: {map[value as 1]})</span>
          },
          'instances.0.resources.memory': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'instances.0.resources.storage': ({ value }) => {
            return <span>{value.toString()} MB</span>
          },
          'instances.0.cmds.0.cmd': ({ value }) => {
            return <TryCborDecode base64Value={value}></TryCborDecode>
          },
          'instances.0.paid_until': ({ value }) => {
            const isExpired = new Date(value).getTime() < new Date().getTime()
            return <span style={isExpired ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'instances.0.removed': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'instances.0.status': ({ value }) => {
            // https://github.com/oasisprotocol/oasis-sdk/blob/2d67fa02e292182314267db9ce6223056aee5ffa/client-sdk/go/modules/roflmarket/types.go#L237-L243
            const map = { 0: ['created', 'red'], 1: ['accepted', 'lightgreen'], 2: ['cancelled', 'red'] }
            return <span style={{color: map[value as 1][1]}}>{value.toString()} ({map[value as 1][0]})</span>
          },
          'instances.0.metadata.net.oasis.error': ({ value }) => {
            return <span style={value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'instances.0.metadata.net.oasis.scheduler.rak': ({ value }) => {
            const schedulerAsAddress = oasis.staking.addressToBech32(oasis.staking.addressFromPublicKey(oasis.misc.fromBase64(value)))
            return <span>
              {value}
              <br />
              <Link to={`https://explorer.dev.oasis.io/search?q=${schedulerAsAddress}`}>{schedulerAsAddress}</Link>
            </span>
          },
        },
      }}>
        <DisplayData result={useGetRuntimeRoflmarketInstances(paratime, { provider: address, ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
