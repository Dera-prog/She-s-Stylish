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
        <motion.div
          className="splash__ring"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="splash__arc" viewBox="0 0 140 140" fill="none" aria-hidden>
            <motion.circle
              cx="70"
              cy="70"
              r="69"
              stroke="rgba(193,160,106,0.65)"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeDasharray="118 316"
              style={{ transformOrigin: '70px 70px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
            />
            <motion.circle
              cx="70"
              cy="70"
              r="60"
              stroke="rgba(193,160,106,0.28)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeDasharray="34 340"
              style={{ transformOrigin: '70px 70px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
          <div className="splash__mark">
            <motion.img
              src="/assets/logo-mark.png"
              alt="She's Stylish monogram"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
            />
            <span className="splash__shimmer" />
          </div>
        </motion.div>

        <h1 className="splash__word">
          <span style={{ overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'block' }}
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              She&rsquo;s
            </motion.span>
          </span>
          <span style={{ overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'block' }}
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
            >
              Stylish
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="splash__sub"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.36em' }}
          transition={{ duration: 1.2, delay: 1.15, ease: 'easeOut' }}
        >
          Dress like you mean it
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
