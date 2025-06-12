import { Modal, Text, Group, ScrollArea, Loader, Box } from '@mantine/core';
import { Transaction, Account } from '@/types/types';
import { TransactionHistoryItem } from '../MainLayout/HomePanel/AccountsHomeTab/TransactionHistoryItem/TransactionHistoryItem';
import { useContactTransactions } from '@/hooks/api/useTransactions';

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
  const { data, isLoading } = useContactTransactions(contactUserId, opened);
  const transactions = data?.transactions || [];

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
      {isLoading ? (
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
