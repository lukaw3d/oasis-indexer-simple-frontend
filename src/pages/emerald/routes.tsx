import { RouteObject } from 'react-router-dom'
import { Blocks } from './Blocks.tsx'
import { Transactions } from './Transactions.tsx'
import { Events } from './Events.tsx'
import { TransactionsHash } from './TransactionsHash.tsx'
import { AccountsAddress } from './AccountsAddress.tsx'
import { Tokens } from './Tokens.tsx'
import { StatsTxVolume } from '../emerald/StatsTxVolume.tsx'
import { StatsActiveAccounts } from '../emerald/StatsActiveAccounts.tsx'

export const routes: RouteObject[] = [
  { path: 'blocks', element: <Blocks /> },
  { path: 'transactions', element: <Transactions /> },
  { path: 'transactions/:txHash', element: <TransactionsHash /> },
  { path: 'events', element: <Events /> },
  { path: 'accounts/:address', element: <AccountsAddress /> },
  { path: 'tokens', element: <Tokens /> },
  { path: 'stats-tx-volume', element: <StatsTxVolume /> },
  { path: 'stats-active-accounts', element: <StatsActiveAccounts /> },
]
