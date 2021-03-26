import useSWR from 'swr'

let count = 0

function incrCount () {
  ++count

  if (count === 1) {
    const spinner = document.getElementById('loading')
    spinner.classList.remove('invisible')
    spinner.classList.add('visible')
  }
}

function decrCount () {
  --count

  if (count === 0) {
    const spinner = document.getElementById('loading')
    spinner.classList.remove('visible')
    spinner.classList.add('invisible')
  }
}

export const fetcher = async (url, token, method = 'GET', body) => {
  incrCount()

  const response = await fetch(url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body
  })

  const result = { data: await response.json(), status: response.status, ok: response.ok }
  decrCount()

  return result
}

const fetchWrapper = (user, url) => useSWR(
  user ? [url, user.token] : null,
  fetcher
)

export default fetchWrapper