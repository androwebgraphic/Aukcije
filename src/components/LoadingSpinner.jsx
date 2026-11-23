import { Spinner } from 'react-bootstrap';
import useLoading from '../hooks/useLoading';

export default function LoadingSpinner() {
  const { loading } = useLoading();

  return (
    <>
      {loading && (
        <div
          className='loading-spinner-overlay'
          role='status'
          aria-live='polite'
          aria-label='Učitavanje u tijeku'
        >
          <Spinner animation='border' variant='primary' aria-hidden='true' />
          <span className='visually-hidden'>Učitavanje u tijeku...</span>
        </div>
      )}
    </>
  );
}