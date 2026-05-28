'use client'

import type { Point } from '../types.ts'
import { useMapContext } from './MapProvider.tsx'

interface MarkerProps extends React.SVGProps<SVGPathElement> {
  coordinates?: Point | undefined
}

const Marker = ({ coordinates, ...restProps }: MarkerProps) => {
  const { projection } = useMapContext()

  const proj = coordinates ? projection(coordinates) : null
  const transform = proj ? `translate(${proj[0]}, ${proj[1]})` : undefined

  return <g transform={transform} {...restProps} />
}

Marker.displayName = 'Marker'

export default Marker
