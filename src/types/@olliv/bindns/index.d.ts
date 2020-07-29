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
    public type: ns_type
    public class: ns_class
    public constructor(name: string, type: number, klass: number)
  }

  export class MessageRR {
    public name: string
    public type: ns_type
    public class: ns_class
    public ttl: number
    public rdata: any[]
    public constructor(name: string, type: number, klass: number, ttl: number, rdata?: Array<any>)
  }

  export class Message {
    public header: MessageHeader
    public question: MessageQuestion[]
    public answer: MessageRR[]
    public authoritative: MessageRR[]
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

  export enum ns_sect {
    qd = 0,
    zn = 0,
    an = 1,
    pr = 1,
    ns = 2,
    ud = 2,
    ar = 3,
    max = 4
  }

  export enum ns_flag {
    qr = 0,
    opcode = 1,
    aa = 2,
    tc = 3,
    rd = 4,
    ra = 5,
    z = 6,
    ad = 7,
    cd = 8,
    rcode = 9,
    max = 10
  }

  export enum ns_opcode {
    query = 0,
    iquery = 1,
    status = 2,
    notify = 4,
    update = 5
  }

  export enum ns_rcode {
    noerror = 0,
    formerr = 1,
    servfail = 2,
    nxdomain = 3,
    notimpl = 4,
    refused = 5,
    yxdomain = 6,
    yxrrset = 7,
    nxrrset = 8,
    notauth = 9,
    notzone = 10,
    max = 11,
    badvers = 16,
    badsig = 16,
    badkey = 17,
    badtime = 18
  }

  enum ns_update_operation {
    delete = 0,
    add = 1,
    max = 2
  }

  enum ns_type {
    invalid = 0,
    a = 1,
    ns = 2,
    md = 3,
    mf = 4,
    cname = 5,
    soa = 6,
    mb = 7,
    mg = 8,
    mr = 9,
    null = 10,
    wks = 11,
    ptr = 12,
    hinfo = 13,
    minfo = 14,
    mx = 15,
    txt = 16,
    rp = 17,
    afsdb = 18,
    x25 = 19,
    isdn = 20,
    rt = 21,
    nsap = 22,
    ns_nsap_ptr = 23,
    sig = 24,
    key = 25,
    px = 26,
    gpos = 27,
    aaaa = 28,
    loc = 29,
    nxt = 30,
    eid = 31,
    nimloc = 32,
    srv = 33,
    atma = 34,
    naptr = 35,
    kx = 36,
    cert = 37,
    a6 = 38,
    dname = 39,
    sink = 40,
    opt = 41,
    apl = 42,
    ds = 43,
    sshfp = 44,
    ipseckey = 45,
    rrsig = 46,
    nsec = 47,
    dnskey = 48,
    dhcid = 49,
    nsec3 = 50,
    nsec3param = 51,
    hip = 55,
    spf = 99,
    tkey = 249,
    tsig = 250,
    ixfr = 251,
    axfr = 252,
    mailb = 253,
    maila = 254,
    any = 255,
    zxfr = 256,
    dlv = 32769,
    max = 65536
  }

  export enum ns_class {
    invalid = 0,
    in = 1,
    chaos = 3,
    hs = 4,
    none = 254,
    any = 255
  }

  export enum ns_key_types {
    rsa = 1,
    dh = 2,
    dsa = 3,
    private = 4
  }
  export enum ns_cert_types {
    pkix = 1,
    spki = 2,
    pgp = 3,
    url = 253,
    oid = 254
  }
}
