import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getRazorpayClient } from '@/lib/razorpay-server';
import { PAYMENTS_ENABLED, PREMIUM_PRICE_PAISE } from '@/lib/payments';

export async function POST() {
  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({ error: 'Payments not enabled yet' }, { status: 404 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Login pannunga' }, { status: 401 });
  }

  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: PREMIUM_PRICE_PAISE,
      currency: 'INR',
      receipt: `premium-${user.id}-${Date.now()}`,
      notes: { user_id: user.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Order create panna mudiyala' }, { status: 500 });
  }
}
