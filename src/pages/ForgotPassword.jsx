import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { authUrl } from "../config/config";
import logo from "../assets/bit.png";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(authUrl.forgotPassword, {
                email: email.trim(),
            });

            if (res.data && res.data.success !== false) {
                toast.success(
                    res.data?.message || "Password reset link sent to your email!"
                );
                setSubmitted(true);
            } else {
                toast.error(res.data?.message || "Failed to send reset link");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            toast.error(
                err?.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center py-10 px-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/25" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-5 sm:px-8 py-8 sm:py-10 shadow-2xl overflow-hidden transition-all duration-300">
                {/* Header text with Logo */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img
                            src={logo}
                            alt="Bi Talents Logo"
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Forgot Password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {submitted
                            ? "Check your inbox for further instructions."
                            : "Enter your registered email address to receive a password reset link."}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                    required
                                />
                                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Sending Link...
                                </>
                            ) : (
                                <>SEND RESET LINK</>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 text-center animate-[fadeIn_0.2s_ease-out]">
                        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 text-blue-700 text-sm">
                            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox or spam folder.
                        </div>
                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                            Didn't receive email? Try again
                        </button>
                    </div>
                )}

                {/* Back to Login Link */}
                <div className="mt-8 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                        <FiArrowLeft size={16} /> Back to Login
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-500">
                    © 2026 Bi Talents. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
