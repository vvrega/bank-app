import { useState, useEffect } from 'react';
import { Modal, Text, Button, Group, TextInput, Paper } from '@mantine/core';
import { Account } from '@/types/types';
import { useTransfer } from '@/hooks/api/useTransfer';

interface TransferModalProps {
  opened: boolean;
  onClose: () => void;
  accounts: Account[];
  onSuccess?: () => void;
  initialName?: string;
  initialIban?: string;
}

export function TransferModal({
  opened,
  onClose,
  accounts,
  onSuccess,
  initialName = '',
  initialIban = '',
}: TransferModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    accounts[0]?.currency || 'PLN'
  );
  const [amount, setAmount] = useState('');
  const [iban, setIban] = useState(initialIban);
  const [title, setTitle] = useState('');
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const transfer = useTransfer();

  useEffect(() => {
    if (opened) {
      setIban(initialIban || '');
      setName(initialName || '');
      setAmount('');
      setTitle('');
      setError(null);
    }
  }, [opened, initialIban, initialName]);

  const selectedAccount = accounts.find((a) => a.currency === selectedCurrency);

  const handleTransfer = async () => {
    setError(null);
    const value = Math.round(Number(amount.replace(',', '.')) * 100) / 100;

    if (!selectedAccount) {
      setError('Select account');
      return;
    }
    if (!iban || !title || !name) {
      setError('Fill all fields');
      return;
    }
    if (isNaN(value) || value <= 0) {
      setError('Enter valid amount');
      return;
    }
    if (value > selectedAccount.balance) {
      setError('Insufficient funds');
      return;
    }

    try {
      await transfer.mutateAsync({
        fromCurrency: selectedCurrency,
        amount: value,
        iban,
        title,
        name,
      });

      setAmount('');
      setIban(initialIban || '');
      setTitle('');
      setName(initialName || '');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Transfer failed');
      }
    }
  };

  return (
    <Modal
      opened={opened}
      title="Transfer"
      onClose={onClose}
      centered
      padding="lg"
      radius="md"
      size="sm"
      overlayProps={{ blur: 2 }}
    >
      <Text fw={500} mb="xs">
        Select account
      </Text>
      <Group mb="md">
        {accounts.map((acc) => (
          <Paper
            key={acc.currency}
            withBorder
            radius="md"
            p="xs"
            style={{
              cursor: 'pointer',
              background:
                selectedCurrency === acc.currency ? '#f1f3f5' : 'white',
              borderColor:
                selectedCurrency === acc.currency ? '#4263eb' : '#dee2e6',
              borderWidth: selectedCurrency === acc.currency ? 2 : 1,
            }}
            onClick={() => setSelectedCurrency(acc.currency)}
          >
            <Text fw={500}>{acc.currency}</Text>
            <Text size="xs">
              {Number(acc.balance).toFixed(2)} {acc.currency}
            </Text>
          </Paper>
        ))}
      </Group>
      <TextInput
        label="Recipient IBAN"
        value={iban}
        onChange={(e) => setIban(e.currentTarget.value)}
        mb="sm"
      />
      <TextInput
        label="Recipient name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        mb="sm"
      />
      <TextInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        mb="sm"
      />
      <TextInput
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.currentTarget.value.replace(',', '.'))}
        type="number"
        min={0.01}
        mb="sm"
      />
      {error && (
        <Text c="red" size="sm" mb="sm">
          {error}
        </Text>
      )}
      <Button fullWidth onClick={handleTransfer} loading={transfer.isPending}>
        Transfer
      </Button>
    </Modal>
  );
}
