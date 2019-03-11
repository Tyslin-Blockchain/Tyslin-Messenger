import { isValidAddress } from 'ethereumjs-util'
import { Cryptos, isErc20 } from './constants'

const RE_TYS_ADDRESS = /^T([0-9]{6,})$/
const RE_DOGE_ADDRESS = /^D([0-9a-zA-Z]{10,})$/

/**
 * Checks if `address` is a valid address for the specified `crypto`.
 *
 * @param {string} crypto one of 'TYS' or 'ETH'
 * @param {string} address value to check
 * @returns {boolean} `true` if address is valid, `false` otherwise
 */
export default function validateAddress (crypto, address) {
  if (crypto === Cryptos.TYS) {
    return RE_TYS_ADDRESS.test(address)
  } else if (crypto === Cryptos.ETH || isErc20(crypto)) {
    return isValidAddress(address)
  } else if (crypto === Cryptos.DOGE) {
    return RE_DOGE_ADDRESS.test(address)
  }
  return true
}