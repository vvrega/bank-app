import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';
import { Transaction, TransactionType } from '@/types/types';

interface Account {
  id: number;
  userId: number;
  currency: string;
  balance: number;
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

  const isExchange = transaction.type === 'Exchange';

  let targetAmount = 0;
  let extractedTargetCurrency = '';

  if (isExchange) {
    if (transaction.description) {
      const match = transaction.description.match(/to ([0-9.]+) ([A-Z]{3})/);
      if (match) {
        if (match[1] && !targetAmount) {
          targetAmount = parseFloat(match[1]);
        }
        if (match[2]) {
          extractedTargetCurrency = match[2];
        }
      }
    }
  }

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
      <Box ml="auto" ta="right">
        {isExchange ? (
          <>
            <Text fw={700} size="sm" c="#c92a2a">
              -{Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
            </Text>
            <Text fw={700} size="sm" c="#228B22">
              +{targetAmount.toFixed(2)} {extractedTargetCurrency}
            </Text>
          </>
        ) : (
          <Text fw={700} size="sm" c={color}>
            {sign}
            {Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
          </Text>
        )}
      </Box>
    </Group>
  );
}
