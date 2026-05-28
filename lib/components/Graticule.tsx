'use client'

import { geoGraticule } from 'd3-geo'
import { memo } from 'react'
import type { Point } from '../types.ts'
import { useMapContext } from './MapProvider.tsx'

interface GraticuleProps extends React.SVGProps<SVGPathElement> {
  /**
   * @default [10, 10]
   */
  step?: Point | undefined
  /**
   * @default "currentcolor"
   */
  stroke?: string | undefined
  /**
   * @default "transparent"
   */
  fill?: string | undefined
}

const Graticule = ({
  fill = 'transparent',
  stroke = 'currentcolor',
  step = [10, 10],
  ...restProps
}: GraticuleProps) => {
  const { path } = useMapContext()
  return (
    <path
      d={path(geoGraticule().step(step)()) ?? undefined}
      fill={fill}
      stroke={stroke}
      {...restProps}
    />
  )
}

Graticule.displayName = 'Graticule'

export default memo(Graticule)
