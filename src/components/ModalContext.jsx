import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    poruka: '',
    onConfirm: null,
  });

  function showModal(poruka, onConfirm = null) {
    setModal({
      show: true,
      poruka,
      onConfirm,
    });
  }

  function hideModal() {
    setModal({
      show: false,
      poruka: '',
      onConfirm: null,
    });
  }

  const value = {
    modal,
    showModal,
    hideModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};