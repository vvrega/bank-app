export type TransactionType = 'deposit' | 'withdraw' | 'exchange' | 'external';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  targetCurrency?: string;
  targetUser?: string;
}

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 500,
    currency: 'PLN',
    date: '2024-05-24',
    description: 'Bank transfer',
  },
  {
    id: '2',
    type: 'withdraw',
    amount: -200,
    currency: 'PLN',
    date: '2024-05-23',
    description: 'ATM',
  },
  {
    id: '3',
    type: 'exchange',
    amount: -100,
    currency: 'PLN',
    date: '2024-05-22',
    targetCurrency: 'EUR',
    description: 'Exchange to EUR',
  },
  {
    id: '4',
    type: 'external',
    amount: -50,
    currency: 'PLN',
    date: '2024-05-21',
    targetUser: 'John Doe',
    description: 'Payment to John',
  },
  {
    id: '5',
    type: 'deposit',
    amount: 1200,
    currency: 'PLN',
    date: '2024-05-20',
    description: 'Salary',
  },
  {
    id: '6',
    type: 'exchange',
    amount: -300,
    currency: 'PLN',
    date: '2024-05-19',
    targetCurrency: 'USD',
    description: 'Exchange to USD',
  },
  {
    id: '7',
    type: 'external',
    amount: -75,
    currency: 'PLN',
    date: '2024-05-18',
    targetUser: 'Anna Nowak',
    description: 'Gift for Anna',
  },
  {
    id: '8',
    type: 'withdraw',
    amount: -150,
    currency: 'PLN',
    date: '2024-05-17',
    description: 'Card payment',
  },
  {
    id: '9',
    type: 'deposit',
    amount: 250,
    currency: 'PLN',
    date: '2024-05-16',
    description: 'Refund',
  },
];
