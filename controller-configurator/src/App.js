import './App.css'
import { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}

const commonProperties = [
  { id: 'max', name: 'Maximum value', type: 'number', min: 1, max: 255, value: 255 },
  { id: 'max', name: 'Minimum value', type: 'number', min: 0, max: 254, value: 0 },
  { id: 'reverse', name: 'Reverse', type: 'boolean', value: false },
]

const encoderProperties = commonProperties
const analogProperties = commonProperties

const items = [
  {
    type: 'controller',
    name: 'Controller',
    width: 4,
    height: 4,
    src: { 0: '/controller0.png', 90: '/controller90.png', 180: '/controller180.png', 270: '/controller270.png' },
    connectors: [
      { available: true, position: { left: 0, top: 80 }, accepts: 'any' },
      { available: true, position: { right: 0, top: 20 }, accepts: 'any' },
      { available: true, position: { right: 0, top: 80 }, accepts: 'any' },
    ],
    properties: [{ id: 'address', name: 'Address', type: 'text' }],
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'encoder',
    type: 'encoder',
    name: 'Encoder',
    width: 5,
    height: 4,
    src: { 0: '/encoder0.png', 90: '/encoder90.png', 180: '/encoder180.png', 270: '/encoder270.png' },
    connectors: [
      { available: true, position: { left: 0, top: 50 } },
      { available: true, position: { right: 0, top: 50 }, accepts: 'encoder' },
    ],
    properties: encoderProperties,
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'encoder_w_leds',
    type: 'encoder',
    name: 'Encoder with LEDs',
    width: 6,
    height: 6,
    src: {
      0: '/encoder_with_leds0.png',
      90: '/encoder_with_leds90.png',
      180: '/encoder_with_leds180.png',
      270: '/encoder_with_leds270.png',
    },
    connectors: [
      { available: true, position: { left: 0, top: 50 } },
      { available: true, position: { right: 0, top: 50 }, accepts: 'encoder' },
    ],
    properties: [
      { id: 'ledCount', name: 'LED count', type: 'number', min: 1, value: 15 },
      { id: 'color', name: 'LED color', type: 'color', value: '#ff0000' },
      ...encoderProperties,
    ],
    orientations: [0],
  },
  {
    id: 'slider',
    type: 'analog',
    name: 'Slider',
    width: 6,
    height: 4,
    src: { 0: '/slider0.png', 90: '/slider90.png', 180: '/slider180.png', 270: '/slider270.png' },
    connectors: [{ available: true, position: { left: 0, top: 50 } }],
    properties: analogProperties,
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'crossfader',
    type: 'analog',
    name: 'Crossfader',
    width: 9,
    height: 4,
    src: { 0: '/crossfader0.png', 90: '/crossfader90.png', 180: '/crossfader180.png', 270: '/crossfader270.png' },
    connectors: [{ available: true, position: { left: 0, top: 50 } }],
    properties: analogProperties,
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'pot',
    type: 'analog',
    name: 'Pot',
    width: 5,
    height: 4,
    src: { 0: '/pot0.png', 90: '/pot90.png', 180: '/pot180.png', 270: '/pot270.png' },
    connectors: [{ available: true, position: { left: 0, top: 50 } }],
    properties: analogProperties,
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'button',
    type: 'button',
    name: 'Pad',
    width: 6,
    height: 6,
    src: { 0: '/pad0.png', 90: '/pad90.png', 180: '/pad180.png', 270: '/pad270.png' },
    connectors: [{ available: true, position: { left: 0, top: 50 } }],
    properties: analogProperties,
    orientations: [0, 90, 180, 270],
  },
]

const applyConnectorRotation = ({ left, right, top, bottom }, rotation) =>
  rotation === 0
    ? { left, right, top, bottom }
    : rotation === 90
    ? { left: bottom, top: left, right: top, bottom: right }
    : rotation === 180
    ? { left: right, top: bottom, right: left, bottom: top }
    : { left: top, bottom: left, right: bottom, top: right }

const gridSize = 20
const connectorWidth = 10

const itemRect = (x, y, width, height, rotation) => {
  const w = (rotation / 90) % 2 === 0 ? width : height
  const h = (rotation / 90) % 2 === 0 ? height : width
  const left = Math.round(x / gridSize) * gridSize - Math.floor(w / 2) * gridSize
  const top = Math.max(Math.round(y / gridSize) * gridSize - Math.floor(h / 2) * gridSize, 0)
  return {
    left,
    right: left + w * gridSize,
    top,
    bottom: top + h * gridSize,
    height: h * gridSize,
    width: w * gridSize,
  }
}

