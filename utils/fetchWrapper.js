import useSWR from 'swr'

const fetcher = (url, token, method = 'GET') => fetch(url, {
  method,
  headers: new Headers({ 'Content-Type': 'application/json', token }),
  credentials: 'same-origin'
}).then((res) => res.json())

const fetchWrapper = (user, url) => useSWR(
  user ? [url, user.token] : null,
  fetcher
)

export default fetchWrapper