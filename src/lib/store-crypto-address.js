import * as tysApi from './tyslin-api'

const queue = { }
const stored = []

export function storeCryptoAddress (crypto, address) {
  if (!queue[crypto] && !stored.includes(crypto)) {
    queue[crypto] = address
  }
}

export function flushCryptoAddresses () {
  if (!tysApi.isReady()) return

  Object.keys(queue).forEach(crypto => {
    const address = queue[crypto]
    tysApi.storeCryptoAddress(crypto, address).then(success => {
      if (success) {
        delete queue[crypto]
        stored.push(crypto)
      }
    })
  })
}
