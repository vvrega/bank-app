export type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

export type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Exchange';

export interface Account {
  id: number;
  name?: string;
  balance: number;
  currency: Currency;
  userId: number;
}

export interface Transaction {
  id: string | number;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  targetCurrency?: string;
  targetUser?: string;
  fromAccountId?: number;
  toAccountId?: number;
  fromUserName?: string;
  toUserName?: string;
  fromAccountUserId?: number;
  toAccountUserId?: number;
}

export interface User {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  iban: string;
}

export interface Contact {
  id: number;
  name: string;
  contactUserIban: string;
  contactUserId: number;
  contactUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface ExchangeRates {
  quotes: {
    PLNEUR: number;
    PLNUSD: number;
    PLNGBP: number;
  };
}
