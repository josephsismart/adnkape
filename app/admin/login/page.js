'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Seal, BeanDivider } from '@/components/Brand';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push(params.get('next') || '/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-5 py-12">
      <form onSubmit={onSubmit} className="card w-full">
        <div className="mb-7 text-center">
          <Seal size={62} className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold text-bean">Admin sign in</h1>
          <p className="mt-1 text-[13px] text-brew">ADN Kape · Farm data management</p>
          <BeanDivider className="mt-5" />
        </div>

        <label className="label" htmlFor="username">
          <FontAwesomeIcon icon={faUser} className="mr-1.5" />
          Username
        </label>
        <input
          id="username"
          className="input mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="label" htmlFor="password">
          <FontAwesomeIcon icon={faLock} className="mr-1.5" />
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="mb-4 rounded-lg bg-cherry/10 p-3 text-sm text-cherry">{error}</p>
        )}

        <button className="btn-primary w-full" disabled={busy}>
          {busy && <FontAwesomeIcon icon={faSpinner} spin />}
          Sign in
        </button>

        <p className="mt-4 text-center text-xs text-brew">
          Credentials are set with <code>ADMIN_USERNAME</code> / <code>ADMIN_PASSWORD</code>{' '}
          in your environment file.
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
