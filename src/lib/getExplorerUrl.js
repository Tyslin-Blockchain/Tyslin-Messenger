import { Cryptos } from './constants'

/**
 * Returns external transaction info explorer URL.
 *
 * @param {string} crypto one of 'TYS' or 'ETH'
 * @param {string} transactionId ID (hash) of the transaction to explore
 * @returns {string} URL to the transaction details page
 */
export default function getExplorerUrl (crypto, transactionId) {
  switch (crypto) {
    case Cryptos.TYS:
      return 'https://explorer.tyslin.com/tx/' + transactionId
    case Cryptos.ETH:
      return 'https://etherscan.io/tx/' + transactionId
    case Cryptos.DOGE:
      return 'https://dogechain.info/tx/' + transactionId
  }

  return ''
}
