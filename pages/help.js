import Link from 'next/link'
import React, { useState } from 'react'
import {
  ArrowDownRight, Edit3, Eye, EyeOff, FastForward, Lock, MapPin, Maximize, Maximize2, Minimize2,
  Plus, Rewind, Save, Search, SkipBack, SkipForward, Trash2, Unlock
} from 'react-feather'
import {
  Badge, Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Carousel,
  CarouselControl, CarouselItem, Col, Collapse, Jumbotron, Nav, NavLink, Row
} from 'reactstrap'

const CollapsibleExample = ({ children }) => {
  const [isOpen, setOpen] = useState(false)

  const toggle = () => setOpen(!isOpen)

  return <>
    <Button size='sm' color="primary" onClick={() => toggle()} style={{ marginBottom: '1rem' }}>
      {isOpen ? <><Minimize2/> Close</> : <><Maximize2/> Open</>} Example
    </Button>
    <Collapse isOpen={isOpen}>{children}</Collapse>
    <hr/>
  </>
}

const CreateChildCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-4 Hivemind.png"
                 alt="Context Menu"/>
        <CardBody>
          <CardTitle tag="h5">Open the Context Menu</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessible from any node on the canvas.
          </CardSubtitle>
          <CardText>
            Contents may vary depending on state of mindmap and node.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Open the Context Menu'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-5 Hivemind.png"
                 alt="Child Node"/>
        <CardBody>
          <CardTitle tag="h5">Create a Child Node</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessed by clicking on the '<Plus/> Child' option from the context menu.
          </CardSubtitle>
          <CardText>
            Type a name and hit ⏎. The newly created child node will show up under the node from
            which the context menu was opened.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Create a Child Node'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
        interval={false}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const HideCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-4 Hivemind.png"
                 alt="Context Menu"/>
        <CardBody>
          <CardTitle tag="h5">Open the Context Menu</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            The '<EyeOff/> Hide' option is accessible from any node on the canvas (except root).
          </CardSubtitle>
          <CardText>
            Useful for reducing clutter on the canvas.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Open the Context Menu'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-8 Hivemind.png"
                 alt="Hide Node"/>
        <CardBody>
          <CardTitle tag="h5">Hide a Node</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessed by clicking on the '<EyeOff/> Hide' option from the context menu.
          </CardSubtitle>
          <CardText>
            Hides the entire sub-tree under this node (as well as the node itself). Shades the
            parent to indicate hidden children.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Hide a Child Node'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
    interval={false}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const RevealCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-9 Hivemind.png"
                 alt="Context Menu"/>
        <CardBody>
          <CardTitle tag="h5">Open the Context Menu</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            The '<Eye/><ArrowDownRight/> Reveal' option is accessible from any node that has hidden
            children.
          </CardSubtitle>
          <CardText>
            Used to reveal (un-hide) the entire sub-tree under the node.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Open the Context Menu'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-15 Hivemind.png"
                 alt="Reveal Node"/>
        <CardBody>
          <CardTitle tag="h5">Reveal a Node</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessed by clicking on the '<Eye/><ArrowDownRight/> Reveal' option from the context
            menu.
          </CardSubtitle>
          <CardText>
            Reveals the entire sub-tree under this node. Un-shades the node to indicate no hidden
            children.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Reveal a Node'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
    interval={false}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const TimelineCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-11 Hivemind.png"
                 alt="Event Detail"/>
        <CardBody>
          <CardTitle tag="h5">Event Detail</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Shows the delta associated with an event (update, in this instance).
          </CardSubtitle>
          <CardText>
            Accessed by clicking on an event on the timeline. Fields that were changed are marked in
            colour. The event time is displayed. If the title was changed, both the old and new
            title are shown in the header section of the detail popup. Clicking on the <Button
            outline color="secondary" size={'sm'}><MapPin/> Jump</Button> button makes the mind map
            jump to a point in time just after this event had occured. This updates the canvas and
            also focuses the timeline on this event.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Event Detail'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-12 Hivemind.png"
                 alt="Timeline Jump"/>
        <CardBody>
          <CardTitle tag="h5">Timeline Jump</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessed by clicking on the <Button outline color="secondary" size={'sm'}><MapPin/> Jump
          </Button> button from the event detail popup.
          </CardSubtitle>
          <CardText>
            The mind map has jumped to the point in time at which this event had occured. The state
            of the canvas reflects the mind map was in just after this event had occurred. The
            affected node is higlighted with a blue border. The timeline focusses on the event in
            question.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Timeline Jump'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-13 Hivemind.png"
                 alt="Event Detail"/>
        <CardBody>
          <CardTitle tag="h5">Event Detail (Focussed)</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Shows the delta associated with an event (update, in this instance).
          </CardSubtitle>
          <CardText>
            Accessed by clicking on an (focussed) event on the timeline. The <Button
            outline color="secondary" size={'sm'}><MapPin/> Jump</Button> button is now replaced
            with a <Button outline color="secondary" size={'sm'}><Search/> Find</Button> button.
            This can be used to zoom in on the affected node on the canvas.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Focussing on an Event Detail'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-14 Hivemind.png"
                 alt="Find Node"/>
        <CardBody>
          <CardTitle tag="h5">Find Node</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Accessed by clicking on the <Button outline color="secondary" size={'sm'}><Search/> Find
          </Button> button from the event detail popup.
          </CardSubtitle>
          <CardText>
            The canvas zooms in on the node affected by the event.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Find Node'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
        interval={false}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const FitCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-20 Hivemind.png"
                 alt="Messed-Up Layout"/>
        <CardBody>
          <CardTitle tag="h5">Messed-Up Layout</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Nodes on the canvas have been manually dragged around.
          </CardSubtitle>
          <CardText>
            Use <Button outline color="primary" size={'sm'}><Maximize/></Button> to re-run the
            layout and achieve optimal fit.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'A Messed-Up Layout'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-15 Hivemind.png"
                 alt="Layout Fixed"/>
        <CardBody>
          <CardTitle tag="h5">Layout Fixed</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Optimal fit achieved.
          </CardSubtitle>
          <CardText>
            This resets any movement on canvas, and also refits nodes after a hide/reveal.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Layout Fixed'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
    interval={false}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const ShowCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const items = [
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-18 Hivemind.png"
                 alt="Hidden Nodes"/>
        <CardBody>
          <CardTitle tag="h5">Canvas with Hidden Nodes</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Some nodes/sub-trees on the canvas have been hidden.
          </CardSubtitle>
          <CardText>
            After hiding, the canvas was told to rerun its layout to optimally fit the now visible
            nodes.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Hidden Nodes'
    },
    {
      contents: <Card className={'mb-4'}>
        <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-19 Hivemind.png"
                 alt="All Nodes Revealed"/>
        <CardBody>
          <CardTitle tag="h5">All Nodes Revealed</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            All hidden nodes/sub-trees are revealed.
          </CardSubtitle>
          <CardText>
            This reveals any hidden nodes/sub-trees on canvas, and also reruns the layout to
            optimally fit the now fully visible mind map.
          </CardText>
        </CardBody>
      </Card>,
      caption: 'Layout Fixed'
    }
  ]

  const next = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) {
      return
    }

    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        {item.contents}
      </CarouselItem>
    )
  })

  return <Carousel
    activeIndex={activeIndex}
    next={next}
    previous={previous}
    interval={false}
  >
    {slides}
    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
    <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
  </Carousel>
}

