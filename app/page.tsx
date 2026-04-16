'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

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

type PaymentRecord = {
  paid: boolean;
  amount: number;
  method: PaymentMethod;
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

function makeUserId(email: string) {
  const safe = email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `USER-${safe || 'GUEST'}-${Math.floor(Math.random() * 900 + 100)}`;
}

export default function EventQrLandingPage() {
  const [step, setStep] = useState<JourneyStep>('landing');
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);

  const [eventName, setEventName] = useState('Metro Singles Fellowship Night');
  const [eventStart, setEventStart] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d;
  });
  const [eventEnd, setEventEnd] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4, 0, 0, 0);
    return d;
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
    gender: 'female' as Gender,
  });

  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [userId, setUserId] = useState('');
  const [shareUrl, setShareUrl] = useState('https://example.com/add-connection');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPaid, setAdminPaid] = useState(false);
  const [adminAmount, setAdminAmount] = useState(0);
  const [adminPaymentMethod, setAdminPaymentMethod] =
    useState<PaymentMethod>('venmo');
  const [paymentRecords, setPaymentRecords] = useState<
    Record<string, PaymentRecord>
  >({});

  const [candidateCode, setCandidateCode] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateGender, setCandidateGender] = useState<Gender>('male');
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      setShareUrl(`${window.location.origin}/add-connection?from=${userId}`);
    }
  }, [userId]);

  const now = new Date();
  const isEventDay = now.toDateString() === eventStart.toDateString();
  const isFutureEvent = now.getTime() < eventStart.getTime();
  const isAroundStart =
    now.getTime() >= eventStart.getTime() - 60 * 60 * 1000 &&
    now.getTime() <= eventStart.getTime() + 90 * 60 * 1000;
  const canCheckIn = isEventDay || isAroundStart;

  const currentPayment = useMemo(() => {
    return paymentRecords[form.email.toLowerCase().trim()] ?? null;
  }, [form.email, paymentRecords]);

  const eventStateMessage = useMemo(() => {
    if (!isEventDay && isFutureEvent) {
      return 'This event is in the future. Display event signup instead of same-day splash urgency.';
    }

    if (isEventDay && isAroundStart) {
      return 'Event is around start time, so attendees should see splash and move quickly into check-in + scanning.';
    }

    if (isEventDay) return 'Event is today. Continue to splash and sign-up flow.';
    return 'Event date passed. Disable new check-ins.';
  }, [isAroundStart, isEventDay, isFutureEvent]);

  const savePaymentRecord = () => {
    const key = adminEmail.toLowerCase().trim();
    if (!key) return;
    setPaymentRecords((prev) => ({
      ...prev,
      [key]: { paid: adminPaid, amount: adminAmount, method: adminPaymentMethod },
    }));
  };

  const beginSignUp = () => setStep('method-select');

  const chooseSignUpMethod = (method: SignUpMethod) => {
    setSignUpMethod(method);
    setStep('signup-form');
  };

  const submitSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canCheckIn) return;

    setHasAccount(true);
    setCheckedInAt(new Date().toLocaleString());
    setUserId(makeUserId(form.email));
    setStep('signup-success');
  };

  const addConnection = () => {
    if (!candidateCode.trim() || !candidateName.trim()) return;
    const relationship =
      form.gender === candidateGender ? 'friend' : 'possible-connection';

    setConnections((prev) => [
      {
        id: candidateCode.trim(),
        displayName: candidateName.trim(),
        gender: candidateGender,
        relationship,
        addedAt: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setCandidateCode('');
    setCandidateName('');
  };

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-gray-900">
      <div className="mx-auto flex w-full max-w-6xl gap-6">
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
                  This app helps you sign up for today&apos;s event and connect with a
                  meaningful, faith-centered matchmaker journey.
                </p>
              </header>

              <div className="flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50 text-sm font-medium text-gray-600">
                Illustration placeholder
              </div>

              <button
                type="button"
                onClick={beginSignUp}
                className="w-full rounded-2xl bg-flyerYellow px-5 py-4 text-base font-bold text-gray-900 shadow-sm transition hover:brightness-95 active:scale-[0.99]"
              >
                Sign Up for This Event + Matchmaker App
              </button>

              <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
                By continuing, you agree to the two required agreements: Safety Policy
                and Biblical View of Marriage.
              </p>
            </>
          )}

          {step === 'method-select' && (
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <h2 className="text-xl font-bold">Choose signup option</h2>
              <p className="text-sm text-gray-700">Recommended: Continue with Google.</p>
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
              <p className="text-sm text-gray-700">
                Signup method selected: <strong>{signUpMethod}</strong>
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(form).map(([key, value]) => (
                  <label key={key} className="flex flex-col gap-1 text-sm capitalize">
                    {key}
                    {key === 'gender' ? (
                      <select
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        value={value}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            gender: e.target.value as Gender,
                          }))
                        }
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    ) : (
                      <input
                        required
                        value={value}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2"
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                <p>
                  Payment lookup:{' '}
                  <strong>
                    {currentPayment
                      ? currentPayment.paid
                        ? `Paid $${currentPayment.amount} via ${currentPayment.method}`
                        : 'Registered but not paid'
                      : 'No admin payment record found yet'}
                  </strong>
                </p>
                <p>
                  Check-in status:{' '}
                  <strong>{checkedInAt ? `Checked in at ${checkedInAt}` : 'Not checked in'}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={!canCheckIn}
                className="w-full rounded-xl bg-flyerYellow px-4 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Complete signup + check in
              </button>
            </form>
          )}

          {step === 'signup-success' && (
            <div className="space-y-3 rounded-xl border border-green-300 bg-green-50 p-4">
              <h2 className="text-xl font-bold">Signup successful</h2>
              <p className="text-sm">
                You are checked in and can continue profile setup or start QR scanning now.
              </p>
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
              <p className="text-sm">
                Users can come back and complete profile details later.
              </p>
              <button
                type="button"
                onClick={() => setStep('scanner')}
                className="rounded-lg bg-flyerYellow px-3 py-2 font-semibold"
              >
                Go to QR scanner
              </button>
            </div>
          )}

          {step === 'scanner' && hasAccount && (
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

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  Scanned QR code
                  <input
                    value={candidateCode}
                    onChange={(e) => setCandidateCode(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="USER-4832"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Name from scanned profile
                  <input
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Jordan P."
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm">
                Scanned person gender
                <select
                  value={candidateGender}
                  onChange={(e) => setCandidateGender(e.target.value as Gender)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>

              <button
                type="button"
                onClick={addConnection}
                className="rounded-lg bg-flyerYellow px-3 py-2 font-semibold"
              >
                Confirm and add connection
              </button>

              <ul className="space-y-2 text-sm">
                {connections.length === 0 && (
                  <li className="rounded-lg bg-gray-100 p-2 text-gray-600">
                    No scanned connections yet.
                  </li>
                )}
                {connections.map((connection) => (
                  <li
                    key={`${connection.id}-${connection.addedAt}`}
                    className="rounded-lg border border-gray-200 p-2"
                  >
                    <strong>{connection.displayName}</strong> ({connection.gender}) —{' '}
                    {connection.relationship.replace('-', ' ')} at {connection.addedAt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="hidden w-full max-w-sm space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:block">
          <h2 className="text-lg font-bold">Administrator panel (testing only)</h2>
          <p className="text-xs text-gray-600">
            Later this moves to admin-only settings/singles-events area. Event timing and payment management are restricted to admins.
          </p>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAdminLoggedIn}
              onChange={(e) => setIsAdminLoggedIn(e.target.checked)}
            />
            Admin logged in
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Event name
            <input
              disabled={!isAdminLoggedIn}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Event start date/time
            <input
              type="datetime-local"
              disabled={!isAdminLoggedIn}
              value={toInputDateTime(eventStart)}
              onChange={(e) => setEventStart(new Date(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Event end date/time
            <input
              type="datetime-local"
              disabled={!isAdminLoggedIn}
              value={toInputDateTime(eventEnd)}
              onChange={(e) => setEventEnd(new Date(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            />
          </label>

          <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">
            <p className="font-semibold">Live event logic</p>
            <p>{eventStateMessage}</p>
          </div>

          <hr className="border-gray-300" />

          <h3 className="text-sm font-semibold">Attendee payment/check-in record</h3>
          <label className="flex flex-col gap-1 text-sm">
            Attendee email
            <input
              disabled={!isAdminLoggedIn}
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={!isAdminLoggedIn}
              checked={adminPaid}
              onChange={(e) => setAdminPaid(e.target.checked)}
            />
            Paid for event
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Amount paid (USD)
            <input
              type="number"
              min={0}
              step={1}
              disabled={!isAdminLoggedIn}
              value={adminAmount}
              onChange={(e) => setAdminAmount(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Payment method
            <select
              disabled={!isAdminLoggedIn}
              value={adminPaymentMethod}
              onChange={(e) => setAdminPaymentMethod(e.target.value as PaymentMethod)}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-200"
            >
              <option value="venmo">Venmo (primary)</option>
              <option value="card">Card</option>
              <option value="zelle">Zelle</option>
              <option value="cash">Cash</option>
              <option value="none">Not set</option>
            </select>
          </label>

          <button
            type="button"
            disabled={!isAdminLoggedIn}
            onClick={savePaymentRecord}
            className="w-full rounded-lg bg-flyerYellow px-3 py-2 font-semibold disabled:opacity-50"
          >
            Save attendee payment record
          </button>
          <p className="text-xs text-gray-600">
            Venmo integration hook: when backend is added, replace manual entry with Venmo webhook/API reconciliation.
          </p>
        </aside>
      </div>
    </main>
  );
}
