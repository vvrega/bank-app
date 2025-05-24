import { TransactionHistoryItem } from './TransactionHistoryItem/TransactionHistoryItem';
import { transactions } from '@/app/_mock/transactions';

import { Box, Button, Group, ScrollArea, Text } from '@mantine/core';
import styles from './AccountsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import {
  IconReplace,
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
} from '@tabler/icons-react';

import { useState } from 'react';
import { AccountActionModal } from '@/components/Modals/AccountActionModal';
import { ChangeAccountModal } from '@/components/Modals/ChangeAccountModal';

type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

interface Account {
  currency: Currency;
  balance: number;
}

const initialAccounts: Account[] = [
  { currency: 'PLN', balance: 1047.53 },
  { currency: 'USD', balance: 320.12 },
  { currency: 'EUR', balance: 210.45 },
  { currency: 'GBP', balance: 99.99 },
];

export const AccountsHomeTab = () => {
  const [depositOpened, setDepositOpened] = useState(false);
  const [withdrawOpened, setWithdrawOpened] = useState(false);
  const [changeAccOpened, setChangeAccOpened] = useState(false);

  const [accounts] = useState(initialAccounts);
  const [selectedCurrency, setSelectedCurrency] = useState('PLN');

  const selectedAccount = accounts.find((a) => a.currency === selectedCurrency);

  return (
    <Box
      className={`${sharedStyles.tabsPanelContainer} ${styles.mainContainer}`}
    >
      <Box>
        <Group
          className={styles.balanceContainer}
          w="100%"
          justify="space-between"
          align="center"
          gap={0}
        >
          <Text size="40px" fw={700} mt="lg" ml="lg">
            {selectedAccount
              ? `${selectedAccount.balance.toLocaleString('pl-PL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${selectedAccount.currency}`
              : ''}
          </Text>
          <Button
            leftSection={<IconReplace size={14} />}
            className={sharedStyles.stringButton}
            size="md"
            onClick={() => setChangeAccOpened(true)}
          >
            Change account
          </Button>
        </Group>
        <Text className={styles.currencyDescription}>
          {selectedAccount
            ? {
                PLN: 'Złoty Polski',
                USD: 'US Dollar',
                EUR: 'Euro',
                GBP: 'British Pound',
              }[selectedAccount.currency]
            : ''}
        </Text>
        <Group className={styles.actionButtonsGroup}>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() => setDepositOpened(true)}
          >
            Deposit
          </Button>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconTransferOut size={14} />}
            onClick={() => setWithdrawOpened(true)}
          >
            Withdraw
          </Button>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconArrowsExchange size={14} />}
          >
            Exchange
          </Button>
          <Button
            className={sharedStyles.actionButton}
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
            {transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </Box>
        </ScrollArea>
      </Box>
      <AccountActionModal
        opened={depositOpened}
        onClose={() => setDepositOpened(false)}
        title="Deposit"
        submitLabel="Deposit"
      />
      <AccountActionModal
        opened={withdrawOpened}
        onClose={() => setWithdrawOpened(false)}
        title="Withdraw"
        submitLabel="Withdraw"
      />
      <ChangeAccountModal
        opened={changeAccOpened}
        onClose={() => setChangeAccOpened(false)}
        accounts={accounts}
        selectedCurrency={selectedCurrency}
        onSelect={setSelectedCurrency}
      />
    </Box>
  );
};
