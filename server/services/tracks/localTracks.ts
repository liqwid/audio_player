import { readdir, watch } from 'fs'
import { EventEmitter } from 'events'
import { promisify } from 'util'
import { map } from 'ramda'
import { TrackService } from './tracks'
import { Track } from 'models/track'

const TRACKS_PATH = '/tracks'

export class LocalTrackService extends EventEmitter implements TrackService {
  private tracksPath: string
  
  constructor(
    path: string,
  ) {
    super()
    this.tracksPath = path + TRACKS_PATH
    this.initTracksWatcher()
  }

  public getTracks(): Promise<Track[]> {
    return promisify(readdir)(this.tracksPath)
    .then(map((filename: string): Track => ({
      url: `${TRACKS_PATH}/${filename}`,
      filename
    })))
  }

  private initTracksWatcher() {
    watch(
      this.tracksPath,
      () => this.emit('update')
    )
  }
}
