import React, { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Button } from 'reactstrap'
import { getOptions } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'

function cyReset (cy) {
  cy.reset()

  const animate = cy.nodes().length <= 50
  if (animate) {
    cy.layout(getOptions(animate)).run()
  }
}

export default function redraw () {
  const { cyWrapper } = useContext(GlobalContext)

  return <Button className="ml-1" color="primary" onClick={() => cyReset(cyWrapper.cy)}>
    <Repeat size={16}/> Redraw
  </Button>
};
