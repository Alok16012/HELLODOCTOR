import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPredictorUser } from "@/lib/predictorAuth";
import { createRazorpayOrder, PREDICTOR_UNLOCK_AMOUNT_PAISE } from "@/lib/razorpay";

// Starts a Razorpay order to unlock the signed-in user's full NEET predictor
// report. Payment is confirmed by /api/predictor/verify-payment, never here.
export async function POST(request: Request) {
  const user = await getPredictorUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const exam = body?.exam === "pg" ? "pg" : "ug";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }

  let order;
  try {
    order = await createRazorpayOrder(
      PREDICTOR_UNLOCK_AMOUNT_PAISE,
      `pred_${user.id.slice(0, 8)}_${Date.now()}`,
      { user_id: user.id, exam }
    );
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: insertError } = await adminClient.from("predictor_orders").insert({
    user_id: user.id,
    razorpay_order_id: order.id,
    status: "created",
    amount_paise: PREDICTOR_UNLOCK_AMOUNT_PAISE,
    exam,
  });
  if (insertError) {
    console.error("Failed to record predictor order:", insertError.message);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: PREDICTOR_UNLOCK_AMOUNT_PAISE,
    currency: "INR",
    keyId: order.keyId,
  });
}
