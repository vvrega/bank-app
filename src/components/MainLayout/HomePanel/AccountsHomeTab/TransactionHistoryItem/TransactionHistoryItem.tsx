import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';

type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Exchange';

interface Transaction {
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
  accounts,
  currentUserId,
}: {
  transaction: Transaction;
  accounts: Account[];
  currentUserId: number;
}) {
  const config = typeConfig[transaction.type];
  const fromAccount = accounts.find(
    (acc) => acc.id === transaction.fromAccountId
  );
  const isOutgoing = fromAccount && fromAccount.userId === currentUserId;
  const sign = isOutgoing ? '-' : '+';
  const color = isOutgoing ? '#c92a2a' : '#228B22';

  let transferTitle = config ? config.label : transaction.type;
  if (transaction.type === 'Transfer') {
    if (isOutgoing && transaction.toUserName) {
      transferTitle = `Transfer to ${transaction.toUserName}`;
    } else if (!isOutgoing && transaction.fromUserName) {
      transferTitle = `Transfer from ${transaction.fromUserName}`;
    } else {
      transferTitle = config ? config.label : transaction.type;
    }
  }

  return (
    <Group align="center" gap="md" mb="xs">
      <ThemeIcon
        color={config ? config.color : 'gray'}
        variant="light"
        size="lg"
      >
        {config ? config.icon : transaction.type?.[0] || '?'}
      </ThemeIcon>
      <Box>
        <Text size="sm" fw={500}>
          {transaction.type === 'Transfer'
            ? transferTitle
            : config
            ? config.label
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
