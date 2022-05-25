import './App.css'
import { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'

import controller0 from './img/controller0.png'
import controller90 from './img/controller90.png'
import controller180 from './img/controller180.png'
import controller270 from './img/controller270.png'
import encoder0 from './img/encoder0.png'
import encoder90 from './img/encoder90.png'
import encoder180 from './img/encoder180.png'
import encoder270 from './img/encoder270.png'
import encoder_with_leds0 from './img/encoder_with_leds0.png'
import encoder_with_leds90 from './img/encoder_with_leds90.png'
import encoder_with_leds180 from './img/encoder_with_leds180.png'
import encoder_with_leds270 from './img/encoder_with_leds270.png'
import slider0 from './img/slider0.png'
import slider90 from './img/slider90.png'
import slider180 from './img/slider180.png'
import slider270 from './img/slider270.png'
import crossfader0 from './img/crossfader0.png'
import crossfader90 from './img/crossfader90.png'
import crossfader180 from './img/crossfader180.png'
import crossfader270 from './img/crossfader270.png'
import pot0 from './img/pot0.png'
import pot90 from './img/pot90.png'
import pot180 from './img/pot180.png'
import pot270 from './img/pot270.png'
import pad0 from './img/pad0.png'
import pad90 from './img/pad90.png'
import pad180 from './img/pad180.png'
import pad270 from './img/pad270.png'

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

const commonProperties = []
const mappingProperties = [
  { id: 'min', name: 'Minimum value', type: 'number', min: 1, max: 255, value: 0 },
  { id: 'max', name: 'Maximum value', type: 'number', min: 0, max: 254, value: 255 },
  {
    id: 'direction',
    name: 'Direction',
    type: 'select',
    value: 'clockwise',
    values: ['clockwise', 'counter clockwise'],
  },
]

const encoderProperties = [
  ...commonProperties,
  ...mappingProperties,
  { id: 'type', name: 'Type', type: 'select', values: ['absolute', 'relative'], value: 'relative' },
  { id: 'loop', name: 'Loop', type: 'boolean', value: false },
]

const analogProperties = commonProperties

const items = [
  {
    id: 'controller',
    type: 'controller',
    name: 'Controller',
    width: 4,
    height: 3,
    src: { 0: controller0, 90: controller90, 180: controller180, 270: controller270 },
    connectors: [
      { available: true, position: { left: 0, top: 80 }, accepts: 'any' },
      { available: true, position: { right: 0, top: 20 }, accepts: 'any' },
      { available: true, position: { right: 0, top: 80 }, accepts: 'any' },
    ],
    properties: [{ id: 'config', name: 'Configuration', type: 'copy', value: '', label: 'Copy config' }],
    orientations: [0, 90, 180, 270],
  },
  {
    id: 'encoder',
    type: 'encoder',
    name: 'Encoder',
    width: 5,
    height: 4,
    src: { 0: encoder0, 90: encoder90, 180: encoder180, 270: encoder270 },
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
      0: encoder_with_leds0,
      90: encoder_with_leds90,
      180: encoder_with_leds180,
      270: encoder_with_leds270,
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
    src: { 0: slider0, 90: slider90, 180: slider180, 270: slider270 },
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
    src: { 0: crossfader0, 90: crossfader90, 180: crossfader180, 270: crossfader270 },
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
    src: { 0: pot0, 90: pot90, 180: pot180, 270: pot270 },
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
    src: { 0: pad0, 90: pad90, 180: pad180, 270: pad270 },
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

const updateItemProperty = (item, propertyId, value, designItems, setDesignItems, setSelectedItem) => {
  const newItems = structuredClone(designItems)
  const itemIndex = designItems.indexOf(item)
  newItems[itemIndex].properties.find(({ id }) => id === propertyId).value = value
  setDesignItems(newItems)
  setSelectedItem(newItems[itemIndex])
}

function PropertiesPanel(selectedItem, designItems, setDesignItems, setSelectedItem) {
  return (
    <div>
      <h3>Properties</h3>
      {selectedItem && (
        <>
          <div>Type: {selectedItem.name}</div>
          <br />
          <div className={'properties'}>
            {selectedItem?.properties?.map(({ name, type, id, ...props }) => (
              <>
                <label className={'property'}>
                  {name}:<br />
                  {type === 'number' && (
                    <input
                      name={id}
                      type="number"
                      min={props.min}
                      max={props.max}
                      value={props.value}
                      onChange={(e) => {
                        updateItemProperty(
                          selectedItem,
                          id,
                          parseInt(e.target.value),
                          designItems,
                          setDesignItems,
                          setSelectedItem
                        )
                      }}
                    />
                  )}
                  {type === 'color' && (
                    <input
                      name={id}
                      type="text"
                      maxLength={7}
                      value={props.value}
                      onChange={(e) => {
                        updateItemProperty(
                          selectedItem,
                          id,
                          e.target.value,
                          designItems,
                          setDesignItems,
                          setSelectedItem
                        )
                      }}
                    />
                  )}
                  {type === 'text' && (
                    <input
                      name={id}
                      type="text"
                      value={props.value}
                      onChange={(e) => {
                        updateItemProperty(
                          selectedItem,
                          id,
                          e.target.value,
                          designItems,
                          setDesignItems,
                          setSelectedItem
                        )
                      }}
                    />
                  )}
                  {type === 'boolean' && (
                    <input
                      name={id}
                      type="checkbox"
                      checked={props.value}
                      onChange={(e) => {
                        updateItemProperty(
                          selectedItem,
                          id,
                          e.target.checked,
                          designItems,
                          setDesignItems,
                          setSelectedItem
                        )
                      }}
                    />
                  )}
                  {type === 'select' && (
                    <select
                      name={id}
                      value={props.value}
                      onChange={(e) => {
                        updateItemProperty(
                          selectedItem,
                          id,
                          e.target.value,
                          designItems,
                          setDesignItems,
                          setSelectedItem
                        )
                      }}
                    >
                      {props.values.map((value) => (
                        <option>{value}</option>
                      ))}
                    </select>
                  )}
                  {type === 'copy' && (
                    <button onClick={() => navigator.clipboard.writeText(props.value)}>{props.label}</button>
                  )}
                </label>
                <br />
              </>
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
        {currentView === 'properties' && PropertiesPanel(selectedItem, designItems, setDesignItems, setSelectedItem)}
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
