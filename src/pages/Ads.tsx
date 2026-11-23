import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ads } from '../lib/data';
import { IconArrow } from '../components/Icons';

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Ads() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [i, setI] = useState(() => {
    const step = Number(params.get('step') ?? 1);
    return Number.isFinite(step) ? Math.min(ads.length - 1, Math.max(0, step - 1)) : 0;
  });
  const ad = ads[i];
  const last = i === ads.length - 1;

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (last) nav('/home', { replace: true });
      else setI((v) => v + 1);
    }, 7000);
    return () => window.clearTimeout(t);
  }, [i, last, nav]);

  const next = () => {
    if (last) nav('/home', { replace: true });
    else setI(i + 1);
  };

  return (
    <div className="ad" role="region" aria-label={`Campaign ${ad.index} of 03`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={ad.id}
          className="ad__scene"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          exit={{ opacity: 0 }}
          transition={{
            clipPath: { duration: 1, ease: EASE },
            opacity: { duration: 0.35, delay: 0.55 },
          }}
        >
          <div className="ad__bg" />
          <div className="ad__arch" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.figure
          key={`look-${ad.id}`}
          className="ad__look"
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <img src={ad.look} alt={ad.lookAlt} draggable={false} />
        </motion.figure>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          key={`copy-${ad.id}`}
          className="ad__layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="ad__copy">
            <motion.div
              className="ad__eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {ad.eyebrow}
            </motion.div>
            <h1 className="ad__title">
              <span style={{ overflow: 'hidden' }}>
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
                >
                  {ad.title[0]}
                </motion.span>
              </span>
              <span style={{ overflow: 'hidden' }}>
                <motion.span
                  style={{ display: 'block', fontStyle: 'italic' }}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.5, ease: EASE }}
                >
                  {ad.title[1]}
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.62 }}
            >
              {ad.copy}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.78 }}
            >
              <button className="link-arrow" style={{ marginTop: 16 }} onClick={next}>
                {ad.cta}
                <IconArrow size={13} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="ad__head">
        <div className="ad__count">
          <b>{ad.index}</b>
          <span>/ 03</span>
        </div>
        <button className="ad__skip" onClick={() => nav('/home', { replace: true })}>
          Skip intro
        </button>
      </div>

      <div className="ad__foot">
        <div className="ad__dots">
          {ads.map((a, idx) => (
            <button
              key={a.id}
              className={`ad__dot ${idx === i ? 'ad__dot--on' : ''}`}
              onClick={() => setI(idx)}
              aria-label={`Go to campaign ${a.index}`}
              aria-current={idx === i}
            />
          ))}
        </div>
        <button className="ad__next" onClick={next} aria-label={last ? 'Enter the boutique' : 'Next'}>
          <IconArrow size={18} />
        </button>
      </div>

      <div className="ad__hint" key={`hint-${ad.id}`}>
        {last ? 'Enter the boutique' : 'Tap to continue'}
      </div>

      <motion.div
        key={`progress-${ad.id}`}
        className="ad__progress"
        style={{ width: '100%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 7, ease: 'linear' }}
      />
    </div>
  );
}
