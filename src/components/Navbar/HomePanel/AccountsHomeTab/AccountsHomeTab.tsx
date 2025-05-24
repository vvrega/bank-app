import { Button, Group, Text } from '@mantine/core';
import styles from './AccountsHomeTab.module.css';
import {
  IconReplace,
  IconPlus,
  IconTransferOut,
  IconSend,
} from '@tabler/icons-react';

export const AccountsHomeTab = () => {
  return (
    <div className={styles.mainContainer}>
      <Group
        className={styles.balanceContainer}
        w="100%"
        justify="space-between"
        align="center"
        gap={0}
      >
        <Text size="40px" fw={700} mt="lg" ml="lg">
          1.047,53 PLN
        </Text>
        <Button
          leftSection={<IconReplace size={14} />}
          className={styles.changeAccButton}
          size="md"
        >
          Change account
        </Button>
      </Group>
      <Text className={styles.currencyDescription}>Złoty Polski</Text>
      <Group className={styles.actionButtonsGroup}>
        <Button
          className={styles.actionButton}
          variant="light"
          size="xs"
          leftSection={<IconPlus size={14} />}
        >
          Deposit
        </Button>
        <Button
          className={styles.actionButton}
          variant="light"
          size="xs"
          leftSection={<IconTransferOut size={14} />}
        >
          Withdraw
        </Button>
        <Button
          className={styles.actionButton}
          variant="light"
          size="xs"
          leftSection={<IconSend size={14} />}
        >
          Transfer
        </Button>
      </Group>
    </div>
  );
};
