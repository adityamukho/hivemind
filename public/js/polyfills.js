// eslint-disable-next-line no-extend-native
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// Store a copy of the fetch function
const _oldFetch = fetch

// Create our new version of the fetch function
window.fetch = function () {
  // Create hooks
  const fetchStart = new Event('fetchStart', {
    view: document,
    bubbles: true,
    cancelable: false
  })
  const fetchEnd = new Event('fetchEnd', {
    view: document,
    bubbles: true,
    cancelable: false
  })

  // Pass the supplied arguments to the real fetch function
  const fetchCall = _oldFetch.apply(this, arguments)

  // Trigger the fetchStart event
  document.dispatchEvent(fetchStart)

  fetchCall
    .then(function () {
      // Trigger the fetchEnd event
      document.dispatchEvent(fetchEnd)
    })
    .catch(function () {
      // Trigger the fetchEnd event
      document.dispatchEvent(fetchEnd)
    })

  return fetchCall
}

document.addEventListener('fetchStart', function () {
  const spinner = document.getElementById('loading')
  spinner.classList.remove('invisible')
  spinner.classList.add('visible')
})

document.addEventListener('fetchEnd', function () {
  const spinner = document.getElementById('loading')
  spinner.classList.remove('visible')
  spinner.classList.add('invisible')
})