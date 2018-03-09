import { EventEmitter } from 'events'
import { LocalTrackService } from './localTracks'
import { Mode, LOCAL } from 'models/modes'
import { Track } from 'models/track'

export interface TrackService extends EventEmitter {
  getTracks(): Promise<Track[]>
}

export function getTrackService(mode: Mode, url: string): TrackService {
  if (mode === LOCAL) {
    return new LocalTrackService(url)
  }
  return new LocalTrackService(url)
}
