import { useEffect, useRef, useCallback, useState } from 'react'

export interface WsEvent {
  type: 'thinking' | 'result' | 'done' | 'error'
  content: string
  metadata?: Record<string, unknown>
}

export interface UseWebSocketOptions {
  onMessage?: (event: WsEvent) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (event: Event) => void
}

export function useWebSocket(url: string | null, options: UseWebSocketOptions = {}) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  // 保持 options 为最新引用，避免陈旧闭包（url 不变时 effect 不重跑）
  const optionsRef = useRef(options)
  useEffect(() => { optionsRef.current = options })

  useEffect(() => {
    if (!url) return

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      optionsRef.current.onOpen?.()
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsEvent
        optionsRef.current.onMessage?.(data)
      } catch {
        // ignore non-JSON messages
      }
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      optionsRef.current.onClose?.()
    }

    ws.current.onerror = (event) => {
      optionsRef.current.onError?.(event)
    }

    return () => {
      ws.current?.close()
      ws.current = null
    }
  }, [url])

  const send = useCallback((data: unknown) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }
    ws.current.send(JSON.stringify(data))
  }, [])

  return { isConnected, send }
}
