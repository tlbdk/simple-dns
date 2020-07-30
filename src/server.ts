import { ns_class, ns_rcode, ns_sect, ns_type } from '@olliv/bindns'

import { DNSServer } from './dns-server'

async function lookupTxtValue(key: string): Promise<string> {
  if (key === 'stuff') {
    return 'extra'
  }
  return 'normal'
}

async function main(): Promise<number> {
  const domain = 'test.nversion.dk'
  const publicIp = '127.0.0.1'

  const dnsServer = new DNSServer(5300, async (req, res) => {
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
    res.addRR(ns_sect.ar, 'ns1.' + domain, ns_type.a, ns_class.in, 10, publicIp)

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
  dnsServer.on('listening', () => console.log(`Server running at 0.0.0.0:${dnsServer.listenPort}`))
  await dnsServer.start()
  console.log('Test with dig @127.0.0.1 -p 5300 txt stuff.test.nversion.dk')
  await new Promise(resolve => dnsServer.on('close', resolve))

  return 0
}

main()
  .then(exitCode => {
    process.exit(exitCode)
  })
  .catch(e => {
    console.error(e)
  })
