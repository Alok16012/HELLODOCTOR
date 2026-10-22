import crypto from "node:crypto";

const API_BASE = "https://api.razorpay.com/v1";

/** One-time price to unlock the full NEET predictor report, in paise. Default ₹49. */
export const PREDICTOR_UNLOCK_AMOUNT_PAISE = Number(process.env.PREDICTOR_UNLOCK_AMOUNT_PAISE) || 4900;

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  return { keyId, keySecret };
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/** Creates a Razorpay order via the REST API (no SDK — just Basic auth + fetch). */
export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>): Promise<RazorpayOrder & { keyId: string }> {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
  });
  if (!response.ok) {
    throw new Error(`Razorpay order creation failed (${response.status}): ${await response.text()}`);
  }
  const order = (await response.json()) as RazorpayOrder;
  return { ...order, keyId };
}

/** Verifies a Razorpay checkout callback's signature: HMAC-SHA256("orderId|paymentId", keySecret). */
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const { keySecret } = credentials();
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
}
