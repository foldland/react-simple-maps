'use client'

import { useMemo } from 'react'
import type { RSMGeography } from '../types.ts'
import { getFeatures, getMesh, prepareFeatures, prepareMesh } from '../utils.ts'
import { useMapContext } from './MapProvider.tsx'

interface Geographies {
  geographies: Array<RSMGeography>
  outline: GeoJSON.MultiLineString | undefined
  borders: GeoJSON.MultiLineString | undefined
}

export default function useGeographies(): Geographies {
  const { path, geography } = useMapContext()

  const { geographies, outline, borders } = useMemo(() => {
    const geographies = getFeatures(geography)
    const mesh = getMesh(geography)

    const preparedGeographies = prepareFeatures(geographies, path)
    const preparedMesh = prepareMesh(mesh?.outline, mesh?.borders, path)

    return {
      geographies: preparedGeographies,
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    }
  }, [geography, path])

  return { geographies: geographies, outline: outline, borders: borders }
}
