import { QueryKey, useQuery as reactQuery, UseQueryOptions } from 'react-query'

export const useQuery = (
  key: QueryKey,
  url: URL,
  fetchOpts?: RequestInit,
  reactQueryOpts?: UseQueryOptions,
) => {
  const options: RequestInit = {
    credentials: 'include',
    ...fetchOpts,
  }
  return reactQuery(
    key,
    () =>
      fetch(url, options).then((x) => {
        if (!x.ok) {
          throw new Error('fetch failed')
        }
        if (
          x.headers.get('Content-Type') === 'application/json; charset=utf-8'
        ) {
          return x.json()
        } else {
          return x.text()
        }
      }),
    reactQueryOpts,
  )
}

export function prepQuery(
  key: QueryKey,
  url: URL,
  fetchOpts?: RequestInit,
  reactQueryOpts?: UseQueryOptions,
) {
  const options: RequestInit = {
    credentials: 'include',
    ...fetchOpts,
  }
  return reactQuery(
    key,
    () =>
      fetch(url, options).then((x) => {
        if (!x.ok) {
          throw new Error('fetch failed')
        }
        if (
          x.headers.get('Content-Type') === 'application/json; charset=utf-8'
        ) {
          return x.json()
        } else {
          return x.text()
        }
      }),
    { enabled: false, ...reactQueryOpts },
  )
}
