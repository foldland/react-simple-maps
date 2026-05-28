import type React from 'react'

interface GeographiesProps extends React.SVGProps<SVGGElement> {}

const Geographies = ({ children, ...restProps }: GeographiesProps) => {
  return <g {...restProps}>{children}</g>
}

Geographies.displayName = 'Geographies'

export default Geographies
