'use client';

import { FormEvent, useMemo, useState } from 'react';

type SignUpMethod = 'google' | 'magic-link' | 'email';
type JourneyStep =
  | 'landing'
  | 'signup'
  | 'signup-success'
  | 'profile'
  | 'scanner';

type Connection = {
  id: string;
  displayName: string;
  relationship: 'friend' | 'possible-connection';
  addedAt: string;
};

const EVENT_NAME = 'Metro Singles Fellowship Night';

function toInputDateTime(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function EventQrLandingPage() {
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

  const [step, setStep] = useState<JourneyStep>('landing');
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>('google');
  const [registrationPaid, setRegistrationPaid] = useState(false);
  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
  });

  const [candidateCode, setCandidateCode] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [relationship, setRelationship] = useState<Connection['relationship']>(
    'possible-connection',
  );
  const [connections, setConnections] = useState<Connection[]>([]);

  const now = new Date();
  const isEventDay = now.toDateString() === eventStart.toDateString();
  const isFutureEvent = now.getTime() < eventStart.getTime();
  const isAroundStart =
    now.getTime() >= eventStart.getTime() - 60 * 60 * 1000 &&
    now.getTime() <= eventStart.getTime() + 90 * 60 * 1000;

  const eventStateMessage = useMemo(() => {
    if (!isEventDay && isFutureEvent) {
      return 'This event is in the future. We will show event signup details so people can pre-register now.';
    }

    if (isEventDay && isAroundStart) {
      return 'Event starts soon (or just started). Show the event splash to speed up check-in and scanning.';
    }

    if (isEventDay) {
      return 'Event is today. Continue to splash and sign-up flow.';
    }

    return 'Event date has passed. Keep this page available for reference, but disable new check-ins.';
  }, [isAroundStart, isEventDay, isFutureEvent]);

  const canCheckIn = isEventDay || isAroundStart;

  const startSignUp = () => setStep('signup');

  const submitSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canCheckIn) return;

    setHasAccount(true);
    setCheckedInAt(new Date().toLocaleString());
    setStep('signup-success');
  };

  const addConnection = () => {
    if (!candidateCode.trim() || !candidateName.trim()) return;
    setConnections((prev) => [
      {
        id: candidateCode.trim(),
        displayName: candidateName.trim(),
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
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-gray-200 p-5 shadow-sm">
        <header className="space-y-2">
          <p className="inline-flex rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold">
            QR Event Entry + Matchmaker Journey
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">{EVENT_NAME}</h1>
          <p className="text-sm text-gray-600">{eventStateMessage}</p>
        </header>

        <div className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm md:grid-cols-2">
          <label className="flex flex-col gap-1">
            Event start (admin controlled)
            <input
              type="datetime-local"
              className="rounded-lg border border-gray-300 px-3 py-2"
              value={toInputDateTime(eventStart)}
              onChange={(e) => setEventStart(new Date(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            Event end (admin controlled)
            <input
              type="datetime-local"
              className="rounded-lg border border-gray-300 px-3 py-2"
              value={toInputDateTime(eventEnd)}
              onChange={(e) => setEventEnd(new Date(e.target.value))}
            />
          </label>
        </div>

        {step === 'landing' && (
          <div className="space-y-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <h2 className="text-xl font-bold">Welcome to the event</h2>
            <p className="text-sm text-gray-700">
              {isFutureEvent
                ? 'Pre-register now and your check-in will be ready on event day.'
                : 'You can sign up now, get checked in, and begin scanning connection QR codes immediately.'}
            </p>
            <button
              type="button"
              onClick={startSignUp}
              className="w-full rounded-xl bg-flyerYellow px-4 py-3 font-bold"
            >
              Sign up for event + app
            </button>
          </div>
        )}

        {step === 'signup' && (
          <form className="space-y-4" onSubmit={submitSignup}>
            <h2 className="text-xl font-bold">Create account and check in</h2>
            <div className="space-y-2 rounded-xl bg-gray-50 p-3">
              <p className="text-sm font-semibold">Choose signup method</p>
              <div className="grid gap-2 md:grid-cols-3">
                {[
                  ['google', 'Continue with Google (recommended)'],
                  ['magic-link', 'Email magic link'],
                  ['email', 'Email + password'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSignUpMethod(value as SignUpMethod)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      signUpMethod === value
                        ? 'border-yellow-500 bg-yellow-100'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <label key={key} className="flex flex-col gap-1 text-sm capitalize">
                  {key}
                  <input
                    required
                    value={value}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm">
              <button
                type="button"
                onClick={() =>
                  setRegistrationPaid(form.email.toLowerCase().includes('vip'))
                }
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                Lookup registration/payment
              </button>
              <span>
                Payment status: <strong>{registrationPaid ? 'Paid' : 'Not paid yet'}</strong>
              </span>
              <span>
                Check-in status: <strong>{checkedInAt ? `Checked in at ${checkedInAt}` : 'Not checked in'}</strong>
              </span>
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
              Account created with <strong>{signUpMethod}</strong>. User is checked in and can continue profile setup or scan event QR connections now.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
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
              Profile completion can happen later. Users can scan right away to avoid missing connection moments during the event.
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
            <p className="text-sm text-gray-700">
              Let others scan your QR and confirm whether they should be added as a friend or possible connection.
            </p>

            <div className="grid gap-2 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Scanned QR code
                <input
                  value={candidateCode}
                  onChange={(e) => setCandidateCode(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="e.g. USER-4832"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Name from QR profile
                <input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Jordan P."
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm">
              Add as
              <select
                value={relationship}
                onChange={(e) =>
                  setRelationship(e.target.value as Connection['relationship'])
                }
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="possible-connection">Possible connection</option>
                <option value="friend">Friend</option>
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
                  <strong>{connection.displayName}</strong> ({connection.id}) —{' '}
                  {connection.relationship.replace('-', ' ')} at {connection.addedAt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
