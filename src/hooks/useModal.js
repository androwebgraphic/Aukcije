import { useContext } from 'react';
import { ModalContext } from '../components/ModalContext';

export default function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal se mora koristiti unutar ModalProvidera-a');
  }

  return context;
}