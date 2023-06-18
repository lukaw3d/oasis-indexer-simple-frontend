import { useEffect, useState } from 'react'
import { useGetRuntimeAccountsAddress } from '../oasis-indexer/generated/api'
import { getEvmBech32Address } from '../utils/getEvmBech32Address'
import { getEthAccountAddress } from '../utils/getEthAccountAddress'

export function Converter() {
  const [fromEvm, setFromEvm] = useState("0xba504818fdd8d3dba2ef8fd9b4f4d5c71ad1d1d3")
  const [fromEvmResult, setFromEvmResult] = useState("")
  useEffect(() => {
    (async () => {
      setFromEvmResult(await getEvmBech32Address(fromEvm))
    })()
  }, [fromEvm])

  const [fromOasis, setFromOasis] = useState("oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t")
  const emeraldAccount = useGetRuntimeAccountsAddress('emerald', fromOasis)
  const sapphireAccount = useGetRuntimeAccountsAddress('sapphire', fromOasis)

  const fromOasisResult = emeraldAccount.isLoading || sapphireAccount.isLoading
    ? 'loading'
    : getEthAccountAddress(emeraldAccount.data?.data.address_preimage) ?? getEthAccountAddress(sapphireAccount.data?.data.address_preimage) ?? '?'

  return (
    <div>
      <section>
        <h2>Convert EVM address to oasis1 (using addressToBech32(fromData(fromHex(evmAddress))))</h2>
        <input type="text" value={fromEvm} onChange={e => setFromEvm(e.target.value)} size={70} />
        <br />
        Result: {fromEvmResult}
      </section>
      <br />
      <br />
      <section>
        <h2>Convert oasis1 address to EVM (using https://index.oasislabs.com/v1/emerald/accounts/oasis1.. address_preimage)</h2>
        <input type="text" value={fromOasis} onChange={e => setFromOasis(e.target.value)} size={70} />
        <br />
        Result: {fromOasisResult}
      </section>
      <br />
      <br />
    </div>
  )
}
