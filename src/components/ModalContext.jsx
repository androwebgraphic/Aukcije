import { createContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    poruka: '',
    onConfirm: null,
    radi: false,
  });

  // Resolver za potvrdi() - null kad modal nije otvoren preko Promise API-ja.
  const cekanje = useRef(null);

  function zatvori(rezultat) {
    const razrijesi = cekanje.current;
    cekanje.current = null;
    if (razrijesi) razrijesi(rezultat);
    setModal({ show: false, poruka: '', onConfirm: null, radi: false });
  }

  // Stari, callback API: showModal('poruka', async () => { ... })
  function showModal(poruka, onConfirm = null) {
    setModal({ show: true, poruka, onConfirm, radi: false });
  }

  // Novi, Promise API za forme: if (!(await potvrdi('...'))) return
  function potvrdi(poruka) {
    return new Promise((razrijesi) => {
      cekanje.current = razrijesi;
      setModal({ show: true, poruka, onConfirm: null, radi: false });
    });
  }

  function hideModal() {
    zatvori(false);
  }

  const value = {
    modal,
    showModal,
    hideModal,
    potvrdi,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal
        show={modal.show}
        onHide={() => {
          if (!modal.radi) hideModal();
        }}
        backdrop={modal.radi ? 'static' : true}
        keyboard={!modal.radi}
        centered
      >
        <Modal.Header closeButton={!modal.radi}>
          <Modal.Title>Potvrda</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.poruka}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal} disabled={modal.radi}>
            Odustani
          </Button>
          <Button
            variant="danger"
            disabled={modal.radi}
            onClick={async () => {
              if (modal.onConfirm) {
                setModal(m => ({ ...m, radi: true }));
                try {
                  await modal.onConfirm();
                } catch (err) {
                  console.error('Greška u modalnoj akciji:', err);
                } finally {
                  zatvori(true);
                }
              } else {
                zatvori(true);
              }
            }}
          >
            Potvrdi
          </Button>
        </Modal.Footer>
      </Modal>
    </ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
