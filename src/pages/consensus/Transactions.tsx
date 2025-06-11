import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetConsensusTransactions, TransactionList } from '../../oasis-indexer/generated/api'
import BigNumber from 'bignumber.js'
import { useState } from 'react'

export function Transactions() {
  const [removeSpam, setRemoveSpam] = useState(false)
  const searchParams = Object.fromEntries(useSearchParams()[0])
  const originalResult = useGetConsensusTransactions({ ...searchParams })

  let result = originalResult
  if (removeSpam && originalResult.data?.data.transactions) {
    result = {
      ...originalResult,
      data: {
        ...originalResult.data,
        data: {
          ...originalResult.data.data,
          transactions: originalResult.data.data.transactions.filter(a => {
            return a.nonce <= 1000 && a.method !== 'consensus.Meta'
          })
        }
      }
    }
  }

  return (
    <>
      <h2>Transactions</h2>
      <ul style={{maxHeight: 400, maxWidth: 400, overflow: 'auto'}}>
        {/* https://github.com/oasisprotocol/nexus/blob/5db62e2/api/spec/v1.yaml#L1841 */}
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=beacon.PVSSCommit`}>beacon.PVSSCommit</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=beacon.PVSSReveal`}>beacon.PVSSReveal</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=beacon.VRFProve`}>beacon.VRFProve</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=consensus.Meta`}>consensus.Meta</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=governance.CastVote`}>governance.CastVote</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=governance.SubmitProposal`}>governance.SubmitProposal</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager.PublishEphemeralSecret`}>keymanager.PublishEphemeralSecret</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager.PublishMasterSecret`}>keymanager.PublishMasterSecret</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager.UpdatePolicy`}>keymanager.UpdatePolicy</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.DeregisterEntity`}>registry.DeregisterEntity</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.ProveFreshness`}>registry.ProveFreshness</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.RegisterEntity`}>registry.RegisterEntity</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.RegisterNode`}>registry.RegisterNode</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.RegisterRuntime`}>registry.RegisterRuntime</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=registry.UnfreezeNode`}>registry.UnfreezeNode</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=roothash.Evidence`}>roothash.Evidence</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=roothash.ExecutorCommit`}>roothash.ExecutorCommit</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=roothash.ExecutorProposerTimeout`}>roothash.ExecutorProposerTimeout</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=roothash.SubmitMsg`}>roothash.SubmitMsg</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.AddEscrow`}>staking.AddEscrow</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.Allow`}>staking.Allow</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.AmendCommissionSchedule`}>staking.AmendCommissionSchedule</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.Burn`}>staking.Burn</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.ReclaimEscrow`}>staking.ReclaimEscrow</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.Transfer`}>staking.Transfer</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=staking.Withdraw`}>staking.Withdraw</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager/churp.Apply`}>keymanager/churp.Apply</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager/churp.Confirm`}>keymanager/churp.Confirm</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager/churp.Create`}>keymanager/churp.Create</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=keymanager/churp.Update`}>keymanager/churp.Update</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=vault.AuthorizeAction`}>vault.AuthorizeAction</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=vault.CancelAction`}>vault.CancelAction</Link></li>
        <li><Link to={`/consensus/transactions?limit=100&offset=0&method=vault.Create`}>vault.Create</Link></li>
      </ul>
      <label><input type="checkbox" checked={removeSpam} onChange={(e) => setRemoveSpam(e.target.checked)} /> remove spam (nonce&gt;1000 and not consensus.Meta (always has nonce 0))</label>
      <CustomDisplayProvider<TransactionList> value={{
        fieldPriority: {
          'transactions.0.hash': -5,
          'transactions.0.block': -4,
          'transactions.0.success': -3,
          'transactions.0.method': -2,
          'transactions.0.body': 100,
        },
        fieldDisplay: {
          'transactions.0.block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'transactions.0.success': ({ value }) => {
            return <span style={!value ? {color: 'red'} : {}}>{value.toString()}</span>
          },
          'transactions.0.method': ({ value }) => {
            return <Link to={`/consensus/transactions?limit=100&offset=0&method=${value}`}>{value}</Link>
          },
          'transactions.0.fee': ({ value }) => {
            return <span>{new BigNumber(value).shiftedBy(-9).toFixed()}</span>
          },
          'transactions.0.hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
          'transactions.0.sender': ({ value }) => {
            return <Link to={`/consensus/accounts/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={result}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
