import { Link } from 'react-router-dom'
import { DisplayData } from '../DisplayData'
import { useGetRuntimeStatus, useGetStatus } from '../oasis-indexer/generated/api'

export function Home() {
  return (
    <>
      <h2>Consensus status</h2>
      <DisplayData result={useGetStatus()}></DisplayData>
      <Link to="/consensus/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/consensus/blocks?limit=1000&to=10000000">Blocks&lt;10000000</Link><br />
      <Link to="/consensus/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/consensus/events?limit=100&offset=0">Events</Link><br />
      <Link to="/consensus/accounts/oasis1qzp86dykm9nfqr83es07c324u64f6dgsdvk0fapj">Accounts</Link><br />

      <h2>Emerald status</h2>
      <DisplayData result={useGetRuntimeStatus('emerald')}></DisplayData>
      <Link to="/emerald/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/emerald/blocks?limit=1000&to=1000">Blocks&lt;1000</Link><br />
      <Link to="/emerald/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/emerald/events?limit=100&offset=0">Events</Link><br />
      <Link to="/emerald/accounts/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t">Accounts</Link><br />
      <Link to="/emerald/tokens?limit=100&offset=0">Tokens</Link><br />

      <h2>Sapphire status</h2>
      <DisplayData result={useGetRuntimeStatus('sapphire')}></DisplayData>
      <Link to="/sapphire/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/sapphire/blocks?limit=1000&to=1000">Blocks&lt;1000</Link><br />
      <Link to="/sapphire/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/sapphire/events?limit=100&offset=0">Events</Link><br />
      <Link to="/sapphire/accounts/oasis1qpupfu7e2n6pkezeaw0yhj8mcem8anj64ytrayne">Accounts</Link><br />
      <Link to="/sapphire/tokens?limit=100&offset=0">Tokens</Link><br />

      <h2>Cipher status</h2>
      <DisplayData result={useGetRuntimeStatus('cipher')}></DisplayData>

      <br />
      <h2>Misc</h2>
      <Link to="/converter">Converter</Link>
    </>
  )
}
