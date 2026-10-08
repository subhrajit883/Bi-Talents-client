import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiArrowLeft,
    FiHeart,
    FiShare2,
    FiMail,
    FiPhone,
    FiUser,
    FiBriefcase,
    FiImage,
    FiVideo,
    FiCheck,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiMaximize2,
    FiSend,
    FiChevronRight as FiChevronRightIcon,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { BiRuler, BiBody } from "react-icons/bi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { talentUrl, clientInterestUrl, apiClient } from "../config/config";
import TalentCard from "../components/home/TalentCard";

// Framer Motion Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

// Helper to parse YouTube embed link
const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

const TalentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const contactPhone = import.meta.env.VITE_CONTACT_PHONE || "+91 9903400656";
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "subhrajit.sportiqofitness@gmail.com";

    const [talent, setTalent] = useState(null);
    const [relatedTalents, setRelatedTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gallery Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Express Interest modal state
    const [interestModalOpen, setInterestModalOpen] = useState(false);
    const [interestNote, setInterestNote] = useState("");
    const [submittingInterest, setSubmittingInterest] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Fetch Talent data
    const fetchTalentDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let selectedTalent = null;

            // Attempt 1: Fetch single talent by ID
            try {
                const singleRes = await axios.get(`${talentUrl.getTalentById}${id}`);
                const data = singleRes.data;
                if (data?.talent) {
                    selectedTalent = data.talent;
                } else if (Array.isArray(data?.talents)) {
                    selectedTalent = data.talents.find(
                        (t) => t._id === id || t.c_id === id
                    ) || data.talents[0];
                } else if (data?._id) {
                    selectedTalent = data;
                }
            } catch (err) {
                console.log("Single talent endpoint fetch fallback, trying getAll...", err?.message);
            }

            // Attempt 2: Fallback to getAll list if single talent endpoint failed or returned null
            if (!selectedTalent) {
                const allRes = await axios.get(talentUrl.getAll, {
                    params: { limit: 500 },
                });
                const allList = allRes.data?.talents || [];
                selectedTalent = allList.find(
                    (t) => t._id === id || t.c_id === id
                );

                if (selectedTalent) {
                    const primaryCatId = selectedTalent.categories?.[0]?._id;
                    const related = allList.filter(
                        (t) =>
                            t._id !== selectedTalent._id &&
                            (primaryCatId
                                ? t.categories?.some((c) => c._id === primaryCatId)
                                : true)
                    );
                    setRelatedTalents(related.slice(0, 4));
                }
            } else {
                try {
                    const allRes = await axios.get(talentUrl.getAll, {
                        params: { limit: 50 },
                    });
                    const allList = allRes.data?.talents || [];
                    const primaryCatId = selectedTalent.categories?.[0]?._id;
                    const related = allList.filter(
                        (t) =>
                            t._id !== selectedTalent._id &&
                            (primaryCatId
                                ? t.categories?.some((c) => c._id === primaryCatId)
                                : true)
                    );
                    setRelatedTalents(related.slice(0, 4));
                } catch (_) {
                    // Ignore related fetch errors
                }
            }

            if (!selectedTalent) {
                setError("Talent profile not found.");
            } else {
                setTalent(selectedTalent);
            }
        } catch (err) {
            console.error("Error fetching talent details:", err);
            setError("Failed to load talent details. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTalentDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [fetchTalentDetails]);

    // Handle Share profile
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Profile link copied to clipboard!");
        } else {
            toast.success("URL copied!");
        }
    };

    // Toggle favorite
    const handleToggleFavorite = () => {
        setIsFavorited((prev) => !prev);
        toast.success(
            !isFavorited
                ? "Added to saved shortlist!"
                : "Removed from saved shortlist"
        );
    };

    // Express interest API call
    const handleExpressInterest = async (e) => {
        e.preventDefault();
        const token =
            localStorage.getItem("clientToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

        if (!token) {
            toast.error("Please log in as a client to express interest.");
            setInterestModalOpen(false);
            navigate("/login");
            return;
        }

        try {
            setSubmittingInterest(true);

            const payload = interestNote && interestNote.trim() !== ""
                ? { message: interestNote.trim() }
                : {};

            const targetUrl = `${clientInterestUrl.create}/${talent._id}`;

            const res = await axios.post(
                targetUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (
                res.data &&
                res.data.success === false &&
                typeof res.data.message === "string" &&
                (res.data.message.toLowerCase().includes("invalid or expired token") ||
                    res.data.message.toLowerCase().includes("jwt expired"))
            ) {
                localStorage.removeItem("clientToken");
                localStorage.removeItem("token");
                localStorage.removeItem("authToken");
                toast.error(res.data.message || "Invalid or expired token. Please log in again.");
                setInterestModalOpen(false);
                navigate("/login");
                return;
            }

            toast.success("Interest expressed successfully! Our team will contact you soon.");
            setInterestModalOpen(false);
            setInterestNote("");
        } catch (err) {
            console.error("Express interest error:", err);
            const msg = err?.response?.data?.message || "";
            const status = err?.response?.status;

            if (
                status === 401 ||
                status === 403 ||
                (typeof msg === "string" &&
                    (msg.toLowerCase().includes("invalid or expired token") ||
                        msg.toLowerCase().includes("jwt expired") ||
                        msg.toLowerCase().includes("unauthorized")))
            ) {
                localStorage.removeItem("clientToken");
                localStorage.removeItem("token");
                localStorage.removeItem("authToken");
                toast.error(msg || "Invalid or expired token. Please log in again.");
                setInterestModalOpen(false);
                navigate("/login");
                return;
            }

            toast.error(
                msg || "Failed to submit interest. Please try again."
            );
        } finally {
            setSubmittingInterest(false);
        }
    };

    // Keyboard navigation for image lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "ArrowRight") handleNextImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, talent]);

    const handlePrevImage = () => {
        if (!talent?.portfolioImages?.length) return;
        setActiveImageIndex((prev) =>
            prev === 0 ? talent.portfolioImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        if (!talent?.portfolioImages?.length) return;
        setActiveImageIndex((prev) =>
            prev === talent.portfolioImages.length - 1 ? 0 : prev + 1
        );
    };

    if (loading) {
        return <TalentDetailsSkeleton />;
    }

    if (error || !talent) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <FiUser size={36} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {error || "Talent Not Found"}
                </h2>
                <p className="text-gray-600 max-w-md mb-6">
                    The talent profile you are looking for might have been removed or is temporarily unavailable.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition"
                    >
                        Browse All Talents
                    </Link>
                </div>
            </div>
        );
    }

    const primaryCategory = talent.categories?.[0]?.name || "Talent";
    const portfolioImages = talent.portfolioImages || [];
    const portfolioVideos = talent.portfolioVideos || [];
    const worksList = talent.works || [];

    // Helper checks to hide cards/fields if there is no data
    const hasPhysicalStats = Boolean(
        talent.height ||
        talent.weight ||
        talent.chestBust ||
        talent.waist ||
        talent.hips ||
        talent.shoulder
    );

    const hasAppearance = Boolean(
        talent.hairColour ||
        talent.eyeColour ||
        talent.skinTone
    );

    const hasContact = Boolean(contactPhone || contactEmail);
    const hasBio = Boolean(talent.bio && talent.bio.trim().length > 0);
    const hasWorks = Array.isArray(worksList) && worksList.length > 0;
    const hasImages = Array.isArray(portfolioImages) && portfolioImages.length > 0;
    const hasVideos = Array.isArray(portfolioVideos) && portfolioVideos.length > 0;

    return (
        <div className="bg-slate-50/70 min-h-screen pb-20">
            {/* Top Navigation Bar */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm transition group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link
                            to={`/category/${talent.categories?.[0]?.slug || "all"}`}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {primaryCategory}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[160px]">
                            {talent.name}
                        </span>
                    </nav>

                    {/* Quick Action Icon Buttons */}
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={handleToggleFavorite}
                            className={`p-2 rounded-xl border transition ${isFavorited
                                ? "bg-rose-50 border-rose-200 text-rose-600"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            title={isFavorited ? "Remove from shortlist" : "Save shortlist"}
                        >
                            <FiHeart className={isFavorited ? "fill-rose-600" : ""} size={18} />
                        </button> */}
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-xl border cursor-pointer border-gray-200 text-gray-600 hover:bg-gray-50 bg-white transition"
                            title="Share Profile"
                        >
                            <FiShare2 size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-2 space-y-8">

                {/* Modern Hero Profile Card (Container-Based, No Full Width Dark Banner) */}



                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                    {/* Soft Decorative Ambient Gradients */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Profile Image with Glow Ring */}
                        <div className="relative shrink-0 group">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 shadow-xl shadow-blue-500/15 transition-transform duration-500 group-hover:scale-[1.02]">
                                <div className="w-full h-full rounded-[22px] overflow-hidden bg-white">
                                    <img
                                        src={talent.profileImage?.url}
                                        alt={talent.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                                        onClick={() => {
                                            if (talent.profileImage?.url) {
                                                setActiveImageIndex(0);
                                                setLightboxOpen(true);
                                            }
                                        }}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                talent.name
                                            )}&background=2563eb&color=fff&size=300`;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Candidate ID Tag */}
                            {talent.c_id && (
                                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg border border-slate-700 tracking-wide">
                                    ID: {talent.c_id}
                                </span>
                            )}
                        </div>

                        {/* Talent Main Header Details */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                {talent.recommendTalent && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full shadow-xs">
                                        <FaWandMagicSparkles className="text-amber-500" />
                                        Recommended
                                    </span>
                                )}

                                {talent.categories?.map((cat) => (
                                    <span
                                        key={cat._id || cat.name}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-full"
                                    >
                                        {cat.name}
                                    </span>
                                ))}

                                {/* {talent.isActive && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Available
                                    </span>
                                )} */}
                            </div>

                            {/* Name & Age */}
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h1 className="text-3xl  cormorant-garamond-bold sm:text-4xl font-bold text-slate-900 tracking-tight">
                                        {talent.name}
                                    </h1>
                                    <HiCheckBadge className="text-blue-600 shrink-0" size={30} title="Verified Profile" />
                                </div>
                                {talent.age && (
                                    <p className="text-slate-500 font-medium text-base mt-1">
                                        {talent.age} Years Old
                                    </p>
                                )}
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setInterestModalOpen(true)}
                                    className="px-6 py-3 bg-linear-to-r cursor-pointer from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 text-sm transition"
                                >
                                    <FiSend size={15} />
                                    Express Interest
                                </motion.button>

                                {/* <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                        navigate("/talent-enquiry", {
                                            state: { talentName: talent.name, c_id: talent.c_id },
                                        })
                                    }
                                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-200 text-sm flex items-center gap-2 transition"
                                >
                                    <FiSend size={15} />
                                    Express Interest
                                </motion.button> */}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Layout for Detailed Info */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column: Specifications (Only rendered if fields exist!) */}
                    <div className="space-y-6">

                        {/* Physical Measurements Card */}
                        {hasPhysicalStats && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                            >
                                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <BiBody className="text-blue-600" size={22} />
                                    Key Measurements
                                </h3>
                                <div className="grid grid-cols-2 gap-3.5">
                                    {talent.height && (
                                        <StatItem
                                            label="Height"
                                            value={talent.height}
                                            icon={<BiRuler className="text-blue-500" />}
                                        />
                                    )}
                                    {talent.weight && (
                                        <StatItem
                                            label="Weight"
                                            value={`${talent.weight} kg`}
                                        />
                                    )}
                                    {talent.chestBust && (
                                        <StatItem
                                            label="Chest / Bust"
                                            value={`${talent.chestBust}"`}
                                        />
                                    )}
                                    {talent.waist && (
                                        <StatItem
                                            label="Waist"
                                            value={`${talent.waist}"`}
                                        />
                                    )}
                                    {talent.hips && (
                                        <StatItem
                                            label="Hips"
                                            value={`${talent.hips}"`}
                                        />
                                    )}
                                    {talent.shoulder && (
                                        <StatItem
                                            label="Shoulder"
                                            value={`${talent.shoulder}"`}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Appearance & Features Card */}
                        {hasAppearance && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                            >
                                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <FiUser className="text-blue-600" size={20} />
                                    Appearance Specs
                                </h3>
                                <div className="space-y-3">
                                    {talent.hairColour && (
                                        <SpecRow label="Hair Colour" value={talent.hairColour} />
                                    )}
                                    {talent.eyeColour && (
                                        <SpecRow label="Eye Colour" value={talent.eyeColour} />
                                    )}
                                    {talent.skinTone && (
                                        <SpecRow label="Skin Tone" value={talent.skinTone} />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Direct Inquiry Contact Card */}
                        {hasContact && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white rounded-3xl p-6 border border-blue-100 shadow-sm"
                            >
                                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <FiPhone className="text-blue-600" size={18} />
                                    Direct Inquiry
                                </h3>
                                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                    Reach out directly for booking and availability details.
                                </p>

                                <div className="space-y-2.5 mb-5 text-sm">
                                    {contactPhone && (
                                        <div className="flex items-center gap-3 text-slate-700 bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-2xs">
                                            <FiPhone className="text-blue-600 shrink-0" size={16} />
                                            <a
                                                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                                                className="hover:text-blue-600 font-semibold"
                                            >
                                                {contactPhone}
                                            </a>
                                        </div>
                                    )}
                                    {contactEmail && (
                                        <div className="flex items-center gap-3 text-slate-700 bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-2xs truncate">
                                            <FiMail className="text-blue-600 shrink-0" size={16} />
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="hover:text-blue-600 font-semibold truncate"
                                            >
                                                {contactEmail}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setInterestModalOpen(true)}
                                    className="w-full py-3 cursor-pointer bg-linear-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition"
                                >
                                    <FiSend size={15} />
                                    Express Interest
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Bio, Experience, Photos & Videos */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Biography / Bio Section */}
                        {hasBio && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FiUser className="text-blue-600" />
                                    About {talent.name}
                                </h2>
                                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100 italic">
                                    "{talent.bio}"
                                </div>
                            </motion.div>
                        )}

                        {/* Work Experience & Roles */}
                        {hasWorks && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FiBriefcase className="text-blue-600" />
                                    Work Experience & Roles
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {worksList.map((work, idx) => (
                                        <span
                                            key={idx}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/90 text-blue-900 border border-blue-100 text-sm font-semibold rounded-2xl shadow-2xs"
                                        >
                                            <FiCheck className="text-blue-600" size={16} />
                                            {work}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Portfolio Images Gallery */}
                        {hasImages && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <FiImage className="text-blue-600" />
                                        Portfolio Photos
                                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                                            {portfolioImages.length}
                                        </span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {portfolioImages.map((img, idx) => (
                                        <motion.div
                                            key={img._id || idx}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => {
                                                setActiveImageIndex(idx);
                                                setLightboxOpen(true);
                                            }}
                                            className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group shadow-2xs hover:shadow-lg transition duration-300"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`${talent.name} portfolio photo ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="p-3 bg-white/95 rounded-full text-slate-900 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                                                    <FiMaximize2 size={18} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Portfolio Videos Gallery */}
                        {hasVideos && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <FiVideo className="text-blue-600" />
                                    Showreels & Videos
                                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                                        {portfolioVideos.length}
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {portfolioVideos.map((vid, idx) => (
                                        <div
                                            key={vid._id || idx}
                                            className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative shadow-2xs"
                                        >
                                            <video
                                                src={vid.url}
                                                controls
                                                className="w-full h-full object-cover"
                                                preload="metadata"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* YouTube Video Showcase Section */}
                        {talent.youtubeLink && getYouTubeEmbedUrl(talent.youtubeLink) && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <FiVideo className="text-red-600" />
                                        Featured YouTube Showcase
                                        <span className="text-xs font-semibold px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                                            YouTube Reel
                                        </span>
                                    </h2>
                                </div>

                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-lg">
                                    <iframe
                                        src={getYouTubeEmbedUrl(talent.youtubeLink)}
                                        title={`${talent.name} YouTube Video`}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Related / Similar Candidates */}
                {relatedTalents.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="pt-10 border-t border-slate-200"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Similar Candidates</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    More profiles in {primaryCategory}
                                </p>
                            </div>
                            <Link
                                to={`/category/${talent.categories?.[0]?.slug || "all"}`}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                View All
                                <FiChevronRightIcon />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedTalents.map((item) => (
                                <TalentCard key={item._id} talent={item} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Lightbox Modal for Image Preview */}
            <AnimatePresence>
                {lightboxOpen && portfolioImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-5 right-5 z-10 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
                        >
                            <FiX size={24} />
                        </button>

                        {/* Prev button */}
                        {portfolioImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevImage();
                                }}
                                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
                            >
                                <FiChevronLeft size={28} />
                            </button>
                        )}

                        {/* Main Image */}
                        <div
                            className="max-w-4xl max-h-[85vh] relative flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={portfolioImages[activeImageIndex]?.url}
                                alt={`Portfolio view ${activeImageIndex + 1}`}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                            />
                            <div className="mt-4 text-xs font-semibold text-white/80 bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
                                Image {activeImageIndex + 1} of {portfolioImages.length}
                            </div>
                        </div>

                        {/* Next button */}
                        {portfolioImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
                            >
                                <FiChevronRight size={28} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Express Interest Modal */}
            <AnimatePresence>
                {interestModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative"
                        >
                            <button
                                onClick={() => setInterestModalOpen(false)}
                                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <FiX size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <FiSend size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Express Interest</h3>
                                    <p className="text-xs text-slate-500">
                                        For {talent.name} ({talent.c_id || "Talent"})
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleExpressInterest} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Project Note / Requirements (Optional)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={interestNote}
                                        onChange={(e) => setInterestNote(e.target.value)}
                                        placeholder="Describe your project, schedule, budget, or specific details..."
                                        className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setInterestModalOpen(false)}
                                        className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingInterest}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submittingInterest ? "Submitting..." : "Send Interest Request"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Component for physical stat item
const StatItem = ({ label, value, icon }) => (
    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80">
        <span className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            {icon}
            {label}
        </span>
        <span className="block text-sm font-bold text-slate-900 capitalize">
            {value}
        </span>
    </div>
);

// Component for spec rows
const SpecRow = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-900 capitalize">{value}</span>
    </div>
);

// Skeleton loading state
const TalentDetailsSkeleton = () => (
    <div className="min-h-screen bg-slate-50 animate-pulse">
        <div className="h-14 bg-white border-b border-slate-200" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
            <div className="h-56 bg-white rounded-3xl border border-slate-100" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="h-44 bg-white rounded-3xl border border-slate-100" />
                    <div className="h-36 bg-white rounded-3xl border border-slate-100" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-32 bg-white rounded-3xl border border-slate-100" />
                    <div className="h-60 bg-white rounded-3xl border border-slate-100" />
                </div>
            </div>
        </div>
    </div>
);

export default TalentDetails;
