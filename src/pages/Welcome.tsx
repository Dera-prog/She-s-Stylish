import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrow } from '../components/Icons';

export default function Welcome() {
  return (
    <main className="welcome">
      <div className="welcome__hero">
        <div className="welcome__arch" />
        <motion.div
          className="welcome__models"
          initial={{ y: '14%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/assets/model-check.png" alt="Model in check tailoring" />
          <img src="/assets/model-office.png" alt="Model in navy knit and poplin" />
          <img src="/assets/model-lavender.png" alt="Model in lavender fleece and butter leather" />
        </motion.div>
        <div className="welcome__fade" />
        <motion.div
          className="welcome__top"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <div className="wordmark">She&rsquo;s Stylish</div>
        </motion.div>
        <motion.div
          className="welcome__tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          New season · The Soft Power Edit
        </motion.div>
      </div>

      <motion.section
        className="welcome__panel"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="eyebrow">Welcome to the house</div>
        <h1>Dressed for every version of you.</h1>
        <p>
          Considered tailoring, soft knits and gold that means something — curated in Lagos for
          the woman who arrives as herself.
        </p>
        <Link className="btn" to="/ads">
          <span>Get started</span>
          <IconArrow size={17} />
        </Link>
        <div className="welcome__login">
          Already have an account?{' '}
          <Link to="/login">
            <b>Log in</b>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
