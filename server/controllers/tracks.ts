import { Mode } from 'models/modes'
import { equals, pluck } from 'ramda'
import { getMetadataService, MetadataService } from 'services/metadata'
import { getTrackService, TrackService } from 'services/tracks'

export class TracksController {
  private readonly TRACKS_KEY = 'tracks'
  private metadataService: MetadataService
  private trackService: TrackService

  constructor(
    mode: Mode,
    url: string,
  ) {
    this.metadataService = getMetadataService(mode, url)
    this.trackService = getTrackService(mode, url)

    this.trackService.addListener('update', this.syncTracksWithMetadata)
  }

  public connectToWs = (ws: any) => {
    const { metadataService } = this
    const sendWsMessage = (data: any) => ws.send(JSON.stringify({
      key: this.TRACKS_KEY,
      data,
    }))
    
    metadataService.getCurrentMetadata()
    .then(sendWsMessage)
    .then(() => metadataService.addListener('update', sendWsMessage))
  
    ws.on('close', () => {
      metadataService.removeListener('update', sendWsMessage)
    })
  }

  private syncTracksWithMetadata = () => {
    const { metadataService, trackService } = this
    Promise.all([
      metadataService.getCurrentMetadata(),
      trackService.getTracks(),
    ])
    .then(([metadata, tracks]) => {
      if (!equals(pluck('url')(metadata), pluck('url')(tracks))) {
        metadataService.updateMetadata(tracks)
      }
    })
  }
}
