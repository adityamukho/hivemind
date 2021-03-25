import React, { useContext, useState } from "react";
import { Maximize } from "react-feather";
import { Button, Tooltip } from "reactstrap";
import { runLayout } from "../../../utils/cyHelpers";
import GlobalContext from "../../GlobalContext";

function handler(cyWrapper) {
  const { cy } = cyWrapper;
  runLayout(cy);
}

export default function fit() {
  const { cyWrapper } = useContext(GlobalContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <>
      <Button
        className="ml-1"
        id="fit"
        outline
        color="secondary"
        onClick={() => handler(cyWrapper)}
      >
        <Maximize size={16} />
      </Button>
      <Tooltip
        placement="top"
        target="fit"
        isOpen={tooltipOpen}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        Fit On Screen
      </Tooltip>
    </>
  );
}
