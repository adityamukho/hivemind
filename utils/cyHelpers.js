import ReactDOM from 'react-dom'

const TYPE_MAP = {
  vertex: 'nodes',
  edge: 'edges'
}
const FIELD_MAP = {
  _id: 'id',
  _from: 'source',
  _to: 'target'
}

export function rg2cy (data) {
  const result = {}

  for (const el of data) {
    const key = TYPE_MAP[el.type]
    result[key] = []
    for (const node of el.nodes) {
      const item = {}
      for (const k in node) {
        item[FIELD_MAP[k] || k] = node[k]
      }
      result[key].push({ data: item })
    }
  }

  return result
}

export function removePopper (popperKey, divKey, poppers) {
  const el = document.getElementById(divKey)
  ReactDOM.unmountComponentAtNode(el)

  const popper = poppers[popperKey]
  if (popper) {
    if (popper.reference.removeAttribute) {
      popper.reference.removeAttribute('disabled')
    }
    popper.destroy()
    delete poppers[popperKey]
  }

  if (el) {
    el.remove()
  }
}

export function setPopper (id, popper, poppers) {
  poppers[id] = popper
}

export function getOptions (animate, fit) {
  // noinspection JSUnusedGlobalSymbols
  return {
    name: 'breadthfirst',

    fit: fit, // whether to fit the viewport to the graph
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
    animateFilter: function () {
      return true
    }, // a function that determines whether the node should be animated.  All nodes animated by default on animate
    // enabled.  Non-animated nodes are positioned immediately when the layout starts
    transform: function (node, position) {
      return position
    } // transform a given node position. Useful for changing flow direction in discrete layouts
  }
}