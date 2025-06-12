import { Modal, Text, Paper, Group, Box } from '@mantine/core';

type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';

interface Account {
  currency: Currency;
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
      title="Change account"
      onClose={onClose}
      centered
      padding="lg"
      radius="md"
      size="xs"
      overlayProps={{ blur: 2 }}
    >
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
                {Number(acc.balance).toFixed(2)} {acc.currency}
              </Text>
            </Group>
          </Paper>
        ))}
      </Box>
    </Modal>
  );
}
