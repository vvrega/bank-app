import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @param initialState Initial open state of the modal
 * @returns Object containing isOpen state and functions to control the modal
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  // Używam useCallback, aby zapobiec niepotrzebnym re-renderom
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