const intersect = (r1, r2) => {
  return !(r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom || r2.bottom <= r1.top)
}

const getSelectedConnectorPosition = (items, connector) => {
  const item = items[connector.item]
  const c = item.connectors[connector.connector]
  return getCoordinate(item, c)
}

const canConnect = (i1, connector1, i2, connector2) => {
  if (i1 === i2 || connector1.available === false || !connector2.available === false) return false

  const acceptsSelectedType =
    connector1.accepts &&
    !connector2?.accepts &&
    (connector1.accepts === 'any' || connector1.accepts === connector2?.type)
  const providesSelectedType =
    !connector1.accepts &&
    connector2?.accepts &&
    (connector1.type === connector2.accepts || connector2.accepts === 'any')

  return acceptsSelectedType || providesSelectedType
}

const ESCAPE_KEYS = ['27', 'Escape']

function PropertiesPanel(selectedItem) {
  return (
    <div>
      <h3>Properties</h3>
      {selectedItem && (
        <>
          <div>Type: {selectedItem.name}</div>
          <div className={'properties'}>
            {selectedItem?.properties?.map(({ name, type, id, ...props }) => (
              <label className={'property'}>
                {name}:
                {type === 'number' && <input type="number" min={props.min} max={props.max} value={props.value} />}
                {type === 'color' && <input type="text" maxLength={7} value={props.value} />}
                {type === 'text' && <input type="text" value={props.value} />}
                {type === 'boolean' && <input type="checkbox" checked={props.value} />}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ComponentPalette(currentView, dragItem, setDragItem) {
  return items.map((item) => (
    <div
      className={`palette-item${item.name === dragItem?.name ? ' palette-item_selected' : ''}`}
      onClick={() => {
        if (dragItem && item.id === dragItem.id) {
          setDragItem(undefined)
        } else {
          setDragItem({ ...item, rotation: 0 })
        }
      }}
    >
      <img src={item.src[0]} draggable={false} />
      <span>{item.name}</span>
    </div>
  ))
}

function CurrentConnector(selectedConnectorPosition, x, y) {
  return (
    <svg className={'current-connector'} pointerEvents={'none'}>
      <line
        x1={selectedConnectorPosition.x}
        y1={selectedConnectorPosition.y}
        x2={x}
        y2={y}
        stroke="#00ff00"
        strokeWidth={3}
        pointerEvents={'none'}
      />
    </svg>
  )
}

function DragItem(invalidLocation, dragItem, x, y) {
  return (
    <img
      className={`drag-item ${invalidLocation ? 'drag-item_invalid' : ''}`}
      src={dragItem.src[dragItem.rotation]}
      style={{
        position: 'absolute',
        ...itemRect(x, y, dragItem.width, dragItem.height, dragItem.rotation),
      }}
    />
  )
}

function getCoordinate(item, connector) {
  const { left: il, right: ir, top: it, bottom: ib } = item
  const { left: cl, right: cr, top: ct, bottom: cb } = applyConnectorRotation(connector.position, item.rotation)

  const orientation = (item.rotation / 90) % 2

  const margins = {
    left: orientation !== 0 ? 10 : 3,
    right: orientation !== 0 ? 10 : 3,
    top: orientation === 0 ? 10 : 3,
    bottom: orientation === 0 ? 10 : 3,
  }

  return {
    x:
      cl !== undefined
        ? il + Math.abs(ir - il) * (cl / 100) + connectorWidth - margins.left
        : ir - Math.abs(ir - il) * (cr / 100) - connectorWidth + margins.right,
    y:
      ct !== undefined
        ? it + Math.abs(ib - it) * (ct / 100) + connectorWidth - margins.top
        : ib - Math.abs(ib - it) * (cb / 100) - connectorWidth + margins.bottom,
  }
}

function getCoordinates(fromItem, fromConnector, toItem, toConnector) {
  const { x: x1, y: y1 } = getCoordinate(fromItem, fromConnector)
  const { x: x2, y: y2 } = getCoordinate(toItem, toConnector)
  return {
    x1,
    y1,
    x2,
    y2,
  }
}

function Connections(designItems) {
  return (
    <svg className={'connections'} pointerEvents={'none'}>
      {designItems
        .map(({ connectors, ...item }) =>
          connectors
            .filter(({ to }) => to)
            .map((connector) => {
              const toItem = designItems[connector.to.item]
              const toConnector = toItem.connectors[connector.to.connector]
              const coordinates = getCoordinates(item, connector, toItem, toConnector)
              return <line strokeWidth={2} stroke="#00ff00" {...coordinates} />
            })
        )
        .flat(2)}
    </svg>
  )
}

function ViewSelector(currentView, setCurrentView) {
  return (
    <div className={'slider-container'}>
      <div
        className={`slider-item ${currentView === 'components' ? 'slider-item_active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setCurrentView('components')
        }}
      >
        Components
      </div>
      <div
        className={`slider-item ${currentView === 'connections' ? 'slider-item_active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setCurrentView('connections')
        }}
      >
        Connections
      </div>
      <div
        className={`slider-item ${currentView === 'properties' ? 'slider-item_active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setCurrentView('properties')
        }}
      >
        Properties
      </div>
    </div>
  )
}

function removeConnections(newItems, i, ci = undefined) {
  newItems.forEach(({ connectors }) =>
    connectors
      .filter(({ to }) => to)
      .forEach((connector) => {
        if (connector.to.item === i && (ci === undefined || connector.to.connector === ci)) {
          delete connector.to
        } else if (connector.to.item > i && ci === undefined) {
          connector.to.item = connector.to.item - 1
        }
      })
  )
}

function getTargetItems(items, connectors) {
  return connectors.filter(({ to }) => to).map(({ to }) => items[to.item])
}

function updateAvailabilityFromRoot(items) {
  items.forEach(({ connectors }) => connectors.forEach((connector) => (connector.available = true)))

  const allConnectors = items
    .map(({ connectors }) => connectors)
    .flat(1)
    .filter(({ to }) => to)
  const rootItems = items.filter((_, i) => !allConnectors.some(({ to: { item } }) => i === item))
  updateAvailability(items, rootItems, rootItems.map(({ connectors }) => connectors).flat(1))
}

function updateAvailability(allItems, items, connectors, level = 1) {
  if (level <= 2) {
    const targetItems = getTargetItems(allItems, connectors)
    targetItems.forEach(({ connectors }) => {
      updateAvailability(allItems, targetItems, connectors, level + 1)
    })
  } else {
    connectors.forEach((connector) => {
      if (connector.accepts) {
        connector.available = false
      }
    })
  }
}

function generateConfig(controller) {}

function App() {
  const [dragItem, setDragItem] = useState()
  const [designItems, setDesignItems] = useState([])
  const [invalidLocation, setInvalidLocation] = useState(false)
  const [currentView, setCurrentView] = useState('components')
  const [selectedConnector, setSelectedConnector] = useState()
  const [selectedItem, setSelectedItem] = useState()
  const { x, y } = useMousePosition()
  useEventListener('keydown', ({ key }) => {
    if (ESCAPE_KEYS.includes(String(key))) {
      setSelectedConnector(undefined)
      setDragItem(undefined)
    }
  })

  useEffect(() => {
    if (!dragItem) {
      return
    }
    const newItem = { ...dragItem, ...itemRect(x, y, dragItem.width, dragItem.height, dragItem.rotation) }
    for (const item of designItems) {
      if (intersect(newItem, item)) {
        setInvalidLocation(true)
        return
      }
    }
    setInvalidLocation(false)
  }, [x, y])

  const selectedConnectorPosition = selectedConnector
    ? getSelectedConnectorPosition(designItems, selectedConnector)
    : undefined

  return (
    <div className="App">
      <div className="palette">
        {currentView === 'components' && ComponentPalette(currentView, dragItem, setDragItem)}
        {currentView === 'properties' && PropertiesPanel(selectedItem)}
      </div>
      {currentView === 'connections' && selectedConnector && CurrentConnector(selectedConnectorPosition, x, y)}
      <div
        className="grid"
        onContextMenu={(e) => {
          e.preventDefault()
          setDragItem({ ...dragItem, rotation: (dragItem.rotation + 90) % 360 })
        }}
        onClick={(e) => {
          if (currentView === 'components') {
            const newItem = {
              ...structuredClone(dragItem),
              ...itemRect(x, y, dragItem.width, dragItem.height, dragItem.rotation),
            }
            for (const item of designItems) {
              if (intersect(newItem, item)) {
                return
              }
            }
            const newItems = designItems.slice()
            newItems.push(newItem)
            setDesignItems(newItems)
          }
        }}
      >
        {currentView === 'components' && dragItem && DragItem(invalidLocation, dragItem, x, y)}

        {designItems.map((item, i) => {
          const { width, height, left, top, rotation, src, connectors, type } = item
          return (
            <div
              style={{ width, height, left, top }}
              className={`grid-item ${currentView === 'properties' ? 'pointer' : ''} ${
                selectedItem === item ? 'selected-item' : ''
              }`}
              onClick={(e) => {
                if (currentView === 'properties') {
                  setSelectedItem(item)
                }
                e.stopPropagation()
              }}
            >
              {currentView === 'components' && (
                <div
                  className="remove-item"
                  onClick={() => {
                    const newItems = designItems.slice()
                    removeConnections(newItems, i)
                    newItems.splice(i, 1)
                    setDesignItems(newItems)
                  }}
                />
              )}
              <img draggable={false} src={src[rotation]} style={{ width: '100%' }} />
              {currentView === 'connections' &&
                connectors.map((connector, ci) => {
                  const { position, available, to, accepts } = connector
                  const rotated = applyConnectorRotation(position, rotation)

                  const selectedIsCurrentItem = i === selectedConnector?.item
                  const selectedIsCurrentConnector = ci === selectedConnector?.connector && selectedIsCurrentItem

                  const connectionOk = canConnect(i, { type, accepts, available }, selectedConnector?.item, {
                    type: selectedConnector?.type,
                    accepts: selectedConnector?.accepts,
                  })

                  const orientation = (rotation / 90) % 2

                  const margins = {
                    left: orientation !== 0 ? '- 7px' : '+ 0px',
                    right: orientation !== 0 ? '- 7px' : '+ 0px',
                    top: orientation === 0 ? '- 7px' : '+ 0px',
                    bottom: orientation === 0 ? '- 7px' : '+ 0px',
                  }

                  return (
                    <div
                      className={`connector ${!available ? 'connector_unavailable' : ''} ${
                        selectedIsCurrentConnector ? 'connector_selected' : ''
                      } ${
                        selectedConnector && !selectedIsCurrentConnector && !connectionOk ? 'connector_unavailable' : ''
                      }`}
                      style={{
                        left: rotated.left !== undefined ? `calc(${rotated.left}% ${margins.left})` : undefined,
                        right: rotated.right !== undefined ? `calc(${rotated.right}% ${margins.right})` : undefined,
                        top: rotated.top !== undefined ? `calc(${rotated.top}% ${margins.top})` : undefined,
                        bottom: rotated.bottom !== undefined ? `calc(${rotated.bottom}% ${margins.bottom})` : undefined,
                      }}
                      onClick={() => {
                        if (!available) return
                        if (selectedConnector) {
                          if (selectedConnector.item === i && selectedConnector.connector === ci) {
                            setSelectedConnector(undefined)
                            return
                          }
                          if (connectionOk) {
                            const newItems = designItems.slice()
                            removeConnections(newItems, i, ci)
                            const current = structuredClone(newItems[i])
                            const selected = structuredClone(newItems[selectedConnector.item])

                            if (selectedConnector.accepts) {
                              selected.connectors[selectedConnector.connector].to = { item: i, connector: ci }
                              newItems[selectedConnector.item] = selected
                            } else {
                              current.connectors[ci].to = {
                                item: selectedConnector.item,
                                connector: selectedConnector.connector,
                              }
                              newItems[i] = current
                            }

                            updateAvailabilityFromRoot(newItems)
                            setDesignItems(newItems)
                            setSelectedConnector(undefined)
                          }
                        } else {
                          const newItems = structuredClone(designItems)
                          delete newItems[i].connectors[ci].to
                          removeConnections(newItems, i, ci)
                          updateAvailabilityFromRoot(newItems)
                          setDesignItems(newItems)
                          setSelectedConnector({ item: i, connector: ci, accepts, type })
                        }
                      }}
                    />
                  )
                })}
            </div>
          )
        })}
        <div
          className="hover-button button"
          onClick={(e) => {
            e.stopPropagation()
            setDesignItems([])
          }}
        >
          Clear
        </div>
        {ViewSelector(currentView, (currentView) => {
          setCurrentView(currentView)
          if (dragItem) {
            setDragItem(undefined)
          }
        })}
        {currentView === 'connections' && Connections(designItems)}
      </div>
    </div>
  )
}

export default App