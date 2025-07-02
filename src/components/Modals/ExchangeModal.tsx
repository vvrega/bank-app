import { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  NumberInput,
  Select,
  Paper,
  Box,
  Divider,
} from '@mantine/core';
import { Currency } from '@/types/types';
import { useAccounts } from '@/hooks/api/useAccounts';
import { useExchange } from '@/hooks/api/useExchange';

interface ExchangeRates {
  PLNEUR: number;
  PLNUSD: number;
  PLNGBP: number;
}

interface ExchangeModalProps {
  opened: boolean;
  onClose: () => void;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  rates?: ExchangeRates;
  onSuccess?: () => void;
}

export function ExchangeModal({
  opened,
  onClose,
  fromCurrency = null,
  toCurrency = null,
  rates,
  onSuccess,
}: ExchangeModalProps) {
  const { data: accounts = [] } = useAccounts();
  const exchange = useExchange();

  const [amount, setAmount] = useState<string>('');
  const [from, setFrom] = useState<Currency | null>(fromCurrency);
  const [to, setTo] = useState<Currency | null>(toCurrency);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (opened) {
      setFrom(fromCurrency);
      setTo(toCurrency);
      setAmount('');
      setError(null);
    }
  }, [opened, fromCurrency, toCurrency]);

  const fromAccount = accounts.find((acc) => acc.currency === from);

  const getExchangeRate = () => {
    if (!from || !to || !rates) return null;

    if (from === 'PLN') {
      return rates[`PLN${to}` as keyof typeof rates];
    } else if (to === 'PLN') {
      return 1 / rates[`PLN${from}` as keyof typeof rates];
    }

    // Cross rate calculation (non-PLN to non-PLN)
    const fromRate = rates[`PLN${from}` as keyof typeof rates];
    const toRate = rates[`PLN${to}` as keyof typeof rates];
    return toRate / fromRate;
  };

  const exchangeRate = getExchangeRate();
  const resultAmount =
    exchangeRate && amount
      ? (parseFloat(amount) * exchangeRate).toFixed(2)
      : '0.00';

  const currencyOptions = accounts
    .filter(
      (acc) =>
        acc &&
        typeof Number(acc.balance) === 'number' &&
        Number(acc.balance) > 0
    )
    .map((acc) => ({
      value: acc.currency,
      label: `${acc.currency} (${Number(acc.balance).toFixed(2)})`,
    }));

  const targetCurrencyOptions = accounts
    .filter((acc) => acc.currency !== from)
    .map((acc) => ({
      value: acc.currency,
      label: acc.currency,
    }));

  const handleExchange = async () => {
    setError(null);
    if (!from || !to) {
      setError('Please select both currencies');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!fromAccount || parseFloat(amount) > fromAccount.balance) {
      setError('Insufficient funds');
      return;
    }

    if (from === to) {
      setError('Cannot exchange to the same currency');
      return;
    }

    try {
      await exchange.mutateAsync({
        fromCurrency: from,
        toCurrency: to,
        amount: parseFloat(amount),
      });

      setAmount('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Exchange failed');
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Currency Exchange"
      withCloseButton
      centered
      padding="lg"
      radius="md"
      size="md"
      overlayProps={{ blur: 2 }}
    >
      <Box>
        <Group mb="md">
          <Select
            label="From Currency"
            placeholder="Select currency"
            value={from}
            onChange={(val) => setFrom(val as Currency)}
            data={currencyOptions}
            style={{ flex: 1 }}
            required
          />
          <Select
            label="To Currency"
            placeholder="Select target currency"
            value={to}
            onChange={(val) => setTo(val as Currency)}
            data={targetCurrencyOptions}
            style={{ flex: 1 }}
            required
          />
        </Group>

        <NumberInput
          label="Amount"
          value={amount}
          onChange={(val) => setAmount(val?.toString() || '')}
          min={0}
          step={0.01}
          required
          mb="md"
        />

        {from && to && exchangeRate && (
          <Paper withBorder p="md" radius="md" mb="md">
            <Text size="sm" c="dimmed" mb="xs">
              Exchange Rate
            </Text>
            <Text size="md" fw={500}>
              1 {from} = {exchangeRate.toFixed(4)} {to}
            </Text>
            <Divider my="xs" />
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                You&apos;ll Get
              </Text>
              <Text size="xl" fw={700}>
                {resultAmount} {to}
              </Text>
            </Group>
          </Paper>
        )}

        {error && (
          <Text c="red" size="sm" mb="md">
            {error}
          </Text>
        )}

        <Group justify="flex-end">
          <Button
            onClick={handleExchange}
            loading={exchange.isPending}
            disabled={!from || !to || !amount || parseFloat(amount) <= 0}
          >
            Exchange
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
