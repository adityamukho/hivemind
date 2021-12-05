import Cytoscape from 'cytoscape'
import Cxtmenu from 'cytoscape-cxtmenu'
import dagre from 'cytoscape-dagre'
import Popper from 'cytoscape-popper'
import viewUtilities from 'cytoscape-view-utilities'
import {
  defer,
  findIndex,
  get,
  intersectionBy,
  map,
  throttle,
  zipObject,
} from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { getOptions, shouldFit } from '../../utils/cyHelpers'
import usePrevious from '../../utils/usePrevious'
import GlobalContext from '../GlobalContext'
import { add, del, edit, hide, reveal, view } from './menu-items'
import style from './style'

let CytoscapeComponent = null
if (typeof window !== 'undefined') {
  CytoscapeComponent = require('react-cytoscapejs')

  Cytoscape.use(Popper)
  Cytoscape.use(Cxtmenu)
  Cytoscape.use(dagre)
  viewUtilities(Cytoscape)
}

const Canvas = ({ data, timestamp, events }) => {
  const { cyWrapper, poppers } = useContext(GlobalContext)
  const [output, setOutput] = useState(null)
  const [els, setEls] = useState([])
  const prevEls = usePrevious(els)

  useEffect(() => {
    if (cyWrapper.cy && prevEls !== els) {
      const commonEls = intersectionBy(prevEls, els, 'data.id')
      const celMap = zipObject(map(commonEls, 'data.id'), commonEls)

      cyWrapper.cy
        .elements()
        .filter((el) => celMap[el.id()])
        .forEach((el) => {
          el.removeData('summary content audio lastUpdatedBy')
          el.data(celMap[el.id()].data)
        })
    }
  }, [cyWrapper.cy, els, prevEls])

  useEffect(() => {
    if (get(data, 'ok') && typeof window !== 'undefined') {
      setEls(CytoscapeComponent.normalizeElements(data.data.elements))
    }
  }, [data])

  useEffect(() => {
    function initCy(cyInternal) {
      cyWrapper.cy = cyInternal

      cyInternal.nodes().forEach((node) => {
        node.scratch('style', node.style())
      })
    }

    const nodes = els.filter((el) => !el.data.id.startsWith('links'))
    const fit = shouldFit(nodes)
    const options = getOptions(fit)

    setOutput(
      <CytoscapeComponent
        cy={initCy}
        style={{ width: '100%', height: '100%' }}
        stylesheet={style}
        layout={options}
        elements={els}
      />
    )
  }, [cyWrapper, els])

  useEffect(() => {
    function configurePlugins(access) {
      function buildMenu() {
        const { viewApi } = cyWrapper

        return function (node) {
          const menu = []

          view(menu, poppers)
          if (!node.data('isRoot')) {
            hide(menu, viewApi)
          }
          if (node.scratch('showReveal')) {
            reveal(menu, viewApi)
          }

          if (access && ['admin', 'write'].includes(access.access)) {
            add(menu, poppers)
            if (!node.data('isRoot')) {
              del(menu, poppers)
            }
            edit(menu, poppers)
          }

          return menu
        }
      }

      const { cy } = cyWrapper
      const minRadius = Math.min(cy.width(), cy.height()) / 8

      const viewOpts = {
        highlightStyles: [
          {
            node: { 'border-color': '#0b9bcd', 'border-width': 3 },
            edge: {
              'line-color': '#0b9bcd',
              'source-arrow-color': '#0b9bcd',
              'target-arrow-color': '#0b9bcd',
              width: 3,
            },
          },
          {
            node: { 'border-color': '#04f06a', 'border-width': 3 },
            edge: {
              'line-color': '#04f06a',
              'source-arrow-color': '#04f06a',
              'target-arrow-color': '#04f06a',
              width: 3,
            },
          },
        ],
        selectStyles: {
          node: {
            'border-color': 'white',
            'border-width': 3,
            'background-color': 'lightgrey',
          },
          edge: {
            'line-color': 'white',
            'source-arrow-color': 'white',
            'target-arrow-color': 'white',
            width: 3,
          },
        },
        setVisibilityOnHide: false, // whether to set visibility on hide/show
        setDisplayOnHide: true, // whether to set display on hide/show
        zoomAnimationDuration: 500, //default duration for zoom animation speed
        neighbor: function (node) {
          return node.successors()
        },
        neighborSelectTime: 500,
      }
      cyWrapper.viewApi = cy.viewUtilities(viewOpts)

      const cxtMenu = {
        menuRadius: minRadius + 50, // the radius of the circular menu in pixels
        selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: buildMenu(), // function( ele ){ return [
        // /*...*/ ] }, // a function
        // that returns
        // commands or a promise of commands
        fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
        activeFillColor: 'rgba(100, 100, 100, 0.5)', // the colour used to indicate the selected
        // command
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
        atMouse: false, // draw menu at mouse position
      }
      cyWrapper.menu = cy.cxtmenu(cxtMenu)
    }

    function setHandlers() {
      const { viewApi, cy } = cyWrapper

      cy.on(
        'boxend',
        throttle(() => defer(() => viewApi.zoomToSelected(cy.$(':selected')))),
        1000
      )

      cy.on('mouseover', 'node', () => {
        document.getElementById('cy').style.cursor = 'pointer'
      })

      cy.on('mouseout', 'node', () => {
        document.getElementById('cy').style.cursor = 'default'
      })

      cy.on('mouseover', 'edge', (e) => {
        e.target.style({
          width: 4,
          'line-color': '#007bff',
          'target-arrow-color': '#007bff',
        })
      })

      cy.on('unselect mouseout', 'edge', (e) => {
        const edge = e.target

        if (!edge.selected()) {
          edge.style({
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
          })
        }
      })

      cy.on('add', 'node', (e) => {
        const node = e.target

        node.scratch('style', node.style())
      })

      cy.on(
        'add data remove',
        'node',
        throttle(() => {
          if (timestamp) {
            const idx = findIndex(events.data, { lctime: timestamp })
            const event = events.data[idx]
            const { viewApi } = cyWrapper

            viewApi.removeHighlights(cy.elements())
            if (event && event.event !== 'deleted') {
              const nid = event.nids[0]
              const node = cy.$id(nid)

              viewApi.highlight(node)
            }
          }
        }, 100)
      )

      cy.on('mouseover', 'node', (e) => {
        e.target.style('background-color', '#007bff')
      })

      cy.on('unselect mouseout', 'node', (e) => {
        const node = e.target

        viewApi.removeHighlights(node)

        if (!node.selected()) {
          node.style(
            'background-color',
            node.scratch('style')['background-color']
          )
        }
      })
    }

    if (cyWrapper.cy && get(data, 'ok') && get(events, 'ok')) {
      configurePlugins(data.data.access)
      setHandlers()
    }

    return () => {
      if (cyWrapper.menu) {
        cyWrapper.menu.destroy()
      }
    }
  }, [data, events, cyWrapper.menu, cyWrapper, timestamp, poppers, els])

  return (
    <div
      className={`border border-${
        timestamp ? 'secondary' : 'danger'
      } rounded w-100`}
      id="cy-container"
    >
      <div className="m-1" id="cy">
        {output}
      </div>
    </div>
  )
}

export default Canvas
