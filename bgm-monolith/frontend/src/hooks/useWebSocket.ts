import { useEffect, useRef, useCallback, useState } from 'react'

export interface WsEvent {
  type: 'thinking' | 'result' | 'done' | 'error'
  content: string
  metadata?: Record<string, unknown>
}

interface UseWebSocketOptions {
  onMessage?: (event: WsEvent) => void
  onOpen?: () => void
  onClose?: () => void
}

export function useWebSocket(url: string | null, options: UseWebSocketOptions = {}) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!url) return

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      options.onOpen?.()
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsEvent
        options.onMessage?.(data)
      } catch {
        // ignore non-JSON messages
      }
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      options.onClose?.()
    }

    return () => {
      ws.current?.close()
      ws.current = null
    }
  }, [url])

  const send = useCallback((data: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    }
  }, [])

  return { isConnected, send }
}
