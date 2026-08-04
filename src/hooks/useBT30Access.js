import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const BT30_PRODUCT_IDS = ['bt30-preorder', 'bt30-program'];

export function useBT30Access() {
  const { user, isLoadingAuth } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!user) {
      setHasAccess(false);
      setChecking(false);
      return;
    }
    base44.entities.Base44Purchase.filter({ appUserId: user.id, status: 'paid' })
      .then((purchases) => {
        const bt30Purchase = purchases.find((p) => BT30_PRODUCT_IDS.includes(p.productId));
        setHasAccess(!!bt30Purchase);
      })
      .catch(() => setHasAccess(false))
      .finally(() => setChecking(false));
  }, [user, isLoadingAuth]);

  return { hasAccess, checking, isLoggedIn: !!user };
}