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
    if (onError) this.ws.onerror = onError
    if (onClose) this.ws.onclose = onClose
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
