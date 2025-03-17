
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    setToken(storedToken);
    setRole(storedRole);
  }, []);

  return { token, role };
};
