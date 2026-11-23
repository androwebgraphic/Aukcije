import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { APP_NAME} from '../constants';

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [naslov, setNaslov] = useState('')

  function showLoading() {
    setLoading(true);
  }

  function hideLoading() {
    setLoading(false);
  }

  function postaviNaslov(naslov){
    setNaslov(naslov)
    document.title = naslov + ', ' + APP_NAME
  }

  const value = {
    loading,
    showLoading,
    hideLoading,
    naslov,
    postaviNaslov
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};