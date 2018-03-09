import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/takeUntil'
import { tracksService } from './tracks'
import { SUCCESS, TRACK_KEY, ERROR } from 'models/track'
import { webSocketConnection } from 'services/websockets'

jest.mock('services/websockets')

const unsubscribe$: Subject<void> = new Subject()
const updateImageMock: jest.Mock = jest.fn()

describe('tracks service', () => {
  describe('getTracksMetaStream', () => {
    const unsubScribeHandle = new Subject()
    const messageSpy = jest.fn()
    const STUB_TRACK_DATA = [
      { url: '1' }
    ]

    afterEach(() => {
      messageSpy.mockClear()
      unsubScribeHandle.next()
    })
    
    it('should return an observable', () => {
      expect(tracksService.getTracksMetaStream()).toBeInstanceOf(Observable)
    })

    it(`should forward websocket connection message with ${TRACK_KEY} key`, () => {
      tracksService.getTracksMetaStream()
      .takeUntil(unsubScribeHandle)
      .subscribe(messageSpy);

      (webSocketConnection as any).mockMessage({
        key: TRACK_KEY,
        data: STUB_TRACK_DATA
      })

      expect(messageSpy).toHaveBeenCalledTimes(1)
      expect(messageSpy).toHaveBeenCalledWith({
        status: SUCCESS,
        tracks: STUB_TRACK_DATA
      })

      messageSpy.mockClear();

      (webSocketConnection as any).mockMessage({
        key: TRACK_KEY + 1,
        data: STUB_TRACK_DATA
      })

      expect(messageSpy).toHaveBeenCalledTimes(0)
    })

    it('should send error message if an error occures in websocket service', () => {
      tracksService.getTracksMetaStream()
      .takeUntil(unsubScribeHandle)
      .subscribe(messageSpy);

      (webSocketConnection as any).mockError()

      expect(messageSpy).toHaveBeenCalledTimes(1)
      expect(messageSpy).toHaveBeenCalledWith({ status: ERROR })
    })
  })
})
