'use client';

import { useState } from 'react';
import {
  Box,
  Text,
  Group,
  Button,
  Paper,
  Loader,
  SimpleGrid,
} from '@mantine/core';
import sharedStyles from '../HomePanel/HomePanel.module.css';
import { useExchangeRates } from '@/hooks/api/useExchangeRates';
import { useAccounts } from '@/hooks/api/useAccounts';
import { useModal } from '@/hooks/useModal';
import { ExchangeModal } from '@/components/Modals/ExchangeModal';
import { Currency } from '@/types/types';

export const StocksPanel = () => {
  const { data: rates, isLoading: ratesLoading } = useExchangeRates();
  const { data: accounts = [], refetch: refetchAccounts } = useAccounts();
  const exchangeModal = useModal();
  const [selectedFromCurrency, setSelectedFromCurrency] =
    useState<Currency | null>(null);
  const [selectedToCurrency, setSelectedToCurrency] = useState<Currency | null>(
    null
  );

  const handleExchangeClick = (from: Currency, to: Currency) => {
    setSelectedFromCurrency(from);
    setSelectedToCurrency(to);
    exchangeModal.open();
  };

  const renderExchangeCard = (currency: Currency, baseLabel: string) => {
    const invertedRate = rates?.quotes
      ? 1 / rates.quotes[`PLN${currency}` as keyof typeof rates.quotes]
      : null;

    const plnAccount = accounts.find((acc) => acc.currency === 'PLN');
    const currencyAccount = accounts.find((acc) => acc.currency === currency);

    return (
      <Paper withBorder p="md" radius="md" key={currency}>
        <Group justify="space-between" mb="xs">
          <Text fw={700} size="lg">
            {currency}
          </Text>
          <Text c="dimmed" size="sm">
            {baseLabel}
          </Text>
        </Group>

        {ratesLoading ? (
          <Group justify="center" my="md">
            <Loader size="sm" />
          </Group>
        ) : (
          <Text size="xl" fw={500} mb="md">
            1 PLN = {invertedRate ? invertedRate.toFixed(4) : '?'} {currency}
          </Text>
        )}

        <Group grow>
          <Button
            variant="light"
            onClick={() => handleExchangeClick('PLN', currency)}
            disabled={!plnAccount || plnAccount.balance <= 0}
          >
            PLN → {currency}
          </Button>
          <Button
            variant="light"
            onClick={() => handleExchangeClick(currency, 'PLN')}
            disabled={!currencyAccount || currencyAccount.balance <= 0}
          >
            {currency} → PLN
          </Button>
        </Group>
      </Paper>
    );
  };

  return (
    <>
      <Text className={sharedStyles.headerTitle}>Currency Exchange</Text>
      <Box className={sharedStyles.tabsPanelContainer}>
        <Text size="lg" fw={500} mb="md">
          Current Exchange Rates
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {renderExchangeCard('EUR', 'Euro')}
          {renderExchangeCard('USD', 'US Dollar')}
          {renderExchangeCard('GBP', 'British Pound')}
        </SimpleGrid>

        <ExchangeModal
          opened={exchangeModal.isOpen}
          onClose={exchangeModal.close}
          fromCurrency={selectedFromCurrency}
          toCurrency={selectedToCurrency}
          onSuccess={refetchAccounts}
          rates={rates?.quotes}
        />
      </Box>
    </>
  );
};
