import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconArrow, IconBack } from '../components/Icons';
import { MARK_INK } from '../components/Chrome';
import { useStore } from '../lib/store';

type Mode = 'login' | 'signup' | 'forgot';

export default function Auth() {
  const nav = useNavigate();
  const loc = useLocation();
  const { dispatch, toast } = useStore();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const from = (loc.state as { from?: string } | null)?.from ?? '/profile';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      toast('Reset link sent to your email');
      setMode('login');
      return;
    }
    const clean = email.trim() || 'ada.adebayo@example.com';
    const display =
      name.trim() ||
      clean
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    dispatch({
      type: 'login',
      user: {
        name: display || 'Ada Adebayo',
        email: clean,
        phone: phone.trim() || '+234 801 234 5678',
      },
    });
    toast(mode === 'signup' ? 'Welcome to the house' : 'Welcome back');
    nav(from, { replace: true });
  };

  const demo = () => {
    dispatch({
      type: 'login',
      user: { name: 'Ada Adebayo', email: 'ada.adebayo@example.com', phone: '+234 801 234 5678' },
    });
    toast('Signed in as Ada');
    nav('/profile', { replace: true });
  };

  const title =
    mode === 'login' ? 'Welcome back.' : mode === 'signup' ? 'Join the house.' : 'Reset access.';
  const sub =
    mode === 'login'
      ? 'Your edit, your orders and your saved pieces — exactly where you left them.'
      : mode === 'signup'
        ? 'Create an account for early access to edits, drops and private appointments.'
        : 'Enter your email and we will send a secure reset link.';

  return (
    <div className="auth">
      <button
        className="iconbtn"
        style={{ marginLeft: -10, marginTop: 12 }}
        onClick={() => nav(-1)}
        aria-label="Back"
      >
        <IconBack />
      </button>

      <img className="auth__mark" src={MARK_INK} alt="She's Stylish" />

      {mode !== 'forgot' && (
        <div className="seg" style={{ margin: '22px 0 0' }}>
          <button className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>
            Log in
          </button>
          <button className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>
            Create account
          </button>
        </div>
      )}

      <h1>{title}</h1>
      <p>{sub}</p>

      <form onSubmit={submit}>
        {mode === 'signup' && (
          <div className="field">
            <label htmlFor="au-name">Full name</label>
            <input id="au-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
        )}
        <div className="field">
          <label htmlFor="au-email">Email</label>
          <input
            id="au-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {mode === 'signup' && (
          <div className="field">
            <label htmlFor="au-phone">Phone</label>
            <input
              id="au-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="+234"
              autoComplete="tel"
            />
          </div>
        )}
        {mode !== 'forgot' && (
          <div className="field">
            <label htmlFor="au-pass">Password</label>
            <input
              id="au-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>
        )}

        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginTop: 4 }}>
            <button type="button" className="textlink" onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </div>
        )}

        <button className="btn" type="submit" style={{ marginTop: 18 }}>
          <span>{mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}</span>
          <IconArrow size={16} />
        </button>
      </form>

      <button className="auth__guest" onClick={demo}>
        Continue with the demo account
      </button>

      <div className="auth__switch">
        {mode === 'login' ? (
          <>
            New to the house?{' '}
            <button className="textlink" onClick={() => setMode('signup')}>
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="textlink" onClick={() => setMode('login')}>
              Log in
            </button>
          </>
        )}
      </div>

      <div className="auth__note">
        This is a product prototype. Sign in with any details — no account is created and nothing
        is shared.
      </div>

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <Link className="textlink" to="/home">
          Continue as guest
        </Link>
      </div>
    </div>
  );
}
