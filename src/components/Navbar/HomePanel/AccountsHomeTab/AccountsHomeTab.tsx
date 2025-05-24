import { TransactionHistoryItem } from './TransactionHistoryItem/TransactionHistoryItem';
import { transactions } from '@/app/_mock/transactions';

import { Box, Button, Group, ScrollArea, Text } from '@mantine/core';
import styles from './AccountsHomeTab.module.css';
import {
  IconReplace,
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';

export const AccountsHomeTab = () => {
  return (
    <Box className={styles.mainContainer}>
      <Box>
        <Group
          className={styles.balanceContainer}
          w="100%"
          justify="space-between"
          align="center"
          gap={0}
        >
          <Text size="40px" fw={700} mt="lg" ml="lg">
            1.047,53 PLN
          </Text>
          <Button
            leftSection={<IconReplace size={14} />}
            className={styles.changeAccButton}
            size="md"
          >
            Change account
          </Button>
        </Group>
        <Text className={styles.currencyDescription}>Złoty Polski</Text>
        <Group className={styles.actionButtonsGroup}>
          <Button
            className={styles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
          >
            Deposit
          </Button>
          <Button
            className={styles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconTransferOut size={14} />}
          >
            Withdraw
          </Button>
          <Button
            className={styles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconArrowsExchange size={14} />}
          >
            Exchange
          </Button>
          <Button
            className={styles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconSend size={14} />}
          >
            Transfer
          </Button>
        </Group>
      </Box>
      <Box>
        <Text ml="lg" mt="xl" size="14px">
          Transactions
        </Text>
        <ScrollArea h="30vh" mx="lg" mt="md" mb="lg">
          <Box m="lg">
            {' '}
            {transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  );
};
