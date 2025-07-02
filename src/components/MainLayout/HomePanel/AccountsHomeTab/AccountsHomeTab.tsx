import { useEffect, useState, useMemo } from 'react';
import { TransactionHistoryItem } from './TransactionHistoryItem/TransactionHistoryItem';
import { Box, Button, Group, ScrollArea, Text } from '@mantine/core';
import styles from './AccountsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import {
  IconPlus,
  IconTransferOut,
  IconSend,
  IconReplace,
} from '@tabler/icons-react';
import { AccountActionModal } from '@/components/Modals/AccountActionModal';
import { ChangeAccountModal } from '@/components/Modals/ChangeAccountModal';
import { TransferModal } from '@/components/Modals/TransferModal';
import { useSession } from 'next-auth/react';
import { useModal } from '@/hooks/useModal';
import { useAccounts } from '@/hooks/api/useAccounts';
import { useTransactions } from '@/hooks/api/useTransactions';
import { Currency, Account, Transaction } from '@/types/types';

export const AccountsHomeTab = () => {
  const { data: session } = useSession();

  const depositModal = useModal();
  const withdrawModal = useModal();
  const changeAccountModal = useModal();
  const transferModal = useModal();

  const [selectedCurrency, setSelectedCurrency] = useState<
    Currency | undefined
  >(undefined);

  const { data: accountsData = [], refetch: refetchAccounts } = useAccounts();

  const {
    data: transactionsData = { transactions: [] },
    refetch: refetchTransactions,
  } = useTransactions(!!accountsData.length);

  const transactions = Array.isArray(transactionsData.transactions)
    ? transactionsData.transactions
    : [];

  const accounts = useMemo(
    () => (Array.isArray(accountsData) ? accountsData : []),
    [accountsData]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem(
        'selectedCurrency'
      ) as Currency | null;

      if (savedCurrency) {
        setSelectedCurrency(savedCurrency as Currency);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedCurrency && accounts.length) {
      setSelectedCurrency(accounts[0].currency as Currency);
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

  const handleSuccess = () => {
    refetchAccounts();
    refetchTransactions();
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
            onClick={changeAccountModal.open}
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
                GBP: 'Great Britain Pound',
              }[selectedAccount.currency as Currency]
            : ''}
        </Text>
        <Group className={styles.actionButtonsGroup}>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={depositModal.open}
          >
            Deposit
          </Button>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconTransferOut size={14} />}
            onClick={withdrawModal.open}
          >
            Withdraw
          </Button>
          <Button
            className={sharedStyles.actionButton}
            variant="light"
            size="xs"
            leftSection={<IconSend size={14} />}
            onClick={transferModal.open}
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
                accounts={accounts}
                currentUserId={Number(session?.user?.id) || 0}
              />
            ))}
          </Box>
        </ScrollArea>
      </Box>

      <AccountActionModal
        opened={depositModal.isOpen}
        onClose={depositModal.close}
        title="Deposit"
        submitLabel="Deposit"
        currency={selectedAccount?.currency}
        balance={selectedAccount?.balance}
        onSuccess={handleSuccess}
      />
      <AccountActionModal
        opened={withdrawModal.isOpen}
        onClose={withdrawModal.close}
        title="Withdraw"
        submitLabel="Withdraw"
        currency={selectedAccount?.currency}
        balance={selectedAccount?.balance}
        onSuccess={handleSuccess}
      />
      <ChangeAccountModal
        opened={changeAccountModal.isOpen}
        onClose={changeAccountModal.close}
        accounts={accounts}
        selectedCurrency={selectedCurrency || 'PLN'}
        onSelect={handleSelectCurrency}
      />
      <TransferModal
        opened={transferModal.isOpen}
        onClose={transferModal.close}
        accounts={accounts}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};
