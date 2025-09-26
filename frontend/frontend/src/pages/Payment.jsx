import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe publishable key
const stripePromise = loadStripe("pk_test_51RyrJh3BS8BoCmLZ7iOr6wroTJlquReEKwBnDC6wq8tHIkQC1XrLukoHdouYP2anMsS1mhLcFghXqMHPq8FkdUvx00VC2S41Ds");

const CheckoutForm = ({ amount, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/create-payment-intent/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setStatus(" Backend did not return clientSecret");
      })
      .catch(err => setStatus(" Backend error: " + err.message));
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setStatus("Processing...");

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setStatus("❌ Payment failed: " + result.error.message);
      toast.error("Payment failed: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setStatus("✅ Payment succeeded!");
      toast.success("✅ Your order is confirmed!");

      // Call backend to update payment_status
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/confirm/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            paymentIntentId: result.paymentIntent.id,
          }),
        });
        const data = await response.json();
        console.log("Backend confirmation:", data);
      } catch (err) {
        console.error("Backend error:", err);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || !clientSecret}>
          Pay Nrs.{amount}
        </button>
        <p>{status}</p>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const PaymentPage = () => {
  const order = JSON.parse(localStorage.getItem("orderDetails")) || {};
  const amount = order.total_cost || 0;
  const orderId = order.id;

  return (
    <Elements stripe={stripePromise}>
      <h2>Payment for Order #{orderId || "N/A"}</h2>
      <CheckoutForm amount={amount} orderId={orderId} />
    </Elements>
  );
};

export default PaymentPage;
export { PaymentPage };
