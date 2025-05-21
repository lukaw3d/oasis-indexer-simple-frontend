import * as oasis from '@oasisprotocol/client'
import { CustomDisplayProvider, RecursiveValue } from '../DisplayData.js';
import { Link } from 'react-router-dom';

function tryCborDecode(base64: string) {
  try {
    return oasis.misc.fromCBOR(oasis.misc.fromBase64(base64))
  } catch (e) {
    return base64
  }
}

export default function TryCborDecode(params: {base64Value: string}) {
  return (
    <CustomDisplayProvider<any> value={{
      fieldPriority: {
        'method': -1,
      },
      fieldDisplay: {
        'args.deployment.app_id': ({ value }) => {
          if (value instanceof Uint8Array && value.length === 21) {
            const appId = oasis.address.toBech32('rofl', value)
            return <Link to={`https://explorer.dev.oasis.io/search?q=${appId}`}>{appId}</Link>
          }
          return value
        },
        'args.deployment.manifest_hash': ({ value }) => {
          if (value instanceof Uint8Array && value.length === 32) return oasis.misc.toBase64(value)
          return value
        },
      },
    }}>
      <RecursiveValue value={tryCborDecode(params.base64Value)} path='' parentValue={{}} />
    </CustomDisplayProvider>
  )
}
