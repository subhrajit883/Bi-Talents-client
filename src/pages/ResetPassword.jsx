import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { authUrl } from "../config/config";
import logo from "../assets/bit.png";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        if (!password) {
            toast.error("Please enter a new password.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(authUrl.resetPassword, {
                token,
                password,
            });

            if (res.data && res.data.success !== false) {
                toast.success(
                    res.data?.message || "Password reset successfully!"
                );
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            } else {
                toast.error(res.data?.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error(
                err?.response?.data?.message ||
                    "Invalid or expired token. Please request a new password reset."
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
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {success
                            ? "Your password has been reset successfully."
                            : "Enter your new password below to reset your account password."}
                    </p>
                </div>

                {!token ? (
                    <div className="space-y-5 text-center animate-[fadeIn_0.2s_ease-out]">
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-red-700 text-sm flex items-center justify-center gap-2">
                            <FiAlertCircle size={18} />
                            Invalid or missing password reset token.
                        </div>
                        <p className="text-xs text-gray-500">
                            Please check the link from your email or request a new password reset.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="w-full cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition-all hover:bg-blue-700"
                        >
                            Request New Reset Link
                        </button>
                    </div>
                ) : success ? (
                    <div className="space-y-5 text-center animate-[fadeIn_0.2s_ease-out]">
                        <div className="rounded-xl bg-green-50 p-4 border border-green-100 text-green-700 text-sm flex items-center justify-center gap-2">
                            <FiCheckCircle size={20} className="text-green-600" />
                            Password reset successful! Redirecting to login...
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold uppercase tracking-wide text-white transition-all hover:bg-blue-700"
                        >
                            GO TO LOGIN NOW
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                        {/* New Password */}
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {showPwd ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPwd ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {showConfirmPwd ? <FiEye /> : <FiEyeOff />}
                                </button>
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
                                    Resetting Password...
                                </>
                            ) : (
                                <>RESET PASSWORD</>
                            )}
                        </button>
                    </form>
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

export default ResetPassword;
