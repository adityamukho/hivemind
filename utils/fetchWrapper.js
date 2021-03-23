import useSWR from 'swr'

export const fetcher = async (url, token, method = 'GET', body) => {
  const res = await fetch(url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body
  })

  return { data: await res.json(), status: res.status, ok: res.ok }
}

const fetchWrapper = (user, url) => useSWR(
  user ? [url, user.token] : null,
  fetcher
)

export default fetchWrapper