import Queue from 'promise-queue'

import utils from '@/lib/tyslin'
import * as tysApi from '@/lib/tyslin-api'
import { isNumeric } from './numericHelpers'
import { TransactionStatus as TS } from './constants'

const maxConcurent = 1
const maxQueue = Infinity

const queue = new Queue(maxConcurent, maxQueue)

/**
 * Add a message to the queue.
 * @param {string} message
 * @param {string} recipientId
 * @returns {Promise}
 */
export function queueMessage (message, recipientId) {
  return queue.add(() => {
    return tysApi.sendMessage({
      to: recipientId,
      message
    })
  })
}

/**
 * Retrieve the chat messages for the current account.
 * @param {number} startHeight
 * @param {number} startOffset
 * @param {boolean} recursive
 * @returns {Promise<{messages: Message[], lastMessageHeight: number}>} Array of messages
 */
export function getChats (startHeight = 0, startOffset = 0, recursive = true) {
  let allTransactions = []
  let lastMessageHeight = 0

  function loadMessages (height = 0, offset = 0) {
    return tysApi.getChats(height, offset, 'asc')
      .then(result => {
        const { transactions } = result
        const length = transactions.length

        // if no more messages
        if (length <= 0) {
          return allTransactions
        }

        allTransactions = [...allTransactions, ...transactions]

        // Save `height` from last message.
        lastMessageHeight = transactions[length - 1].height

        // recursive
        if (recursive) {
          return loadMessages(height, offset + length)
        } else {
          return allTransactions
        }
      })
  }

  return loadMessages(startHeight, startOffset)
    .then(transactions => ({
      messages: transactions,
      lastMessageHeight: lastMessageHeight
    }))
}

/**
 * Create empty chat.
 */
export function createChat () {
  return {
    messages: [],
    numOfNewMessages: 0
  }
}

/**
 * Creates a message object with uniq ID.
 * @param {string} recipientId
 * @param {string} senderId
 * @param {string} message
 * @param {string} status
 */
export function createMessage ({ recipientId, senderId, message, status = TS.PENDING }) {
  return {
    id: utils.epochTime(), // @todo uuid will be better
    recipientId,
    senderId,
    message,
    status,
    timestamp: Date.now(),
    type: 'message'
  }
}

/**
 * Create a transaction object with uniq ID.
 * @param {number} transactionId
 * @param {string} recipientId
 * @param {string} senderId
 * @param {number} amount
 * @param {string} comment Transaction comment
 * @param {string} type TYS, ETH...
 * @param {string} status
 */
export function createTransaction (payload) {
  const {
    transactionId,
    recipientId,
    senderId,
    amount,
    comment,
    hash,
    type = 'TYS',
    status = TS.PENDING
  } = payload

  const transaction = {
    id: transactionId,
    recipientId,
    senderId,
    amount,
    hash,
    type,
    status,
    timestamp: Date.now()
  }

  if (comment) {
    transaction.message = comment
  }

  return transaction
}

/**
 * Returns real timestamp by TYS timestamp.
 * @param {number} tysTimestamp
 */
export function getRealTimestamp (tysTimestamp) {
  const foundationDate = Date.UTC(2019, 1, 1, 17, 0, 0, 0)

  return parseInt(tysTimestamp) * 1000 + foundationDate
}

/**
 * Transform message for better integration into Vue components.
 * @param {Object} abstract Message object returned by the server.
 * @returns {Message} See `components/AChat/types.ts`
 */
export function transformMessage (abstract) {
  let transaction = {}
  const knownCryptos = {
    eth_transaction: 'ETH',
    bz_transaction: 'BZ',
    bnb_transaction: 'BNB',
    doge_transaction: 'DOGE'
  }
  const notSupportedYetCryptos = {
    lsk_transaction: 'LSK',
    dash_transaction: 'DASH'
  }

  // common properties for all transaction types
  transaction.id = abstract.id
  transaction.senderId = abstract.senderId
  transaction.recipientId = abstract.recipientId
  transaction.tysTimestamp = abstract.timestamp
  transaction.timestamp = getRealTimestamp(abstract.timestamp)
  transaction.status = abstract.status || TS.DELIVERED
  transaction.i18n = !!abstract.i18n
  transaction.amount = abstract.amount ? abstract.amount : 0
  transaction.message = ''
  transaction.height = abstract.height
  transaction.asset = {}

  if (abstract.message && abstract.message.type) { // cryptos
    transaction.asset = abstract.message
    transaction.message = abstract.message.comments || ''
    transaction.amount = isNumeric(abstract.message.amount) ? +abstract.message.amount : 0
    transaction.status = TS.PENDING
    transaction.hash = abstract.message.hash || ''

    const cryptoType = abstract.message.type.toLowerCase()
    const knownCrypto = knownCryptos[cryptoType]
    const notSupportedYetCrypto = notSupportedYetCryptos[cryptoType]
    if (knownCrypto) {
      transaction.type = knownCrypto
    } else {
      transaction.type = notSupportedYetCrypto || 'UNKNOWN_CRYPTO'
      transaction.status = TS.INVALID
    }
  } else { // TYS transaction or Message
    transaction.message = abstract.message || ''
    transaction.hash = abstract.id // tys transaction id (hash)

    abstract.amount > 0
      ? transaction.type = 'TYS'
      : transaction.type = 'message'
  }

  return transaction
}
