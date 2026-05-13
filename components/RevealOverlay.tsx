'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  revealing: boolean;
}

const TEXT = '과연 그대의 목적지는..?';

export default function RevealOverlay({ revealing }: Props) {
  return (
    <AnimatePresence>
      {revealing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              padding: '0 24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {TEXT.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.06,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                style={{ whiteSpace: 'pre' }}
              >
                {char}
              </motion.span>
            ))}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + TEXT.length * 0.06 + 0.2 }}
            style={{ display: 'flex', gap: '10px' }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
