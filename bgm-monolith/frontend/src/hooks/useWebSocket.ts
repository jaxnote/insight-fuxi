import { useEffect, useRef, useCallback } from 'react'

export function useWebSocket(url: string | null) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!url) return
    ws.current = new WebSocket(url)
    return () => {
      ws.current?.close()
    }
  }, [url])

  const send = useCallback((data: unknown) => {
    ws.current?.send(JSON.stringify(data))
  }, [])

  return { send }
}
