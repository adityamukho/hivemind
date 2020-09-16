import React, { useContext } from 'react'
import { Eye } from 'react-feather'
import { Button } from 'reactstrap'
import { runLayout } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'

function handler (cyWrapper) {
  const {cy, viewApi} = cyWrapper
  const els = cy.elements()
  viewApi.show(els)
  els.removeStyle()
  runLayout(cy)
}

export default function showAll () {
  const { cyWrapper } = useContext(GlobalContext)

  return <Button className="ml-1" outline color="secondary" onClick={() => handler(cyWrapper)}>
    <Eye size={16}/>
  </Button>
};
