import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => nav('/welcome', { replace: true }), 3600);
    return () => window.clearTimeout(t);
  }, [nav]);

  return (
    <motion.div className="splash" onClick={() => nav('/welcome')}>
      <div className="splash__top">
        <span>Lagos · Nigeria</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nav('/welcome');
          }}
        >
          Est. 2026 · Skip
        </button>
      </div>

      <motion.div
        className="splash__art"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <picture>
          <source srcSet="/assets/splash-monogram.webp" type="image/webp" />
          <img
            className="splash__intro"
            src="/assets/splash-monogram.jpg"
            alt="She’s Stylish — luxury women’s fashion"
          />
        </picture>
        <motion.span
          className="splash__shimmer"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
      </motion.div>

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
