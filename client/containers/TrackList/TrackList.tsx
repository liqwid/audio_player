import * as React from 'react'

import { propEq } from 'ramda'

import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Track } from 'components/Track'
import { Loader } from 'components/Loader'
import { tracksService } from 'services/tracks'
import { selectedTrackService } from 'services/selectedTrack'
import { playService } from 'services/play'
import { TrackMessage, TrackMeta, SUCCESS, ERROR, LOADING } from 'models/track'

export const ERROR_TEXT: string = 'Failed to load audio'

export interface TrackListProps {}

export interface TrackListState {
  activeTrackUrl: string | null
  selectedTrackUrl: string | null
  tracks: TrackMeta[]
  loading: boolean
  error: boolean
}

export class TrackList extends React.Component<TrackListProps, TrackListState> {
  private unsubscribe$: Subject<void>

  constructor(props: TrackListProps) {
    super(props)

    this.state = {
      activeTrackUrl: null,
      selectedTrackUrl: null,
      tracks: [],
      loading: true,
      error: false,
    }
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectTrackService()
    this.connectSelectedTrackService()
    this.connectPlayService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  connectTrackService() {
    // Get an instance of images stream
    const tracksStream: Observable<TrackMessage> = tracksService.getTracksMetaStream()
    // Auto unsubscribe when this.unsubscribe$.next is called
    .takeUntil(this.unsubscribe$)

    tracksStream
    .filter(({ status }: TrackMessage): boolean => status === LOADING)
    .subscribe(() => this.setState({ loading: true, error: false }))

    tracksStream
    .filter(({ status }: TrackMessage): boolean => status === SUCCESS)
    .subscribe(({ tracks }: TrackMessage) =>
      this.setState({ loading: false, error: false, tracks: (tracks as TrackMeta[]) })
    )

    tracksStream
    .filter(({ status }: TrackMessage): boolean => status === ERROR)
    .subscribe(() => this.setState({ loading: false, error: true }))
  }
  
  connectPlayService() {
    playService.getPlayingTrackStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((activeTrack: TrackMeta | null) => this.setState({
      activeTrackUrl: activeTrack && activeTrack.url
    }))
  }
  
  connectSelectedTrackService() {
    selectedTrackService.getSelectedTrackStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((selectedTrack: TrackMeta | null) => this.setState({
      selectedTrackUrl: selectedTrack && selectedTrack.url
    }))
  }

  render() {
    const { tracks, loading, error,
      activeTrackUrl, selectedTrackUrl } = this.state

    return (
      <div>
        {error && <p>{ERROR_TEXT}</p>}
        {loading && <Loader />}
        {tracks.length && tracks.map((track: TrackMeta) =>
          <Track
            {...track}
            key={track.url}
            onActivate={playService.playTrack}
            onSelect={selectedTrackService.selectTrack}
            isActive={propEq('url', activeTrackUrl)(track)}
            isSelected={propEq('url', selectedTrackUrl)(track)}
          />
        ) || ''}
      </div>
    )
  }
}
