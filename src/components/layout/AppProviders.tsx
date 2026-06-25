// @ts-nocheck
'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initFromLocalStorage = useAppStore(s => s.initFromLocalStorage)

  useEffect(() => {
    initFromLocalStorage()
  }, [initFromLocalStorage])

  return <>{children}</>
}
