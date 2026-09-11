import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';
import { PAYMENTS_ENABLED } from '@/lib/payments';

// Configure this URL in Razorpay Dashboard -> Settings -> Webhooks
// as: https://your-app.vercel.app/api/razorpay/webhook
// Subscribe to event: payment.captured
export async function POST(req: Request) {
  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({ error: 'Payments not enabled yet' }, { status: 404 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    const userId = payment?.notes?.user_id;

    if (userId) {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
