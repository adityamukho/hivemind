import CytoscapeComponent from "react-cytoscapejs"
import React, { useContext, useState } from 'react'
import GlobalContext from '../GlobalContext'
import style from "./style"

function getOptions(animate = true) {
  // noinspection JSUnusedGlobalSymbols
  return {
    name: "breadthfirst",

    fit: animate, // whether to fit the viewport to the graph
    directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 30, // padding on fit
    circle: false, // put depths in concentric circles if true, put depths top down if false
    grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout
    // algorithm
    maximal: true, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS
    // only)
    animate, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animateFilter: function() {
      return true;
    }, // a function that determines whether the node should be animated.  All nodes animated by default on animate
    // enabled.  Non-animated nodes are positioned immediately when the layout starts
    transform: function(node, position) {
      return position;
    } // transform a given node position. Useful for changing flow direction in discrete layouts
  };
}

const Canvas = ({elements}) => {
  const [cy, setCy] = useState()
  const { cyComp } = useContext(GlobalContext)
  const options = getOptions()

  return <div className="border border-secondary rounded w-100" id="cy-container">
    <div className="m-1" id="cy">
      <CytoscapeComponent
        ref={cyComp}
        cy={setCy}
        style={{ width: "100%", height: "100%" }}
        stylesheet={style}
        layout={options}
        elements={CytoscapeComponent.normalizeElements(elements)}
      />
    </div>
  </div>
}

export default Canvas