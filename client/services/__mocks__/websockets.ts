import { Subject } from 'rxjs/Subject'

const webSocketStateMock: Subject<any> = new Subject()
export const webSocketConnection = {
  getMessageStream() {
    return webSocketStateMock
  },

  pushMessage: jest.fn(),

  mockMessage(message: any) {
    webSocketStateMock.next(message)
  },
  
  mockError(err: string) {
    webSocketStateMock.error(err)
  },
}
