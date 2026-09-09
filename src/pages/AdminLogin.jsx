import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { authUrl } from "../config/config";
import toast from "react-hot-toast";

// Replace with your own background image
// import loginBg from "../../../assets/images/login-bg.jpg";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password.");
            return;
        }
        try {
            setLoading(true);

            const res = await axios.post(authUrl.adminlogin, {
                email,
                password,
            });

            console.log(res.data);

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                toast.success("Welcome back, Admin!");
                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
        // style={{
        //     backgroundImage: `url(${loginBg})`,
        // }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/75"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white px-8 py-10 shadow-2xl">

                <div className="text-center">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to your admin account
                    </p>

                </div>

                <form
                    onSubmit={handleLogin}
                    className="mt-8 space-y-5"
                >
                    {/* Email */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="relative">

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-red-600"
                            />

                            <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        </div>

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-red-600"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? (
                                    <FiEye />
                                ) : (
                                    <FiEyeOff />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Remember */}

                    {/* <div className="flex items-center justify-between">

                        <label className="flex items-center gap-2 text-sm text-gray-600">

                            <input
                                type="checkbox"
                                className="accent-red-600"
                            />

                            Remember me

                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text--600 hover:underline"
                        >
                            Forgot Password?
                        </Link>

                    </div> */}

                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-md bg-blue-600 py-3 font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Logging In..."
                            : "LOGIN"}
                    </button>
                </form>


                {/* <div className="my-6 flex items-center">

                    <div className="h-px flex-1 bg-gray-300"></div>

                    <span className="px-3 text-sm text-gray-500">
                        or login with
                    </span>

                    <div className="h-px flex-1 bg-gray-300"></div>

                </div> */}

                {/* <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 py-3 transition hover:bg-gray-50"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="h-5 w-5"
                    />

                    <span className="font-medium text-gray-700">
                        Login with Google
                    </span>
                </button> */}

                {/* Footer */}

                <p className="mt-8 text-center text-xs text-gray-500">
                    © 2026 Bi Talents. All rights reserved.
                </p>

            </div>
        </div>
    );
}

export default AdminLogin;
