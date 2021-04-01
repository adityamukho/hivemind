import React, { useContext } from 'react'
import { Maximize } from 'react-feather'
import { runLayout } from '../../../utils/cyHelpers'
import GlobalContext from '../../GlobalContext'
import ToolTippedButton from './ToolTippedButton'

function handler(cyWrapper) {
  const { cy } = cyWrapper
  runLayout(cy)
}

export default function Fit() {
  const { cyWrapper } = useContext(GlobalContext)

  return (
    <ToolTippedButton
      className="ml-1"
      id="fit"
      outline
      color="secondary"
      placement="top"
      tooltip="Fit On Canvas"
      onClick={() => handler(cyWrapper)}
    >
      <Maximize size={16} />
    </ToolTippedButton>
  )
}
