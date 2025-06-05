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
import { TransferModal } from '@/components/Modals/TransferModal';

export type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

interface Account {
  id: number;
  currency: Currency;
  balance: number;
  userId: number;
}

export const AccountsHomeTab = () => {
  const [depositOpened, setDepositOpened] = useState(false);
  const [withdrawOpened, setWithdrawOpened] = useState(false);
  const [changeAccOpened, setChangeAccOpened] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<
    Currency | undefined
  >(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transferOpened, setTransferOpened] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (
      storedCurrency &&
      ['PLN', 'USD', 'EUR', 'GBP'].includes(storedCurrency)
    ) {
      setSelectedCurrency(storedCurrency as Currency);
    }
  }, []);

  const fetchAccounts = async () => {
    const res = await fetch('http://localhost:4000/api/accounts', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setAccounts(data.accounts);
      if (data.accounts.length > 0) {
        setUserId(data.accounts[0].userId);
      }
    }
  };

  const fetchTransactions = async () => {
    const res = await fetch('http://localhost:4000/api/transactions', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions);
    } else {
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  useEffect(() => {
    fetchTransactions();
  }, [accounts.length]);

  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
  };

  useEffect(() => {
    if (accounts.length > 0 && accounts[0].userId) {
      setCurrentUserId(accounts[0].userId);
    } else {
      fetch('http://localhost:4000/api/me', { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.user && data.user.id) {
            setCurrentUserId(data.user.id);
          }
        });
    }
  }, [accounts]);

  const selectedAccount = accounts.find((a) => a.currency === selectedCurrency);

  if (!selectedCurrency) return null;

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
            {userId !== null &&
              currentUserId !== null &&
              transactions.map((transaction) => (
                <TransactionHistoryItem
                  key={transaction.id}
                  transaction={transaction}
                  accounts={accounts}
                  currentUserId={currentUserId}
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
          fetchAccounts();
          fetchTransactions();
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
          fetchAccounts();
          fetchTransactions();
        }}
      />
      <ChangeAccountModal
        opened={changeAccOpened}
        onClose={() => setChangeAccOpened(false)}
        accounts={accounts}
        selectedCurrency={selectedCurrency}
        onSelect={handleSelectCurrency}
      />
      <TransferModal
        opened={transferOpened}
        onClose={() => setTransferOpened(false)}
        accounts={accounts}
        onSuccess={() => {
          fetchAccounts();
          fetchTransactions();
        }}
      />
    </Box>
  );
};
