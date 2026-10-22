import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPredictorUser } from "@/lib/predictorAuth";
import { verifyRazorpaySignature } from "@/lib/razorpay";

// Verifies a Razorpay checkout callback's signature server-side, then marks
// the signed-in user as unlocked. Nothing here trusts the client's word that
// payment succeeded — the HMAC check is what actually matters.
export async function POST(request: Request) {
  const user = await getPredictorUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = verifyRazorpaySignature(orderId, paymentId, signature);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }
  if (!valid) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }
  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: order, error: orderError } = await adminClient
    .from("predictor_orders")
    .select("user_id, amount_paise")
    .eq("razorpay_order_id", orderId)
    .single();
  if (orderError || !order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found." }, { status: 400 });
  }

  await adminClient.from("predictor_orders").update({ status: "paid", razorpay_payment_id: paymentId }).eq("razorpay_order_id", orderId);

  const { error: unlockError } = await adminClient.from("predictor_unlocks").upsert({
    user_id: user.id,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    amount_paise: order.amount_paise,
  });
  if (unlockError) {
    console.error("Failed to record predictor unlock:", unlockError.message);
    return NextResponse.json({ error: "Payment verified but unlock failed — please contact support." }, { status: 500 });
  }

  return NextResponse.json({ unlocked: true });
}
