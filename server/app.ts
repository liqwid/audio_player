import { createServer, Server } from 'http'
import * as express from 'express'
import { assetsPath } from 'utils/paths'
import { initWebsockets } from './websocketServer'
import { TracksController } from 'controllers/tracks'
import { LOCAL } from 'models/modes'

const WS_TIMEOUT = 30000

// Init express to serve static
const app: express.Express = express()
app.use(express.static(assetsPath))

const server: Server = createServer(app)
const wsServer = initWebsockets(server, WS_TIMEOUT)

const tracksController = new TracksController(LOCAL, assetsPath)

wsServer.on('connection', tracksController.connectToWs)

export default server
