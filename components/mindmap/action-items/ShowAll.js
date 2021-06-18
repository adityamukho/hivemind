import React, { useContext } from 'react'
import { Eye } from 'react-feather'
import { runLayout } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'
import ToolTippedButton from '../ToolTippedButton'

function handler (cyWrapper) {
  const { cy, viewApi } = cyWrapper
  const els = cy.elements()
  viewApi.show(els)
  els.removeStyle()
  els.scratch('showReveal', false)
  runLayout(cy)
}

export default function ShowAll () {
  const { cyWrapper } = useContext(GlobalContext)

  return (
    <>
      <ToolTippedButton
        tooltip="Show All"
        className="ml-1"
        id="showall"
        outline
        color="secondary"
        onClick={() => handler(cyWrapper)}
      >
        <Eye size={16} />
      </ToolTippedButton>
    </>
  )
}
