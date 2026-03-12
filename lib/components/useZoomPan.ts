'use client'

import { select as d3Select } from 'd3-selection'
import {
  type D3ZoomEvent,
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
  type ZoomBehavior,
} from 'd3-zoom'
import { useEffect, useRef, useState } from 'react'
import type { Point, Position } from '../types.ts'
import { getCoords } from '../utils.ts'
import { useMapContext } from './MapProvider.tsx'

interface ZoomPan {
  mapRef: React.RefObject<SVGSVGElement | null>
  position: Position
  transformString: string
}

interface ZoomPanProps {
  /**
   * @default [0, 0]
   */
  center?: Point | undefined
  /**
   * @default 1
   */
  zoom?: number | undefined
  /**
   * @default [1, 8]
   */
  scaleExtent?: Point | undefined
  onMoveStart?:
    | ((
        position: { coordinates: [number, number] | null; zoom: number },
        event: D3ZoomEvent<SVGElement, any>
      ) => void)
    | undefined
  onMove?:
    | ((
        position: { x: number; y: number; zoom: number; dragging: WheelEvent },
        event: D3ZoomEvent<SVGElement, any>
      ) => void)
    | undefined
  onMoveEnd?:
    | ((
        position: { coordinates: [number, number]; zoom: number },
        event: D3ZoomEvent<SVGElement, any>
      ) => void)
    | undefined
  filterZoomEvent?: ((element: SVGElement) => boolean) | undefined
  translateExtent?: [[number, number], [number, number]] | undefined
}

export default function useZoomPan({
  center = [0, 0],
  filterZoomEvent,
  onMoveStart,
  onMoveEnd,
  onMove,
  translateExtent = [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  ],
  scaleExtent = [1, 8],
  zoom = 1,
}: ZoomPanProps): ZoomPan {
  const { width, height, projection } = useMapContext()

  const [lon, lat] = center
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, k: 1 })
  const lastPosition = useRef<Position>({ x: 0, y: 0, k: 1 })
  const mapRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null)
  const bypassEvents = useRef(false)

  const [a, b] = translateExtent
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  useEffect(() => {
    if (!mapRef.current) {
      return
    }
    const svg = d3Select(mapRef.current)

    function handleZoomStart(d3Event: D3ZoomEvent<SVGElement, any>) {
      if (!onMoveStart || bypassEvents.current) {
        return
      }
      onMoveStart(
        {
          coordinates:
            projection.invert?.(getCoords(width, height, d3Event.transform)) ??
            null,
          zoom: d3Event.transform.k,
        },
        d3Event
      )
    }

    function handleZoom(d3Event: D3ZoomEvent<SVGElement, any>) {
      if (bypassEvents.current) {
        return
      }
      const { transform, sourceEvent } = d3Event
      setPosition({
        x: transform.x,
        y: transform.y,
        k: transform.k,
      })
      if (!onMove) {
        return
      }
      onMove(
        {
          x: transform.x,
          y: transform.y,
          zoom: transform.k,
          dragging: sourceEvent,
        },
        d3Event
      )
    }

    function handleZoomEnd(d3Event: D3ZoomEvent<SVGElement, any>) {
      if (bypassEvents.current) {
        bypassEvents.current = false
        return
      }
      const coordinates = projection.invert?.(
        getCoords(width, height, d3Event.transform)
      )
      if (!coordinates) {
        return
      }

      const [x, y] = coordinates
      lastPosition.current = { x: x, y: y, k: d3Event.transform.k }
      if (!onMoveEnd) {
        return
      }
      onMoveEnd({ coordinates: [x, y], zoom: d3Event.transform.k }, d3Event)
    }

    const zoom = d3Zoom<SVGSVGElement, unknown>()
      .filter((d3Event) => {
        if (filterZoomEvent) {
          return filterZoomEvent(d3Event)
        }
        return d3Event ? !d3Event.ctrlKey && !d3Event.button : false
      })
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [a1, a2],
        [b1, b2],
      ])
      .on('start', handleZoomStart)
      .on('zoom', handleZoom)
      .on('end', handleZoomEnd)

    zoomRef.current = zoom
    svg.call(zoom)
  }, [
    width,
    height,
    a1,
    a2,
    b1,
    b2,
    minZoom,
    maxZoom,
    projection,
    onMoveStart,
    onMove,
    onMoveEnd,
    filterZoomEvent,
  ])

  useEffect(() => {
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    ) {
      return
    }

    const coords = projection([lon, lat])
    if (!mapRef.current || !zoomRef.current || !coords) {
      return
    }
    const x = coords[0] * zoom
    const y = coords[1] * zoom
    const svg = d3Select(mapRef.current)

    bypassEvents.current = true

    svg.call(
      zoomRef.current.transform,
      d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom)
    )
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom })

    lastPosition.current = { x: lon, y: lat, k: zoom }
  }, [lon, lat, zoom, width, height, projection])

  return {
    mapRef: mapRef,
    position: position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  }
}
