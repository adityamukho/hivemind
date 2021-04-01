import React, { useState } from 'react'
import { Button, Tooltip } from 'reactstrap'

const ToolTippedButton = ({
  children,
  tooltip,
  placement = 'top',
  ...props
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <>
      <span id={'bw' + props.id}>
        <Button {...props}>{children}</Button>
      </span>

      <Tooltip
        placement={placement}
        target={'bw' + props.id}
        isOpen={tooltipOpen}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        {tooltip}
      </Tooltip>
    </>
  )
}

export default ToolTippedButton