const Page = () =>
  <Row>
    <Col xs="auto" md={3} tabIndex="1" style={{ height: '90vh', overflowY: 'scroll' }}>
      <h3>Navigation</h3>
      <Nav vertical id={'nav'} className={'navbar-light bg-light'}>
        <NavLink href="#intro">Introduction</NavLink>
        <NavLink href="#at-a-glance">At a Glance</NavLink>
        <Nav vertical>
          <NavLink href="#key-points" className={'ml-3'}>Key Points</NavLink>
        </Nav>
        <NavLink href="#quick-start">Quick Start</NavLink>
        <Nav vertical>
          <NavLink href="#logging-in" className={'ml-3'}>Logging In</NavLink>
          <NavLink href="#create-mind-map" className={'ml-3'}>Creating a mind map</NavLink>
          <NavLink href="#create-child-node" className={'ml-3'}>Creating a (child) node</NavLink>
          <NavLink href="#delete-node" className={'ml-3'}>Deleting a node</NavLink>
          <NavLink href="#edit-node" className={'ml-3'}>Editing a node</NavLink>
          <NavLink href="#view-node" className={'ml-3'}>Viewing a node</NavLink>
          <NavLink href="#hide-node" className={'ml-3'}>Hiding a node</NavLink>
          <NavLink href="#reveal-node" className={'ml-3'}>
            Revealing (Un-hiding) a node (sub-tree)
          </NavLink>
          <NavLink href="#time-travel" className={'ml-3'}>Time travel</NavLink>
          <Nav vertical>
            <NavLink href="#timeline" className={'ml-5'}>Using the Timeline</NavLink>
            <NavLink href="#playback" className={'ml-5'}>Using the Playback Buttons</NavLink>
          </Nav>
          <NavLink href="#search" className={'ml-3'}>Searching</NavLink>
          <NavLink href="#rename" className={'ml-3'}>Renaming a mind map</NavLink>
          <NavLink href="#fit" className={'ml-3'}>Fit on canvas</NavLink>
          <NavLink href="#show-all" className={'ml-3'}>Show All</NavLink>
        </Nav>
      </Nav>
    </Col>
    <Col xs="auto" md={9} tabIndex="0" style={{ height: '90vh', overflowY: 'scroll' }}>
      <Jumbotron>
        <h1 id={'intro'}>Introduction</h1>
        <p>
          Hivemind is a free tool that lets you create mind maps in your browser. It supports
          time-travel (through the change history of the mind map), tagging specific time points
          (<Badge color="secondary">Planned</Badge>) and collaborative editing (<Badge
          color="secondary">Planned</Badge>).
        </p>

        <h1 id={'at-a-glance'}>At a Glance</h1>
        <p>
          Each mind map is modelled as a tree, ie. it has a single root node, and all other nodes
          are descendants of this root node through a single hierarchy. There are no cases of
          multiple parents, cycles, loops (self-joining edges), parallel edges or orphaned nodes.
        </p>

        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28 Hivemind.png"
                     alt="Example Mind Map"/>
            <CardBody>
              <CardTitle tag="h5">An example mind map</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Tree structure with a single root node.
              </CardSubtitle>
              <CardText>
                This tree is 3 levels deep. Each node can have one or more children, but exactly one
                parent (except the root node, which has none). The timeline at the bottom shows at
                what points this mind map was modified.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <p>
          Each node in the mindmap is a container for information. There is a title, a summary and a
          content field. This node is connected to exactly one parent by an edge (except when it is
          the root node), and can optionally have one or mode child nodes. The edges themselves do
          not carry any information at present, other than which nodes they connect.
        </p>

        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-1 Hivemind.png"
                     alt="Node Details"/>
            <CardBody>
              <CardTitle tag="h5">Expanded view of a node</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Accessed by a context menu upon clicking the node.
              </CardSubtitle>
              <CardText>
                Apart from the title, summary and content, a few other bits of information are
                displayed, like who created/last updated the node, and where the node sits in the
                overall hierarchy.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <h2 id={'key-points'}>Key Points</h2>
        <p>
          Every write operation that is performed on a node (create/update/delete) is recorded
          permanently in a time-travelling database, allowing for point-in-time lookups of any
          historic version of a single node or the graph as a whole.
        </p>

        <ol>
          <li>
            The root node is special - it cannot be deleted, and is the only node without a parent.
          </li>
          <li className={'text-danger'}>
            Whenever a node is deleted, the entire subtree under it is also deleted in order to
            ensure there are no orphaned nodes.
          </li>
          <li>
            Only users with edit or admin access can perform write operations on the tree.
          </li>
          <li>
            <Badge color="secondary">Planned</Badge> A user with admin access can additionally share
            the mindmap with other users (by granting/revoking read/write/admin access) or make it
            publicly (in)visible (read-only).
          </li>
          <li>
            <Badge color="secondary">Planned</Badge> Only an admin user can delete a mind map.
          </li>
          <li className={'text-danger'}>
            Access control is <strong>NOT</strong> modelled temporally, ie. if your access to a mind
            map is revoked, you lose access to ALL its history, not just from the time of
            revocation. Conversely, if you are granted access to a mind map, you gain access to
            its <strong>ENTIRE</strong> history, not just from now onwards.
          </li>
        </ol>

        <h1 id={'quick-start'}>Quick Start</h1>
        <h2 id={'logging-in'}>Logging in</h2>
        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-2 Hivemind.png"
                     alt="Login Prompt"/>
            <CardBody>
              <CardTitle tag="h5">Login Prompt</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Login via email or an external authentication provider.
              </CardSubtitle>
              <CardText>
                Anonymous users must first login to start creating mind maps.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <ul>
          <li>Go the the Hivemind <Link href={'/'}><a>home</a></Link> page.</li>
          <li>If you're not logged in, you'll see a login prompt as shown in the example above.</li>
          <li>
            Use an email (that you own) or one of the other providers (currently Google, GitHub) to
            sign in.
          </li>
          <li>
            If you're signing in for the first time, you'll have to perform a few extra steps,
            either to set your password, or to authorize Hivemind with the external provider.
          </li>
          <li>Once you've signed in, you'll be redirected to the list of mind maps that you own.
          </li>
        </ul>

        <h2 id={'create-mind-map'}>Creating a mind map</h2>
        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-3 Hivemind.png"
                     alt="Login Prompt"/>
            <CardBody>
              <CardTitle tag="h5">Create a Mind Map</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Accessed from the mind maps <Link href={'/mmaps'}><a>list</a></Link> page.
              </CardSubtitle>
              <CardText>
                Click on the <Button color='success' size='sm'
                                     id='create'><Plus/> Create</Button> button. Then just type a
                name and hit ⏎.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <ul>
          <li>Go to the mind maps <Link href={'/mmaps'}><a>list</a></Link> page.</li>
          <li>
            Click on the <Button color='success' size='sm'
                                 id='create'><Plus/> Create</Button> button.
          </li>
          <li>Type a name and hit ⏎ (&lt;Enter&gt;).</li>
          <li>
            <strong>
              The first node in the mind map will inherit its title from the mind map's name.
            </strong>
          </li>
        </ul>

        <h2 id={'create-child-node'}>Creating a (child) node</h2>
        <p>
          Each node (except the root node) is a child of exactly one other node. While the root node
          is automatically created for you when you create the mind map, every other node must be
          created as a descendant of the root node by accessing a context menu within the mind map
          canvas (the black area). This context menu is available on all nodes, but its contents
          could vary depending on a number of factors. The 'create child' option is available,
          provided:
        </p>

        <ol>
          <li>The user has 'admin' or 'write' access to the mind map, and</li>
          <li>
            The mind map is being viewed in 'write' mode (i.e., not in 'lookback mode' - to be
            discussed later).
          </li>
        </ol>

        <CollapsibleExample><CreateChildCarousel/></CollapsibleExample>

        <ul>
          <li>Click on the node under which you wish to create the child.</li>
          <li>Select the '<Plus/> Child' option.</li>
          <li>Type a name and hit ⏎ (&lt;Enter&gt;).</li>
          <li>The new node will show up under the node selected above.</li>
        </ul>

        <h2 id={'delete-node'}>Deleting a node</h2>
        <p>
          All nodes (except the root node) can be deleted. Upon deletion, the entire sub-tree under
          the deleted node is also deleted. The 'delete node' option is available, provided:
        </p>

        <ol>
          <li>The user has 'admin' or 'write' access to the mind map,</li>
          <li>
            The mind map is being viewed in 'write' mode (i.e., not in 'lookback mode' - to be
            discussed later), and
          </li>
          <li>The node is not the root node.</li>
        </ol>

        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-6 Hivemind.png"
                     alt="Delete a node"/>
            <CardBody>
              <CardTitle tag="h5">Delete a Node</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Accessed by clicking on the '<Trash2/> Del' option from the context menu.
              </CardSubtitle>
              <CardText>
                Confirm delete operation to get rid of the node (and all of its descendants, if
                present).
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>
        <ul>
          <li>Click on the node that you would like to remove.</li>
          <li>Select the '<Trash2/> Del' option.</li>
          <li>Confirm that you want to delete the node by clicking the <Button size='sm'
                                                                               color="danger"><Trash2/> Delete</Button> button.
          </li>
        </ul>

        <h2 id={'edit-node'}>Editing a node</h2>
        <p>
          All nodes can be edited. The 'edit node' option is available, provided:
        </p>

        <ol>
          <li>The user has 'admin' or 'write' access to the mind map, and</li>
          <li>
            The mind map is being viewed in 'write' mode (i.e., not in 'lookback mode' - to be
            discussed later).
          </li>
        </ol>

        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-7 Hivemind.png"
                     alt="Edit a node"/>
            <CardBody>
              <CardTitle tag="h5">Edit a Node</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Accessed by clicking on the '<Edit3/> Edit' option from the context menu.
              </CardSubtitle>
              <CardText>
                Edit one or more of the 'title', 'summary' and 'content' fields, and click
                the <Button color="primary" size='sm'><Save/> Save</Button> button.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>
        <ul>
          <li>Click on the node that you would like to edit.</li>
          <li>Select the '<Edit3/> Edit' option.</li>
          <li>The popup screen will appear with a title, summary and content of the node.</li>
          <li>
            Modify one or more of the attributes as required as click on&nbsp;
            <Button color="primary" size='sm'><Save/> Save</Button>.
          </li>
        </ul>

        <h2 id={'view-node'}>Viewing a node</h2>
        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-1 Hivemind.png"
                     alt="View a node"/>
            <CardBody>
              <CardTitle tag="h5">View a Node</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Accessed by clicking on the '<Eye/> View' option from the context menu.
              </CardSubtitle>
              <CardText>
                View the title, summary and content of the node. Also shows its position in the
                hierarchy and who created/last updated it.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>
        <ul>
          <li>Click on the node that you would like to view.</li>
          <li>Select the '<Eye/> View' option.</li>
          <li>The popup screen will appear with a title, summary and content of the node.</li>
        </ul>

        <h2 id={'hide-node'}>Hiding a node</h2>
        <p>
          Each node (except the root node) has an option to be hidden from display on the canvas.
          This can be useful to temporarily remove clutter when a large number of nodes are on
          display. Upon hiding, the entire sub-tree under the node is also hidden. To indicate that
          a node was hidden, its parent is marked in a grey/black shaded background. The hidden node
          (and all its descendants) can be revealed using a menu option under its parent.
        </p>

        <CollapsibleExample><HideCarousel/></CollapsibleExample>

        <ul>
          <li>Click on the node which you wish to hide.</li>
          <li>Select the '<EyeOff/> Hide' option.</li>
          <li>Hides the entire sub-tree under this node (as well as the node itself).</li>
          <li>Shades the parent to indicate hidden children.</li>
        </ul>

        <h2 id={'reveal-node'}>Revealing (Un-hiding) a node (sub-tree)</h2>
        <p>
          A hidden node (and its descendants) is indicated by a shaded background on its parent. To
          reveal its sub-tree and render them back onto the canvas, a menu option is added to the
          parent (only for parents with hidden children). Clicking on this reveals (un-hides)
          the <strong>entire sub-tree under the parent</strong>.
        </p>

        <CollapsibleExample><RevealCarousel/></CollapsibleExample>

        <ul>
          <li>Click on the (shaded) node whose children you wish to reveal.</li>
          <li>Select the '<Eye/><ArrowDownRight/> Reveal' option.</li>
          <li>Reveals the <strong>entire sub-tree under this node</strong>.</li>
          <li>Un-shades the node to indicate no hidden children.</li>
        </ul>

        <h2 id={'time-travel'}>Time travel</h2>
        <p>
          Hivemind can <strong>time-travel</strong>. What this means is, as you keep changing the
          mindmap through create/edit/delete operations, Hivemind keeps track of all these changes
          and retains a history of all the revisions of the mind map as a whole. This gives users of
          Hivemind the unique ability to rewind back to any point in time through the history of the
          mind map, and view it as it was at that time. This is achieved either by using the
          timeline component (below the canvas) or the playback buttons (in the menu bar above the
          canvas). See the image below.
        </p>

        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-10 Hivemind.png"
                     alt="Time Travel Controls"/>
            <CardBody>
              <CardTitle tag="h5">Time Travel</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Use the playback buttons or the timeline.
              </CardSubtitle>
              <CardText>
                Travel back/forth through the history of changes to the mind map, and view it as it
                was at any point in time through its lifecycle.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <p>
          Whenever the user travels through time to look back at a historical version of the mind
          map, it is said to be in <strong>'lookback mode'</strong>, and all modifications are
          disabled (since its history is treated as immutable). This is indicated in three ways:
        </p>

        <ol>
          <li>
            A <code>timestamp</code> query parameter in the URL, which also serves as a permalink to
            this point-in-time version of the mind map,
          </li>
          <li>
            A button at the top right of the menu bar, which shows a <span
            className={'text-secondary'}><Lock/></span> symbol (otherwise showing a <span
            className={'text-danger'}><Unlock/></span> symbol when in 'write mode'),
          </li>
          <li>
            A grey border around the canvas (which is otherwise red in 'write mode').
          </li>
        </ol>

        <p>
          <strong>
            While the mind map is in 'lookback mode', it cannot be edited.
          </strong>
        </p>

        <h3 id={'timeline'}>Using the Timeline</h3>
        <p>
          The timeline is the component displayed at the bottom of the mind map canvas, that shows a
          time series of write events that took place on the mind map, in chronological order. It
          has the following properties:
        </p>
        <ol>
          <li>
            The timeline can zoom in and out. This is manually achieved by scrolling while the
            cursor is on the timeline (or using pinch zoom on a touchscreen).
          </li>
          <li>
            When fully zoomed out, the timeline fits all events of the mind map. It cannot be zoomed
            out beyond the boundaries defined by the first and the last events of the mind map.
          </li>
          <li>
            When fully zoomed in, it has a resolution of 1 minute.
          </li>
          <li>
            Events are color-coded to depict their type. A 'create' event is <span
            className={'text-success'}>green</span>, an 'update' event is <span
            className={'text-primary'}>blue</span> and a 'delete' event is <span
            className={'text-danger'}>red</span>.
          </li>
          <li>
            When two or more events get too close together on the timeline to be clearly rendered
            (ie. they start overlapping), they are clubbed together in a 'cluster', with a number
            showing the number of events in that cluster.
          </li>
          <li>
            A cluster can be expanded to fill the timeline by double-clicking on it.
          </li>
          <li>
            Double-clicking an empty portion of the timeline will cause it to zoom out fully.
          </li>
        </ol>

        <p>
          Open the example below for a step-by-step guide how to use the timeline.
        </p>

        <p>
          <strong>
            Any jump triggered on the timeline automatically puts the mind map in 'lookback mode'.
          </strong>
          It can be put back into 'write mode' by clicking on the <Button outline color="secondary"
                                                                          size={'sm'}><Lock/></Button> button
          at the top right in the menu bar.
        </p>

        <CollapsibleExample><TimelineCarousel/></CollapsibleExample>

        <h3 id={'playback'}>Using the Playback Buttons</h3>
        <p>
          The playback buttons at the top menu bar should be fairly easy to understand and use. They
          look and work similar to an audio player - only that in this case, the buttons are used to
          jump between events on the timeline, rather than between items in a playlist.
        </p>
        <ol>
          <li>
            The <Button outline color="secondary" size={'sm'}><SkipBack/></Button> button takes you
            directly to the first event of the timeline.
          </li>
          <li>
            The <Button outline color="secondary" size={'sm'}><Rewind/></Button> button takes you
            to the previous event from the current event on the timeline. If you are currently in
            'write mode' then this takes you to the last event.
          </li>
          <li>
            The <Button outline color="secondary" size={'sm'}><FastForward/></Button> button takes
            you
            to the next event from the current event on the timeline. If you are currently in
            'write mode' then this takes you to the last event.
          </li>
          <li>
            The <Button outline color="secondary" size={'sm'}><SkipForward/></Button> button takes
            you directly to the last event of the timeline.
          </li>
        </ol>

        <p>
          <strong>
            Any action on the playback buttons automatically puts the mind map in 'lookback mode'.
          </strong>
          It can be put back into 'write mode' by clicking on the <Button outline color="secondary"
                                                                          size={'sm'}><Lock/></Button> button
          at the top right in the menu bar.
        </p>

        <h2 id={'search'}>Searching</h2>
        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-16 Hivemind.png"
                     alt="Search"/>
            <CardBody>
              <CardTitle tag="h5">Search</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Search for nodes on canvas.
              </CardSubtitle>
              <CardText>
                Use one or more filters/sort to locate a particular node of your interest. Clicking
                on a row will make the canvas zoom in one the node corresponding to that row.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <ul>
          <li>
            Click on the <Button outline color="secondary" size={'sm'}><Search/></Button> button in
            the top menu bar.
          </li>
          <li>Enter your filter criteria or sort the columns in ascending/descending order.</li>
          <li>If a node that matches all filter critera exists, you should see it in the list.</li>
          <li>
            Click on the node if you would like to navigate to it in the canvas.
          </li>
        </ul>

        <h2 id={'rename'}>Renaming a mind map</h2>
        <p>
          The mind map can be renamed when in 'write mode'. This is true when:
        </p>

        <ol>
          <li>The user has 'admin' or 'write' access to the mind map, and</li>
          <li>
            The mind map is being viewed in 'write' mode (i.e., not in 'lookback mode' - as
            discussed earlier).
          </li>
        </ol>
        <CollapsibleExample>
          <Card className={'mb-4'}>
            <CardImg top width="100%" src="/img/help/Screenshot_2021-03-28-17 Hivemind.png"
                     alt="Rename"/>
            <CardBody>
              <CardTitle tag="h5">Rename</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Rename the mind map.
              </CardSubtitle>
              <CardText>
                Click on the <Button outline color="primary" size={'sm'}><Edit3/></Button> button.
                Enter the new name and hit <Button color="primary" size='sm'><Save/> Save</Button>.
              </CardText>
            </CardBody>
          </Card>
        </CollapsibleExample>

        <ul>
          <li>Click on the <Button outline color="primary" size={'sm'}><Edit3/></Button> button.
          </li>
          <li>This button can be found in the menu bar.</li>
          <li>Modify the name as required and hit ⏎ (&lt;Enter&gt;).</li>
        </ul>

        <h2 id={'fit'}>Fit on canvas</h2>
        <p>
          If the mind map does not optimally fit in the canvas, either because you played around
          with the canvas zoom or moved a few nodes around, or just hid/revealed a bunch of nodes,
          you can force them to optimally fit by clicking on the <Button outline color="secondary"
                                                                         size={'sm'}><Maximize/></Button> button
          in the top menu bar.
        </p>

        <CollapsibleExample><FitCarousel/></CollapsibleExample>

        <h2 id={'show-all'}>Show All</h2>
        <p>
          If several sub-trees were hidden on the canvas, it can get tedious to reveal them all by
          navigating to their parents one-by-one. For such cases a quick shortcut is to click on
          the <Button outline color="secondary" size={'sm'}><Eye/></Button> button in the top menu
          bar. This causes the canvas to immediately reveal all hidden sub-trees and also re-run the
          layout if necessary.
        </p>

        <CollapsibleExample><ShowCarousel/></CollapsibleExample>
      </Jumbotron>
    </Col>
  </Row>

export default Page
