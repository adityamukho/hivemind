import Cytoscape from 'cytoscape'
import Cxtmenu from 'cytoscape-cxtmenu'
import Popper from 'cytoscape-popper'
import React, { useContext, useEffect, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { getOptions } from '../../utils/cyHelpers'
import GlobalContext from '../GlobalContext'
import { add, del, edit, view } from './menu-items'
import style from './style'

Cytoscape.use(Popper)
Cytoscape.use(Cxtmenu)

function buildMenu (cy, poppers, setEls, access) {
  return function (node) {
    const menu = []

    view(menu, poppers, cy)

    if (['admin', 'write'].includes(access.access)) {
      add(menu, poppers, setEls, cy)
      if (!node.data().isRoot) {
        del(menu, poppers, setEls, cy)
      }
      edit(menu, poppers)
    }

    return menu
  }
}

function configurePlugins (cy, poppers, setEls, access) {
  const minRadius = Math.min(cy.width(), cy.height()) / 8
  const cxtMenu = {
    menuRadius: minRadius + 50, // the radius of the circular menu in pixels
    selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
    commands: buildMenu(cy, poppers, setEls, access), // function( ele ){ return [ /*...*/ ] }, // a function
                                                            // that returns
    // commands or a promise of commands
    fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    activeFillColor: 'rgba(100, 100, 100, 0.5)', // the colour used to indicate the selected command
    activePadding: 10, // additional size in pixels for the active command
    indicatorSize: 16, // the size in pixels of the pointer to the active command
    separatorWidth: 3, // the empty spacing in pixels between successive commands
    spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    minSpotlightRadius: minRadius - 40, // the minimum radius in pixels of the spotlight
    maxSpotlightRadius: minRadius - 20, // the maximum radius in pixels of the spotlight
    openMenuEvents: 'tap', // space-separated cytoscape events that will open the menu; only
    // `cxttapstart` and/or `taphold` work here
    itemColor: 'white', // the colour of text in the command's content
    itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
    // zIndex: 9999, // the z-index of the ui div
    atMouse: false // draw menu at mouse position
  }

  // noinspection JSUnresolvedFunction
  cy.cxtmenu(cxtMenu)
}

function setHandlers (cy) {
  cy.on('mouseover', 'node', function () {
    document.getElementById('cy').style.cursor = 'pointer'
  })

  cy.on('mouseout', 'node', function () {
    document.getElementById('cy').style.cursor = 'default'
  })

  cy.on('select mouseover', 'edge', e => {
    e.target.style({
      width: 4,
      'line-color': '#007bff',
      'target-arrow-color': '#007bff'
    })
  })

  cy.on('unselect mouseout', 'edge', e => {
    const edge = e.target

    if (!edge.selected()) {
      edge.style({
        width: 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc'
      })
    }
  })

  cy.on('add', 'node', e => {
    const node = e.target

    node.scratch('style', node.style())
  })

  cy.on('mouseover select', 'node', e => {
    e.target.style('background-color', '#007bff')
  })

  cy.on('mouseout unselect', 'node', e => {
    const node = e.target

    if (!node.selected()) {
      node.style(
        'background-color',
        node.scratch('style')['background-color']
      )
    }
  })
}

const Canvas = ({ elements, access }) => {
  const [cy, setCy] = useState()
  const [els, setEls] = useState(CytoscapeComponent.normalizeElements(elements))
  const { cyWrapper, poppers } = useContext(GlobalContext)

  const nodes = els.filter(el => !el.data.id.startsWith('links'))
  const animate = nodes.length <= 50
  const fit = nodes.length > 1 && nodes.length < 17
  const options = getOptions(animate, fit)

  function initCy (cy) {
    setCy(cy)
    cyWrapper.cy = cy

    cy.nodes().forEach(node => {
      node.scratch('style', node.style())
    })
  }

  useEffect(() => {
    if (cy) {
      configurePlugins(cy, poppers, setEls, access)
      setHandlers(cy)
    }
  }, [cy])

  return <div className="border border-secondary rounded w-100" id="cy-container">
    <div className="m-1" id="cy">
      <CytoscapeComponent
        cy={initCy}
        style={{ width: '100%', height: '100%' }}
        stylesheet={style}
        layout={options}
        elements={els}
      />
    </div>
  </div>
}

export default Canvas