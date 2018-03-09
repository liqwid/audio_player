import { EventEmitter } from 'events'
import { LocalMetadataService } from './localMetadata'
import { Mode, LOCAL } from 'models/modes'
import { Metadata } from 'models/metadata'
import { Track } from 'models/track'

export interface MetadataService extends EventEmitter {
  getCurrentMetadata(): Promise<Metadata[]>
  updateMetadata(tracks: Track[]): Promise<Metadata[]>
}

export function getMetadataService(mode: Mode, url: string): MetadataService {
  if (mode === LOCAL) {
    return new LocalMetadataService(url)
  }
  return new LocalMetadataService(url)
}
