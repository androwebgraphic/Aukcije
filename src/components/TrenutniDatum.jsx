import React from 'react';

function TrenutniDatum() {
  const danas = new Date();
  
  // en-US format standardno koristi mm/dd/yyyy
  const formatiraniDatum = danas.toLocaleDateString('hr-HR', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <div>
      <h3>Trenutni datum:</h3>
      <p>{formatiraniDatum}</p>
    </div>
  );
}

export default Datum;