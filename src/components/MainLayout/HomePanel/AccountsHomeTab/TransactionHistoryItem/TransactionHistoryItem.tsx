import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';

type TransactionType = 'deposit' | 'withdraw' | 'exchange' | 'external';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  targetCurrency?: string; // for internal
  targetUser?: string; // for external
}

const typeConfig: Record<
  TransactionType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  deposit: {
    icon: <IconPlus size={18} />,
    color: 'green',
    label: 'Deposit',
  },
  withdraw: {
    icon: <IconTransferOut size={18} />,
    color: 'red',
    label: 'Withdraw',
  },
  exchange: {
    icon: <IconArrowsExchange size={18} />,
    color: 'blue',
    label: 'Currency exchange',
  },
  external: {
    icon: <IconSend size={18} />,
    color: 'orange',
    label: 'External transfer',
  },
};

const valueColor: Record<TransactionType, string> = {
  deposit: '#228B22',
  exchange: '#212529',
  withdraw: '#c92a2a',
  external: '#c92a2a',
};

export function TransactionHistoryItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const config = typeConfig[transaction.type];

  return (
    <Group align="center" gap="md" mb="xs">
      <ThemeIcon color={config.color} variant="light" size="lg">
        {config.icon}
      </ThemeIcon>
      <Box>
        <Text size="sm" fw={500}>
          {config.label}
          {transaction.type === 'exchange' && transaction.targetCurrency
            ? ` to ${transaction.targetCurrency}`
            : ''}
          {transaction.type === 'external' && transaction.targetUser
            ? ` to ${transaction.targetUser}`
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
      <Text
        fw={700}
        size="sm"
        ml="auto"
        style={{ color: valueColor[transaction.type] }}
      >
        {transaction.amount > 0 ? '+' : ''}
        {transaction.amount} {transaction.currency}
      </Text>
    </Group>
  );
}
