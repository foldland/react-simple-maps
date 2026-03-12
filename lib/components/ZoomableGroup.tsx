import type { D3ZoomEvent } from 'd3-zoom'
import type { Point } from '../types.ts'
import { useMapContext } from './MapProvider.tsx'
import useZoomPan from './useZoomPan.ts'
import { ZoomPanProvider } from './ZoomPanProvider.tsx'

interface ZoomableGroupProps extends React.SVGProps<SVGGElement> {
  children?: React.ReactNode
  /**
   * @default [0, 0]
   */
  center?: Point | undefined
  /**
   * @default 1
   */
  zoom?: number | undefined
  /**
   * @default 1
   */
  minZoom?: number | undefined
  /**
   * @default 5
   */
  maxZoom?: number | undefined
  /**
   * @default 0.025
   */
  zoomSensitivity?: number | undefined
  /**
   * @default false
   */
  disablePanning?: boolean | undefined
  /**
   * @default false
   */
  disableZooming?: boolean | undefined
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

const ZoomableGroup = ({
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 8,
  translateExtent,
  filterZoomEvent,
  onMoveStart,
  onMove,
  onMoveEnd,
  ...restProps
}: ZoomableGroupProps) => {
  const { width, height } = useMapContext()

  const { mapRef, transformString, position } = useZoomPan({
    center: center,
    filterZoomEvent: filterZoomEvent,
    onMoveStart: onMoveStart,
    onMove: onMove,
    onMoveEnd: onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
    translateExtent: translateExtent,
    zoom: zoom,
  })

  return (
    <ZoomPanProvider
      value={{
        x: position.x,
        y: position.y,
        k: position.k,
        transformString: transformString,
      }}
    >
      <g ref={mapRef}>
        <rect fill="transparent" height={height} width={width} />
        <g transform={transformString} {...restProps} />
      </g>
    </ZoomPanProvider>
  )
}

ZoomableGroup.displayName = 'ZoomableGroup'

export default ZoomableGroup
