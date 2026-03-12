import { memo } from 'react'
import type { RSMGeography } from '../types.ts'

interface GeographyProps extends React.SVGProps<SVGPathElement> {
  geography?: RSMGeography
}

const Geography = ({ geography, ...restProps }: GeographyProps) => {
  return <path d={geography?.svgPath} tabIndex={0} {...restProps} />
}

Geography.displayName = 'Geography'

export default memo(Geography)
