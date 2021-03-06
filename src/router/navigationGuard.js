import { Cryptos } from '@/lib/constants'
import store from '@/store'

export default {
  chats: (to, from, next) => {
    if (store.state.chat.chats.hasOwnProperty(to.params.partnerId)) {
      next()
    } else next('/chats')
  },
  transaction: (to, from, next) => {
    const crypto = to.params.crypto.toUpperCase()
    const txId = to.params.txId
    if (Cryptos[crypto]) {
      if (crypto === 'TYS') {
        if (store.state.tys.transactions.hasOwnProperty(txId)) {
          next()
        } else next('/transactions/TYS')
      } else if (crypto === 'DOGE') {
        if (store.getters['doge/transaction'](txId)) {
          next()
        } else next('/transactions/DOGE')
      } else if (crypto === 'BNB' || crypto === 'BZ') {
        if (store.getters[crypto.toLowerCase() + '/transaction'](txId)) {
          next()
        } else next('/transactions/BNB')
      } else if (crypto === 'ETH') {
        if (store.state.eth.transactions.hasOwnProperty(txId)) {
          next()
        } else next('/transactions/ETH')
      } else next('/home')
    } else next('/home')
  },
  transactions: (to, from, next) => {
    if (to.params.crypto) {
      if (Cryptos[to.params.crypto.toUpperCase()]) {
        next()
      } else next('/home')
    } else next('/home')
  }
}
