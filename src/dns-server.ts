import { Server, ServerRequest, ServerResponse } from '@olliv/bindns'

export type RequestListener = (req: ServerRequest, res: ServerResponse) => void

export class DNSServer {
  private requestListener: RequestListener
  private server: Server

  public constructor(listenPort = 0, requestListener: RequestListener) {
    this.requestListener = requestListener
    this.server = new Server('udp4', (req, res) => {
      this.handleRequest(req, res)
    })
    this.server.bind(listenPort)
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
