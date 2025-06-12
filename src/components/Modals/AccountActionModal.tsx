import { useState } from 'react';
import { Modal, Text, Button, Group, TextInput } from '@mantine/core';
import { useDeposit } from '@/hooks/api/useDeposit';
import { useWithdraw } from '@/hooks/api/useWithdraw';

interface AccountActionModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  quickAmounts?: number[];
  currency?: string;
  balance?: number;
  onSuccess?: () => void;
}

export function AccountActionModal({
  opened,
  onClose,
  title,
  submitLabel,
  quickAmounts = [50, 100, 250, 500],
  currency = 'PLN',
  balance = 0,
  onSuccess,
}: AccountActionModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const minAmount =
    currency === 'PLN'
      ? 2
      : currency === 'USD' || currency === 'EUR' || currency === 'GBP'
      ? 0.5
      : 1;
  const maxAmount = submitLabel === 'Withdraw' ? balance : 100000;
  const minAmountText =
    currency === 'PLN'
      ? 'Minimum amount is 2 PLN'
      : `Minimum amount is 0.5 ${currency}`;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(',', '.');
    value = value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      const [int, dec] = value.split('.');
      value = int + '.' + (dec.length > 2 ? dec.slice(0, 2) : dec);
    }
    setAmount(value);
  };

  const handleSubmit = async () => {
    setError(null);
    let value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value)) {
      setError('Enter a valid amount');
      return;
    }
    value = Math.round(value * 100) / 100;

    if (!/^\d+(\.\d{1,2})?$/.test(value.toFixed(2))) {
      setError('Maximum 2 decimal places allowed');
      return;
    }
    if (value < minAmount) {
      setError(`Minimum amount is ${minAmount} ${currency}`);
      return;
    }
    if (value > maxAmount) {
      setError(
        submitLabel === 'Withdraw'
          ? 'Insufficient funds'
          : `Maximum deposit is 100000 ${currency}`
      );
      return;
    }

    try {
      if (submitLabel === 'Withdraw') {
        await withdraw.mutateAsync({ amount: value, currency });
      } else {
        await deposit.mutateAsync({ amount: value, currency });
      }

      setAmount('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Operation failed');
      }
    }
  };

  return (
    <Modal
      title={title}
      opened={opened}
      onClose={onClose}
      centered
      padding="lg"
      radius="md"
      size="sm"
      overlayProps={{ blur: 2 }}
    >
      <TextInput
        label="Amount"
        placeholder={`Enter amount in ${currency}`}
        value={amount}
        onChange={handleAmountChange}
        type="text"
        min={minAmount}
        max={maxAmount}
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
            onClick={() => setAmount(val.toFixed(2))}
          >
            {val.toFixed(2)} {currency}
          </Button>
        ))}
      </Group>
      {error && (
        <Text c="red" size="sm" mb="sm">
          {error}
        </Text>
      )}
      <Button
        fullWidth
        onClick={handleSubmit}
        loading={withdraw.isPending || deposit.isPending}
      >
        {submitLabel}
      </Button>
    </Modal>
  );
}
