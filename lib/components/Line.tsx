import type { LineString } from 'geojson'
import type { Point } from '../types.ts'
import { useMapContext } from './MapProvider.tsx'

interface LineProps
  extends Pick<
    React.SVGProps<SVGPathElement>,
    Exclude<keyof React.SVGProps<SVGPathElement>, 'from' | 'to'>
  > {
  /**
   * @default [0, 0]
   */
  from?: Point | undefined
  /**
   * @default [0, 0]
   */
  to?: Point | undefined
  /**
   * @default [[0, 0], [0, 0]]
   */
  coordinates?: Array<Point> | undefined
  /**
   * @default "currentcolor"
   */
  stroke?: string | undefined
  /**
   * @default 3
   */
  strokeWidth?: number | string | undefined
  /**
   * @default "transparent"
   */
  fill?: string | undefined
}

const Line = ({
  from = [0, 0],
  to = [0, 0],
  coordinates,
  stroke = 'currentcolor',
  strokeWidth = 3,
  fill = 'transparent',
  ...restProps
}: LineProps) => {
  const { path } = useMapContext()

  const lineData: LineString = {
    type: 'LineString',
    coordinates: coordinates || [from, to],
  }

  return (
    <path
      d={path(lineData) ?? undefined}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...restProps}
    />
  )
}

Line.displayName = 'Line'

export default Line
