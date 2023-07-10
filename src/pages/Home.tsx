import { Link } from 'react-router-dom'
import { DisplayData } from '../DisplayData'
import { useGetRuntimeStatus, useGetStatus } from '../oasis-indexer/generated/api'

export function Home() {
  return (
    <>
      <h2>Consensus</h2>
      <Link to="/consensus/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/consensus/blocks?limit=5000&to=10000000">Blocks&lt;10000000</Link><br />
      <Link to="/consensus/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/consensus/events?limit=100&offset=0">Events</Link><br />
      <Link to="/consensus/accounts/oasis1qzp86dykm9nfqr83es07c324u64f6dgsdvk0fapj">Accounts</Link><br />
      Status:
      <div style={{minHeight: '5em'}}>
        <DisplayData
          result={useGetStatus()}
          customDisplay={{ fieldDisplay: {}, fieldPriority: {} }}
        />
      </div>

      <h2>Emerald</h2>
      <Link to="/emerald/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/emerald/blocks?limit=5000&to=5000">Blocks&lt;5000</Link><br />
      <Link to="/emerald/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/emerald/events?limit=100&offset=0">Events</Link><br />
      <Link to="/emerald/accounts/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t">Accounts</Link><br />
      <Link to="/emerald/tokens?limit=100&offset=0">Tokens</Link><br />
      Status:
      <div style={{minHeight: '5em'}}>
        <DisplayData
          result={useGetRuntimeStatus('emerald')}
          customDisplay={{ fieldDisplay: {}, fieldPriority: {} }}
        />
      </div>

      <h2>Sapphire</h2>
      <Link to="/sapphire/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/sapphire/blocks?limit=5000&to=5000">Blocks&lt;5000</Link><br />
      <Link to="/sapphire/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/sapphire/events?limit=100&offset=0">Events</Link><br />
      <Link to="/sapphire/accounts/oasis1qpupfu7e2n6pkezeaw0yhj8mcem8anj64ytrayne">Accounts</Link><br />
      <Link to="/sapphire/tokens?limit=100&offset=0">Tokens</Link><br />
      Status:
      <div style={{minHeight: '5em'}}>
        <DisplayData
          result={useGetRuntimeStatus('sapphire')}
          customDisplay={{ fieldDisplay: {}, fieldPriority: {} }}
        />
      </div>

      <h2>Cipher</h2>
      Status:
      <div style={{minHeight: '5em'}}>
        <DisplayData
          result={useGetRuntimeStatus('cipher')}
          customDisplay={{ fieldDisplay: {}, fieldPriority: {} }}
        />
      </div>

      <br />
      <h2>Misc</h2>
      <Link to="/converter">Converter</Link><br />
      <Link to="https://github.com/lukaw3d/oasis-indexer-simple-frontend">Source code</Link><br />
    </>
  )
}
