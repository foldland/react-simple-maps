import type { Geography, ProjectionFunction } from '../types.ts'
import { MapProvider } from './MapProvider.tsx'

interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode
  /**
   * @default 800
   */
  width?: number | undefined
  /**
   * @default 600
   */
  height?: number | undefined
  /**
   * @default "geoEqualEarth"
   */
  projection: ProjectionFunction

  geography: Geography
}

const ComposableMap = ({
  width = 800,
  height = 600,
  projection,
  geography,
  ...restProps
}: ComposableMapProps) => {
  return (
    <MapProvider
      geography={geography}
      height={height}
      projection={projection}
      width={width}
    >
      <svg viewBox={`0 0 ${width} ${height}`} {...restProps} />
    </MapProvider>
  )
}

ComposableMap.displayName = 'ComposableMap'

export default ComposableMap
