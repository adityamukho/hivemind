import useSWR from 'swr'

export const fetcher = async (url, token, method = 'GET', body) => {
  const paceHandler = () => {
    Pace.restart()
  }

  Pace.on('hide', paceHandler)

  const response = await fetch(url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body
  })

  const result = { data: await response.json(), status: response.status, ok: response.ok }
  Pace.off('hide', paceHandler)

  return result
}

const fetchWrapper = (user, url) => useSWR(
  user ? [url, user.token] : null,
  fetcher
)

export default fetchWrapper