import React from 'react'
import ReactDOM from 'react-dom'
import { EyeOff } from 'react-feather'
import { getDependents } from '../../../utils/cyHelpers'

export default function view (menu, viewApi) {
  const view = document.createElement('span')
  ReactDOM.render(<EyeOff/>, view)
  menu.push({
    fillColor: 'rgba(100, 100, 100, 0.75)',
    content: view.outerHTML,
    select: function (el) {
      const coll = getDependents(el)
      viewApi.hide(coll)
    },
    enabled: true
  })
}