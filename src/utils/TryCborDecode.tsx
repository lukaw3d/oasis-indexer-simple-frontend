import * as oasis from '@oasisprotocol/client'
import { CustomDisplayProvider, RecursiveValue } from '../DisplayData.js';

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
      },
    }}>
      <RecursiveValue value={tryCborDecode(params.base64Value)} path='' parentValue={{}} />
    </CustomDisplayProvider>
  )
}
