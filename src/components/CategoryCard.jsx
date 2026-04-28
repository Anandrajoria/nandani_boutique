import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryCard({ item, onDetails }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="editorial-card"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        borderRadius: 0, overflow: 'hidden', position: 'relative', cursor: 'pointer',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
        <motion.img
          src={item.img} alt={item.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'; }}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <motion.div
        animate={{
          background: hovered
            ? 'linear-gradient(to top, rgba(13,12,9,0.88) 0%, rgba(13,12,9,0.3) 55%, transparent 100%)'
            : 'linear-gradient(to top, rgba(13,12,9,0.6) 0%, transparent 65%)',
        }}
        transition={{ duration: 0.5 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(232,213,176,0.85)', marginBottom: 6 }}>
          {item.emoji} Collection
        </p>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 400, color: '#fff', lineHeight: 1.15 }}>
          {item.name}
        </h3>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35 }}
            >
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 18, marginTop: 10 }}>
                {item.desc}
              </p>
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onDetails(item)}
                style={{
                  fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
                  color: '#fff', border: '1px solid rgba(255,255,255,0.5)',
                  padding: '9px 22px', borderRadius: 0, background: 'transparent', cursor: 'pointer',
                }}
              >
                Details →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
