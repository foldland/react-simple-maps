import { memo } from 'react'
import { useMapContext } from './MapProvider.tsx'

interface SphereProps extends React.SVGProps<SVGPathElement> {
  /**
   * @default "rsm-sphere"
   */
  id: string
  /**
   * @default "transparent"
   */
  fill: string
  /**
   * @default "currentcolor"
   */
  stroke: string
  /**
   * @default 0.5
   */
  strokeWidth: number
}

const Sphere = ({
  id = 'rsm-sphere',
  fill = 'transparent',
  stroke = 'currentcolor',
  strokeWidth = 0.5,
  ...restProps
}: SphereProps) => {
  const { path } = useMapContext()
  const spherePath = path({ type: 'Sphere' }) ?? undefined

  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d={spherePath} />
        </clipPath>
      </defs>
      <path
        d={spherePath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ pointerEvents: 'none' }}
        {...restProps}
      />
    </>
  )
}

Sphere.displayName = 'Sphere'

export default memo(Sphere)
