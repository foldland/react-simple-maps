'use client'

import type { GeoPath, GeoProjection } from 'd3-geo'
import { geoPath } from 'd3-geo'
import { createContext, useContext, useMemo } from 'react'
import type { Geography, ProjectionFunction } from '../types.ts'

interface MapContextType {
  geography: Geography
  height: number
  path: GeoPath
  projection: GeoProjection
  width: number
}

const MapContext = createContext<MapContextType | undefined>(undefined)

interface MapProviderProps {
  children: React.ReactNode
  geography: Geography
  height: number
  projection: ProjectionFunction
  width: number
}

const MapProvider = ({
  width,
  height,
  projection,
  geography,
  children,
}: MapProviderProps) => {
  const value = useMemo(() => {
    const proj = projection(width, height)

    return {
      width: width,
      height: height,
      projection: proj,
      geography: geography,
      path: geoPath().projection(proj),
    }
  }, [width, height, projection, geography])

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
