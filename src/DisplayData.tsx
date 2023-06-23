import { UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import isPlainObject from 'is-plain-obj';
import { createContext, useContext } from 'react';

type ShallowValue<T, TProp> = T extends Record<string | number, any>
    ? (TProp extends '*' ? T[number] : T[TProp & string])
    : never

export type DeepValue<T, TProp> = T extends Record<string | number, any>
  ? TProp extends `${infer TBranch}.${infer TDeepProp}`
    ? DeepValue<ShallowValue<T, TBranch>, TDeepProp>
    : ShallowValue<T, TProp>
  : never

type TestDeep = DeepValue<{a: {b: [{c: { d: 5 }}]}}, 'a.b.0.c.d'>
5 satisfies TestDeep
// @ts-expect-error Does not satisfy
3 satisfies TestDeep


type BB = 5 extends DeepValue<{a: {b: [{c: { d: 5 }}]}}, infer R> ? R : never

const bb: BB = 'f'


type AA = {
  [K in string]: (a: DeepValue<{a: {b: [{c: { d: 5 }}]}}, K>) => void
}

const a: AA = {
  'a.b': (aaaaaaaaaaaaa) => {

  }
}

export const CustomDisplayContext = createContext({
  fieldDisplay: {} as Record<string, React.FC<{ path: string, value: any, parentValue: any }>>,
  fieldPriority: {} as Record<string, number>,
})

export function DisplayData({ result }: { result: UseQueryResult<AxiosResponse<any> | undefined> }) {
  if (result.isLoading) return <div>Loading...</div>
  if (result.error) return <div>{result.error.toString()}</div>
  return (<div>
    <Recursive field='' value={result.data?.data} path='' parentValue={result.data?.data} />
  </div>
  )
}

export function Recursive({ field, value, path, parentValue }: {
  field?: string
  value: any
  path: string
  parentValue: any
}) {
  if (!field) {
    return <RecursiveValue value={value} path={path} parentValue={parentValue} />
  }
  return (
    <div style={{ marginLeft: '2ex' }}>
      <strong>{field}: </strong>
      <RecursiveValue value={value} path={path} parentValue={parentValue} />
    </div>
  )
}

export function RecursiveValue({ value, path, parentValue }: {
  value: any
  path: string
  parentValue: any
}) {
  const customDisplay = useContext(CustomDisplayContext);

  const CustomFieldDisplay = customDisplay.fieldDisplay[path]
  if (CustomFieldDisplay) {
    return <span title={path + '  ' + JSON.stringify(value)}>
      <CustomFieldDisplay path={path} value={value} parentValue={parentValue} />
    </span>
  }

  if (value == null) {
    return (<span title={path + '  ' + 'null/undefined'}></span>)
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return (<span title={path + '  ' + JSON.stringify(value)}>{value.toString()}</span>)
  }

  if (Array.isArray(value) && value.length > 2 && value.every(a => isPlainObject(a))) {
    const fields = [...new Set(value.flatMap(a => Object.keys(a)))]
      .sort((a, b) =>
        (customDisplay.fieldPriority[path ? path + '[*].' + a : a] ?? 0) -
        (customDisplay.fieldPriority[path ? path + '[*].' + b : b] ?? 0)
      )

    return  (
      <div>
        <table>
          <thead>
          <tr>
            {fields.map((field) => <th key={field} title={path ? path + '[*].' + field : field}>{field}</th>)}
          </tr>
          </thead>
          <tbody>
          {value.map((value, index) => (
            <tr key={index}>
              {fields.map((field) =>
                <td key={field + index}>
                  <RecursiveValue value={value[field]} path={path ? path + '[*].' + field : field} parentValue={value} />
                </td>
              )}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <>[]</>
    return (
      <div>
        {
          value.map((_, field) => (
            <Recursive
              key={field}
              field={field + ''}
              value={value[field]}
              path={path ? path + '[*]' : '[*]'}
              parentValue={value}
            />
          ))
        }
      </div>
    )
  }

  if (Object.keys(value).length === 0) return <>{'{}'}</>
  return (
    <div>
      {
        Object.keys(value)
          .sort((a, b) =>
            (customDisplay.fieldPriority[path ? path + '.' + a : a] ?? 0) -
            (customDisplay.fieldPriority[path ? path + '.' + b : b] ?? 0)
          )
          .map((field, index) => (
            <Recursive
              key={index}
              field={field}
              value={value[field]}
              path={path ? path + '.' + field : field}
              parentValue={value}
            />
          ))
      }
    </div>
  )
}
