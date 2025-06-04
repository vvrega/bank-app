import { useState } from 'react';
import { Modal, TextInput, Button, Text, Group } from '@mantine/core';

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
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, iban }),
      });
      const data = await res.json();
      if (res.ok) {
        setName('');
        setIban('');
        onContactAdded();
        onClose();
      } else {
        setError(data.error || 'Failed to add contact');
      }
    } catch {
      setError('Failed to add contact');
    } finally {
      setLoading(false);
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
        <Text color="red" size="sm" mb="sm">
          {error}
        </Text>
      )}
      <Group justify="flex-end">
        <Button onClick={handleAdd} loading={loading} disabled={!name || !iban}>
          Add contact
        </Button>
      </Group>
    </Modal>
  );
}
