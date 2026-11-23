import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrow } from '../components/Icons';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DesktopIntro() {
  return (
    <main className="dintro">
      <div className="dintro__arch" />

      <motion.img
        className="dintro__model"
        src="/assets/model-office.png"
        alt=""
        draggable={false}
        initial={{ opacity: 0, y: '6%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <div className="dintro__scrim" />

      <motion.div
        className="dintro__top"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
      >
        <span>Lagos · Nigeria</span>
        <span>Desktop edition</span>
      </motion.div>

      <div className="dintro__body">
        <motion.div
          className="dintro__word"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.34em' }}
          transition={{ duration: 1.4, delay: 0.25, ease: EASE }}
        >
          She&rsquo;s Stylish
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: EASE }}
        >
          The wardrobe
          <br />
          you were promised.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          Denim softened, leather cut sharp, and pieces that carry from the office to the evening.
        </motion.p>

        <motion.div
          className="dintro__rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 1.05, ease: EASE }}
        />

        <motion.div
          className="dintro__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25, ease: EASE }}
        >
          <Link className="dintro__cta" to="/home" replace>
            <span>Enter the boutique</span>
            <IconArrow size={16} />
          </Link>
          <span className="dintro__meta">The house is open</span>
        </motion.div>
      </div>

      <motion.div
        className="dintro__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        Curated in Lagos · Delivered nationwide
      </motion.div>
    </main>
  );
}
