import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiUser,
    FiPhone,
    FiMapPin,

    FiLogIn,
    FiUserPlus,
} from "react-icons/fi";

import { authUrl } from "../../config/config";
import logo from "../../assets/bit.png";

const TAB_LOGIN = "login";
const TAB_REGISTER = "register";

function classNames(...args) {
    return args.filter(Boolean).join(" ");
}

const ClientAuth = ({ initialTab = TAB_LOGIN }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(initialTab);

    /* -------- Login form state -------- */
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [showLoginPwd, setShowLoginPwd] = useState(false);

    /* -------- Register form state -------- */
    const [registerForm, setRegisterForm] = useState({
        companyName: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        password: "",
    });
    const [registerLoading, setRegisterLoading] = useState(false);
    const [showRegisterPwd, setShowRegisterPwd] = useState(false);

    /* -------- Keep activeTab prop in sync when routing between pages -------- */
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab, location.pathname]);

    /* -------- Shared handlers -------- */
    const updateRegister = (field, value) =>
        setRegisterForm((prev) => ({ ...prev, [field]: value }));

    /* -------- Login submit -------- */
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginEmail.trim() || !loginPassword) {
            toast.error("Please enter email and password.");
            return;
        }
        try {
            setLoginLoading(true);
            const res = await axios.post(authUrl.clientLogin, {
                email: loginEmail.trim(),
                password: loginPassword,
            });
            if (res.data && res.data.success) {
                localStorage.setItem("clientToken", res.data.token);
                if (res.data.client) {
                    try {
                        localStorage.setItem(
                            "client",
                            JSON.stringify(res.data.client)
                        );
                    } catch (_) { }
                }
                toast.success(res.data.message || "Welcome back!");
                navigate("/interests", { replace: true });
            } else {
                toast.error(res.data?.message || "Login failed");
            }
        } catch (err) {
            console.error("login error:", err);
            toast.error(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoginLoading(false);
        }
    };

    /* -------- Register submit -------- */
    const handleRegister = async (e) => {
        e.preventDefault();
        const { companyName, name, phone, email, address, password } =
            registerForm;
        if (
            !companyName.trim() ||
            !name.trim() ||
            !phone.trim() ||
            !email.trim() ||
            !address.trim() ||
            !password
        ) {
            toast.error("Please fill in all fields.");
            return;
        }
        try {
            setRegisterLoading(true);
            const res = await axios.post(authUrl.clientRegister, {
                companyName: companyName.trim(),
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                address: address.trim(),
                password,
            });
            if (res.data && res.data.success) {
                localStorage.setItem("token", res.data.token);
                if (res.data.client) {
                    try {
                        localStorage.setItem(
                            "client",
                            JSON.stringify(res.data.client)
                        );
                    } catch (_) { }
                }
                toast.success(
                    res.data.message || "Client registration successful!"
                );
                navigate("/dashboard", { replace: true });
            } else {
                toast.error(res.data?.message || "Registration failed");
            }
        } catch (err) {
            console.error("Client register error:", err);
            toast.error(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setRegisterLoading(false);
        }
    };

    const switchTab = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        navigate(tab === TAB_LOGIN ? "/login" : "/register", {
            replace: true,
        });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/25" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md lg:max-w-3xl rounded-2xl bg-white px-5 sm:px-8 lg:px-10 py-8 sm:py-10 shadow-2xl overflow-hidden transition-all duration-300">
                {/* Header text with Logo */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Bi Talents Logo" className="h-16 w-auto object-contain" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                        {activeTab === TAB_LOGIN
                            ? "Welcome Back"
                            : "Create Account"}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {activeTab === TAB_LOGIN
                            ? "Login to your account"
                            : "Register your company as a client"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="relative grid grid-cols-2 mb-8 p-1.5 rounded-xl bg-gray-100 text-sm font-semibold border border-gray-200">
                    <button
                        type="button"
                        onClick={() => switchTab(TAB_LOGIN)}
                        className={classNames(
                            "relative z-10 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
                            activeTab === TAB_LOGIN
                                ? "bg-blue-600 text-white shadow"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <FiLogIn size={14} />
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => switchTab(TAB_REGISTER)}
                        className={classNames(
                            "relative z-10 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
                            activeTab === TAB_REGISTER
                                ? "bg-blue-600 text-white shadow"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <FiUserPlus size={14} />
                        Register
                    </button>
                </div>

                {/* ====== Login form ====== */}
                {activeTab === TAB_LOGIN && (
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5 animate-[fadeIn_0.2s_ease-out]"
                    >
                        {/* Email */}
                        <div className="group mt-2 rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showLoginPwd ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={loginPassword}
                                    onChange={(e) =>
                                        setLoginPassword(e.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowLoginPwd(!showLoginPwd)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {showLoginPwd ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="lg:col-span-2 w-full cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loginLoading ? (
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
                                    Logging In...
                                </>
                            ) : (
                                <>LOGIN</>
                            )}
                        </button>
                    </form>
                )}

                {/* ====== Register form ====== */}
                {activeTab === TAB_REGISTER && (
                    <form
                        onSubmit={handleRegister}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 max-h-[62vh] lg:max-h-none overflow-y-auto lg:overflow-visible pr-1 lg:pr-0 animate-[fadeIn_0.2s_ease-out]"
                    >
                        {/* Row 1: Full Name (2 cols) */}
                        <div className="lg:col-span-2 group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={registerForm.name}
                                    onChange={(e) => updateRegister("name", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Row 2: Company Name (1 col) */}
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter company name"
                                    value={registerForm.companyName}
                                    onChange={(e) => updateRegister("companyName", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Row 2: Phone Number (1 col) */}
                        <div className="group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={registerForm.phone}
                                    onChange={(e) => updateRegister("phone", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Row 3: Email Address (2 cols) */}
                        <div className="lg:col-span-2 group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={registerForm.email}
                                    onChange={(e) => updateRegister("email", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Row 4: Address (textarea, 2 cols) */}
                        <div className="lg:col-span-2 group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={2}
                                    placeholder="Enter your address"
                                    value={registerForm.address}
                                    onChange={(e) => updateRegister("address", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600 resize-none"
                                />
                                <FiMapPin className="absolute right-3 top-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Row 5: Password (2 cols) */}
                        <div className="lg:col-span-2 group rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showRegisterPwd ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={registerForm.password}
                                    onChange={(e) => updateRegister("password", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterPwd(!showRegisterPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {showRegisterPwd ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {/* Centered Register Button */}
                        <div className="lg:col-span-2 flex justify-center mt-2">
                            <button
                                type="submit"
                                disabled={registerLoading}
                                className="w-full max-w-xs cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {registerLoading ? (
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
                                        Registering...
                                    </>
                                ) : (
                                    <>REGISTER</>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-500">
                    © 2026 Bi Talents. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ClientAuth;
export { TAB_LOGIN, TAB_REGISTER };
