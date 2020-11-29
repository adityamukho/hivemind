import { invert } from 'lodash'
import ReactDOM from 'react-dom'

const RG2CY_TYPE_MAP = {
  vertex: 'nodes',
  edge: 'edges'
}
const RG2CY_FIELD_MAP = {
  _id: 'id',
  _from: 'source',
  _to: 'target'
}
const CY2RG_FIELD_MAP = invert(RG2CY_FIELD_MAP)

export function rg2cy (data) {
  const result = {}

  for (const el of data) {
    const key = RG2CY_TYPE_MAP[el.type]
    result[key] = []
    for (const node of el.nodes) {
      const item = {}
      for (const k in node) {
        item[RG2CY_FIELD_MAP[k] || k] = node[k]
      }
      result[key].push({ data: item })
    }
  }

  return result
}

export function cy2rg (data) {
  const result = {}

  for (const el of data) {
    const [coll] = el.id.split('/')
    if (!result[coll]) {
      result[coll] = []
    }

    const item = {}
    for (const k in el) {
      item[CY2RG_FIELD_MAP[k] || k] = el[k]
    }

    result[coll].push(item)
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

export function getOptions (fit) {
  // noinspection JSUnusedGlobalSymbols
  return {
    name: 'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: 20, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: 100, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph.
                       // Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function () { return 1 }, // number of ranks to keep between the source and target of
                                      // the edge
    edgeWeight: function () { return 1 }, // higher weight edges are generally made shorter and
                                          // straighter than
    // lower weight edges

    // general layout options
    fit: fit, // whether to fit to viewport
    padding: 10, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the
                              // overall area that the nodes take up
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the
                                        // space used by a node
    animate: true, // whether to transition the node positions
    animateFilter: function () { return true }, // whether to animate specific nodes when animation
                                                // is on;
    // non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: 'ease', // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function (node, pos) {
      if (!node.neighborhood().filter(':visible').length) {
        const cy = node.cy()
        cy.reset()

        return { x: cy.width() / 2, y: cy.height() / 2 }
      }

      return pos
    }, // a function that applies a transform to the final node position
    ready: function () {}, // on layoutready
    stop: function () {} // on layoutstop
  }
}

export function getDependents (el) {
  return el.union(el.successors()).union(el.incomers('edge'))
}

export function runLayout (cy) {
  const nodes = cy.nodes(':visible')
  const fit = shouldFit(nodes)
  cy.layout(getOptions(fit)).run()
}

export function shouldFit (nodes) {
  return nodes.length > 1
}

export function getPath (el) {
  let path = el.scratch('path')

  if (!path) {
    const els = el.cy().elements()
    const root = els[0]

    path = els.aStar({
      root: root,
      goal: el,
      directed: true
    }).path.nodes().map(node => node.data().title)

    el.scratch('path', path)
  }

  return path
}