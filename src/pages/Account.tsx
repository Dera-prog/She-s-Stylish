import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackBar, Screen, TitleHead } from '../components/Chrome';
import { IconArrow, IconCheck, IconChevron, IconLock, IconSparkle } from '../components/Icons';
import { useStore } from '../lib/store';

export function EditProfile() {
  const nav = useNavigate();
  const { state, dispatch, toast } = useStore();
  const [name, setName] = useState(state.user?.name ?? '');
  const [email, setEmail] = useState(state.user?.email ?? '');
  const [phone, setPhone] = useState(state.user?.phone ?? '');

  const save = () => {
    dispatch({ type: 'login', user: { name, email, phone } });
    toast('Profile updated');
    nav(-1);
  };

  return (
    <Screen>
      <BackBar title="Personal information" />
      <div className="stack" style={{ paddingTop: 6 }}>
        <div className="eyebrow">How we address you</div>
        <div className="field" style={{ marginTop: 14 }}>
          <label htmlFor="ep-name">Full name</label>
          <input id="ep-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="ep-email">Email</label>
          <input id="ep-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="ep-phone">Phone</label>
          <input id="ep-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
        </div>
        <button className="btn" onClick={save} style={{ marginTop: 10 }}>
          <span>Save changes</span>
          <IconArrow size={16} />
        </button>
        <div className="notice" style={{ marginTop: 16 }}>
          Your details are used for delivery and order updates only. We never sell your data.
        </div>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}

type Address = { id: number; label: string; line: string; city: string; phone: string; def: boolean };

const seedAddresses: Address[] = [
  {
    id: 1,
    label: 'Home',
    line: '12 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    phone: '+234 801 234 5678',
    def: true,
  },
  {
    id: 2,
    label: 'Office',
    line: '4A Musa Yar\u2019Adua Street, Victoria Island',
    city: 'Lagos',
    phone: '+234 803 987 6543',
    def: false,
  },
];

export function Addresses() {
  const { toast } = useStore();
  const [list, setList] = useState<Address[]>(seedAddresses);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: 'Home', line: '', city: 'Lagos', phone: '' });

  const add = () => {
    if (!draft.line.trim()) {
      toast('Add a street address');
      return;
    }
    setList((l) => [
      ...l,
      { id: Date.now(), label: draft.label || 'Address', line: draft.line, city: draft.city, phone: draft.phone, def: l.length === 0 },
    ]);
    setDraft({ label: 'Home', line: '', city: 'Lagos', phone: '' });
    setAdding(false);
    toast('Address saved');
  };

  return (
    <Screen>
      <BackBar title="Saved addresses" />
      <TitleHead title="Deliveries" eyebrow="Where the ribbon arrives" />

      <div className="stack" style={{ marginTop: 18 }}>
        {list.map((a) => (
          <div className="addresscard" key={a.id} style={{ marginBottom: 10 }}>
            <IconSparkle size={18} />
            <div style={{ flex: 1 }}>
              <b>
                {a.label}{' '}
                {a.def && <span className="pill pill--gold" style={{ marginLeft: 6 }}>Default</span>}
              </b>
              <br />
              {a.line}
              <br />
              {a.city}, Nigeria
              {a.phone ? (
                <>
                  <br />
                  {a.phone}
                </>
              ) : null}
              <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                <button
                  className="textlink"
                  onClick={() => {
                    setList((l) => l.map((x) => ({ ...x, def: x.id === a.id })));
                    toast('Default address updated');
                  }}
                >
                  Make default
                </button>
                <button
                  className="textlink"
                  onClick={() => {
                    setList((l) => l.filter((x) => x.id !== a.id));
                    toast('Address removed');
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {adding ? (
          <div style={{ marginTop: 10 }}>
            <div className="fieldrow">
              <div className="field">
                <label htmlFor="ad-label">Label</label>
                <input id="ad-label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="ad-city">City</label>
                <input id="ad-city" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ad-line">Street address</label>
              <input id="ad-line" value={draft.line} onChange={(e) => setDraft({ ...draft, line: e.target.value })} placeholder="House number and street" />
            </div>
            <div className="field">
              <label htmlFor="ad-phone">Phone</label>
              <input id="ad-phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} inputMode="tel" />
            </div>
            <div className="split">
              <button className="btn" onClick={add}>
                <span>Save address</span>
              </button>
              <button className="btn btn--ghost" onClick={() => setAdding(false)}>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn--ghost" style={{ marginTop: 8 }} onClick={() => setAdding(true)}>
            <span>Add a new address</span>
            <IconArrow size={16} />
          </button>
        )}
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}

function Toggle({
  label,
  note,
  on,
  onToggle,
}: {
  label: string;
  note: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="toggle-row">
      <div>
        <b>{label}</b>
        <span>{note}</span>
      </div>
      <button
        className={`switch ${on ? 'switch--on' : ''}`}
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
      />
    </div>
  );
}

export function Notifications() {
  const { toast } = useStore();
  const [prefs, setPrefs] = useState({
    orders: true,
    arrivals: true,
    drops: false,
    styling: true,
  });

  const set = (k: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
    toast('Notification preferences saved');
  };

  return (
    <Screen>
      <BackBar title="Notifications" />
      <TitleHead title="Stay in the know" eyebrow="Only what matters" />
      <div className="stack" style={{ marginTop: 18 }}>
        <Toggle
          label="Order updates"
          note="Payment, dispatch and delivery alerts"
          on={prefs.orders}
          onToggle={() => set('orders')}
        />
        <Toggle
          label="New arrivals"
          note="The moment a new edit goes live"
          on={prefs.arrivals}
          onToggle={() => set('arrivals')}
        />
        <Toggle
          label="Drops & exclusives"
          note="Limited pieces and private previews"
          on={prefs.drops}
          onToggle={() => set('drops')}
        />
        <Toggle
          label="Styling notes"
          note="Occasional edits from the house stylist"
          on={prefs.styling}
          onToggle={() => set('styling')}
        />
        <div className="notice" style={{ marginTop: 18 }}>
          We only send messages you have asked for. You can change your mind at any time.
        </div>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}

export function Preferences() {
  const { toast } = useStore();
  const [clothes, setClothes] = useState('M');
  const [shoes, setShoes] = useState('38');
  const [styles, setStyles] = useState<string[]>(['Tailoring', 'Occasion']);
  const [pwd, setPwd] = useState({ next: '', confirm: '' });

  const toggleStyle = (s: string) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Screen>
      <BackBar title="Preferences & security" />
      <TitleHead title="Made for you" eyebrow="Fit, style, security" />

      <div className="stack" style={{ marginTop: 18 }}>
        <div className="eyebrow">Sizes</div>
        <div className="fieldrow" style={{ marginTop: 12 }}>
          <div className="field">
            <label htmlFor="pr-clothes">Clothing</label>
            <select id="pr-clothes" className="select" value={clothes} onChange={(e) => setClothes(e.target.value)}>
              {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pr-shoes">Shoes (EU)</label>
            <select id="pr-shoes" className="select" value={shoes} onChange={(e) => setShoes(e.target.value)}>
              {['36', '37', '38', '39', '40', '41'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="eyebrow" style={{ marginTop: 22 }}>
          Style notes
        </div>
        <div className="chips" style={{ padding: '12px 0 0', flexWrap: 'wrap' }}>
          {['Tailoring', 'Evening', 'Knitwear', 'Occasion', 'Everyday', 'Accessories'].map((s) => (
            <button
              key={s}
              className={`chip ${styles.includes(s) ? 'chip--on' : ''}`}
              onClick={() => toggleStyle(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 26 }}>
          Password
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="pr-next">New password</label>
          <input id="pr-next" type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} placeholder="••••••••" autoComplete="new-password" />
        </div>
        <div className="field">
          <label htmlFor="pr-confirm">Confirm password</label>
          <input id="pr-confirm" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} placeholder="••••••••" autoComplete="new-password" />
        </div>

        <button
          className="btn"
          onClick={() => {
            if (pwd.next && pwd.next !== pwd.confirm) {
              toast('Passwords do not match');
              return;
            }
            toast('Preferences saved');
          }}
        >
          <span>Save preferences</span>
          <IconLock size={16} />
        </button>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}

export function Settings() {
  const nav = useNavigate();
  const { state, dispatch, toast } = useStore();

  return (
    <Screen>
      <BackBar title="App settings" />
      <TitleHead title="Settings" eyebrow="The house, configured" />
      <div className="list" style={{ marginTop: 16 }}>
        <div className="list__label">Shopping</div>
        <div className="list__row">
          <span>Currency</span>
          <span className="status status--gold">NGN ₦</span>
        </div>
        <div className="list__row">
          <span>Language</span>
          <span className="status">English</span>
        </div>
        <div className="list__row">
          <span>Country</span>
          <span className="status">Nigeria</span>
        </div>

        <div className="list__label" style={{ marginTop: 22 }}>
          Policies
        </div>
        <Link className="list__row" to="/support">
          <span>Delivery &amp; returns</span>
          <IconChevron size={15} className="chev" />
        </Link>
        <Link className="list__row" to="/support">
          <span>Privacy policy</span>
          <IconChevron size={15} className="chev" />
        </Link>
        <Link className="list__row" to="/support">
          <span>Terms of service</span>
          <IconChevron size={15} className="chev" />
        </Link>

        <div className="list__label" style={{ marginTop: 22 }}>
          Account
        </div>
        <Link className="list__row" to="/account/edit">
          <span>Personal information</span>
          <IconChevron size={15} className="chev" />
        </Link>
        <button
          className="list__row"
          onClick={() => {
            dispatch({ type: 'logout' });
            toast('Signed out');
            nav('/welcome');
          }}
        >
          <span>Sign out</span>
          <IconChevron size={15} className="chev" />
        </button>
        <button
          className="list__row"
          style={{ color: '#8a4b3a' }}
          onClick={() => {
            dispatch({ type: 'reset' });
            dispatch({ type: 'logout' });
            toast('Demo data cleared');
            nav('/welcome');
          }}
        >
          <span>Reset demo data</span>
          <IconChevron size={15} className="chev" />
        </button>

        <div className="list__foot">
          <span>Signed in as {state.user?.email ?? 'guest'}</span>
          <span>v1.0</span>
        </div>
      </div>
    </Screen>
  );
}

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Lagos standard delivery arrives in 2–4 working days (₦3,500). Express is next-day within Lagos (₦7,500). Nationwide delivery takes 3–7 working days.',
  },
  {
    q: 'What is your return policy?',
    a: 'Returns and exchanges are accepted within 7 days of delivery. Pieces must be unworn with tags attached. Start a return from your order page.',
  },
  {
    q: 'How do I choose my size?',
    a: 'Every product page includes bust, waist and hip measurements. Our pieces fit true to size; if you are between sizes, take the larger.',
  },
  {
    q: 'When will sold-out pieces return?',
    a: 'Edits are produced in limited runs. Save the piece to your wishlist and we will notify you if it returns to stock.',
  },
  {
    q: 'Do you offer styling appointments?',
    a: 'Private styling consultations in Lagos are available on request. Message the house and we will arrange a time.',
  },
];

export function Support() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Screen>
      <BackBar title="Help & support" />
      <TitleHead title="At your service" eyebrow="Care, answered" />

      <div className="stack" style={{ marginTop: 18 }}>
        {faqs.map((f, i) => (
          <div className="acc" key={f.q}>
            <button className="acc__head" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span style={{ textTransform: 'none', letterSpacing: '0.02em', fontFamily: 'var(--serif)', fontSize: 16 }}>
                {f.q}
              </span>
              <span
                style={{
                  transform: open === i ? 'rotate(90deg)' : 'none',
                  transition: 'transform .25s',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <IconChevron size={14} />
              </span>
            </button>
            {open === i && <div className="acc__body">{f.a}</div>}
          </div>
        ))}
      </div>

      <div className="divider-label">Talk to a person</div>
      <div className="stack" style={{ marginTop: 14 }}>
        <Link className="opt" to="/contact" style={{ width: '100%' }}>
          <IconSparkle size={18} />
          <span className="opt__body">
            <span className="opt__title">
              <span>Email the house</span>
              <span className="opt__price">care@shesstylish.ng</span>
            </span>
            <span className="opt__note">Replies within one business day · 9am–7pm WAT</span>
          </span>
        </Link>
        <div className="opt" style={{ width: '100%', cursor: 'default' }}>
          <IconCheck size={18} />
          <span className="opt__body">
            <span className="opt__title">
              <span>WhatsApp</span>
              <span className="opt__price">+234 801 234 5678</span>
            </span>
            <span className="opt__note">Fastest for delivery questions</span>
          </span>
        </div>
      </div>
      <div className="confirm__micro" style={{ marginBottom: 26 }}>
        The house · Lagos, Nigeria
      </div>
    </Screen>
  );
}

export function Contact() {
  const nav = useNavigate();
  const { toast } = useStore();
  const [subject, setSubject] = useState('Order enquiry');
  const [message, setMessage] = useState('');

  return (
    <Screen>
      <BackBar title="Contact us" />
      <TitleHead title="Write to us." eyebrow="A real person reads every note" />
      <div className="stack" style={{ marginTop: 18 }}>
        <div className="field">
          <label htmlFor="ct-subject">Subject</label>
          <select id="ct-subject" className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {['Order enquiry', 'Delivery question', 'Returns & exchanges', 'Sizing advice', 'Styling appointment', 'Something else'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ct-message">Message</label>
          <textarea
            id="ct-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you need"
            style={{
              width: '100%',
              minHeight: 130,
              border: '1px solid var(--line)',
              background: '#fcf8f1',
              padding: 14,
              fontSize: 11.5,
              outline: 'none',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>
        <button
          className="btn"
          onClick={() => {
            if (!message.trim()) {
              toast('Add a message first');
              return;
            }
            toast('Message sent · we will reply by email');
            nav('/support');
          }}
        >
          <span>Send message</span>
          <IconArrow size={16} />
        </button>
        <div className="notice" style={{ marginTop: 14 }}>
          We answer within one business day, 9am–7pm WAT. For urgent delivery questions, WhatsApp
          is fastest.
        </div>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}
