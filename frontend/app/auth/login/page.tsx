'use client';

import { useState } from 'react';
import { loginUser } from '@/services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      const { token, role, athleteId} = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('athleteId', athleteId);

      if (role) {
        router.push(`/dashboard/${role}s`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
