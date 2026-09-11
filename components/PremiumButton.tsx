'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PremiumButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setError('');
    setLoading(true);

    const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!scriptLoaded) {
      setLoading(false);
      setError('Razorpay load aagala. Internet check pannunga.');
      return;
    }

    const res = await fetch('/api/razorpay/create-order', { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? 'Order create panna mudiyala.');
      return;
    }

    setLoading(false);

    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: 'TET & TNPSC Study Hall',
      description: 'Premium materials access',
      theme: { color: '#1E2A4A' },
      handler: function () {
        // Webhook updates is_premium in the background; refresh to pick it up.
        router.refresh();
      },
    });

    rzp.on('payment.failed', function () {
      setError('Payment fail aachu. Try pannunga.');
    });

    rzp.open();
  }

  return (
    <div>
      <button onClick={handleUpgrade} disabled={loading} className="btn-gold">
        {loading ? 'Loading…' : 'Upgrade to Premium'}
      </button>
      {error && <p className="text-err text-sm mt-2">{error}</p>}
    </div>
  );
}
