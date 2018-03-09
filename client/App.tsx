import * as React from 'react'
import { TrackList } from 'containers/TrackList'
import { Playback } from 'containers/Playback'
import { keyControlService } from 'services/keyControl'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import styled from 'styled-components'

const Layout = styled.div`
  text-align: center;
`

class App extends React.Component {
  
  componentDidMount() {
    keyControlService.start()
  }

  componentWillUnmount() {
    keyControlService.stop()
  }
  
  render() {
    return (
      <MuiThemeProvider>
        <Layout>
          <Playback/>
          <TrackList/>
        </Layout>
      </MuiThemeProvider>
    )
  }
}

export default App
