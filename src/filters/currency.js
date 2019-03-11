import BigNumber from '@/lib/bignumber'
import { Cryptos } from '@/lib/constants'

/**
 * Format currency amount to a fancy string with symbol
 * @param {number} amount - Amount to format
 * @param {string} symbol - Currency symbol (ticker)
 * @param {boolean} isTysBalance - Amount is TYS balance
 * @returns {string}
 */
export default (amount, symbol = Cryptos.TYS, isTysBalance) => {
  const formatted = BigNumber(
    !isTysBalance && symbol === Cryptos.TYS ? amount / 1e8 : amount
  ).toFixed()
  return `${formatted} ${symbol}`
}
