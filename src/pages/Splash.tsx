import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const dust = [
  { left: '16%', top: '28%', delay: 0 },
  { left: '78%', top: '22%', delay: 1.4 },
  { left: '30%', top: '62%', delay: 2.6 },
  { left: '68%', top: '70%', delay: 0.8 },
  { left: '84%', top: '46%', delay: 3.4 },
  { left: '22%', top: '76%', delay: 2 },
];

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => nav('/welcome', { replace: true }), 3600);
    return () => window.clearTimeout(t);
  }, [nav]);

  return (
    <motion.div className="splash" onClick={() => nav('/welcome')}>
      <motion.div
        className="splash__glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.82], scale: [0.8, 1.05, 1] }}
        transition={{ duration: 2.6, ease: 'easeOut' }}
      />

      {dust.map((d, i) => (
        <motion.span
          key={i}
          className="splash__dust"
          style={{ left: d.left, top: d.top }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 0.55, 0], y: -26 }}
          transition={{ duration: 5.2, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="splash__top">
        <span>Lagos · Nigeria</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nav('/welcome');
          }}
          style={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
        >
          Est. 2026 · Skip
        </button>
      </div>

      <div className="splash__lockup">
        <motion.svg
          className="splash__halo"
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle cx="150" cy="150" r="147" stroke="rgba(193,160,106,0.32)" strokeWidth="0.7" />
          <circle
            cx="150"
            cy="150"
            r="136"
            stroke="rgba(193,160,106,0.2)"
            strokeWidth="0.6"
            strokeDasharray="1.5 7"
          />
        </motion.svg>

        <motion.div
          className="splash__brand"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="splash__logo"
            src="/assets/logo-lockup.png"
            alt="She’s Stylish — luxury women’s fashion"
          />
          <motion.span
            className="splash__shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          />
        </motion.div>
      </div>

      <motion.div
        className="splash__foot"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.5 }}
      >
        <div className="splash__rule" />
        <div className="splash__quote">&ldquo;Elegance is refusal.&rdquo;</div>
        <div className="splash__micro">Curated in Lagos · Delivered nationwide</div>
      </motion.div>

      <div className="splash__loader">
        <motion.i
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
