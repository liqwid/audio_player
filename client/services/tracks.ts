import { propEq, findIndex } from 'ramda'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/startWith'

import { webSocketConnection, WsMessage } from 'services/websockets'
import { SUCCESS, LOADING, ERROR, TrackMeta, TrackMessage, TRACK_KEY } from 'models/track'

export class TracksService {
  private tracksMetaObservable: Observable<TrackMessage>
  private tracksState: BehaviorSubject<TrackMeta[]> = new BehaviorSubject([])

  constructor() {
    this.connectToTrackSocketStream()
  }

  public getTracksMetaStream(): Observable<TrackMessage> {
    return this.tracksMetaObservable
  }

  public getTracksStream(): Observable<TrackMeta[]> {
    return this.tracksState.asObservable()
  }

  public getNextTrack(
    currentTrackUrl: string | null,
    loop: boolean = false
  ): TrackMeta | null {
    const tracks = this.tracksState.getValue()
    
    if (currentTrackUrl === null) {
      return tracks[0] || null
    }
    
    const selectedTrackIndex: number = findIndex(
      propEq('url', currentTrackUrl),
      tracks
    )
    let nextTrack = tracks[selectedTrackIndex + 1]
    if (currentTrackUrl && !nextTrack) {
      nextTrack = loop ? tracks[0] : tracks[selectedTrackIndex]
    }

    return nextTrack
  }

  public getPreviousTrack(
    currentTrackUrl: string | null,
    loop: boolean = false
  ): TrackMeta | null {
    const tracks = this.tracksState.getValue()
    
    if (currentTrackUrl === null) {
      return tracks[tracks.length - 1] || null
    }
    
    const selectedTrackIndex: number = findIndex(
      propEq('url', currentTrackUrl),
      tracks
    )
    let nextTrack = tracks[selectedTrackIndex - 1]
    if (currentTrackUrl && !nextTrack) {
      nextTrack = loop ? tracks[tracks.length - 1] : tracks[selectedTrackIndex]
    }

    return nextTrack
  }

  private connectToTrackSocketStream() {
    this.tracksMetaObservable = webSocketConnection
    .getMessageStream()
    .filter(({ key }: WsMessage) => key === TRACK_KEY)
    .map(({ data }: WsMessage): TrackMessage => {
      this.tracksState.next(data)
      return {
        status: SUCCESS,
        tracks: data,
      }
    })
    .startWith({
      status: LOADING,
    })
    .catch((error: string): Observable<TrackMessage> => Observable.of({
      status: ERROR,
    }))
  }
}

export const tracksService = new TracksService()
