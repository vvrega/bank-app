import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';

type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Exchange';

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

interface Account {
  id: number;
  userId: number;
}

const typeConfig: Record<
  TransactionType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  Deposit: {
    icon: <IconPlus size={18} />,
    color: 'green',
    label: 'Deposit',
  },
  Withdraw: {
    icon: <IconTransferOut size={18} />,
    color: 'red',
    label: 'Withdraw',
  },
  Exchange: {
    icon: <IconArrowsExchange size={18} />,
    color: 'blue',
    label: 'Currency exchange',
  },
  Transfer: {
    icon: <IconSend size={18} />,
    color: 'orange',
    label: 'Transfer',
  },
};

export function TransactionHistoryItem({
  transaction,
  currentUserId,
}: {
  transaction: Transaction & {
    fromAccountUserId?: number;
    toAccountUserId?: number;
  };
  accounts: Account[];
  currentUserId: number;
}) {
  const isOutgoing =
    transaction.type === 'Transfer' &&
    transaction.fromAccountUserId === currentUserId;

  const sign =
    transaction.type === 'Transfer'
      ? isOutgoing
        ? '-'
        : '+'
      : transaction.type === 'Withdraw'
      ? '-'
      : '+';

  const color =
    transaction.type === 'Transfer'
      ? isOutgoing
        ? '#c92a2a'
        : '#228B22'
      : transaction.type === 'Withdraw'
      ? '#c92a2a'
      : '#228B22';

  let transferTitle = typeConfig[transaction.type]?.label || transaction.type;
  if (transaction.type === 'Transfer') {
    if (isOutgoing && transaction.toUserName) {
      transferTitle = `Transfer to ${transaction.toUserName}`;
    } else if (!isOutgoing && transaction.fromUserName) {
      transferTitle = `Transfer from ${transaction.fromUserName}`;
    }
  }

  return (
    <Group align="center" gap="md" mb="xs">
      <ThemeIcon
        color={typeConfig[transaction.type]?.color || 'gray'}
        variant="light"
        size="lg"
      >
        {typeConfig[transaction.type]?.icon || transaction.type?.[0] || '?'}
      </ThemeIcon>
      <Box>
        <Text size="sm" fw={500}>
          {transaction.type === 'Transfer'
            ? transferTitle
            : typeConfig[transaction.type]
            ? typeConfig[transaction.type].label
            : transaction.type}
          {transaction.type === 'Exchange' && transaction.targetCurrency
            ? ` to ${transaction.targetCurrency}`
            : ''}
        </Text>
        <Text size="xs" c="dimmed">
          {transaction.date}
        </Text>
        {transaction.description && (
          <Text size="xs" c="dimmed">
            {transaction.description}
          </Text>
        )}
      </Box>
      <Text fw={700} size="sm" ml="auto" style={{ color }}>
        {sign}
        {Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
      </Text>
    </Group>
  );
}
