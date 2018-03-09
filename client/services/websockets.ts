import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

export type WsMessage = {
  key: string
  data?: any
}

const DEFAULT_ERROR_MESSAGE = 'Unknown server error'
const DEFAULT_WS_URL = '/'

const { location } = window
let wsBaseUrl: string
if (location.protocol === 'https:') {
  wsBaseUrl = 'wss:'
} else {
  wsBaseUrl = 'ws:'
}
wsBaseUrl += '//' + location.host

export class WebSocketService {
  private webSocket: WebSocket
  private messageSubject: Subject<WsMessage> = new Subject()

  constructor(
    public url: string
  ) {
    this.webSocket = this.createWebsocketConnection(url)
  }

  public getMessageStream(): Observable<WsMessage> {
    return this.messageSubject.asObservable()
  }

  public pushMessage(message: WsMessage) {
    this.webSocket.send(JSON.stringify(message))
  }

  private createWebsocketConnection(url: string): WebSocket {
    const webSocket = new WebSocket(wsBaseUrl + url)
    webSocket.onmessage = this.handleMessage
    webSocket.onerror = this.handleError
    webSocket.onclose = this.handleClose

    return webSocket
  }

  private handleMessage = (event: MessageEvent) => {
    this.messageSubject.next(<WsMessage> JSON.parse(event.data))
  }

  private handleError = (event: Event) => {
    this.messageSubject.error(new Error(DEFAULT_ERROR_MESSAGE))
  }

  private handleClose = (e: CloseEvent) => {
    this.messageSubject.error(new Error(DEFAULT_ERROR_MESSAGE))
  }
}

export const webSocketConnection: WebSocketService = new WebSocketService(DEFAULT_WS_URL)
