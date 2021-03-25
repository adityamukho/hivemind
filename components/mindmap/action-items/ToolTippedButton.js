import React, { useState } from "react";
import { Tooltip, Button } from "reactstrap";
const ToolTippedButton = ({ children, tooltip, ...props }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <>
      <span id={"bw" + props.id}>
        <Button {...props}>{children}</Button>
      </span>

      <Tooltip
        placement="top"
        target={"bw" + props.id}
        isOpen={tooltipOpen}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        {tooltip}
      </Tooltip>
    </>
  );
};

export default ToolTippedButton