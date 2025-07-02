import { Button, Group, Loader, Paper, Text, Flex, Stack } from '@mantine/core';
import { IconArrowsExchange } from '@tabler/icons-react';
import { Currency } from '@/types/types';
import { Account } from '@/types/types';

interface ExchangeCardProps {
  currency: Currency;
  baseLabel: string;
  rates?: {
    [key: string]: number;
  };
  ratesLoading: boolean;
  accounts: Account[];
  onExchangeClick: (from: Currency, to: Currency) => void;
}

export const ExchangeCard = ({
  currency,
  baseLabel,
  rates,
  ratesLoading,
  accounts,
  onExchangeClick,
}: ExchangeCardProps) => {
  const invertedRate = rates
    ? 1 / rates[`PLN${currency}` as keyof typeof rates]
    : null;

  const plnAccount = accounts.find((acc) => acc.currency === 'PLN');
  const currencyAccount = accounts.find((acc) => acc.currency === currency);

  const accountBalance = currencyAccount ? Number(currencyAccount.balance) : 0;
  const accountValueInPLN = invertedRate ? accountBalance * invertedRate : 0;

  const canExchange =
    (plnAccount && plnAccount.balance > 0) ||
    (currencyAccount && currencyAccount.balance > 0);

  return (
    <Paper withBorder p="md" radius="md">
      <Flex align="flex-start" direction="column">
        <Stack gap={0}>
          <Text fw={700} size="28px" mb="md">
            {baseLabel}
          </Text>

          <Group gap={12}>
            <Text fw={600} size="24px">
              {accountBalance.toFixed(2)} {currency}
            </Text>
            <Text size="16px" c="dimmed">
              ≈ {accountValueInPLN.toFixed(2)} PLN
            </Text>
          </Group>

          <Text fw={700} mt="xl" size="18px">
            Exchange rate:
          </Text>
          {ratesLoading ? (
            <Loader size="sm" />
          ) : (
            <Text size="md" fw={500} c="blue">
              {invertedRate ? invertedRate.toFixed(4) : '?'} PLN
            </Text>
          )}
        </Stack>

        <Button
          variant="light"
          fullWidth
          mt="lg"
          leftSection={<IconArrowsExchange size={16} />}
          onClick={() =>
            onExchangeClick(
              canExchange && currencyAccount?.balance ? currency : 'PLN',
              canExchange && currencyAccount?.balance ? 'PLN' : currency
            )
          }
          disabled={!canExchange}
        >
          Exchange
        </Button>
      </Flex>
    </Paper>
  );
};
