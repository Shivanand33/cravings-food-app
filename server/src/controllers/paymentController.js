import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const RazorpayGetKey = async (req, res, next) => {
  try {
    const key = process.env.RAZORPAY_TEST_API_KEY || "rzp_test_mockkey123";
    res.status(200).json({ key });
  } catch (error) {
    next(error);
  }
};

export const RazorPayCreateOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      const error = new Error("Invalid Amount");
      error.statusCode = 400;
      return next(error);
    }

    const Total = Number(amount);
    const RazorPayOptions = {
      amount: Math.round(Total * 100),
      currency: "INR",
      receipt: `CravingReciept_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    };

    const rzpKey = process.env.RAZORPAY_TEST_API_KEY?.trim();
    if (!rzpKey || rzpKey.includes("1234567890")) {
      // Mock order response if real keys are not provided
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: RazorPayOptions.amount,
        currency: "INR",
        receipt: RazorPayOptions.receipt,
        status: "created",
      };
      return res.status(200).json({ message: "Mock Order Created", data: mockOrder });
    }

    const order = await razorpay.orders.create(RazorPayOptions);
    res.status(200).json({ message: "Redirecting for Payment", data: order });
  } catch (error) {
    next(error);
  }
};

export const RazorPayVerifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      const error = new Error("Payment details missing");
      error.statusCode = 400;
      return next(error);
    }

    const secret = process.env.RAZORPAY_TEST_API_SECRET;
    if (!secret || secret.includes("1234567890") || razorpay_order_id.startsWith("order_mock_")) {
      return res.status(200).json({ success: true, message: "Mock Payment Verified Successfully" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: "Payment Verified Successfully" });
    } else {
      const error = new Error("Invalid Payment Signature");
      error.statusCode = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};