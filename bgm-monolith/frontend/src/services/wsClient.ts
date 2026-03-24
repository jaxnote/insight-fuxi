export class WebSocketClient {
  private ws: WebSocket | null = null

  connect(
    url: string,
    onMessage: (event: MessageEvent) => void,
    onError?: (event: Event) => void,
    onClose?: (event: CloseEvent) => void,
  ) {
    this.ws = new WebSocket(url)
    this.ws.onmessage = onMessage
    this.ws.onerror = onError ?? ((e) => console.warn('[WebSocketClient] connection error', e))
    this.ws.onclose = onClose ?? (() => console.warn('[WebSocketClient] connection closed'))
  }

  send(data: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }
    this.ws.send(JSON.stringify(data))
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}
