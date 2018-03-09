import * as React from 'react'
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Loader } from 'components/Loader'
import { Track } from 'components/Track'
import { TrackList, TrackListProps, TrackListState, ERROR_TEXT } from "./TrackList"
import { tracksService } from 'services/tracks'

jest.mock('services/tracks')
jest.mock('services/websockets')

const { LOADING, SUCCESS, ERROR, TrackMessage } = require.requireActual('services/tracks')

const TRACKS = [
  {
    url: 'url1'
  },
  {
    url: 'url2'
  }
]
const ERROR_MESSAGE = { status: ERROR }
const LOADING_MESSAGE = { status: LOADING }
const SUCCESS_MESSAGE = { status: SUCCESS, tracks: TRACKS }

describe('TrackList component', () => {
  let wrapper: ShallowWrapper<TrackListProps, TrackListState>
  beforeEach(() => {
    wrapper = shallow(<TrackList />)
    jest.clearAllMocks()
  })
  afterEach(() => {
    wrapper.unmount()
  })
  it('should render Loader if state.loading is true', () => {
    wrapper.setState({ loading: true })
    expect(wrapper.find(Loader)).toHaveLength(1)
  })
  it('should not render Loader if state.loading is false', () => {
    wrapper.setState({ loading: false })
    expect(wrapper.find(Loader)).toHaveLength(0)
  })

  it('should render error message and refresh link if state.error is true', () => {
    wrapper.setState({ error: true })
    expect(wrapper.find(`p[children="${ERROR_TEXT}"]`)).toHaveLength(1)
  })
  it('should not render error message and refresh link if state.error is false', () => {
    wrapper.setState({ error: false })
    expect(wrapper.find(`p[children="${ERROR_TEXT}"]`)).toHaveLength(0)
  })

  it('should render tracks if state has tracks', () => {
    wrapper.setState({ tracks: TRACKS })
    const images = wrapper.find(Track)
    expect(images).toHaveLength(TRACKS.length)
    expect(images.map((node) => node.prop('url'))).toEqual(TRACKS.map((track) => track.url))
  })
  it('should not render tracks if state has no tracks', () => {
    wrapper.setState({ tracks: [] })
    const images = wrapper.find(Track)
    expect(images).toHaveLength(0)
  })

  describe('Track stream connection', () => {
    let mountWrapper: ReactWrapper<TrackListProps, TrackListState>
    const imageSubject: Subject<TrackMessage> = new Subject()
    beforeEach(() => {
      jest.spyOn(tracksService, 'getTracksMetaStream')
      jest.clearAllMocks()
      mountWrapper = mount(<TrackList />)
    })

    afterEach(() => {
      mountWrapper.unmount()
    })

    it('should call getTracksMetaStream upon load', () => {
      expect(tracksService.getTracksMetaStream).toHaveBeenCalledTimes(1)
    })

    it('should change state to error on image stream error message', () => {
      tracksService.mockMessage(ERROR_MESSAGE)
      const { loading, error } = mountWrapper.state()
      expect(loading).toBe(false)
      expect(error).toBe(true)
    })
    it('should change state to loading on image stream loading message', () => {
      tracksService.mockMessage(LOADING_MESSAGE)
      const { loading, error } = mountWrapper.state()
      expect(loading).toBe(true)
      expect(error).toBe(false)
    })
    it('should add images to state on image stream success message', () => {
      tracksService.mockMessage(SUCCESS_MESSAGE)
      const { loading, error, tracks } = mountWrapper.state()
      expect(loading).toBe(false)
      expect(error).toBe(false)
      expect(tracks).toBe(TRACKS)
    })
    it('should add images to state on image stream success message', () => {
      tracksService.mockMessage(SUCCESS_MESSAGE)
      const { loading, error, tracks } = mountWrapper.state()
      expect(loading).toBe(false)
      expect(error).toBe(false)
      expect(tracks).toBe(TRACKS)
    })
  })
})
