import { UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import isPlainObject from 'is-plain-obj';
import { createContext, useContext } from 'react';

// Adjusted from https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
type Paths<ObjectType extends object> =
  ObjectType extends Array<infer T>
  ? `0.${Paths<T & object>}`
  : {[Key in keyof ObjectType & (string | number)]:
      ObjectType[Key] extends object | undefined
        ? `${Key}` | `${Key}.${Paths<NonNullable<ObjectType[Key]>>}`
        : `${Key}`
    }[keyof ObjectType & (string | number)];

type GetByPath<T extends object, Path extends string> = Path extends `${infer Key}.${infer PathRest}` ? GetByPath<T[Key & keyof T] & object, PathRest> : Path extends '' ? T : T[Path & keyof T]
type PopPath<Path extends string> = Path extends `${infer Key}.${infer PathRest}`
  ? (PopPath<PathRest> extends '' ? `${Key}` : `${Key}.${PopPath<PathRest>}`)
  : ''

type FieldDisplay<T extends object> = {
  [K in Paths<T>]?: React.FC<{
    path: K,
    value: GetByPath<T, K>,
    parentValue: GetByPath<T, PopPath<K>>,
  }>
}

type FieldPriority<T extends object> = {
  [K in Paths<T>]?: number | 'hide'
}

export function typeTest() {
  const testPaths: Paths<{a: {b: {c: { d: 5 }}[]}}> = 'a.b.0.c.d'
  console.log(testPaths)
  const testPop: PopPath<'a.b.0.c.d'> = 'a.b.0.c'
  console.log(testPop)
  const testFieldDisplay: FieldDisplay<{a: {b: {c: { d: 5 }}[]}}> = {
    'a.b.0.c.d': ({path, value, parentValue}) => {
      const testPath: 'a.b.0.c.d' = path
      // @ts-expect-error Test
      const testPathErr: 'a.b.0.c.d.2' = path
      const testValue: 5 = value
      // @ts-expect-error Test
      const testValueErr: 6 = value
      const testParentValue: { d: 5 } = parentValue
      // @ts-expect-error Test
      const testParentValueErr: { a: 5 } = parentValue
      console.log(testPath, testPathErr, testValue, testValueErr, testParentValue, testParentValueErr)
      return <div></div>
    },
  }
  console.log(testFieldDisplay)

  const testPaths2: Paths<{a: {b: {c: { d: 5 }} | undefined}}> = 'a.b.c.d'
  console.log(testPaths2)
  const testPaths3: GetByPath<{a: {b: {c: { d: 5 }} | undefined}}, 'a.b.c.d'> = 5
  console.log(testPaths3)
}

export interface TypedCustomDisplay<T extends object> {
  fieldDisplay: FieldDisplay<T>
  fieldPriority: FieldPriority<T>
}

const CustomDisplayContext = createContext<TypedCustomDisplay<any>>({
  fieldDisplay: {},
  fieldPriority: {},
})

export const CustomDisplayProvider = <T extends object,>({value, children}: {value: TypedCustomDisplay<T>, children: React.ReactNode}) => {
  return <CustomDisplayContext.Provider value={value}>{children}</CustomDisplayContext.Provider>
}

export function DisplayData({ result }: { result: Pick<UseQueryResult<AxiosResponse<any> | undefined>, 'data' | 'error' | 'isLoading'> }) {
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
      <strong style={field === 'error' ? { color: 'red'} : {}}>{field}: </strong>
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
      .filter(a => customDisplay.fieldPriority[path ? path + '.0.' + a : a] !== 'hide')
      .sort((a, b) =>
        (customDisplay.fieldPriority[path ? path + '.0.' + a : a] ?? 0) -
        (customDisplay.fieldPriority[path ? path + '.0.' + b : b] ?? 0)
      )

    return  (
      <div>
        <table>
          <thead>
          <tr>
            {fields.map((field) => <th key={field} title={path ? path + '.0.' + field : field}>{field}</th>)}
          </tr>
          </thead>
          <tbody>
          {value.map((value, index) => (
            <tr key={index}>
              {fields.map((field) =>
                <td key={field + index}>
                  <RecursiveValue value={value[field]} path={path ? path + '.0.' + field : field} parentValue={value} />
                </td>
              )}
            </tr>
          ))}
          </tbody>
        </table>
        {parentValue.total_count && (value.length === parentValue.total_count + (parentValue.is_total_count_clipped ? 9999999 : 0)) ? '' : 'There might be more data'}
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
              path={path ? path + '.0' : '.0'}
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
          .filter(a => customDisplay.fieldPriority[path ? path + '.' + a : a] !== 'hide')
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
