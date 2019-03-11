export type Message = {
  id: number,
  hash?: string, // transactionId for third-party cryptos
  senderId: string,
  recipientId: string,
  message: string,
  timestamp: number,
  tysTimestamp: number,
  amount: number,
  i18n: boolean,
  status: MessageStatus,
  type: MessageType
}

export enum MessageType {
  Message = 'message',
  TYS = 'TYS',
  ETH = 'ETH',
  BZ = 'BZ',
  BNB = 'BNB',
  DOGE = 'DOGE'
}

export enum MessageStatus {
  DELIVERED,
  PENDING,
  REJECTED,
  INVALID
}

export type User = {
  id: string,
  name?: string
}
