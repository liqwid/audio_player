import { Server as WsServer } from 'uws'
import { Server } from 'http'

/**
 * We should monitor dropped clients because the close message can be lost
 * due to network being down
 * @param wsServer server instance
 * @param timeout polling for being alive timeout
 */
function dropDeadClients(wsServer: WsServer, timeout: number) {
  wsServer.on('connection', (ws: any) => {
    ws.isAlive = true
    ws.on('pong', () => ws.isAlive = true)
  })
  
  setInterval(
    () => wsServer.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate()
  
      ws.isAlive = false
      ws.ping(() => {})
    }),
    timeout
  )
}

export function initWebsockets(server: Server, timeout: number) {
  const wsServer: WsServer = new WsServer({ server })

  dropDeadClients(wsServer, timeout)

  return wsServer
}
