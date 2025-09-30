import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";


// ✅ Public key from Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Membership() {
    return (
        <div className="max-w-xl mx-auto mt-12 p-6 rounded shadow bg-white text-center">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Gold Membership</h2>
            <p className="mb-6 text-gray-600">
                Get exclusive access by upgrading to <span className="font-semibold">Gold</span> for only <span className="text-purple-600">$10</span>.
            </p>

            {/* Stripe Payment Form */}
            <Elements stripe={stripePromise}>
                <CheckoutForm></CheckoutForm>
            </Elements>
        </div>
    );
}
