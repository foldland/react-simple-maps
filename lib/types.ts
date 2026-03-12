import type { GeoProjection } from 'd3-geo'
import type { Feature, GeoJSON, Geometry, GeometryObject } from 'geojson'
import type { Objects, Topology } from 'topojson-specification'

export type Point = [number, number]

export interface Mesh {
  outline: GeoJSON.MultiLineString
  borders: GeoJSON.MultiLineString
}

export type ProjectionFunction = (
  width: number,
  height: number
) => GeoProjection

export interface Position {
  x: number
  y: number
  k: number
}

export type Geography = Topology<Objects<GeometryObject>> | GeoJSON

export type RSMGeography = (Feature | Geometry) & {
  rsmKey: string
  svgPath: string | undefined
}
