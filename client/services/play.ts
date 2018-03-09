import { propEq, find, pipe, merge, assoc } from 'ramda'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { PlayingTrackMeta, PlayState, INITIAL_PLAY_MESSAGE } from 'models/play'
import { tracksService } from 'services/tracks'
import { selectedTrackService } from 'services/selectedTrack'

class PlayService {
  private playState: BehaviorSubject<PlayState> = new BehaviorSubject(INITIAL_PLAY_MESSAGE)
  private selectedTrackUrl: string | null = null

  constructor() {
    selectedTrackService.getSelectedTrackStream()
    .subscribe((selectedTrack) => {
      this.selectedTrackUrl = selectedTrack && selectedTrack.url
    })
  }

  public playTrack = (url: string | null) => {
    this.playState.next({
      url,
      paused: url ? false : true,
      currentTime: 0
    })
  }

  public playPrevious = () => {
    const playingTrackUrl = this.playState.getValue().url
    const prevTrack = tracksService.getPreviousTrack(playingTrackUrl)
    this.playTrack(prevTrack && prevTrack.url)
  }

  public playNext = () => {
    const playingTrackUrl = this.playState.getValue().url
    const nextTrack = tracksService.getNextTrack(playingTrackUrl)
    this.playTrack(nextTrack && nextTrack.url)
  }

  public togglePause = () => {
    if (!this.playState.getValue().url) {
      if (!this.selectedTrackUrl) return
      return this.playTrack(this.selectedTrackUrl)
    }

    const currentPlayState = this.playState.getValue()
    this.playState.next(assoc('paused', !currentPlayState.paused, currentPlayState))
  }

  public updateCurrentTime = (time: number) => {
    this.playState.next(assoc('currentTime', time, this.playState.getValue()))
  }

  public getPlayingTrackStream(): Observable<PlayingTrackMeta> {
    return Observable.combineLatest(
      tracksService.getTracksStream(),
      this.playState
    ).map(
      ([ tracks = [], { url, paused, currentTime } ]: any) =>
        pipe(
          find(propEq('url', url)),
          merge({ paused, currentTime }),
        )(tracks)
        || { paused: true }
    )
  }
}

export const playService = new PlayService()
