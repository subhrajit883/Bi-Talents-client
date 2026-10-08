
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FiUser,
    FiCalendar,
    FiPhone,
    FiMail,
    FiMapPin,
    FiGrid,
    FiCheckCircle,
    FiSend,
    FiPlus,
    FiX,
    FiStar,
} from "react-icons/fi";

import { categoryUrl, talentEnquiryUrl } from "../config/config";

const DEFAULT_WORK_OPTIONS = [
    "Fashion Modelling",
    "Commercial Modelling",
    "Ramp Walk",
    "Print Modelling",
    "Acting / Drama",
    "Voiceover / Dubbing",
    "Dance Performance",
    "Brand Endorsement",
];

const TalentEnquiryForm = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "Male",
        contactNumber: "",
        emailAddress: "",
        address: "",
        interestedInCategory: "",
        works: [],
        driveLink: "",
        youtubeLink: ""
    });

    const [customWork, setCustomWork] = useState("");

    // Fetch active categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(categoryUrl.getAll);

                const list = res.data.categories || [];
                const activeCats = list.filter(
                    (cat) => cat.isActive !== false
                );

                setCategories(activeCats);

                if (activeCats.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        interestedInCategory: activeCats[0]._id,
                    }));
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
                toast.error("Failed to load categories");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Toggle work selection
    const toggleWorkSelection = (workName) => {
        setFormData((prev) => {
            const exists = prev.works.includes(workName);

            if (exists) {
                return {
                    ...prev,
                    works: prev.works.filter(
                        (item) => item !== workName
                    ),
                };
            }

            return {
                ...prev,
                works: [...prev.works, workName],
            };
        });
    };

    // Add custom work
    const handleAddCustomWork = (e) => {
        e.preventDefault();

        const trimmed = customWork.trim();

        if (!trimmed) return;

        if (formData.works.includes(trimmed)) {
            toast.error("Work type already added");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            works: [...prev.works, trimmed],
        }));

        setCustomWork("");
    };

    // Remove selected work
    const handleRemoveWork = (workName) => {
        setFormData((prev) => ({
            ...prev,
            works: prev.works.filter((w) => w !== workName),
        }));
    };

    // Submit enquiry
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only full name and contact number are mandatory
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name");
            return;
        }

        if (!formData.contactNumber.trim()) {
            toast.error("Please enter your contact number");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                fullName: formData.fullName.trim(),
                contactNumber: formData.contactNumber.trim(),
                ...(formData.dateOfBirth && {
                    dateOfBirth: formData.dateOfBirth,
                }),
                ...(formData.gender && {
                    gender: formData.gender,
                }),
                ...(formData.emailAddress.trim() && {
                    emailAddress: formData.emailAddress.trim(),
                }),
                ...(formData.address.trim() && {
                    address: formData.address.trim(),
                }),
                ...(formData.interestedInCategory && {
                    interestedInCategory: formData.interestedInCategory,
                }),
                works: formData.works,
                ...(formData.driveLink.trim() && {
                    driveLink: formData.driveLink.trim(),
                }),
                ...(formData.youtubeLink.trim() && {
                    youtubeLink: formData.youtubeLink.trim(),
                }),
            };

            const res = await axios.post(
                talentEnquiryUrl.create,
                payload
            );

            if (
                res.data?.success ||
                res.status === 200 ||
                res.status === 201
            ) {
                toast.success(
                    "Enquiry submitted successfully! We will contact you soon."
                );

                // Reset form
                setFormData({
                    fullName: "",
                    dateOfBirth: "",
                    gender: "Male",
                    contactNumber: "",
                    emailAddress: "",
                    address: "",
                    driveLink: "",
                    youtubeLink: "",
                    interestedInCategory: categories[0]?._id || "",
                    works: [],
                });

                setCustomWork("");
            }
        } catch (err) {
            console.error("Enquiry submission failed:", err);

            toast.error(
                err?.response?.data?.message ||
                "Failed to submit enquiry. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 py-10 sm:py-4 px-4 sm:px-6 lg:px-8">
            {/* Ambient background */}
            {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-indigo-600/15 blur-3xl" />
                <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_35%)]" />
            </div> */}

            <div className="relative max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center sm:mb-5 mt-5">


                    <h1 className="mt-1 text-3xl sm:text-2xl lg:text-4xl font-bold leading-tight pb-2 tracking-tight bg-linear-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                        Talent Enquiry Form
                    </h1>

                    <p className="mt-3 text-sm sm:text-base leading-7 text-slate-400 max-w-2xl mx-auto">
                        <span className="block">
                            Interested in showcasing your talent?
                        </span>
                        <span className="block">
                            Fill out the details below and get discovered.
                        </span>
                    </p>

                    <div className="mt-6 mb-5  flex items-center justify-center gap-2">
                        <span className="h-px w-10 bg-linear-to-r from-transparent to-blue-500/60" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                        <span className="h-px w-10 bg-linear-to-l from-transparent to-blue-500/60" />
                    </div>
                </div>

                {/* Main Form */}
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-400/70 to-transparent" />

                    <div className="p-5 sm:p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* Personal Information */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-400 shadow-lg shadow-blue-950/20">
                                        <FiUser size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold text-white">
                                            Personal Information
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Tell us a little about yourself
                                        </p>
                                    </div>
                                    <div className="ml-auto hidden sm:block h-px flex-1 bg-linear-to-r from-slate-800 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Full Name <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                                required
                                            />
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                            />
                                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Gender
                                        </label>
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {["Male", "Female", "Other"].map((g) => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            gender: g,
                                                        }))
                                                    }
                                                    className={`relative py-3 px-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${formData.gender === g
                                                        ? "bg-blue-600/15 border-blue-500/70 text-blue-200 shadow-lg shadow-blue-950/30"
                                                        : "bg-slate-950/45 border-slate-800/90 text-slate-500 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-300"
                                                        }`}
                                                >
                                                    {formData.gender === g && (
                                                        <FiCheckCircle size={14} className="text-blue-400" />
                                                    )}
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interested Category */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Interested In Category
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="interestedInCategory"
                                                value={formData.interestedInCategory}
                                                onChange={handleChange}
                                                disabled={loadingCategories}
                                                className="w-full pl-11 pr-8 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm appearance-none"
                                            >
                                                <option value="">
                                                    {loadingCategories
                                                        ? "Loading categories..."
                                                        : "Select a category"}
                                                </option>

                                                {categories.map((cat) => (
                                                    <option
                                                        key={cat._id}
                                                        value={cat._id}
                                                        className="bg-slate-900 text-slate-100"
                                                    >
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <FiGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">
                                                ▾
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 shadow-lg shadow-cyan-950/20">
                                        <FiPhone size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold text-white">
                                            Contact Details
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            How can our team reach you?
                                        </p>
                                    </div>
                                    <div className="ml-auto hidden sm:block h-px flex-1 bg-linear-to-r from-slate-800 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Contact Number */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Contact Number <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                                placeholder="e.g. 9876543210"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                                required
                                            />
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="emailAddress"
                                                value={formData.emailAddress}
                                                onChange={handleChange}
                                                placeholder="e.g. rahul.sharma@example.com"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                            />
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="sm:col-span-2 group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="address"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="e.g. Salt Lake, Kolkata, West Bengal, India"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner resize-none"
                                            />
                                            <FiMapPin className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={17} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Work Specialties */}
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 shadow-lg shadow-indigo-950/20">
                                        <FiStar size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold text-white">
                                            Work & Portfolio Interests
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Choose the opportunities that interest you
                                        </p>
                                    </div>
                                    <div className="ml-auto hidden sm:block h-px flex-1 bg-linear-to-r from-slate-800 to-transparent" />
                                </div>

                                <p className="text-xs leading-6 text-slate-500 mb-5 ml-0 sm:ml-[3.75rem]">
                                    Select all areas of work you are interested in or add your custom work domain.
                                </p>

                                {/* Preset Options */}
                                <div className="flex flex-wrap gap-2.5 mb-5">
                                    {DEFAULT_WORK_OPTIONS.map((work) => {
                                        const selected = formData.works.includes(work);

                                        return (
                                            <button
                                                key={work}
                                                type="button"
                                                onClick={() => toggleWorkSelection(work)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 border ${selected
                                                    ? "bg-blue-500/15 border-blue-400/60 text-blue-200 shadow-lg shadow-blue-950/20 -translate-y-0.5"
                                                    : "bg-slate-950/45 border-slate-800/90 text-slate-400 hover:border-blue-500/30 hover:bg-slate-900 hover:text-slate-200"
                                                    }`}
                                            >
                                                {selected ? (
                                                    <FiCheckCircle className="text-blue-400" size={14} />
                                                ) : (
                                                    <FiPlus className="text-slate-600" size={14} />
                                                )}
                                                {work}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Work Input */}
                                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl mb-5">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={customWork}
                                            onChange={(e) => setCustomWork(e.target.value)}
                                            placeholder="Add custom work type..."
                                            className="w-full px-4 py-3 rounded-xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-xs"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddCustomWork}
                                        className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                                    >
                                        <FiPlus size={14} />
                                        Add Work
                                    </button>
                                </div>

                                {/* Selected Works */}
                                {formData.works.length > 0 && (
                                    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-blue-500/[0.04] border border-blue-500/15">
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Selected Works
                                            </span>
                                            <span className="px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold">
                                                {formData.works.length} selected
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {formData.works.map((w) => (
                                                <span
                                                    key={w}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium"
                                                >
                                                    {w}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveWork(w)}
                                                        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-500/20 hover:text-white transition-colors"
                                                    >
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Portfolio Links */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">

                                    {/* Google Drive */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Google Drive Link
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="url"
                                                name="driveLink"
                                                value={formData.driveLink}
                                                onChange={handleChange}
                                                placeholder="https://drive.google.com/..."
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                            />

                                            <svg
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                                width="17"
                                                height="17"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 2v12" />
                                                <path d="m5 9 7 7 7-7" />
                                                <path d="M5 22h14" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* YouTube */}
                                    <div className="group">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            YouTube Link
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="url"
                                                name="youtubeLink"
                                                value={formData.youtubeLink}
                                                onChange={handleChange}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/55 border border-slate-800/90 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-700 transition-all text-sm shadow-inner"
                                            />

                                            <svg
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                                width="17"
                                                height="17"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 12s0-4-1-6-2-2-4-2H7C5 4 3 4 2 6s-1 6-1 6 0 4 1 6 2 2 4 2h10c2 0 3-1 4-2s1-6 1-6Z" />
                                                <path d="m10 8 5 4-5 4V8Z" />
                                            </svg>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6 border-t border-slate-800/80">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                                    {/* <div className="text-center sm:text-left">
                                        <p className="text-sm font-semibold text-slate-300">
                                            Ready to get discovered?
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Submit your details and our team will get in touch.
                                        </p>
                                    </div> */}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto min-w-52 px-7 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-950/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:translate-y-0 border border-blue-400/20"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting Enquiry...
                                            </>
                                        ) : (
                                            <>
                                                <FiSend size={16} />
                                                Submit Enquiry
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="text-center text-[11px] text-slate-600 mt-6">
                    Your information is used only to process your talent enquiry.
                </p>
            </div>
        </div>
    );
};

export default TalentEnquiryForm;
