'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const authGuard = (Component: React.FC) => {
  return function AuthGuard(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login'); 
      }
    }, []);

    return <Component {...props} />;
  };
};
