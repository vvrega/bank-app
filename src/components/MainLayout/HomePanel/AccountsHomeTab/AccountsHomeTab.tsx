import { useEffect, useState } from 'react';
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
} from '@tabler/icons-react';
import { AccountActionModal } from '@/components/Modals/AccountActionModal';
import { ChangeAccountModal } from '@/components/Modals/ChangeAccountModal';
import { TransferModal } from '@/components/Modals/TransferModal';
import { useSession } from 'next-auth/react';

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

  const { data: accounts = [], refetch: refetchAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
  });

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    enabled: !!accounts.length,
  });

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
    <Box className={styles.mainContainer}>
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
      <Box>
        <Text ml="lg" mt="xl" size="14px">
          Transactions
        </Text>
        <ScrollArea h="30vh" mb="sm">
          <Box m="lg">
            {transactions.map((transaction: any) => (
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
