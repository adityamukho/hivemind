import React from "react";
import ReactDOM from "react-dom";
import { Trash2 } from "react-feather";
import { remove } from "../../../lib/api-client";

export default (menu, canvas, sessionID) => {
  const del = document.createElement("span");
  ReactDOM.render(<Trash2 />, del);
  menu.push({
    fillColor: "rgba(200, 0, 0, 0.75)",
    content: del.outerHTML,
    contentStyle: {},
    select: async function(el) {
      const confirmed = window.confirm(
        "Are you sure? This will remove the selected node and ALL its descendants!"
      );
      if (confirmed) {
        await remove(sessionID, el.id());
        canvas.setElements();
      }
    },
    enabled: true
  });
};
