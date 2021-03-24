import React, { useContext, useState } from 'react'
import { Eye } from 'react-feather'
import { Button, Tooltip } from 'reactstrap'
import { runLayout } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'

function handler (cyWrapper) {
  const {cy, viewApi} = cyWrapper
  const els = cy.elements()
  viewApi.show(els)
  els.removeStyle()
  els.scratch('showReveal', false)
  runLayout(cy)
}

export default function showAll () {
  const { cyWrapper } = useContext(GlobalContext)
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return <>
  <Tooltip placement="top" target="showall"  isOpen={tooltipOpen}
        toggle={() => setTooltipOpen(!tooltipOpen)}>Show All</Tooltip>
  <Button className="ml-1" id="showall" outline color="secondary" onClick={() => handler(cyWrapper)}>
    <Eye size={16}/>
  </Button>
  </>
};
