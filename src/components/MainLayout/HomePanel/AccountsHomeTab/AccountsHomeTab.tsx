import { useEffect, useState } from 'react';
import { TransactionHistoryItem } from './TransactionHistoryItem/TransactionHistoryItem';
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
import { AccountActionModal } from '@/components/Modals/AccountActionModal';
import { ChangeAccountModal } from '@/components/Modals/ChangeAccountModal';

export type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

interface Account {
  id: number;
  currency: Currency;
  balance: number;
}

export const AccountsHomeTab = () => {
  const [depositOpened, setDepositOpened] = useState(false);
  const [withdrawOpened, setWithdrawOpened] = useState(false);
  const [changeAccOpened, setChangeAccOpened] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PLN');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch('http://localhost:4000/api/accounts', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts);
        if (data.accounts.length && !accounts.length) {
          setSelectedCurrency(data.accounts[0].currency);
        }
      }
    };
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const selectedAccount = accounts.find(
        (a) => a.currency === selectedCurrency
      );
      if (selectedAccount) {
        const res = await fetch(
          `http://localhost:4000/api/accounts/${selectedAccount.id}/transactions`,
          { credentials: 'include' }
        );
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }
      }
    };
    if (accounts.length) {
      fetchTransactions();
    }
  }, [accounts, selectedCurrency]);

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
        <ScrollArea h="30vh" mb="sm">
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
