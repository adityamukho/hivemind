import React, { useContext } from 'react'
import { Maximize } from 'react-feather'
import { Button } from 'reactstrap'
import { runLayout } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'

function handler (cyWrapper) {
  const { cy } = cyWrapper
  runLayout(cy)
}

export default function fit () {
  const { cyWrapper } = useContext(GlobalContext)

  return <Button className="ml-1" outline color="secondary" onClick={() => handler(cyWrapper)}>
    <Maximize size={16}/>
  </Button>
};
