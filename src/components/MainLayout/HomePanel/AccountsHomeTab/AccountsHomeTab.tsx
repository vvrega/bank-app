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
  const [selectedCurrency, setSelectedCurrency] = useState<
    Currency | undefined
  >(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (
      storedCurrency &&
      ['PLN', 'USD', 'EUR', 'GBP'].includes(storedCurrency)
    ) {
      setSelectedCurrency(storedCurrency as Currency);
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch('http://localhost:4000/api/accounts', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts);
      }
    };
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
    if (accounts.length && selectedCurrency) {
      fetchTransactions();
    }
  }, [accounts, selectedCurrency]);

  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
  };

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
            {selectedAccount
              ? `${Number(selectedAccount.balance).toFixed(2)} ${
                  selectedAccount.currency
                }`
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
        currency={selectedAccount?.currency}
        balance={selectedAccount?.balance}
        onSuccess={() => {
          const fetchAccounts = async () => {
            const res = await fetch('http://localhost:4000/api/accounts', {
              credentials: 'include',
            });
            if (res.ok) {
              const data = await res.json();
              setAccounts(data.accounts);
            }
          };
          fetchAccounts();
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
          const fetchAccounts = async () => {
            const res = await fetch('http://localhost:4000/api/accounts', {
              credentials: 'include',
            });
            if (res.ok) {
              const data = await res.json();
              setAccounts(data.accounts);
            }
          };
          fetchAccounts();
        }}
      />
      <ChangeAccountModal
        opened={changeAccOpened}
        onClose={() => setChangeAccOpened(false)}
        accounts={accounts}
        selectedCurrency={selectedCurrency}
        onSelect={handleSelectCurrency}
      />
    </Box>
  );
};
