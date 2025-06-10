import { Link } from 'react-router-dom'
import { StatusDisplay } from '../utils/StatusDisplay'

export function Home() {
  return (
    <div>
      <h2>Use backend:</h2>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/staging-testnet/">staging-testnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/staging-mainnet/">staging-mainnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/production-testnet/">production-testnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/production-mainnet/">production-mainnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/blue-testnet/">blue-testnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/blue-mainnet/">blue-mainnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/default-testnet/">default-testnet</a><br/>
      <a href="https://lukaw3d.github.io/oasis-indexer-simple-frontend/default-mainnet/">default-mainnet (nexus.oasis.io)</a><br/>

      <h2>Consensus</h2>
      <Link to="/consensus/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/consensus/blocks?limit=5000&to=10000000">Blocks&lt;10000000</Link><br />
      <Link to="/consensus/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/consensus/events?limit=100&offset=0">Events</Link><br />
      <Link to="/consensus/accounts/oasis1qzp86dykm9nfqr83es07c324u64f6dgsdvk0fapj">Accounts</Link><br />
      <Link to="/consensus/accounts-delegations/oasis1qzp86dykm9nfqr83es07c324u64f6dgsdvk0fapj">Account delegations</Link><br />
      <Link to="/consensus/accounts-debonding-delegations/oasis1qzp86dykm9nfqr83es07c324u64f6dgsdvk0fapj">Account debonding delegations</Link><br />
      <Link to="/consensus/entities?limit=100&offset=0">Entities</Link><br />
      <Link to="/consensus/validators?limit=100&offset=0">Validators</Link><br />
      <Link to="/consensus/epochs?limit=100&offset=0">Epochs</Link><br />
      <Link to="/consensus/proposals?limit=100&offset=0">Proposals</Link><br />
      <Link to="/consensus/stats-tx-volume?limit=100&offset=0">StatsTxVolume</Link><br />
      <Link to="/consensus/stats-active-accounts?limit=100&offset=0">StatsActiveAccounts</Link><br />
      Status:
      <StatusDisplay layer='consensus'/>

      <h2>Emerald</h2>
      <Link to="/emerald/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/emerald/blocks?limit=5000&to=5000">Blocks&lt;5000</Link><br />
      <Link to="/emerald/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/emerald/events?limit=100&offset=0">Events</Link><br />
      <Link to="/emerald/accounts/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t">Accounts</Link><br />
      <Link to="/emerald/tokens?limit=100&offset=0">Tokens</Link><br />
      <Link to="/emerald/stats-tx-volume?limit=100&offset=0">StatsTxVolume</Link><br />
      <Link to="/emerald/stats-active-accounts?limit=100&offset=0">StatsActiveAccounts</Link><br />
      Status:
      <StatusDisplay layer='emerald'/>

      <h2>Sapphire</h2>
      <Link to="/sapphire/blocks?limit=100&offset=0">Blocks</Link>, <Link to="/sapphire/blocks?limit=5000&to=5000">Blocks&lt;5000</Link><br />
      <Link to="/sapphire/transactions?limit=100&offset=0">Transactions</Link><br />
      <Link to="/sapphire/events?limit=100&offset=0">Events</Link><br />
      <Link to="/sapphire/accounts/oasis1qpupfu7e2n6pkezeaw0yhj8mcem8anj64ytrayne">Accounts</Link><br />
      <Link to="/sapphire/tokens?limit=100&offset=0">Tokens</Link><br />
      <Link to="/sapphire/stats-tx-volume?limit=100&offset=0">StatsTxVolume</Link><br />
      <Link to="/sapphire/stats-active-accounts?limit=100&offset=0">StatsActiveAccounts</Link><br />
      <Link to="/sapphire/rofl-market?limit=100&offset=0">ROFL market providers</Link><br />
      <Link to="/sapphire/rofl-txs-events?limit=100&offset=0">ROFL apps+market Transactions+Events mix</Link><br />
      Status:
      <StatusDisplay layer='sapphire'/>

      <h2>Cipher</h2>
      Status:
      <StatusDisplay layer='cipher'/>

      <br />
      <h2>Misc</h2>
      <Link to="/converter">Converter</Link><br />
      <Link to="https://github.com/lukaw3d/oasis-indexer-simple-frontend">Source code</Link><br />
    </div>
  )
}
