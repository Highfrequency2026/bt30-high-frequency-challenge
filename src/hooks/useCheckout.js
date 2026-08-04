import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export function useCheckout() {
  const [loadingId, setLoadingId] = useState(null);
  const { toast } = useToast();

  const startCheckout = async (productId) => {
    setLoadingId(productId);
    try {
      const res = await base44.functions.invoke('create-stripe-checkout', { productId });
      const redirectUrl = res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast({ title: 'Checkout error', description: 'Could not start checkout. Please try again.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Checkout error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoadingId(null);
    }
  };

  return { startCheckout, loadingId };
}