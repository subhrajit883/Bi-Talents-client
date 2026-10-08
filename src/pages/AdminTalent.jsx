import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
    FiTrash2,
    FiPlus,
    FiX,
    FiChevronDown,
    FiUpload,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiHash,
    FiStar,
    FiCheck,
    FiGrid,
    FiThumbsUp,
    FiAlignLeft,
    FiMaximize2,
    FiActivity,
    FiSliders,
    FiTag,
    FiSun,
    FiEye,
    FiVideo,
} from "react-icons/fi";
import { talentUrl, categoryUrl, apiClient } from "../config/config";

const AdminTalent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const isEdit = Boolean(editId);

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        c_id: "",
        name: "",
        age: "",
        categories: [],
        address: "",
        phone: "",
        email: "",
        works: [],
        recommendTalent: false,
        bio: "",
        youtubeLink: "",
        height: "",
        weight: "",
        chestBust: "",
        waist: "",
        hips: "",
        shoulder: "",
        shoeSize: "",
        dressSize: "",
        clothingSize: "",
        hairColour: "",
        eyeColour: "",
        skinTone: "",
    });

    const [workInput, setWorkInput] = useState("");

    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    const [portfolioImages, setPortfolioImages] = useState([]);
    const [portfolioVideos, setPortfolioVideos] = useState([]);
    const [removedPortfolioImageIds, setRemovedPortfolioImageIds] = useState([]);
    const [removedPortfolioVideoIds, setRemovedPortfolioVideoIds] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [isDraggingProfile, setIsDraggingProfile] = useState(false);
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [loadingTalent, setLoadingTalent] = useState(false);

    const portfolioImgInputRef = useRef(null);
    const portfolioVidInputRef = useRef(null);
    const profileImgInputRef = useRef(null);
    const catDropdownRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get(categoryUrl.getAll);
                setCategories(
                    (res.data.categories || []).filter((c) => c.isActive)
                );
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isEdit || !editId) return;
        const fetchTalent = async () => {
            try {
                setLoadingTalent(true);
                const res = await apiClient.get(
                    `${talentUrl.getTalentById}${editId}`
                );
                const t = res.data.talent;
                if (!t) return;
                setForm({
                    c_id: t.c_id || "",
                    name: t.name || "",
                    age: t.age || "",
                    categories: (t.categories || []).map(
                        (c) => c._id || c
                    ),
                    address: t.address || "",
                    phone: t.phone || "",
                    email: t.email || "",
                    works: [...(t.works || [])],
                    recommendTalent: Boolean(t.recommendTalent),
                    bio: t.bio || "",
                    youtubeLink: t.youtubeLink || "",
                    height: t.height || "",
                    weight: t.weight || "",
                    chestBust: t.chestBust || "",
                    waist: t.waist || "",
                    hips: t.hips || "",
                    shoulder: t.shoulder || "",
                    shoeSize: t.shoeSize || "",
                    dressSize: t.dressSize || "",
                    clothingSize: t.clothingSize || "",
                    hairColour: t.hairColour || "",
                    eyeColour: t.eyeColour || "",
                    skinTone: t.skinTone || "",
                });
                setProfileImagePreview(t.profileImage?.url || null);
                setPortfolioImages(
                    (t.portfolioImages || []).map((img) => ({
                        file: null,
                        preview: img.url,
                        existingId: img._id,
                    }))
                );
                setPortfolioVideos(
                    (t.portfolioVideos || []).map((vid) => ({
                        file: null,
                        preview: vid.url,
                        existingId: vid._id,
                    }))
                );
            } catch (err) {
                console.error(err);
                toast.error("Failed to load candidate");
            } finally {
                setLoadingTalent(false);
            }
        };
        fetchTalent();
    }, [editId, isEdit]);

    /* Close category dropdown on outside click */
    useEffect(() => {
        const onClickOutside = (e) => {
            if (
                catDropdownRef.current &&
                !catDropdownRef.current.contains(e.target)
            ) {
                setShowCatDropdown(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () =>
            document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const handleInput = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const toggleCategory = (catId) => {
        setForm((prev) => {
            const has = prev.categories.includes(catId);
            return {
                ...prev,
                categories: has
                    ? prev.categories.filter((id) => id !== catId)
                    : [...prev.categories, catId],
            };
        });
    };

    const removeCategory = (catId) => {
        setForm((prev) => ({
            ...prev,
            categories: prev.categories.filter((id) => id !== catId),
        }));
    };

    const addWork = () => {
        const v = workInput.trim();
        if (!v) return;
        setForm((prev) => ({ ...prev, works: [...prev.works, v] }));
        setWorkInput("");
    };

    const removeWork = (idx) => {
        setForm((prev) => ({
            ...prev,
            works: prev.works.filter((_, i) => i !== idx),
        }));
    };

    const onProfileImageChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setProfileImage(f);
        setProfileImagePreview(URL.createObjectURL(f));
    };

    const onProfileImageDrop = (e) => {
        e.preventDefault();
        setIsDraggingProfile(false);
        const f = e.dataTransfer.files?.[0];
        if (!f || !f.type.startsWith("image/")) {
            toast.error("Please drop an image file");
            return;
        }
        setProfileImage(f);
        setProfileImagePreview(URL.createObjectURL(f));
    };

    const removeProfileImage = () => {
        setProfileImage(null);
        setProfileImagePreview(null);
        if (profileImgInputRef.current)
            profileImgInputRef.current.value = "";
    };

    const onPortfolioImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const items = files.map((f) => ({
            file: f,
            preview: URL.createObjectURL(f),
        }));
        setPortfolioImages((prev) => [...prev, ...items]);
        if (portfolioImgInputRef.current)
            portfolioImgInputRef.current.value = "";
    };

    const removePortfolioImage = (idx) => {
        setPortfolioImages((prev) => {
            const item = prev[idx];
            if (item?.existingId) {
                setRemovedPortfolioImageIds((ids) => [...ids, item.existingId]);
            }
            return prev.filter((_, i) => i !== idx);
        });
    };

    const onPortfolioVideosChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const items = files.map((f) => ({
            file: f,
            preview: URL.createObjectURL(f),
        }));
        setPortfolioVideos((prev) => [...prev, ...items]);
        if (portfolioVidInputRef.current)
            portfolioVidInputRef.current.value = "";
    };

    const removePortfolioVideo = (idx) => {
        setPortfolioVideos((prev) => {
            const item = prev[idx];
            if (item?.existingId) {
                setRemovedPortfolioVideoIds((ids) => [...ids, item.existingId]);
            }
            return prev.filter((_, i) => i !== idx);
        });
    };

    const buildPayload = () => {
        const fd = new FormData();
        fd.append("c_id", form.c_id);
        fd.append("name", form.name);
        fd.append("age", String(form.age));
        fd.append("address", form.address);
        fd.append("phone", form.phone);
        fd.append("email", form.email);
        fd.append("works", JSON.stringify(form.works));
        fd.append("recommendTalent", String(form.recommendTalent));
        fd.append("bio", form.bio);
        fd.append("youtubeLink", form.youtubeLink);
        fd.append("height", form.height);
        fd.append("weight", form.weight);
        fd.append("chestBust", form.chestBust);
        fd.append("waist", form.waist);
        fd.append("hips", form.hips);
        fd.append("shoulder", form.shoulder);
        fd.append("shoeSize", form.shoeSize);
        fd.append("dressSize", form.dressSize);
        fd.append("clothingSize", form.clothingSize);
        fd.append("hairColour", form.hairColour);
        fd.append("eyeColour", form.eyeColour);
        fd.append("skinTone", form.skinTone);

        fd.append("categories", JSON.stringify(form.categories));

        if (profileImage) {
            fd.append("profileImage", profileImage);
        }
        portfolioImages.forEach((item) => {
            if (item.file) fd.append("portfolioImages", item.file);
        });
        portfolioVideos.forEach((item) => {
            if (item.file) fd.append("portfolioVideos", item.file);
        });
        if (isEdit) {
            const keptImgIds = portfolioImages
                .filter((item) => item.existingId)
                .map((item) => item.existingId);
            const keptVidIds = portfolioVideos
                .filter((item) => item.existingId)
                .map((item) => item.existingId);
            fd.append("keptPortfolioImageIds", JSON.stringify(keptImgIds));
            fd.append("keptPortfolioVideoIds", JSON.stringify(keptVidIds));
            fd.append(
                "removedPortfolioImageIds",
                JSON.stringify(removedPortfolioImageIds)
            );
            fd.append(
                "removedPortfolioVideoIds",
                JSON.stringify(removedPortfolioVideoIds)
            );
        }
        return fd;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.age || !form.address || !form.phone) {
            toast.error("Name, age, address, and phone are required");
            return;
        }
        if (!form.categories.length) {
            toast.error("Please select at least one category");
            return;
        }
        if (!isEdit && !profileImage) {
            toast.error("Profile image is required");
            return;
        }
        try {
            setSubmitting(true);

            const payload = buildPayload();

            if (isEdit && editId) {
                await axios.put(`${talentUrl.update}${editId}`, payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success("Candidate updated successfully!");
                navigate("/admin/allcandidates");
            } else {
                await axios.post(`${talentUrl.create}`, payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success("Candidate saved successfully!");
                setForm({
                    c_id: "",
                    name: "",
                    age: "",
                    categories: [],
                    address: "",
                    phone: "",
                    email: "",
                    works: [],
                    recommendTalent: false,
                    bio: "",
                    youtubeLink: "",
                    height: "",
                    weight: "",
                    chestBust: "",
                    waist: "",
                    hips: "",
                    shoulder: "",
                    shoeSize: "",
                    dressSize: "",
                    clothingSize: "",
                    hairColour: "",
                    eyeColour: "",
                    skinTone: "",
                });
                setProfileImage(null);
                setProfileImagePreview(null);
                setPortfolioImages([]);
                setPortfolioVideos([]);
                setRemovedPortfolioImageIds([]);
                setRemovedPortfolioVideoIds([]);
            }
        } catch (err) {
            console.error("Save candidate error:", err);
            toast.error(
                err?.response?.data?.message ||
                (isEdit
                    ? "Failed to update candidate"
                    : "Failed to save candidate")
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const selectedCategoryNames = form.categories
        .map((id) => categories.find((c) => c._id === id)?.name)
        .filter(Boolean);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-6 py-8 lg:px-12 lg:py-10">
            {/* Page Header */}
            <div className="max-w-[1400px] mx-auto mb-8">
                {loadingTalent && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading candidate...
                    </div>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
                    {isEdit ? "Edit Candidate" : "Add New Candidate"}
                </h1>
            </div>

            {/* Main Form Card */}
            <form
                onSubmit={handleSubmit}
                className="max-w-[1400px] mx-auto bg-white/80 backdrop-blur-xl rounded-[28px] border border-white shadow-2xl shadow-slate-200/60 p-8 lg:p-12 relative overflow-hidden"
            >
                <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-violet-300/15 to-pink-300/10 rounded-full blur-3xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
                    <div className="space-y-12">
                        {/* BASIC INFORMATION SECTION */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-300 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                        Basic Information
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Personal and contact details
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* C_ID */}
                                <FieldWrapper
                                    label="C_ID"
                                    icon={<FiHash size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.c_id}
                                        onChange={(e) =>
                                            handleInput("c_id", e.target.value)
                                        }
                                        placeholder="e.g. C04"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Name */}
                                <FieldWrapper
                                    label="Name *"
                                    icon={<FiUser size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            handleInput("name", e.target.value)
                                        }
                                        placeholder="Full name"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Age */}
                                <FieldWrapper
                                    label="Age *"
                                    icon={<FiCalendar size={15} />}
                                >
                                    <input
                                        type="number"
                                        value={form.age}
                                        onChange={(e) =>
                                            handleInput("age", e.target.value)
                                        }
                                        placeholder="Age in years"
                                        min="0"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Categories Multi-select */}
                                <div ref={catDropdownRef}>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-0.5">
                                        Categories *
                                    </label>
                                    <div className="relative">
                                        <div
                                            className={`w-full px-4 py-3 pl-11 rounded-2xl border min-h-[60px] flex flex-wrap items-center gap-2 transition-all ${showCatDropdown
                                                ? "ring-4 ring-blue-500/10 border-blue-500 bg-white"
                                                : "border-slate-200 bg-slate-50/50 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white"
                                                }`}
                                            onClick={() => setShowCatDropdown(true)}
                                        >
                                            <FiGrid
                                                size={15}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                            />

                                            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 pr-14">
                                                {selectedCategoryNames.length ===
                                                    0 ? (
                                                    <span className="text-sm text-slate-400 select-none">
                                                        Select categories
                                                    </span>
                                                ) : (
                                                    selectedCategoryNames.map(
                                                        (name, idx) => {
                                                            const catId =
                                                                form.categories[
                                                                idx
                                                                ];
                                                            return (
                                                                <span
                                                                    key={catId}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-200/80"
                                                                    onClick={(e) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                >
                                                                    {name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            removeCategory(
                                                                                catId
                                                                            );
                                                                        }}
                                                                        className="text-white/80 hover:text-white hover:bg-white/20 rounded p-0.5 transition-colors"
                                                                        aria-label="Remove category"
                                                                    >
                                                                        <FiX
                                                                            size={
                                                                                11
                                                                            }
                                                                        />
                                                                    </button>
                                                                </span>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </div>

                                            {/* Arrow button that toggles the dropdown */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowCatDropdown(
                                                        (v) => !v
                                                    );
                                                }}
                                                aria-label="Toggle categories dropdown"
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-500 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center ${showCatDropdown
                                                    ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/20"
                                                    : ""
                                                    }`}
                                            >
                                                <FiChevronDown
                                                    size={15}
                                                    className={`transition-transform duration-200 ${showCatDropdown
                                                        ? "rotate-180"
                                                        : "rotate-0"
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Dropdown panel */}
                                        {showCatDropdown && (
                                            <div className="absolute z-30 left-0 right-0 mt-2 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 py-2 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                                                {categories.length === 0 ? (
                                                    <div className="px-4 py-6 text-sm text-slate-400 text-center">
                                                        No categories found
                                                    </div>
                                                ) : (
                                                    <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                                        {categories.map((c) => {
                                                            const checked =
                                                                form.categories.includes(
                                                                    c._id
                                                                );
                                                            return (
                                                                <li key={c._id}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            toggleCategory(
                                                                                c._id
                                                                            );
                                                                        }}
                                                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${checked
                                                                            ? "bg-blue-50 text-blue-700 font-semibold"
                                                                            : "text-slate-700 hover:bg-slate-50"
                                                                            }`}
                                                                    >
                                                                        <span
                                                                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${checked
                                                                                ? "bg-blue-600 border-blue-600 text-white"
                                                                                : "bg-white border-slate-300 text-transparent hover:border-blue-400"
                                                                                }`}
                                                                        >
                                                                            <FiCheck
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        </span>
                                                                        <span className="flex-1 text-left">
                                                                            {c.name}
                                                                        </span>
                                                                        {checked && (
                                                                            <span className="text-[11px] font-medium text-blue-500">
                                                                                Selected
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <FieldWrapper
                                    label="Address *"
                                    icon={<FiMapPin size={15} />}
                                    textarea
                                >
                                    <textarea
                                        value={form.address}
                                        onChange={(e) =>
                                            handleInput("address", e.target.value)
                                        }
                                        rows={2}
                                        placeholder="Full address"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
                                    />
                                </FieldWrapper>

                                {/* Phone */}
                                <FieldWrapper
                                    label="Phone *"
                                    icon={<FiPhone size={15} />}
                                >
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            handleInput("phone", e.target.value)
                                        }
                                        placeholder="Phone number"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Email */}
                                <FieldWrapper
                                    label="Email"
                                    icon={<FiMail size={15} />}
                                >
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            handleInput("email", e.target.value)
                                        }
                                        placeholder="Email address"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Bio */}
                                <FieldWrapper
                                    label="Biography / Overview"
                                    icon={<FiAlignLeft size={15} />}
                                    textarea
                                >
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) =>
                                            handleInput("bio", e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Brief biography, background, or description"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
                                    />
                                </FieldWrapper>

                                {/* Recommend this Talent */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-0.5">
                                        Recommend this Talent
                                    </label>
                                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/60 to-white shadow-sm hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${form.recommendTalent
                                                    ? "bg-amber-100 text-amber-600 shadow-sm"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                <FiThumbsUp size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Featured / Recommended
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Highlight this candidate in recommended lists
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={form.recommendTalent}
                                            onClick={() =>
                                                handleInput(
                                                    "recommendTalent",
                                                    !form.recommendTalent
                                                )
                                            }
                                            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${form.recommendTalent
                                                ? "bg-blue-600"
                                                : "bg-slate-200"
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.recommendTalent
                                                    ? "translate-x-5"
                                                    : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* PHYSICAL MEASUREMENTS & ATTRIBUTES SECTION */}
                        <section className="pt-6 border-t border-slate-200/80">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <FiSliders size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                        Physical Attributes & Measurements
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Height, weight, measurements, and appearance
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Height */}
                                <FieldWrapper
                                    label="Height"
                                    icon={<FiMaximize2 size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.height}
                                        onChange={(e) =>
                                            handleInput("height", e.target.value)
                                        }
                                        placeholder="e.g. 5'10&quot; / 178 cm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Weight */}
                                <FieldWrapper
                                    label="Weight"
                                    icon={<FiActivity size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.weight}
                                        onChange={(e) =>
                                            handleInput("weight", e.target.value)
                                        }
                                        placeholder="e.g. 65 kg"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Chest / Bust */}
                                <FieldWrapper
                                    label="Chest / Bust"
                                    icon={<FiSliders size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.chestBust}
                                        onChange={(e) =>
                                            handleInput("chestBust", e.target.value)
                                        }
                                        placeholder="e.g. 34&quot; / 86 cm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Waist */}
                                <FieldWrapper
                                    label="Waist"
                                    icon={<FiSliders size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.waist}
                                        onChange={(e) =>
                                            handleInput("waist", e.target.value)
                                        }
                                        placeholder="e.g. 28&quot; / 71 cm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Hips */}
                                <FieldWrapper
                                    label="Hips"
                                    icon={<FiSliders size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.hips}
                                        onChange={(e) =>
                                            handleInput("hips", e.target.value)
                                        }
                                        placeholder="e.g. 36&quot; / 91 cm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Shoulder */}
                                <FieldWrapper
                                    label="Shoulder"
                                    icon={<FiSliders size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.shoulder}
                                        onChange={(e) =>
                                            handleInput("shoulder", e.target.value)
                                        }
                                        placeholder="e.g. 18&quot; / 45 cm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Shoe Size */}
                                <FieldWrapper
                                    label="Shoe Size"
                                    icon={<FiTag size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.shoeSize}
                                        onChange={(e) =>
                                            handleInput("shoeSize", e.target.value)
                                        }
                                        placeholder="e.g. 8 US / 41 EU"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Dress Size */}
                                <FieldWrapper
                                    label="Dress Size"
                                    icon={<FiTag size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.dressSize}
                                        onChange={(e) =>
                                            handleInput("dressSize", e.target.value)
                                        }
                                        placeholder="e.g. S / M / 4"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Clothing Size */}
                                <FieldWrapper
                                    label="Clothing Size"
                                    icon={<FiTag size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.clothingSize}
                                        onChange={(e) =>
                                            handleInput("clothingSize", e.target.value)
                                        }
                                        placeholder="e.g. Medium / 38"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Hair Colour */}
                                <FieldWrapper
                                    label="Hair Colour"
                                    icon={<FiSun size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.hairColour}
                                        onChange={(e) =>
                                            handleInput("hairColour", e.target.value)
                                        }
                                        placeholder="e.g. Black, Dark Brown"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Eye Colour */}
                                <FieldWrapper
                                    label="Eye Colour"
                                    icon={<FiEye size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.eyeColour}
                                        onChange={(e) =>
                                            handleInput("eyeColour", e.target.value)
                                        }
                                        placeholder="e.g. Brown, Hazel, Blue"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>

                                {/* Skin Tone */}
                                <FieldWrapper
                                    label="Skin Tone"
                                    icon={<FiUser size={15} />}
                                >
                                    <input
                                        type="text"
                                        value={form.skinTone}
                                        onChange={(e) =>
                                            handleInput("skinTone", e.target.value)
                                        }
                                        placeholder="e.g. Fair, Medium, Warm"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </FieldWrapper>
                            </div>
                        </section>
                    </div>

                    {/* =======================
                        MEDIA SIDEBAR
                    ======================= */}
                    <section className="border-t-2 border-dashed border-slate-200/60 lg:border-t-0 lg:border-l-2 lg:pl-12 pt-8 lg:pt-0 space-y-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <FiUpload size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                    Media & Works
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Profile, portfolio, and reels
                                </p>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div>
                            <div className="flex items-center justify-between mb-3 ml-0.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    Profile Image {!isEdit && "*"}
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    JPG / PNG / WEBP
                                </span>
                            </div>
                            <div className="relative inline-block w-full max-w-[220px]">
                                <div
                                    className={`relative w-full h-72 rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${isDraggingProfile
                                        ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-2xl shadow-blue-300/40"
                                        : profileImagePreview
                                            ? "border-transparent shadow-2xl shadow-slate-300/60"
                                            : "border-dashed border-slate-300 bg-slate-50/80 hover:border-blue-400 hover:bg-blue-50/50"
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDraggingProfile(true);
                                    }}
                                    onDragLeave={() => setIsDraggingProfile(false)}
                                    onDrop={onProfileImageDrop}
                                    onClick={() =>
                                        profileImgInputRef.current?.click()
                                    }
                                >
                                    {profileImagePreview ? (
                                        <>
                                            <img
                                                src={profileImagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-14 opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                                                    <FiUpload size={11} />
                                                    Click to change
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                                                <FiUser size={26} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 mb-1">
                                                Upload photo
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                or drag & drop
                                            </span>
                                        </label>
                                    )}
                                    <input
                                        ref={profileImgInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={onProfileImageChange}
                                        className="hidden"
                                    />
                                </div>
                                {profileImagePreview && (
                                    <button
                                        type="button"
                                        onClick={removeProfileImage}
                                        className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-white text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-xl border border-red-100 hover:border-red-500 transition-all hover:scale-110"
                                        title="Remove profile image"
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Portfolio Images */}
                        <div>
                            <div className="flex items-center justify-between mb-3 ml-0.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    Portfolio Images
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    {portfolioImages.length} uploaded
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {portfolioImages.map((item, idx) => (
                                    <div
                                        key={`pimg-${idx}`}
                                        className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                                    >
                                        <img
                                            src={item.preview}
                                            alt={`Portfolio ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePortfolioImage(idx)
                                            }
                                            className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/90 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all shadow-md"
                                            title="Remove image"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/60 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                                        <FiPlus size={22} />
                                    </div>
                                    <span className="text-[10px] mt-2 font-medium">
                                        Add images
                                    </span>
                                    <input
                                        ref={portfolioImgInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={
                                            onPortfolioImagesChange
                                        }
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Portfolio Videos */}
                        <div>
                            <div className="flex items-center justify-between mb-3 ml-0.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    Portfolio Videos
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    {portfolioVideos.length} uploaded
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {portfolioVideos.map((item, idx) => (
                                    <div
                                        key={`pvid-${idx}`}
                                        className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-900"
                                    >
                                        <video
                                            src={item.preview}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            muted
                                            preload="metadata"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-11 h-11 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-blue-600 shadow-xl group-hover:scale-110 transition-transform">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-4 h-4 ml-0.5"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePortfolioVideo(idx)
                                            }
                                            className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/90 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all shadow-md"
                                            title="Remove video"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/60 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                                        <FiPlus size={22} />
                                    </div>
                                    <span className="text-[10px] mt-2 font-medium">
                                        Add videos
                                    </span>
                                    <input
                                        ref={portfolioVidInputRef}
                                        type="file"
                                        accept="video/*"
                                        multiple
                                        onChange={
                                            onPortfolioVideosChange
                                        }
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* YouTube Link */}
                        <div>
                            <div className="flex items-center justify-between mb-2.5 ml-0.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    YouTube Reel / Video Link
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    URL
                                </span>
                            </div>
                            <FieldWrapper
                                label=""
                                icon={<FiVideo size={15} />}
                            >
                                <input
                                    type="url"
                                    value={form.youtubeLink}
                                    onChange={(e) =>
                                        handleInput("youtubeLink", e.target.value)
                                    }
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </FieldWrapper>
                        </div>

                        {/* Works */}
                        <div>
                            <div className="flex items-center justify-between mb-2.5 ml-0.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    Works / Portfolio Highlights
                                </label>
                                {form.works.length > 0 && (
                                    <span className="text-xs text-slate-400">
                                        {form.works.length} work
                                        {form.works.length !== 1 && "s"}
                                    </span>
                                )}
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/60 to-white p-4 space-y-3 shadow-sm">
                                <div className="flex flex-wrap gap-2.5">
                                    {form.works.length === 0 && (
                                        <span className="text-sm text-slate-400 py-2 px-1.5 italic">
                                            Add notable works, achievements,
                                            or past projects
                                        </span>
                                    )}
                                    {form.works.map((w, idx) => (
                                        <span
                                            key={idx}
                                            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all"
                                        >
                                            <FiStar
                                                size={11}
                                                className="text-amber-400"
                                            />
                                            {w}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeWork(idx)
                                                }
                                                className="ml-0.5 text-slate-300 group-hover:text-red-500 hover:bg-red-50 rounded-md p-0.5 transition-all"
                                                aria-label="Remove work"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2.5 pt-1">
                                    <input
                                        type="text"
                                        value={workInput}
                                        onChange={(e) =>
                                            setWorkInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addWork();
                                            }
                                        }}
                                        placeholder="Add works — press Enter to add"
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={addWork}
                                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-1.5"
                                    >
                                        <FiPlus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ==============
                    BOTTOM ACTIONS
                ============== */}
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 mt-12 border-t border-slate-200/80">
                    <div className="flex items-center justify-end gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-7 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="relative inline-flex items-center gap-2.5 px-9 py-3.5 rounded-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-700 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {submitting ? (
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
                                    {isEdit ? "Updating Candidate..." : "Saving Candidate..."}
                                </>
                            ) : (
                                <>
                                    <FiUpload size={15} />
                                    {isEdit ? "Update Candidate" : "Save Candidate"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

/* ============ Reusable Field Wrapper ============ */
const FieldWrapper = ({
    label,
    icon,
    children,
    textarea = false,
}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-0.5">
                {label}
            </label>
            <div className="relative">
                <span
                    className={`absolute left-4 ${textarea ? "top-4" : "top-1/2 -translate-y-1/2"
                        } text-slate-400 pointer-events-none`}
                >
                    {icon}
                </span>
                {children}
            </div>
        </div>
    );
};

export default AdminTalent;

