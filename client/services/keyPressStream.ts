import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'

export const keyPressStream = Observable.fromEvent(document, 'keydown')
