export class WebSocketClient {
  private ws: WebSocket | null = null

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    this.ws = new WebSocket(url)
    this.ws.onmessage = onMessage
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
