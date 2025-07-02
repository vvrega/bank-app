import { useState } from 'react';
import { Box, Text, Stack, ScrollArea } from '@mantine/core';
import sharedStyles from '../HomePanel/HomePanel.module.css';
import { useExchangeRates } from '@/hooks/api/useExchangeRates';
import { useAccounts } from '@/hooks/api/useAccounts';
import { useModal } from '@/hooks/useModal';
import { ExchangeModal } from '@/components/Modals/ExchangeModal';
import { Currency } from '@/types/types';
import { ExchangeCard } from './ExchangeCard/ExchangeCard';

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

  return (
    <>
      <Text className={sharedStyles.headerTitle}>Currency Exchange</Text>
      <Box
        className={`${sharedStyles.tabsPanelContainer} ${sharedStyles.stocksPanelContainer}`}
      >
        <ScrollArea h="80vh">
          <Stack gap="md">
            <ExchangeCard
              currency="EUR"
              baseLabel="Euro"
              rates={rates?.quotes}
              ratesLoading={ratesLoading}
              accounts={accounts}
              onExchangeClick={handleExchangeClick}
            />
            <ExchangeCard
              currency="USD"
              baseLabel="US Dollar"
              rates={rates?.quotes}
              ratesLoading={ratesLoading}
              accounts={accounts}
              onExchangeClick={handleExchangeClick}
            />
            <ExchangeCard
              currency="GBP"
              baseLabel="Great Britain Pound"
              rates={rates?.quotes}
              ratesLoading={ratesLoading}
              accounts={accounts}
              onExchangeClick={handleExchangeClick}
            />
          </Stack>
        </ScrollArea>
      </Box>
      <ExchangeModal
        opened={exchangeModal.isOpen}
        onClose={exchangeModal.close}
        fromCurrency={selectedFromCurrency}
        toCurrency={selectedToCurrency}
        onSuccess={refetchAccounts}
        rates={rates?.quotes}
      />
    </>
  );
};
