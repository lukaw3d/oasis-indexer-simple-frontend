import { RouteObject } from 'react-router-dom'
import { Blocks } from './Blocks.tsx'
import { Transactions } from './Transactions.tsx'
import { Events } from './Events.tsx'
import { TransactionsHash } from './TransactionsHash.tsx'
import { AccountsAddress } from './AccountsAddress.tsx'

export const routes: RouteObject[] = [
  { path: 'blocks', element: <Blocks /> },
  { path: 'transactions', element: <Transactions /> },
  { path: 'transactions/:txHash', element: <TransactionsHash /> },
  { path: 'events', element: <Events /> },
  { path: 'accounts/:address', element: <AccountsAddress /> },
]
