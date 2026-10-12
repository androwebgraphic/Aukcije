import { motion } from 'framer-motion';

export default function SlideLeftCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}  // Početno stanje: nevidljivo, 100px ulijevo
      animate={{ opacity: 1, x: 0 }}      // Ciljano stanje: vidljivo, na svojoj poziciji
      transition={{ 
        duration: 0.6, 
        ease: "easeOut" 
      }}
      style={{
        padding: '20px',
        backgroundColor: '#f0f4f8',
        borderRadius: '8px',
        maxWidth: '400px'
      }}
    >
      <h3>Dobrodošli!</h3>
      <p>Ovaj kartica klizi s lijeve strane pri učitavanju.</p>
    </motion.div>
  );
}