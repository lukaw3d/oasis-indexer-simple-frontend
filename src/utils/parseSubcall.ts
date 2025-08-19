import { decodeAbiParameters } from 'viem'
import * as oasis from '@oasisprotocol/client'
import { yamlDump } from './yamlDump'

export function parseSubcall(data: `0x${string}`) {
  try {
    const [methodName, cborHexParams] = decodeAbiParameters(
      [{ type: 'string' }, { type: 'bytes' }],
      data,
    )

    // TODO: could type as oasisRT.rofl.TransactionCallHandlers etc
    const params = oasis.misc.fromCBOR(oasis.misc.fromHex(cborHexParams.replace('0x', ''))) as any
    try {
      if (methodName === 'consensus.Delegate') {
        if (params?.to instanceof Uint8Array) params.to = oasis.staking.addressToBech32(params.to)
        if (params?.amount?.[0] instanceof Uint8Array)
          params.amount[0] = oasis.quantity.toBigInt(params.amount[0])
        if (params?.amount?.[1] instanceof Uint8Array)
          params.amount[1] = oasis.misc.toStringUTF8(params.amount[1])
      }
      if (methodName === 'consensus.Undelegate') {
        if (params?.from instanceof Uint8Array)
          params.from = oasis.staking.addressToBech32(params.from)
        if (params?.shares instanceof Uint8Array)
          params.shares = oasis.quantity.toBigInt(params.shares)
      }
      if (methodName.startsWith('rofl.')) {
        if (params?.id instanceof Uint8Array) params.id = oasis.address.toBech32('rofl', params.id)
        if (params?.admin instanceof Uint8Array)
          params.admin = oasis.staking.addressToBech32(params.admin)
      }
      if (methodName.startsWith('roflmarket.')) {
        if (params?.id instanceof Uint8Array) params.id = `0x${oasis.misc.toHex(params.id)}`
        if (params?.offer instanceof Uint8Array) params.offer = `0x${oasis.misc.toHex(params.offer)}`
        if (params?.provider instanceof Uint8Array)
          params.provider = oasis.staking.addressToBech32(params.provider)
        if (params?.admin instanceof Uint8Array)
          params.admin = oasis.staking.addressToBech32(params.admin)
        if (params?.deployment?.app_id instanceof Uint8Array)
          params.deployment.app_id = oasis.address.toBech32('rofl', params.deployment.app_id)
        if (params?.deployment?.manifest_hash instanceof Uint8Array)
          params.deployment.manifest_hash = `0x${oasis.misc.toHex(params.deployment.manifest_hash)}`
        if (params?.cmds?.[0] instanceof Uint8Array)
          params.cmds = params.cmds.map((cmdUint: Uint8Array) =>
            parseCmd(oasis.misc.toBase64(cmdUint)),
          )
      }
    } catch (e) {
      console.error('Failed to normalize subcall data', e, params, data)
    }


    let stringifiedParams
    try {
      stringifiedParams = yamlDump(params)
    } catch (e) {
      console.error('Failed to stringify subcall data', e, params, data)
    }
    const paramsAsAbi = [
      {
        name: 'body',
        evm_type: 'string',
        value: stringifiedParams ?? cborHexParams,
      },
    ]
    return { methodName, cborHexParams, params, stringifiedParams, paramsAsAbi }
  } catch (e) {
    console.error('Failed to parse subcall data (might be malformed)', e, data)
  }
}

function parseCmd(cmdBase64: string) {
  const parsed = oasis.misc.fromCBOR(new Uint8Array(Buffer.from(cmdBase64, 'base64'))) as { method: string; args: any }
  if (parsed.args?.deployment?.app_id) {
    parsed.args.deployment.app_id = oasis.address.toBech32('rofl', parsed.args.deployment.app_id)
  }
  return parsed
}
