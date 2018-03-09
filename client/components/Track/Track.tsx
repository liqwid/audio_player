import * as React from 'react'

import styled from 'styled-components'

import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import { blueGrey700, blueGrey900 } from 'material-ui/styles/colors'

import { formatAudioDuration } from 'utils/timeFormat'
import { TrackMeta } from 'models/track'

const TrackWrapper = styled(Paper)`
  height: 48px;
  padding: 16px;
  margin: 2px;
  color: white !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TrackInfoRight = styled.div`
  display: flex;
  align-items: center;
  max-width: 80%;
`
const TextWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`

const TrackInfoLeft = styled.div``

const IconWrapper = styled.div`
  margin-right: 8px;
  width: 24px;
  min-width: 24px;
`

export interface TrackProps extends TrackMeta {
  isActive: boolean
  isSelected: boolean
  onActivate(url: string): void
  onSelect(url: string): void
}

export function Track(props: TrackProps) {
  const { url, onSelect, onActivate, title, filename, isSelected, isActive, duration, artist } = props
  return (
    <TrackWrapper
      style={{ backgroundColor: isSelected && blueGrey900 || blueGrey700 }}
      onClick={() => onSelect(url)}
      onDoubleClick={() => onActivate(url)}
    >
      <TrackInfoRight>
        <IconWrapper>
          {
            isActive && <FontIcon
              className='fas fa-music'
              color='#fff'
            />
          }
        </IconWrapper>
        <TextWrapper>
          {artist && `${artist} - ` || ''}
          {title || filename}
        </TextWrapper>
      </TrackInfoRight>
      <TrackInfoLeft>
        {formatAudioDuration(duration)}
      </TrackInfoLeft>
    </TrackWrapper>
  )
}
