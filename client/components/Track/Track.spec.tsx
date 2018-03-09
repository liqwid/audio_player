import * as React from 'react'
import { Track, TrackProps } from './Track'
import { shallow, ShallowWrapper } from 'enzyme'

const url: string = 'src'

describe('Track component', () => {
  let wrapper: ShallowWrapper<TrackProps>
  beforeEach(() => {
    const props: TrackProps = { url }
    wrapper = shallow(<Track {...props} />)
  })

  describe('audio', () => {
    it('should render audio tag', () => {
      expect(wrapper.find('audio')).toHaveLength(1)
    })
    it(`should prepend set url to src`, () => {
      expect(wrapper.find('audio').prop('src'))
      .toEqual(url)
    })
  })
})
