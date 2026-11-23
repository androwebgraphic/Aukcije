import { Modal, Button } from 'react-bootstrap';
import { BiQuestionMark } from 'react-icons/bi';
import useModal from '../hooks/useModal';

export default function PotvrdaModal() {
  const { modal, hideModal } = useModal();

  function handlePotvrdi() {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    hideModal();
  }

  return (
    <Modal 
      show={modal.show} 
      onHide={hideModal} 
      centered 
      backdrop='static'
      contentClassName='border-0 shadow-lg rounded-4'
    >
      <Modal.Header closeButton className='border-0 pb-0 pt-4 px-4'>
        <div className='d-flex align-items-center gap-3'>
          <div 
            className='d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-25 text-warning' 
            style={{ width: '42px', height: '42px' }}
            aria-hidden='true'
          >
            <BiQuestionMark size={26} aria-hidden='true' />
          </div>
          <Modal.Title className='fs-5 fw-bold mb-0'>
            Potvrda radnje
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body className='text-secondary fs-6 py-3 px-4'>
        {modal.poruka}
      </Modal.Body>

      <Modal.Footer className='border-0 pt-2 pb-4 px-4 gap-2'>
        <Button 
          variant='light' 
          onClick={hideModal}
          className='px-4 fw-medium border'
        >
          Odustani
        </Button>
        <Button 
          variant='danger' 
          onClick={handlePotvrdi}
          className='px-4 fw-medium'
        >
          U redu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}