import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/do'

export const LOADING = 'loading'
export const ERROR = 'error'
export const SUCCESS = 'success'

const trackStateMock: Subject<any> = new Subject()
export const tracksService = {
  getTracksMetaStream() {
    return trackStateMock
  },

  pushMessage: jest.fn(),

  mockMessage(message: any) {
    trackStateMock.next(message)
  },
  
  mockError(err: string) {
    trackStateMock.error(err)
  },
}
