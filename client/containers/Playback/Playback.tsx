import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import { blueGrey700, blueGrey900, grey500 } from 'material-ui/styles/colors'

import styled from 'styled-components'

import { TimeSlider } from 'components/TimeSlider'
import { playService } from 'services/play'
import { selectedTrackService } from 'services/selectedTrack'
import { TrackMeta, BLANK_TRACK } from 'models/track'
import { PlayingTrackMeta } from 'models/play'

export interface PlaybackProps {}

export interface PlaybackState {
  currentTime: number
  activeTrack: TrackMeta | null
  paused: boolean
  trackIsSelected: boolean
}

const PlayWrapper = styled.div`
  display: flex;
`

const PlayButton = styled(FlatButton)`
  height: 88px !important;
  width: 88px;

  &:disabled {
    span {
      color: ${grey500} !important
    }
  }
`

const StepButton = styled(FlatButton)`
  height: 88px !important;
  width: 44px !important;
  min-width: 44px !important;
`

const ControlIcon = styled(FontIcon)`
  color: ${blueGrey700} !important;
  :hover {
    color: ${blueGrey900} !important;
  }
`

const PlayIcon = styled(ControlIcon)`
  padding: 32px 34px;
`

const StepIcon = styled(ControlIcon)`
  padding: 32px 11px;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 88px;
  margin: 0 16px;
  width: calc(100% - 176px);
  color: white;
`
const TextWrapper = styled.div`
  display:block;
  color: ${blueGrey900};
  width: 95%;
  height: 60px;
  margin-top: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export class Playback extends React.Component<PlaybackProps, PlaybackState> {
  private unsubscribe$: Subject<void>
  private audio: HTMLAudioElement | null

  constructor(props: PlaybackProps) {
    super(props)

    this.state = {
      currentTime: 0,
      activeTrack: null,
      paused: true,
      trackIsSelected: false,
    }
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectToPlayService()
    this.connectToSelectedService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  componentDidUpdate(
    prevProps: PlaybackProps,
    prevState: PlaybackState
  ) {
    const { paused, activeTrack } = this.state
    const activeUrl = activeTrack ? activeTrack.url : ''
    const prevActiveUrl = prevState.activeTrack ? prevState.activeTrack.url : ''
    if (paused && !prevState.paused) {
      this.pause()
    }
    if (!paused && (prevState.paused || activeUrl !== prevActiveUrl)) {
      this.play()
    }
  }

  shouldComponentUpdate(
    nextProps: PlaybackProps,
    { activeTrack, currentTime, paused, trackIsSelected }: PlaybackState
  ) {
    const activeUrl = activeTrack && activeTrack.url || ''
    const currentActiveUrl = this.state.activeTrack && this.state.activeTrack.url || ''
    return (
      activeUrl !== currentActiveUrl
      || currentTime !== this.state.currentTime
      || paused !== this.state.paused
      || trackIsSelected !== this.state.trackIsSelected
    )
  }

  connectToPlayService() {
    playService.getPlayingTrackStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((track: PlayingTrackMeta) => 
      this.setState({
        currentTime: track.currentTime,
        paused: track.paused,
        activeTrack: track
      })
    )
  }

  connectToSelectedService() {
    selectedTrackService.getSelectedTrackStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((track: TrackMeta | null) => 
      this.setState({
        trackIsSelected: Boolean(track)
      })
    )
  }

  updateCurrentTime = () => {
    if (!this.audio || !this.audio.src) return
    const { currentTime } = this.audio
    playService.updateCurrentTime(currentTime)
  }

  play = () => {
    if (!this.audio || !this.audio.src) return
    this.audio.play()
  }

  pause = () => {
    if (!this.audio || !this.audio.src) return
    this.audio.pause()
  }

  onTimerChange = (time: number) => {
    if (!this.audio || !this.audio.src) return
    this.audio.currentTime = time
  }

  render() {
    let { currentTime, activeTrack, paused, trackIsSelected } = this.state
    const { url, duration, artist, title, filename } = activeTrack ? activeTrack : BLANK_TRACK

    return (
      <PlayWrapper>
        <PlayButton
          onClick={playService.togglePause}
          disabled={!trackIsSelected && !activeTrack}
          icon={<PlayIcon className={`fas ${paused && 'fa-play' || 'fa-pause'}`}/>}
        />
        <StepButton
          onClick={() => playService.playPrevious()}
          icon={<StepIcon className='fas fa-step-backward'/>}
        />
        <StepButton
          onClick={() => playService.playNext()}
          icon={<StepIcon className='fas fa-step-forward'/>}
        />
        <TitleWrapper>
          <TextWrapper>
            {artist && `${artist} - ` || ''}
            {title || filename}
          </TextWrapper>
          <TimeSlider
            time={currentTime}
            duration={duration}
            disabled={!trackIsSelected && !activeTrack}
            onChange={this.onTimerChange}
          />
        </TitleWrapper>
        <audio
          ref={(node) => this.audio = node}
          src={url}
          onTimeUpdate={this.updateCurrentTime}
          onEnded={playService.playNext}
        />
      </PlayWrapper>
    )
  }
}
