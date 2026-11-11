import React, { useState, useEffect } from 'react';

const Odbrojavanje = ({ zavrsava }) => {
  const [preostalo, setPreostalo] = useState(() => Math.max(0, new Date(zavrsava) - Date.now()));

  useEffect(() => {
    if (preostalo <= 0) return;
    const timer = setInterval(() => {
      const ms = new Date(zavrsava) - Date.now();
      setPreostalo(ms > 0 ? ms : 0);
      if (ms <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [zavrsava]);

  if (preostalo <= 0) return <span style={{color:'red', fontWeight:'bold', fontStyle:'italic'}}>Aukcija završila!!!</span>;

  const s = Math.floor((preostalo / 1000) % 60).toString().padStart(2, '0');
  const m = Math.floor((preostalo / (1000 * 60)) % 60).toString().padStart(2, '0');
  const h = Math.floor((preostalo / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  const d = Math.floor(preostalo / (1000 * 60 * 60 * 24));

  return <span>{d > 0 ? `${d}d ` : ''}{h}h:{m}:{s}</span>;
};

export default Odbrojavanje;