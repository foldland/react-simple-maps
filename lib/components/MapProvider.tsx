'use client'

import type { GeoPath, GeoProjection } from 'd3-geo'
import { geoPath } from 'd3-geo'
import { createContext, useContext, useMemo } from 'react'
import type { ProjectionFunction } from '../types.ts'

interface MapContextType {
  width: number
  height: number
  path: GeoPath
  projection: GeoProjection
}

const MapContext = createContext<MapContextType | undefined>(undefined)

const MapProvider = ({
  width,
  height,
  projection,
  children,
}: {
  width: number
  height: number
  projection: ProjectionFunction
  children: React.ReactNode
}) => {
  const value = useMemo(() => {
    const proj = projection(width, height)

    return {
      width: width,
      height: height,
      projection: proj,
      path: geoPath().projection(proj),
    }
  }, [width, height, projection])

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

const useMapContext = () => {
  const context = useContext(MapContext)

  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider')
  }

  return context
}

export { MapContext, MapProvider, useMapContext }
