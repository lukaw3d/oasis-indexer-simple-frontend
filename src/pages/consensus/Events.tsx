import { Link, useSearchParams } from 'react-router-dom'
import { CustomDisplayProvider, DisplayData } from '../../DisplayData'
import { useGetConsensusEvents, ConsensusEventList } from '../../oasis-indexer/generated/api'

export function Events() {
  const searchParams = Object.fromEntries(useSearchParams()[0])
  return (
    <>
      <h2>Events</h2>
      <ul style={{maxHeight: 400, maxWidth: 400, overflow: 'auto'}}>
        {/* https://github.com/oasisprotocol/nexus/blob/5db62e2/api/spec/v1.yaml#L1998-L2021 */}
        <li><Link to={`/consensus/events?limit=100&offset=0&type=governance.proposal_executed`}>governance.proposal_executed</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=governance.proposal_finalized`}>governance.proposal_finalized</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=governance.proposal_submitted`}>governance.proposal_submitted</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=governance.vote`}>governance.vote</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=registry.entity`}>registry.entity</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=registry.node_unfrozen`}>registry.node_unfrozen</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=registry.node`}>registry.node</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=registry.runtime`}>registry.runtime</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=registry.runtime_suspended`}>registry.runtime_suspended</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=roothash.execution_discrepancy`}>roothash.execution_discrepancy</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=roothash.executor_committed`}>roothash.executor_committed</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=roothash.finalized`}>roothash.finalized</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=roothash.message`}>roothash.message</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=roothash.in_msg_processed`}>roothash.in_msg_processed</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.allowance_change`}>staking.allowance_change</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.burn`}>staking.burn</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.escrow.add`}>staking.escrow.add</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.escrow.debonding_start`}>staking.escrow.debonding_start</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.escrow.reclaim`}>staking.escrow.reclaim</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.escrow.take`}>staking.escrow.take</Link></li>
        <li><Link to={`/consensus/events?limit=100&offset=0&type=staking.transfer`}>staking.transfer</Link></li>
      </ul>

      <CustomDisplayProvider<ConsensusEventList> value={{
        fieldPriority: {
          'events.0.block': -4,
          'events.0.type': -3,
          'events.0.body': 100,
        },
        fieldDisplay: {
          'events.0.block': ({ value }) => {
            return <Link to={`/consensus/blocks?limit=1&to=${value}`}>{value}</Link>
          },
          'events.0.type': ({ value }) => {
            return <Link to={`/consensus/events/?limit=100&offset=0&type=${value}`}>{value}</Link>
          },
          'events.0.tx_hash': ({ value }) => {
            return <Link to={`/consensus/transactions/${value}`}>{value}</Link>
          },
        },
      }}>
        <DisplayData result={useGetConsensusEvents({ ...searchParams })}></DisplayData>
      </CustomDisplayProvider>
    </>
  )
}
