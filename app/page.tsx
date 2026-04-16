'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type SignUpMethod = 'google' | 'magic-link' | 'email';
type JourneyStep =
  | 'landing'
  | 'method-select'
  | 'signup-form'
  | 'signup-success'
  | 'profile'
  | 'scanner';
type Gender = 'female' | 'male';
type PaymentMethod = 'venmo' | 'cash' | 'card' | 'zelle' | 'none';
type SortKey = 'name' | 'email' | 'paid' | 'checkedInToday';

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  paid: boolean;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  checkedInToday: boolean;
  invitationSentAt: string | null;
};

type Connection = {
  id: string;
  displayName: string;
  gender: Gender;
  relationship: 'friend' | 'possible-connection';
  addedAt: string;
};

function toInputDateTime(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function buildId(seed: string) {
  const safe = seed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  return `USER-${safe || 'GUEST'}-${Math.floor(Math.random() * 900 + 100)}`;
}

export default function EventQrLandingPage() {
  const [step, setStep] = useState<JourneyStep>('landing');
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);

  const [eventName, setEventName] = useState('Metro Singles Fellowship Night');
  const [eventStart, setEventStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(19, 0, 0, 0);
    return d;
  });
  const [eventEnd, setEventEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(22, 0, 0, 0);
    return d;
  });
  const [eventCost, setEventCost] = useState(25);
  const [venmoHandle, setVenmoHandle] = useState('@YourChurchSingles');
  const [paymentLink, setPaymentLink] = useState('https://venmo.com/u/YourChurchSingles');

  const [flyerFront, setFlyerFront] = useState<string | null>(null);
  const [flyerBack, setFlyerBack] = useState<string | null>(null);
  const [fullScreenFlyer, setFullScreenFlyer] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
    gender: 'female' as Gender,
  });
  const [currentUserId, setCurrentUserId] = useState('');
  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [primaryMergeUserId, setPrimaryMergeUserId] = useState<string>('');

  const [checkInEmail, setCheckInEmail] = useState('');
  const [checkInFirstName, setCheckInFirstName] = useState('');
  const [checkInLastName, setCheckInLastName] = useState('');
  const [checkInGender, setCheckInGender] = useState<Gender>('female');
  const [checkInPaid, setCheckInPaid] = useState(false);
  const [checkInAmount, setCheckInAmount] = useState(0);
  const [checkInMethod, setCheckInMethod] = useState<PaymentMethod>('venmo');

  const [shareUrl, setShareUrl] = useState('https://example.com/add-connection');
  const [candidateCode, setCandidateCode] = useState('');
  const [candidateProfile, setCandidateProfile] = useState<AdminUser | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUserId) {
      setShareUrl(`${window.location.origin}/add-connection?from=${currentUserId}`);
    }
  }, [currentUserId]);

  const now = new Date();
  const isEventDay = now.toDateString() === eventStart.toDateString();
  const isFutureEvent = now.getTime() < eventStart.getTime();
  const isAroundStart =
    now.getTime() >= eventStart.getTime() - 60 * 60 * 1000 &&
    now.getTime() <= eventStart.getTime() + 90 * 60 * 1000;
  const canCheckIn = isEventDay || isAroundStart;

  const eventStateMessage = useMemo(() => {
    if (isFutureEvent) return 'Future event mode: RSVP is required before event day.';
    if (isEventDay && isAroundStart) {
      return 'Today near start time: event splash + check-in + scanner should be active.';
    }
    if (isEventDay) return 'Today event mode: check-in active.';
    return 'Past event mode: disable new check-ins.';
  }, [isAroundStart, isEventDay, isFutureEvent]);

  const currentUser = useMemo(() => {
    const email = form.email.toLowerCase().trim();
    return adminUsers.find((u) => u.email === email) ?? null;
  }, [adminUsers, form.email]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = adminUsers.filter((u) => {
      if (!q) return true;
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortKey === 'paid') return Number(a.paid === true) > Number(b.paid === true) ? direction : -direction;
      if (sortKey === 'checkedInToday') {
        return Number(a.checkedInToday === true) > Number(b.checkedInToday === true)
          ? direction
          : -direction;
      }
      const left = (sortKey === 'name'
        ? `${a.firstName} ${a.lastName}`
        : a.email
      ).toLowerCase();
      const right = (sortKey === 'name'
        ? `${b.firstName} ${b.lastName}`
        : b.email
      ).toLowerCase();
      return left > right ? direction : -direction;
    });

    return list;
  }, [adminUsers, searchTerm, sortDirection, sortKey]);

  const handleUploadFlyer = (
    e: ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (side === 'front') setFlyerFront(url);
    if (side === 'back') setFlyerBack(url);
  };

  const upsertAdminUser = (payload: Partial<AdminUser> & { email: string }) => {
    const key = payload.email.toLowerCase().trim();
    if (!key) return;

    setAdminUsers((prev) => {
      const existing = prev.find((u) => u.email === key);
      if (existing) {
        return prev.map((u) =>
          u.email === key
            ? {
                ...u,
                ...payload,
                email: key,
              }
            : u,
        );
      }

      return [
        {
          id: buildId(key),
          firstName: payload.firstName ?? 'Guest',
          lastName: payload.lastName ?? 'Attendee',
          email: key,
          gender: payload.gender ?? 'female',
          paid: payload.paid ?? false,
          amountPaid: payload.amountPaid ?? 0,
          paymentMethod: payload.paymentMethod ?? 'none',
          checkedInToday: payload.checkedInToday ?? false,
          invitationSentAt: payload.invitationSentAt ?? null,
        },
        ...prev,
      ];
    });
  };

  const handleAdminCheckIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    upsertAdminUser({
      email: checkInEmail,
      firstName: checkInFirstName,
      lastName: checkInLastName,
      gender: checkInGender,
      paid: checkInPaid,
      amountPaid: checkInAmount,
      paymentMethod: checkInMethod,
      checkedInToday: true,
      invitationSentAt: new Date().toLocaleString(),
    });
  };

  const beginSignUp = () => setStep('method-select');

  const chooseSignUpMethod = (method: SignUpMethod) => {
    setSignUpMethod(method);
    setStep('signup-form');
  };

  const submitSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = buildId(form.email);
    setCurrentUserId(id);
    setCheckedInAt(new Date().toLocaleString());

    upsertAdminUser({
      id,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      checkedInToday: canCheckIn,
    });

    setStep('signup-success');
  };

  const lookupScannedProfile = () => {
    const found = adminUsers.find((u) => u.id.toLowerCase() === candidateCode.toLowerCase().trim());
    setCandidateProfile(found ?? null);
  };

  const addConnectionFromProfile = () => {
    if (!candidateProfile) return;
    const relationship =
      candidateProfile.gender === form.gender ? 'friend' : 'possible-connection';

    setConnections((prev) => [
      {
        id: candidateProfile.id,
        displayName: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
        gender: candidateProfile.gender,
        relationship,
        addedAt: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const mergeAccounts = (secondaryUserId: string) => {
    if (!primaryMergeUserId || primaryMergeUserId === secondaryUserId) return;
    setAdminUsers((prev) => {
      const primary = prev.find((u) => u.id === primaryMergeUserId);
      const secondary = prev.find((u) => u.id === secondaryUserId);
      if (!primary || !secondary) return prev;

      const merged: AdminUser = {
        ...primary,
        paid: primary.paid || secondary.paid,
        amountPaid: primary.amountPaid || secondary.amountPaid,
        checkedInToday: primary.checkedInToday || secondary.checkedInToday,
        invitationSentAt: primary.invitationSentAt ?? secondary.invitationSentAt,
      };

      return [merged, ...prev.filter((u) => u.id !== primary.id && u.id !== secondary.id)];
    });
  };

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-gray-900">
      <div className="mx-auto flex w-full max-w-7xl gap-6">
        <section className="w-full max-w-md flex-1 space-y-6">
          {step === 'landing' && (
            <>
              <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
                We are so glad you&apos;re here
              </p>

              <header className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  Welcome to the Event!
                </h1>
                <p className="text-base leading-relaxed text-gray-700">
                  {isFutureEvent
                    ? `Please RSVP for this future event. Cost is $${eventCost}.`
                    : 'This app helps you sign up for today\'s event and connect with a meaningful, faith-centered matchmaker journey.'}
                </p>
              </header>

              <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50">
                <Image
                  src="/illustrations/people-line-splash.png"
                  alt="People line illustration"
                  width={800}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={beginSignUp}
                className="w-full rounded-2xl bg-flyerYellow px-5 py-4 text-base font-bold text-gray-900 shadow-sm transition hover:brightness-95 active:scale-[0.99]"
              >
                {isFutureEvent ? 'RSVP for This Event + Matchmaker App' : 'Sign Up for This Event + Matchmaker App'}
              </button>

              <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
                By continuing, you agree to the two required agreements: Safety Policy and Biblical View of Marriage.
              </p>
            </>
          )}

          {step === 'method-select' && (
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <h2 className="text-xl font-bold">Choose signup option</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => chooseSignUpMethod('google')}
                  className="w-full rounded-lg bg-flyerYellow px-4 py-3 text-left font-semibold"
                >
                  Continue with Google (recommended)
                </button>
                <button
                  type="button"
                  onClick={() => chooseSignUpMethod('magic-link')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left"
                >
                  Continue with email magic link
                </button>
                <button
                  type="button"
                  onClick={() => chooseSignUpMethod('email')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left"
                >
                  Continue with email + password
                </button>
              </div>
            </div>
          )}

          {step === 'signup-form' && signUpMethod && (
            <form className="space-y-4 rounded-xl border border-gray-200 p-4" onSubmit={submitSignup}>
              <h2 className="text-xl font-bold">Create account and check in</h2>
              <p className="text-sm text-gray-700">Method: <strong>{signUpMethod}</strong></p>

              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(form).map(([key, value]) => (
                  <label key={key} className="flex flex-col gap-1 text-sm capitalize">
                    {key}
                    {key === 'gender' ? (
                      <select
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        value={value}
                        onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as Gender }))}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    ) : (
                      <input
                        required
                        value={value}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                <p>
                  {currentUser?.paid
                    ? `Payment recorded: $${currentUser.amountPaid} via ${currentUser.paymentMethod}.`
                    : `Event cost is $${eventCost}. Pay ${venmoHandle} on Venmo or use payment link.`}
                </p>
                <p className="break-all text-xs text-gray-600">{paymentLink}</p>
                <p>
                  Check-in status: <strong>{checkedInAt ? `Checked in at ${checkedInAt}` : 'Not checked in'}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={!canCheckIn && !isFutureEvent}
                className="w-full rounded-xl bg-flyerYellow px-4 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFutureEvent ? 'Complete RSVP + create account' : 'Complete signup + check in'}
              </button>
            </form>
          )}

          {step === 'signup-success' && (
            <div className="space-y-3 rounded-xl border border-green-300 bg-green-50 p-4">
              <h2 className="text-xl font-bold">Signup successful</h2>
              <p className="text-sm">
                The cost of this event is <strong>${eventCost}</strong>. Pay <strong>{venmoHandle}</strong> with Venmo (or use the link below).
              </p>
              <p className="break-all text-xs text-gray-700">{paymentLink}</p>

              <div className="grid gap-2 sm:grid-cols-2">
                {flyerFront && (
                  <button type="button" onClick={() => setFullScreenFlyer(flyerFront)} className="overflow-hidden rounded-lg border border-gray-300">
                    <img src={flyerFront} alt="Flyer front" className="h-28 w-full object-cover" />
                  </button>
                )}
                {flyerBack && (
                  <button type="button" onClick={() => setFullScreenFlyer(flyerBack)} className="overflow-hidden rounded-lg border border-gray-300">
                    <img src={flyerBack} alt="Flyer back" className="h-28 w-full object-cover" />
                  </button>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2"
                >
                  Continue profile
                </button>
                <button
                  type="button"
                  onClick={() => setStep('scanner')}
                  className="rounded-lg bg-flyerYellow px-3 py-2 font-semibold"
                >
                  Start scanning connections
                </button>
              </div>
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h2 className="text-xl font-bold">Profile draft</h2>
              <button
                type="button"
                onClick={() => setStep('scanner')}
                className="rounded-lg bg-flyerYellow px-3 py-2 font-semibold"
              >
                Go to QR scanner
              </button>
            </div>
          )}

          {step === 'scanner' && (
            <div className="space-y-4 rounded-xl border border-gray-300 p-4">
              <h2 className="text-xl font-bold">Connection QR scanner</h2>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                <p className="mb-2 font-semibold">Your QR for others to scan</p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`}
                  alt="Your profile QR code"
                  className="mx-auto h-44 w-44 rounded-md border border-gray-300 bg-white p-2"
                />
                <p className="mt-2 break-all text-xs text-gray-600">{shareUrl}</p>
              </div>

              <label className="flex flex-col gap-1 text-sm">
                Scanned QR code
                <input
                  value={candidateCode}
                  onChange={(e) => setCandidateCode(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="USER-XXXX-123"
                />
              </label>

              <button type="button" onClick={lookupScannedProfile} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                Lookup scanned profile
              </button>

              {candidateProfile && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">
                      {candidateProfile.firstName} {candidateProfile.lastName} ({candidateProfile.gender})
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingUserId(candidateProfile.id)}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      aria-label="Edit scanned profile"
                      title="Edit scanned profile"
                    >
                      ✏️
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">Testing only: scanned profile details can be edited in admin records.</p>
                  <button
                    type="button"
                    onClick={addConnectionFromProfile}
                    className="mt-2 rounded-lg bg-flyerYellow px-3 py-2 font-semibold"
                  >
                    Confirm and add connection
                  </button>
                </div>
              )}

              <ul className="space-y-2 text-sm">
                {connections.length === 0 && <li className="rounded-lg bg-gray-100 p-2 text-gray-600">No scanned connections yet.</li>}
                {connections.map((connection) => (
                  <li key={`${connection.id}-${connection.addedAt}`} className="rounded-lg border border-gray-200 p-2">
                    <strong>{connection.displayName}</strong> ({connection.gender}) — {connection.relationship.replace('-', ' ')} at {connection.addedAt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="hidden w-full max-w-3xl space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:block">
          <h2 className="text-lg font-bold">Administrator panel (testing only)</h2>
          <p className="text-xs text-gray-600">Only admins should be able to modify event settings in production.</p>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAdminLoggedIn} onChange={(e) => setIsAdminLoggedIn(e.target.checked)} />
            Admin logged in
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Event name
              <input disabled={!isAdminLoggedIn} value={eventName} onChange={(e) => setEventName(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Event cost (USD)
              <input type="number" min={0} disabled={!isAdminLoggedIn} value={eventCost} onChange={(e) => setEventCost(Number(e.target.value))} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Venmo handle placeholder
              <input disabled={!isAdminLoggedIn} value={venmoHandle} onChange={(e) => setVenmoHandle(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Payment info link placeholder
              <input disabled={!isAdminLoggedIn} value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Event start
              <input type="datetime-local" disabled={!isAdminLoggedIn} value={toInputDateTime(eventStart)} onChange={(e) => setEventStart(new Date(e.target.value))} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Event end
              <input type="datetime-local" disabled={!isAdminLoggedIn} value={toInputDateTime(eventEnd)} onChange={(e) => setEventEnd(new Date(e.target.value))} className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200" />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Flyer front upload
              <input type="file" accept="image/*" disabled={!isAdminLoggedIn} onChange={(e) => handleUploadFlyer(e, 'front')} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Flyer back upload
              <input type="file" accept="image/*" disabled={!isAdminLoggedIn} onChange={(e) => handleUploadFlyer(e, 'back')} />
            </label>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">{eventStateMessage}</div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h3 className="mb-2 text-sm font-semibold">Admin check-in by email (adds user row + sends invite)</h3>
            <form onSubmit={handleAdminCheckIn} className="grid gap-2 md:grid-cols-3">
              <input required placeholder="Email" value={checkInEmail} onChange={(e) => setCheckInEmail(e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm" />
              <input required placeholder="First name" value={checkInFirstName} onChange={(e) => setCheckInFirstName(e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm" />
              <input required placeholder="Last name" value={checkInLastName} onChange={(e) => setCheckInLastName(e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm" />
              <select value={checkInGender} onChange={(e) => setCheckInGender(e.target.value as Gender)} className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              <input type="number" min={0} value={checkInAmount} onChange={(e) => setCheckInAmount(Number(e.target.value))} className="rounded border border-gray-300 px-2 py-1 text-sm" placeholder="Amount paid" />
              <select value={checkInMethod} onChange={(e) => setCheckInMethod(e.target.value as PaymentMethod)} className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option value="venmo">Venmo</option>
                <option value="card">Card</option>
                <option value="zelle">Zelle</option>
                <option value="cash">Cash</option>
                <option value="none">Not set</option>
              </select>
              <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={checkInPaid} onChange={(e) => setCheckInPaid(e.target.checked)} />Paid</label>
              <button type="submit" className="rounded bg-flyerYellow px-3 py-1 text-sm font-semibold">Check in + send invite</button>
            </form>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users" className="rounded border border-gray-300 px-2 py-1 text-sm" />
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option value="name">Sort by name</option>
                <option value="email">Sort by email</option>
                <option value="paid">Sort by paid</option>
                <option value="checkedInToday">Sort by today event</option>
              </select>
              <button type="button" onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))} className="rounded border border-gray-300 px-2 py-1 text-sm">{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</button>

              <select value={primaryMergeUserId} onChange={(e) => setPrimaryMergeUserId(e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option value="">Select merge priority account</option>
                {adminUsers.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.id})</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-1">User</th>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">Gender</th>
                    <th className="px-2 py-1">Today&apos;s event</th>
                    <th className="px-2 py-1">Paid</th>
                    <th className="px-2 py-1">Method</th>
                    <th className="px-2 py-1">Invite</th>
                    <th className="px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100">
                      <td className="px-2 py-1">{u.firstName} {u.lastName}<div className="text-[10px] text-gray-500">{u.id}</div></td>
                      <td className="px-2 py-1">{u.email}</td>
                      <td className="px-2 py-1">{u.gender}</td>
                      <td className="px-2 py-1">{u.checkedInToday ? 'Yes' : 'No'}</td>
                      <td className="px-2 py-1">{u.paid ? `$${u.amountPaid}` : 'No'}</td>
                      <td className="px-2 py-1">{u.paymentMethod}</td>
                      <td className="px-2 py-1">{u.invitationSentAt ?? '-'}</td>
                      <td className="px-2 py-1">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingUserId(u.id)}
                            className="rounded border border-gray-300 px-2 py-0.5"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button type="button" onClick={() => mergeAccounts(u.id)} className="rounded border border-gray-300 px-2 py-0.5">Merge</button>
                          <button type="button" onClick={() => setAdminUsers((prev) => prev.filter((x) => x.id !== u.id))} className="rounded border border-red-300 px-2 py-0.5 text-red-700">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <p className="font-semibold">Admin scan user QR to open account details</p>
            <p className="text-xs text-gray-600">Use scanner app and open `/add-connection?from=USER-ID` URL, then search by that USER-ID in this table.</p>
          </div>
        </aside>
      </div>

      {editingUserId && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md space-y-3 rounded-xl bg-white p-4">
            <h3 className="text-lg font-bold">Edit user (testing only)</h3>
            {(() => {
              const user = adminUsers.find((u) => u.id === editingUserId);
              if (!user) return <p>User not found.</p>;
              return (
                <>
                  <input value={user.firstName} onChange={(e) => setAdminUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, firstName: e.target.value } : u))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                  <input value={user.lastName} onChange={(e) => setAdminUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, lastName: e.target.value } : u))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                  <select value={user.gender} onChange={(e) => setAdminUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, gender: e.target.value as Gender } : u))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                  <button type="button" onClick={() => setEditingUserId(null)} className="w-full rounded bg-flyerYellow px-3 py-2 font-semibold">Done</button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {fullScreenFlyer && (
        <button
          type="button"
          onClick={() => setFullScreenFlyer(null)}
          className="fixed inset-0 z-20 bg-black/85 p-2"
          title="Close flyer"
        >
          <img src={fullScreenFlyer} alt="Full screen flyer" className="mx-auto max-h-full w-auto rounded" />
        </button>
      )}
    </main>
  );
}
