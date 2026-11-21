import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconArrow, IconBack } from '../components/Icons';
import { MARK_INK } from '../components/Chrome';
import { useStore } from '../lib/store';

export default function Auth() {
  const nav = useNavigate();
  const loc = useLocation();
  const { state, dispatch, toast } = useStore();
  const [name, setName] = useState(state.user?.name ?? '');
  const [email, setEmail] = useState(state.user?.email ?? '');
  const [phone, setPhone] = useState(state.user?.phone ?? '');

  const from = (loc.state as { from?: string } | null)?.from ?? '/profile';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast('Add your name, email and phone');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      toast('Check your email address');
      return;
    }
    dispatch({
      type: 'login',
      user: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() },
    });
    toast('Your details are saved');
    nav(from, { replace: true });
  };

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

      <h1>Your details.</h1>
      <p>
        Kept on this device so checkout, delivery updates and your order history stay together.
      </p>

      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="au-name">Full name</label>
          <input id="au-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="au-email">Email</label>
          <input
            id="au-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
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

        <button className="btn" type="submit" style={{ marginTop: 18 }}>
          <span>Save my details</span>
          <IconArrow size={16} />
        </button>
      </form>

      <div className="auth__note">
        We use these details for delivery and order updates only. They never leave this device
        unless you place an order.
      </div>

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <Link className="textlink" to="/home">
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
