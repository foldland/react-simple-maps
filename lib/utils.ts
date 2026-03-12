import type { GeoPath } from 'd3-geo'
import type { ZoomTransform } from 'd3-zoom'
import type { Feature, GeoJSON, Geometry } from 'geojson'
import { feature, mesh } from 'topojson-client'
import type { Geography, Mesh, Point, RSMGeography } from './types.ts'

export function getCoords(w: number, h: number, t: ZoomTransform): Point {
  const xOffset = (w * t.k - w) / 2
  const yOffset = (h * t.k - h) / 2
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k]
}

export function getFeatures(geographies: Geography): Array<Feature> | Geometry {
  let geojson: GeoJSON
  if (geographies.type === 'Topology') {
    geojson = feature(
      geographies,
      geographies.objects[Object.keys(geographies.objects)[0]]
    )
  } else {
    geojson = geographies
  }

  switch (geojson.type) {
    case 'FeatureCollection':
      return geojson.features

    case 'Feature':
      return [geojson]

    default:
      return geojson
  }
}

export function getMesh(geographies: Geography): Mesh | null {
  if (geographies.type !== 'Topology') {
    return null
  }

  const object = geographies.objects[Object.keys(geographies.objects)[0]]

  const outline = mesh(geographies, object, (a, b) => {
    return a === b
  })
  const borders = mesh(geographies, object, (a, b) => {
    return a !== b
  })

  return { outline: outline, borders: borders }
}

export function prepareMesh(
  outline: GeoJSON.MultiLineString | undefined,
  borders: GeoJSON.MultiLineString | undefined,
  path: GeoPath
) {
  return outline && borders
    ? {
        outline: { ...outline, rsmKey: 'outline', svgPath: path(outline) },
        borders: { ...borders, rsmKey: 'borders', svgPath: path(borders) },
      }
    : {}
}

export function prepareFeatures(
  geographies: Array<Feature> | Geometry,
  path: GeoPath
): Array<RSMGeography> {
  if (Array.isArray(geographies)) {
    return geographies.map((d, i) => {
      return {
        ...d,
        rsmKey: `geo-${i}`,
        svgPath: path(d) ?? undefined,
      }
    })
  }

  return [
    {
      ...geographies,
      rsmKey: 'geo-geometry',
      svgPath: path(geographies) ?? undefined,
    },
  ]
}

export function createConnectorPath(dx = 30, dy = 30, curve = 0.5) {
  const curvature = Array.isArray(curve) ? curve : [curve, curve]
  const curveX = (dx / 2) * curvature[0]
  const curveY = (dy / 2) * curvature[1]
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`
}
