import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  brojAktivnihUcitavanja,
  pocniUcitavanje,
  pretplatiSeNaUcitavanje,
  zavrsiUcitavanje,
} from '../utils/loadingBus';

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  // Broj aktivnih dohvata dolazi iz loadingBusa (servisi ga sami javljaju),
  // pa se spinner prikazuje na svakoj stranici, a ne samo tamo gdje je
  // stranica ručno zvala showLoading().
  const [brojAktivnih, setBrojAktivnih] = useState(() => brojAktivnihUcitavanja());

  useEffect(() => pretplatiSeNaUcitavanje(setBrojAktivnih), []);

  const value = {
    loading: brojAktivnih > 0,
    showLoading: pocniUcitavanje,
    hideLoading: zavrsiUcitavanje,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
