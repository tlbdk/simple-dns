declare module '@olliv/bindns' {
  import { EventEmitter } from 'events'
  import net from 'net'

  export class MessageHeader {
    public id: number
    public qr: number
    public opcode: number
    public aa: number
    public tc: number
    public rd: number
    public ra: number
    public z: number
    public ad: number
    public cd: number
    public rcode: number
    public qdcount: number
    public ancount: number
    public nscount: number
    public arcount: number
  }

  export class MessageQuestion {
    public name: string
    public type: number
    public class: number
    public constructor(name: string, type: number, klass: number)
  }

  export class MessageRR {
    public name: string
    public type: number
    public class: number
    public ttl: number
    public rdata: any[]
    public constructor(name: string, type: number, klass: number, ttl: number, rdata?: Array<any>)
  }

  export class Message {
    public header: MessageHeader
    public question: MessageQuestion[]
    public answer: any[]
    public authoritative: any[]
    public additional: MessageRR[]

    public addRR(sect: number, name: string, type: number, klass: number, ttl: number, ...info: Array<string>): void
    public sendTo(socket: import('dgram').Socket, port: number, host: string): void
  }

  export class ServerRequest extends Message {
    public rinfo: {
      adresss: string
      family: string
      port: number
      size: number
    }
    public socket: net.Socket
  }
  export class ServerResponse extends Message {
    public send(): void
  }

  export class Server extends EventEmitter {
    public socket: import('dgram').Socket
    public constructor(type: 'udp4' | 'udp6', requestListener?: (req: ServerRequest, res: ServerResponse) => void)
    public bind(port: number, address?: string): void
    public close(): void
  }

  export abstract class ns_sect {
    public static qd: number
    public static zn: number
    public static an: number
    public static pr: number
    public static ns: number
    public static ud: number
    public static ar: number
    public static max: number
  }

  export abstract class ns_flag {
    public static qr: number
    public static opcode: number
    public static aa: number
    public static tc: number
    public static rd: number
    public static ra: number
    public static z: number
    public static ad: number
    public static cd: number
    public static rcode: number
    public static max: number
  }

  export abstract class ns_opcode {
    public static query: number
    public static iquery: number
    public static status: number
    public static notify: number
    public static update: number
  }

  export abstract class ns_rcode {
    public static noerror: number
    public static formerr: number
    public static servfail: number
    public static nxdomain: number
    public static notimpl: number
    public static refused: number
    public static yxdomain: number
    public static yxrrset: number
    public static nxrrset: number
    public static notauth: number
    public static notzone: number
    public static max: number
    public static badvers: number
    public static badsig: number
    public static badkey: number
    public static badtime: number
  }

  export abstract class ns_type {
    public static invalid: number
    public static a: number
    public static ns: number
    public static md: number
    public static mf: number
    public static cname: number
    public static soa: number
    public static mb: number
    public static mg: number
    public static mr: number
    public static nul: number
    public static wks: number
    public static ptr: number
    public static hinfo: number
    public static minfo: number
    public static mx: number
    public static txt: number
    public static rp: number
    public static afsdb: number
    public static x25: number
    public static isdn: number
    public static rt: number
    public static nsap: number
    public static ns_nsap_ptr: number
    public static sig: number
    public static key: number
    public static px: number
    public static gpos: number
    public static aaaa: number
    public static loc: number
    public static nxt: number
    public static eid: number
    public static nimloc: number
    public static srv: number
    public static atma: number
    public static naptr: number
    public static kx: number
    public static cert: number
    public static a6: number
    public static dname: number
    public static sink: number
    public static opt: number
    public static apl: number
    public static ds: number
    public static sshfp: number
    public static ipseckey: number
    public static rrsig: number
    public static nsec: number
    public static dnskey: number
    public static dhcid: number
    public static nsec3: number
    public static nsec3param: number
    public static hip: number
    public static spf: number
    public static tkey: number
    public static tsig: number
    public static ixfr: number
    public static axfr: number
    public static mailb: number
    public static maila: number
    public static any: number
    public static zxfr: number
    public static dlv: number
    public static max: number
  }

  export abstract class ns_class {
    public static invalid: number
    public static in: number
    public static none: number
    public static any: number
    public staticmax: number
  }
}
