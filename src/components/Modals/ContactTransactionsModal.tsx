import { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  Group,
  ScrollArea,
  Loader,
  Box,
  CloseButton,
} from '@mantine/core';
import {
  TransactionHistoryItem,
  Transaction,
} from '../MainLayout/HomePanel/AccountsHomeTab/TransactionHistoryItem/TransactionHistoryItem';

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

      try {
        const res = await fetch(
          `/api/transactions?contactUserId=${contactUserId}`
        );

        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        } else {
          console.error('Failed to fetch transactions:', await res.text());
          setTransactions([]);
        }
      } catch (err) {
        console.error('Transaction fetch error:', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContactTransactions();
  }, [opened, contactUserId]);

  return (
    <Modal
      opened={opened}
      title="Transaction history"
      onClose={onClose}
      centered
      size="lg"
      padding="lg"
      radius="md"
      overlayProps={{ blur: 2 }}
    >
      {loading ? (
        <Group justify="center" p="xl">
          <Loader />
        </Group>
      ) : transactions.length === 0 ? (
        <Text ta="center" fw={500} p="xl">
          No transactions found with this contact
        </Text>
      ) : (
        <ScrollArea h="400px" mb="sm">
          <Box p="md">
            {transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction.id}
                transaction={transaction}
                accounts={accounts}
                currentUserId={currentUserId}
              />
            ))}
          </Box>
        </ScrollArea>
      )}
    </Modal>
  );
}
