import { ns_class, ns_rcode, ns_sect, ns_type } from '@olliv/bindns'
import { Resolver } from 'dns'

import { DNSServer } from './dns-server'

const domain = 'test.nversion.dk'
const publicIp = '127.0.0.1'

async function lookupTxtValue(key: string): Promise<string> {
  if (key === 'stuff') {
    return 'extra'
  }
  return 'normal'
}

describe('DNSServer', () => {
  const dnsServer = new DNSServer(0, async (req, res) => {
    if (req.question.length == 0) {
      return
    }
    const name = req.question[0].name === '.' ? '' : req.question[0].name
    if (!name.endsWith(domain)) {
      return res.send()
    }

    // Authoritative for this zone.
    res.header.aa = 1
    res.header.rcode = ns_rcode.noerror
    res.addRR(ns_sect.ar, domain, ns_type.ns, ns_class.in, 10, 'ns1.' + domain)
    res.addRR(ns_sect.ar, `ns1.${domain}`, ns_type.a, ns_class.in, 10, publicIp)

    if ([ns_type.soa, ns_type.any].includes(req.question[0].type)) {
      // Add SOA
      res.addRR(
        ns_sect.an,
        domain,
        ns_type.soa,
        ns_class.in,
        360,
        'hostmaster.' + domain,
        'hostmaster.' + domain,
        '2',
        '21600',
        '3600',
        '259200',
        '300'
      )
    }

    if ([ns_type.soa, ns_type.txt].includes(req.question[0].type)) {
      const names = name.split('.')
      const value = await lookupTxtValue(names[0])
      res.addRR(ns_sect.an, name, ns_type.txt, ns_class.in, 3600, value)
    }

    res.send()
  })

  beforeAll(async () => {
    await dnsServer.start()
  })

  afterAll(async () => {
    await dnsServer.stop()
  })

  it('Simple lookup', done => {
    const resolver = new Resolver()
    resolver.setServers([`127.0.0.1:${dnsServer.listenPort}`])
    resolver.resolveTxt('stuff.test.nversion.dk', (err, adresses) => {
      expect(adresses).toEqual([])
      done()
    })
  })
})
