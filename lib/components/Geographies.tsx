import type { GeoPath, GeoProjection } from 'd3-geo'
import type React from 'react'
import type { Geography, RSMGeography } from '../types.ts'
import { useMapContext } from './MapProvider.tsx'
import useGeographies from './useGeographies.ts'

interface GeographiesChildrenArgument {
  geographies: Array<RSMGeography>
  path: GeoPath
  projection: GeoProjection
  outline: GeoJSON.MultiLineString | undefined
  borders: GeoJSON.MultiLineString | undefined
}

interface GeographiesProps
  extends Omit<React.SVGProps<SVGGElement>, 'children'> {
  geography: Geography
  children?:
    | ((data: GeographiesChildrenArgument) => React.ReactNode)
    | undefined
}

const Geographies = ({
  geography,
  children,
  ...restProps
}: GeographiesProps) => {
  const { path, projection } = useMapContext()
  const { geographies, outline, borders } = useGeographies({
    geography: geography,
  })

  return (
    <g {...restProps}>
      {geographies.length > 0 &&
        children?.({
          geographies: geographies,
          outline: outline,
          borders: borders,
          path: path,
          projection: projection,
        })}
    </g>
  )
}

Geographies.displayName = 'Geographies'

export default Geographies
