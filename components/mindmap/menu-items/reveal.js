import React from 'react'
import ReactDOM from 'react-dom'
import { Eye, ArrowDownRight } from 'react-feather'
import { getDependents, runLayout } from '../../../utils/cyHelpers'

export default function view (menu, viewApi) {
  const reveal = document.createElement('span')
  ReactDOM.render(<><Eye/><ArrowDownRight/></>, reveal)
  menu.push({
    fillColor: 'rgba(255, 255, 255, 0.75)',
    content: reveal.outerHTML,
    select: function (el) {
      const coll = getDependents(el)
      viewApi.show(coll)
      coll.removeStyle()
      el.scratch('showReveal', false)
      runLayout(el.cy())
    },
    enabled: true
  })
}