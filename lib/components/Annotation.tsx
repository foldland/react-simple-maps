import type { Point } from '../types.ts'
import { createConnectorPath } from '../utils.ts'
import { useMapContext } from './MapProvider.tsx'

interface AnnotationProps extends React.SVGProps<SVGGElement> {
  children?: React.ReactNode
  subject?: Point | undefined
  connectorProps: React.SVGProps<SVGPathElement> | undefined
  /**
   * @default 30
   */
  dx?: number | undefined
  /**
   * @default 30
   */
  dy?: number | undefined
  /**
   * @default 0
   */
  curve?: number | undefined
}

const Annotation = ({
  subject,
  children,
  connectorProps,
  dx = 30,
  dy = 30,
  curve = 0,
  ...restProps
}: AnnotationProps) => {
  const { projection } = useMapContext()
  const proj = subject ? projection(subject) : null
  const transform = proj
    ? `translate(${proj[0] + dx}, ${proj[1] + dy})`
    : undefined

  const connectorPath = createConnectorPath(dx, dy, curve)

  return (
    <g transform={transform} {...restProps}>
      <path
        d={connectorPath}
        fill="transparent"
        stroke="#000"
        {...connectorProps}
      />
      {children}
    </g>
  )
}

Annotation.displayName = 'Annotation'

export default Annotation
