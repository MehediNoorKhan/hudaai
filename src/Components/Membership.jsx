import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import UserRoute from "../Components/UserRoute";

// ✅ Stripe Public Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Membership() {
    return (
        <UserRoute>
            <div className="py-24 px-4 sm:px-6 md:px-10">
                <div className="max-w-xl mx-auto px-6 sm:px-8 md:px-10 py-8 sm:py-10 rounded-2xl bg-white text-center shadow-lg">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
                        Upgrade to Gold Membership
                    </h2>

                    {/* Subtitle */}
                    <p className="mb-6 text-blue-400 text-sm sm:text-base">
                        Get exclusive access by upgrading to{" "}
                        <span className="font-semibold text-blue-600">Gold</span> for only{" "}
                        <span className="text-purple-600">$10</span>.
                    </p>

                    {/* Stripe Payment Form */}
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </div>
        </UserRoute>
    );
}
