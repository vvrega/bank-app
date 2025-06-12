import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransactionHistoryItem } from './TransactionHistoryItem/TransactionHistoryItem';
import { Box, Button, Group, ScrollArea, Text } from '@mantine/core';
import styles from './AccountsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconArrowsExchange,
  IconReplace,
} from '@tabler/icons-react';
import { AccountActionModal } from '@/components/Modals/AccountActionModal';
import { ChangeAccountModal } from '@/components/Modals/ChangeAccountModal';
import { TransferModal } from '@/components/Modals/TransferModal';
import { useSession } from 'next-auth/react';

import { Transaction } from './TransactionHistoryItem/TransactionHistoryItem';

export type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

interface Account {
  id: number;
  name: string;
  balance: number;
  currency: Currency;
  userId: number;
}

export const AccountsHomeTab = () => {
  const [depositOpened, setDepositOpened] = useState(false);
  const [withdrawOpened, setWithdrawOpened] = useState(false);
  const [changeAccOpened, setChangeAccOpened] = useState(false);
  const [transferOpened, setTransferOpened] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<
    Currency | undefined
  >(undefined);
  const { data: session } = useSession();

  const { data: accountsData = [], refetch: refetchAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
  });

  const {
    data: transactionsData = { transactions: [] },
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    enabled: !!accountsData.length,
  });

  const transactions = Array.isArray(transactionsData.transactions)
    ? transactionsData.transactions
    : [];

  const accounts = useMemo(
    () => (Array.isArray(accountsData) ? accountsData : []),
    [accountsData]
  );

  useEffect(() => {
    if (!selectedCurrency && accounts.length) {
      setSelectedCurrency(accounts[0].currency);
      localStorage.setItem('selectedCurrency', accounts[0].currency);
    }
  }, [accounts, selectedCurrency]);

  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem('selectedCurrency', selectedCurrency);
    }
  }, [selectedCurrency]);

  const selectedAccount = accounts.find(
    (acc: Account) => acc.currency === selectedCurrency
  );

  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

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
            {selectedAccount ? (
              <>
                {Number(selectedAccount.balance).toFixed(2)}{' '}
                <span style={{ fontSize: '24px' }}>
                  {selectedAccount.currency}
                </span>
              </>
            ) : (
              ''
            )}
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
                PLN: 'Polish Zloty',
                USD: 'US Dollar',
                EUR: 'Euro',
                GBP: 'British Pound',
              }[selectedAccount.currency as Currency]
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
            onClick={() => setTransferOpened(true)}
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
            {transactions.map((transaction: Transaction) => (
              <TransactionHistoryItem
                key={transaction.id}
                transaction={transaction}
                accounts={accounts as Account[]}
                currentUserId={Number(session?.user?.id) || 0}
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
        currency={selectedAccount?.currency}
        balance={selectedAccount?.balance}
        onSuccess={() => {
          refetchAccounts();
          refetchTransactions();
        }}
      />
      <AccountActionModal
        opened={withdrawOpened}
        onClose={() => setWithdrawOpened(false)}
        title="Withdraw"
        submitLabel="Withdraw"
        currency={selectedAccount?.currency}
        balance={selectedAccount?.balance}
        onSuccess={() => {
          refetchAccounts();
          refetchTransactions();
        }}
      />
      <ChangeAccountModal
        opened={changeAccOpened}
        onClose={() => setChangeAccOpened(false)}
        accounts={accounts}
        selectedCurrency={selectedCurrency || 'PLN'}
        onSelect={handleSelectCurrency}
      />
      <TransferModal
        opened={transferOpened}
        onClose={() => setTransferOpened(false)}
        accounts={accounts}
        onSuccess={() => {
          refetchAccounts();
          refetchTransactions();
        }}
      />
    </Box>
  );
};
