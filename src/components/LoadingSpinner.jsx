import { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import useLoading from '../hooks/usLoading';

// Kratki dohvati (npr. iz Firestore cachea) traju svega nekoliko ms — spinner
// bi samo bljesnuo i nitko ga ne bi vidio. Zato se prikazuje tek kad
// učitavanje potraje, a kad se jednom pojavi, ostaje vidljiv minimalno
// vrijeme da ga oko stigne registrirati.
const ODGODA_PRIKAZA_MS = 120;
const MIN_PRIKAZ_MS = 350;

export default function LoadingSpinner() {
  const { loading } = useLoading();
  const [prikazi, setPrikazi] = useState(false);
  const pocetakPrikazaRef = useRef(0);

  useEffect(() => {
    let timer = null;

    if (loading && !prikazi) {
      timer = setTimeout(() => {
        pocetakPrikazaRef.current = Date.now();
        setPrikazi(true);
      }, ODGODA_PRIKAZA_MS);
    }

    if (!loading && prikazi) {
      const proteklo = Date.now() - pocetakPrikazaRef.current;
      timer = setTimeout(() => setPrikazi(false), Math.max(0, MIN_PRIKAZ_MS - proteklo));
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, prikazi]);

  if (!prikazi) return null;

  return (
    <div className='loading-spinner-overlay'>
      <Spinner animation='border' role='status' variant='primary' />
      <span className='visually-hidden'>Učitavanje…</span>
    </div>
  );
}
