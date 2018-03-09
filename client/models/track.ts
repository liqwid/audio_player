import { ICommonTagsResult } from 'music-metadata/lib'

export type SUCCESS = 'success'
export type LOADING = 'loading'
export type ERROR = 'error'
export type Status = SUCCESS | LOADING | ERROR

export interface TrackMeta extends ICommonTagsResult {
  url: string
  duration: number
  filename?: string
}

export type TrackMessage = {
  status: Status
  tracks?: TrackMeta[]
}

export const SUCCESS: SUCCESS = 'success'
export const LOADING: LOADING = 'loading'
export const ERROR: ERROR = 'error'

export const TRACK_KEY = 'tracks'

export const BLANK_TRACK = {
  duration: Infinity,
  currentTime: 0,
  title: '',
  artist: '',
  filename: '',
  url: ''
}
