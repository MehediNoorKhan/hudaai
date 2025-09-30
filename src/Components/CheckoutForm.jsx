import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const price = 1000; // $10 (Stripe uses cents)

    useEffect(() => {
        // Create PaymentIntent when component mounts
        axiosSecure.post("/create-payment-intent", { amount: price })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(err => console.error("PaymentIntent error:", err));
    }, [axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const card = elements.getElement(CardElement);
        if (!card) return;

        try {
            // 1️⃣ Create PaymentMethod
            const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                type: "card",
                card,
                billing_details: {
                    name: user?.displayName || "Anonymous",
                    email: user?.email,
                },
            });

            if (pmError) {
                Swal.fire("Error", pmError.message, "error");
                setLoading(false);
                return;
            }

            // 2️⃣ Confirm Payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                Swal.fire("Payment Failed", confirmError.message, "error");
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                // 3️⃣ Save transaction to backend
                const transactionData = {
                    email: user?.email,
                    amount: paymentIntent.amount / 100, // convert cents to dollars
                    transactionId: paymentIntent.id,
                    cardType: paymentMethod.card.brand,
                    cardOwner: paymentMethod.billing_details.name,
                };

                await axiosSecure.post("/save-payment", transactionData);

                Swal.fire("Success", "You are now a Gold Member!", "success");
            }
        } catch (err) {
            console.error("Payment error:", err);
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement className="p-3 border rounded" />

            <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className={`px-6 py-2 rounded bg-purple-600 text-white font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Processing..." : "Pay $10"}
            </button>
        </form>
    );
}
