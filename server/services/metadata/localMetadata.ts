import { readFile, writeFile } from 'fs'
import { EventEmitter } from 'events'
import { promisify } from 'util'
import { merge, pipe } from 'ramda'
import { parseFile } from 'music-metadata'
import { MetadataService } from './metadata'
import { Metadata } from 'models/metadata'
import { Track } from 'models/track'

const METADATA_PATH = '/metadata.json'

export class LocalMetadataService extends EventEmitter implements MetadataService {
  private metadataPromise: Promise<any>
  private filePath: string
  
  constructor(
    private path: string
  ) {
    super()
    this.filePath = path + METADATA_PATH
    this.metadataPromise = this.readMetadata()
  }

  public getCurrentMetadata(): Promise<Metadata[]> {
    return this.metadataPromise
  }

  public updateMetadata(tracks: Track[]): Promise<Metadata[]> {
    this.metadataPromise = this.replaceMetadata(tracks)
    this.metadataPromise.then((metadata) => this.emit('update', metadata))

    return this.metadataPromise
  }

  private readMetadata(): Promise<Metadata> {
    return promisify(readFile)(this.filePath, 'utf8')
    .then(JSON.parse)
  }

  private replaceMetadata(tracks: Track[]): Promise<Metadata[]> {
    const extractMetadataPromise: Promise<Metadata[]> = Promise.all(tracks.map(
      ({ url, filename }): Promise<Metadata> =>
        parseFile(`${this.path}${url}`)
        .then(pipe(
          ({ common, format: { duration } }) => ({ ...common, duration }),
          merge({ url, filename }),
        ))
        .catch((err): any => ({ url, filename }))
    ))
    extractMetadataPromise.then((metadata: Metadata[]) =>
      promisify(writeFile)(this.filePath,  JSON.stringify(metadata), 'utf8')
    )

    return extractMetadataPromise
  }
}
