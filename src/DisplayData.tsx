import { UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import isPlainObject from 'is-plain-obj';
import { createContext, useContext } from 'react';
import tb from 'ts-toolbelt';

// From https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]
type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;
type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : ""

type FieldDisplay<T> = {
  [K in Paths<T>]?: React.FC<{
    path: K,
    value: tb.Object.Path<T, tb.String.Split<K, '.'>>,
    parentValue: tb.Object.Path<T, tb.List.Pop<tb.String.Split<K, '.'>>>,
  }>
}

type FieldPriority<T> = {
  [K in Paths<T>]?: number
}

export function typeTest() {
  const testPaths: Paths<{a: {b: [{c: { d: 5 }}]}}> = 'a.b.0.c.d'
  console.log(testPaths)
  const testPop: tb.List.Pop<tb.String.Split<'a.b.0.c.d', '.'>> = ['a', 'b', '0', 'c']
  console.log(testPop)
  const testFieldDisplay: FieldDisplay<{a: {b: [{c: { d: 5 }}]}}> = {
    'a.b.0.c.d': ({path, value, parentValue}) => {
      console.log(path)
      console.log(value)
      console.log(parentValue)
      return <div></div>
    },
  }
  console.log(testFieldDisplay)
}

export interface TypedCustomDisplay<T> {
  fieldDisplay: FieldDisplay<T>
  fieldPriority: FieldPriority<T>
}

const CustomDisplayContext = createContext<TypedCustomDisplay<any>>({
  fieldDisplay: {},
  fieldPriority: {},
})

export const CustomDisplayProvider = <T,>({value, children}: {value: TypedCustomDisplay<T>, children: React.ReactNode}) => {
  return <CustomDisplayContext.Provider value={value}>{children}</CustomDisplayContext.Provider>
}

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
