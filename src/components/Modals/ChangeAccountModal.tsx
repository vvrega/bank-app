import {
  Modal,
  Text,
  Group,
  Button,
  Box,
  CloseButton,
  Paper,
} from '@mantine/core';

import type { Currency } from '@/components/MainLayout/HomePanel/AccountsHomeTab/AccountsHomeTab';

interface Account {
  currency: 'PLN' | 'USD' | 'EUR' | 'GBP';
  balance: number;
}

interface ChangeAccountModalProps {
  opened: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
}

export function ChangeAccountModal({
  opened,
  onClose,
  accounts,
  selectedCurrency,
  onSelect,
}: ChangeAccountModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      padding="lg"
      radius="md"
      size="xs"
      overlayProps={{ blur: 2 }}
    >
      <Group justify="space-between" align="center" mb="md">
        <Text size="lg" fw={700}>
          Change account
        </Text>
        <CloseButton onClick={onClose} />
      </Group>
      <Box>
        {accounts.map((acc) => (
          <Paper
            key={acc.currency}
            withBorder
            radius="md"
            p="md"
            mb="sm"
            style={{
              cursor: 'pointer',
              background:
                selectedCurrency === acc.currency ? '#f1f3f5' : 'white',
              borderColor:
                selectedCurrency === acc.currency ? '#4263eb' : '#dee2e6',
              borderWidth: selectedCurrency === acc.currency ? 2 : 1,
            }}
            onClick={() => {
              onSelect(acc.currency);
              onClose();
            }}
          >
            <Group justify="space-between">
              <Text fw={500}>{acc.currency}</Text>
              <Text fw={700}>
                {acc.balance.toLocaleString('pl-PL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {acc.currency}
              </Text>
            </Group>
          </Paper>
        ))}
      </Box>
    </Modal>
  );
}
