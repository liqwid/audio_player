import { propEq, find } from 'ramda'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/do'

import { TrackMeta } from 'models/track'
import { tracksService } from 'services/tracks'

class SelectedTrackService {
  private selectedTrackUrl: BehaviorSubject<string | null> = new BehaviorSubject(null)

  public selectTrack = (url: string | null) => {
    return this.selectedTrackUrl.next(url)
  }
  
  public selectNext = () => {
    const selectedTrackUrl = this.selectedTrackUrl.getValue()
    const nextTrack = tracksService.getNextTrack(selectedTrackUrl)
    
    this.selectTrack(nextTrack && nextTrack.url)
  }

  public selectPrevious = () => {
    const selectedTrackUrl = this.selectedTrackUrl.getValue()
    const prevTrack = tracksService.getPreviousTrack(selectedTrackUrl)
    
    return this.selectTrack(prevTrack && prevTrack.url)
  }

  public getSelectedTrackStream(): Observable<TrackMeta | null> {
    return Observable.combineLatest(
      tracksService.getTracksStream(),
      this.selectedTrackUrl
    ).map(
      ([ tracks = [], url ]: any) => find(propEq('url', url), tracks) || null
    )
  }
}

export const selectedTrackService = new SelectedTrackService()
