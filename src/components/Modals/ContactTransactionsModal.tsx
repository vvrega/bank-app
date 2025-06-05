import { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  Group,
  Box,
  ScrollArea,
  Loader,
  CloseButton,
} from '@mantine/core';
import {
  TransactionHistoryItem,
  Transaction,
} from '@/components/MainLayout/HomePanel/AccountsHomeTab/TransactionHistoryItem/TransactionHistoryItem';

interface Account {
  id: number;
  userId: number;
  currency: string;
  balance: number;
}

interface ContactTransactionsModalProps {
  opened: boolean;
  onClose: () => void;
  contactUserId: number;
  accounts: Account[];
  currentUserId: number;
}

export function ContactTransactionsModal({
  opened,
  onClose,
  contactUserId,
  accounts,
  currentUserId,
}: ContactTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContactTransactions = async () => {
      if (!opened) return;
      setLoading(true);
      const res = await fetch(
        'http://localhost:4000/api/transactions?contactUserId=' + contactUserId,
        { credentials: 'include' }
      );
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
      setLoading(false);
    };
    fetchContactTransactions();
  }, [opened, contactUserId]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      padding="lg"
      radius="md"
      size="lg"
      overlayProps={{ blur: 2 }}
    >
      <Group justify="space-between" align="center" mb="md">
        <Text size="lg" fw={700}>
          Transactions with this contact
        </Text>
        <CloseButton onClick={onClose} />
      </Group>
      <ScrollArea h={400}>
        <Box>
          {loading ? (
            <Loader />
          ) : transactions.length === 0 ? (
            <Text size="sm" c="dimmed">
              No transactions found.
            </Text>
          ) : (
            transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction.id}
                transaction={transaction}
                accounts={accounts}
                currentUserId={currentUserId}
              />
            ))
          )}
        </Box>
      </ScrollArea>
    </Modal>
  );
}
