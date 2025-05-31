'use client';

import { useState } from 'react';
import { Login } from '@/components/Login/Login';
import { Register } from '@/components/Register/Register';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main>
      {showRegister ? (
        <Register onSwitch={() => setShowRegister(false)} />
      ) : (
        <Login onSwitch={() => setShowRegister(true)} />
      )}
    </main>
  );
}
