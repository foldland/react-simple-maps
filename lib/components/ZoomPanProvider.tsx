'use client'

import type React from 'react'
import { createContext, useContext } from 'react'

interface ZoomPanContextType {
  x: number
  y: number
  k: number
  transformString: string
}

const ZoomPanContext = createContext<ZoomPanContextType | undefined>(undefined)

const defaultValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: 'translate(0 0) scale(1)',
}

const ZoomPanProvider = ({
  value = defaultValue,
  children,
}: {
  value?: ZoomPanContextType
  children: React.ReactNode
}) => {
  return (
    <ZoomPanContext.Provider value={value}>{children}</ZoomPanContext.Provider>
  )
}

const useZoomPanContext = () => {
  const context = useContext(ZoomPanContext)

  if (context === undefined) {
    throw new Error('useZoomPanContext must be used within a ZoomPanProvider')
  }

  return context
}

export { ZoomPanContext, ZoomPanProvider, useZoomPanContext }
