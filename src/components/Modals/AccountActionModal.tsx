import { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  TextInput,
  CloseButton,
} from '@mantine/core';

interface AccountActionModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  quickAmounts?: number[];
  minAmount?: number;
  minAmountText?: string;
}

export function AccountActionModal({
  opened,
  onClose,
  title,
  submitLabel,
  quickAmounts = [50, 100, 250, 500],
  minAmount = 2,
  minAmountText = 'Minimum amount is 2 PLN',
}: AccountActionModalProps) {
  const [amount, setAmount] = useState('');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      padding="lg"
      radius="md"
      size="sm"
      overlayProps={{ blur: 2 }}
    >
      <Group justify="space-between" align="center" mb="md">
        <Text size="lg" fw={700}>
          {title}
        </Text>
        <CloseButton onClick={onClose} />
      </Group>
      <TextInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.currentTarget.value)}
        type="number"
        min={minAmount}
        mb={4}
      />
      <Text size="xs" c="dimmed" mb="sm">
        {minAmountText}
      </Text>
      <Group mb="md">
        {quickAmounts.map((val) => (
          <Button
            key={val}
            variant="light"
            size="xs"
            onClick={() => setAmount(val.toString())}
          >
            {val} PLN
          </Button>
        ))}
      </Group>
      <Button fullWidth>{submitLabel}</Button>
    </Modal>
  );
}
