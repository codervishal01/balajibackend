import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(!!token);
    setLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    window.location.href = '/admin';
  };

  return {
    isAdmin,
    loading,
    signOut
  };
};
