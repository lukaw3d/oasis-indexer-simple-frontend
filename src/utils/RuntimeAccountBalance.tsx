
import { useGetRuntimeAccountsAddress, Runtime, EthOrOasisAddress } from '../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'

export default function RuntimeAccountBalance(params: {paratime: Runtime, address: EthOrOasisAddress}) {
  const request = useGetRuntimeAccountsAddress(params.paratime, params.address)
  return <span>
    {request.data?.data.balances.map(value => {
      const parsedBalance = new BigNumber(value.balance).shiftedBy(-value.token_decimals)
      return <span style={parsedBalance.isLessThan(10) ? {color: 'red'} : {}}>
        {parsedBalance.toFixed()}
        {' '}
        {value.token_symbol}
        {' '}
      </span>
    })}
  </span>
}
