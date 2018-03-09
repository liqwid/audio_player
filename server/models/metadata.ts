import { ICommonTagsResult } from 'music-metadata/lib'

export interface Metadata extends ICommonTagsResult {
  url: string
  duration: number
}
