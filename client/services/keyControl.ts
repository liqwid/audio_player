import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/takeUntil'

import { DOWN_ARROW, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, ENTER, SPACE } from 'utils/keycodes'
import { keyPressStream } from 'services/keyPressStream'
import { selectedTrackService } from 'services/selectedTrack'
import { playService } from 'services/play'

class KeyControlService {
  private unsubscribe$: Subject<void>
  private selectedTrackUrl: string | null = null

  start() {
    this.unsubscribe$ = new Subject()

    selectedTrackService.getSelectedTrackStream()
    .subscribe((selectedTrack) => {
      this.selectedTrackUrl = selectedTrack && selectedTrack.url
    })
    
    keyPressStream
    .takeUntil(this.unsubscribe$)
    .subscribe(this.controlWithKeys)
  }

  controlWithKeys = ({ keyCode }: React.KeyboardEvent<any>) => {
    if (keyCode === DOWN_ARROW) {
      return selectedTrackService.selectNext()
    }
    
    if (keyCode === UP_ARROW) {
      return selectedTrackService.selectPrevious()
    }
    
    if (keyCode === ENTER && this.selectedTrackUrl) {
      return playService.playTrack(this.selectedTrackUrl)
    }

    if (keyCode === SPACE) {
      return playService.togglePause()
    }

    if (keyCode === RIGHT_ARROW) {
      return playService.playNext()
    }

    if (keyCode === LEFT_ARROW) {
      return playService.playPrevious()
    }
  }

  stop() {
    this.unsubscribe$.next()
  }
}

export const keyControlService = new KeyControlService()
