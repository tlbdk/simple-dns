import { Server, ServerRequest, ServerResponse } from '@olliv/bindns'
import { AddressInfo } from 'net'

export type RequestListener = (req: ServerRequest, res: ServerResponse) => void

export class DNSServer {
  public listenAddress = ''
  public listenPort: number
  private requestListener: RequestListener
  private server: Server

  public constructor(listenPort = 0, requestListener: RequestListener) {
    this.requestListener = requestListener
    this.server = new Server('udp4', (req, res) => {
      this.handleRequest(req, res)
    })
    this.listenPort = listenPort
  }

  public async start(): Promise<void> {
    const listeningPromise = new Promise<AddressInfo>((resolve, reject) => {
      this.server.on('listening', () => {
        resolve(this.server.socket.address())
      })
      this.server.on('error', e => {
        reject(e)
      })
    })
    this.server.bind(this.listenPort)
    const addressInfo = await listeningPromise
    this.listenPort = addressInfo.port
    this.listenAddress = addressInfo.address
  }

  public async stop(): Promise<void> {
    this.server.close()
    return new Promise(resolve =>
      this.server.on('close', () => {
        resolve()
      })
    )
  }

  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.server.on(event, listener)
    return this
  }

  private handleRequest(req: ServerRequest, res: ServerResponse): void {
    try {
      Promise.all([Promise.resolve(this.requestListener(req, res))]).catch(e => {
        // TODO: Handle error
      })
    } catch (e) {
      // TODO: Handle error
    }
  }
}
