import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
export function useUserId() {
  const { accessToken } = useAuth();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      if (!accessToken) return;
      try {
        // Use api.get for consistency
        const res = await api.get('/profile/me');
        const data = res.data;
          setUserId(data.profile?.user_id || data.profile?.user_id || data.profile?.user_id || data.user_id || data.user_id|| null);
      } catch {
        setUserId(null);
      }
    }
    fetchUserId();
  }, [accessToken]);

  return userId;
}
