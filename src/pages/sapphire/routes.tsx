import { RouteObject } from 'react-router-dom'
import { Blocks } from '../emerald/Blocks.tsx'
import { Transactions } from '../emerald/Transactions.tsx'
import { Events } from '../emerald/Events.tsx'
import { TransactionsHash } from '../emerald/TransactionsHash.tsx'
import { AccountsAddress } from '../emerald/AccountsAddress.tsx'
import { Tokens } from '../emerald/Tokens.tsx'
import { StatsTxVolume } from '../emerald/StatsTxVolume.tsx'
import { StatsActiveAccounts } from '../emerald/StatsActiveAccounts.tsx'

export const routes: RouteObject[] = [
  { path: 'blocks', element: <Blocks paratime='sapphire' /> },
  { path: 'transactions', element: <Transactions paratime='sapphire' /> },
  { path: 'transactions/:txHash', element: <TransactionsHash paratime='sapphire' /> },
  { path: 'events', element: <Events paratime='sapphire' /> },
  { path: 'accounts/:address', element: <AccountsAddress paratime='sapphire' /> },
  { path: 'tokens', element: <Tokens paratime='sapphire' /> },
  { path: 'stats-tx-volume', element: <StatsTxVolume layer='sapphire' /> },
  { path: 'stats-active-accounts', element: <StatsActiveAccounts layer='sapphire' /> },
]
