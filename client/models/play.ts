import { TrackMeta } from 'models/track'

export type PlayState = {
  url: string | null,
  paused: boolean,
  currentTime: number
}

export interface PlayingTrackMeta extends TrackMeta {
  paused: boolean
  currentTime: number
}

export const INITIAL_PLAY_MESSAGE: PlayState = {
  url: null,
  paused: true,
  currentTime: 0
}
