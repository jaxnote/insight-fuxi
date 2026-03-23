export class WebSocketClient {
  private ws: WebSocket | null = null

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    this.ws = new WebSocket(url)
    this.ws.onmessage = onMessage
  }

  send(data: unknown) {
    this.ws?.send(JSON.stringify(data))
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}
