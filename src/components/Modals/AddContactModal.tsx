import { useState } from 'react';
import { Modal, TextInput, Button, Text, Group } from '@mantine/core';
import { useAddContact } from '@/hooks/api/useAddContact';

interface AddContactModalProps {
  opened: boolean;
  onClose: () => void;
  onContactAdded: () => void;
}

export function AddContactModal({
  opened,
  onClose,
  onContactAdded,
}: AddContactModalProps) {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addContact = useAddContact();

  const handleAdd = async () => {
    setError(null);

    if (!name || !iban) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await addContact.mutateAsync({ name, iban });
      setName('');
      setIban('');
      onContactAdded();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add contact');
      }
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add new contact" centered>
      <TextInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        mb="md"
        required
      />
      <TextInput
        label="IBAN number"
        value={iban}
        onChange={(e) => setIban(e.currentTarget.value)}
        mb="md"
        required
      />
      {error && (
        <Text c="red" size="sm" mb="sm">
          {error}
        </Text>
      )}
      <Group justify="flex-end">
        <Button
          onClick={handleAdd}
          loading={addContact.isPending}
          disabled={!name || !iban}
        >
          Add contact
        </Button>
      </Group>
    </Modal>
  );
}
