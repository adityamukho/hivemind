import React from 'react'
import ReactDOM from 'react-dom'
import { EyeOff } from 'react-feather'
import { getDependents } from '../../../utils/cyHelpers'

export default function view(menu, viewApi) {
  const hide = document.createElement('span')
  ReactDOM.render(
    <>
      <EyeOff /> Hide
    </>,
    hide
  )
  menu.push({
    fillColor: 'rgba(0, 0, 0, 0.75)',
    content: hide.outerHTML,
    select: function (el) {
      const coll = getDependents(el)
      viewApi.hide(coll)

      const parent = el.incomers('node')
      parent.style({
        'background-fill': 'linear-gradient',
        'background-gradient-stop-colors':
          'gray black gray black gray black gray black gray' + ' black gray',
        'background-gradient-stop-positions':
          '0% 10% 20% 30% 40% 50% 60% 70% 80% 90% 100%',
        'background-gradient-direction': 'to-bottom-right',
        'border-width': 3,
        'border-color': 'gray',
      })
      parent.scratch('showReveal', true)
    },
    enabled: true,
  })
}
