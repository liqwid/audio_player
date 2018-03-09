import * as React from 'react'

import Slider from 'material-ui/Slider'

import styled from 'styled-components'
import { blueGrey700, grey500 } from 'material-ui/styles/colors'

export interface TimeSliderProps {
  time: number
  duration: number
  disabled: boolean
  onChange(time: number): void
}

const ColoredSlider = styled(Slider)`
  height: 36px;
  >div {
    margin: 16px 0 !important;
  }

  >div {
    >div {
      >div {
        background-color: ${grey500} !important;
        &:first-child,:last-child {
          background-color: ${blueGrey700} !important;
        }
      }
    }
  }
`

const MIN_TIMER_VAL = 0
const MAX_TIMER_VAL = 100

function timeToSliderVal(time: number, duration: number): number {
  return time * (MAX_TIMER_VAL - MIN_TIMER_VAL) / duration
}

function sliderValToTime(val: number, duration: number): number {
  return val / (MAX_TIMER_VAL - MIN_TIMER_VAL) * duration
}

export function TimeSlider({ time, duration, disabled, onChange }: TimeSliderProps) {
  return (
    <ColoredSlider
      min={MIN_TIMER_VAL}
      max={MAX_TIMER_VAL}
      value={timeToSliderVal(time, duration)}
      disabled={disabled}
      onChange={(e: React.MouseEvent<{}>, val: number) => onChange(sliderValToTime(val, duration))}
    />
  )
}
