import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiPlus,
    FiChevronDown,
    FiEye,
    FiEdit2,
    FiTrash2,
    FiFilter,
    FiX,
    FiUser,
    FiHash,
    FiUsers,
    FiImage,
    FiVideo,
} from "react-icons/fi";
import { talentUrl, categoryUrl, apiClient } from "../config/config";

const DEFAULT_PROFILE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2360a5fa'/><stop offset='1' stop-color='%236366f1'/></linearGradient></defs><rect width='48' height='48' rx='24' fill='url(%23g)'/><path fill='white' d='M24 12a6 6 0 110 12 6 6 0 010-12zm-12 26c0-6.627 5.373-12 12-12s12 5.373 12 12' opacity='.85'/></svg>`
    );

const AdminAllTalents = () => {
    const navigate = useNavigate();

    const [talents, setTalents] = useState([]);
    const [meta, setMeta] = useState({
        count: 0,
        total: 0,
        page: 1,
        limit: 500,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const catDropdownRef = useRef(null);

    const fetchTalents = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(talentUrl.getAll, {
                params: { limit: 500 },
            });
            setTalents(res.data.talents || []);
            setMeta({
                count: res.data.count ?? 0,
                total: res.data.total ?? res.data.count ?? 0,
                page: res.data.page ?? 1,
                limit: res.data.limit ?? 500,
            });
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

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
        fetchTalents();
    }, []);

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

    const filteredTalents = useMemo(() => {
        const q = search.trim().toLowerCase();
        return talents.filter((t) => {
            const matchSearch =
                !q ||
                (t.name || "").toLowerCase().includes(q) ||
                (t.c_id || "").toLowerCase().includes(q) ||
                (t.email || "").toLowerCase().includes(q) ||
                (t.phone || String("")).toString().includes(q);
            const matchCat =
                categoryFilter === "all" ||
                (t.categories || []).some(
                    (c) =>
                        c._id === categoryFilter ||
                        c.name === categoryFilter
                );
            return matchSearch && matchCat;
        });
    }, [talents, search, categoryFilter]);

    const handleDelete = async (t) => {
        try {
            setDeletingId(t._id);
            await apiClient.delete(`${talentUrl.delete}${t._id}`);
            setTalents((prev) => prev.filter((x) => x._id !== t._id));
            toast.success(`${t.name} deleted`);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
            setConfirmDelete(null);
        }
    };

    const selectedCategoryName =
        categoryFilter === "all"
            ? "All Categories"
            : categories.find(
                  (c) =>
                      c._id === categoryFilter || c.name === categoryFilter
              )?.name || "All Categories";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-6 py-8 lg:px-10 lg:py-10">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-semibold border border-blue-200/50">
                                <FiUsers size={12} />
                                Talent Directory
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight  bg-clip-text text-transparent">
                            All Candidates
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            {meta.total} candidate
                            {meta.total !== 1 && "s"} registered
                        </p>
                    </div>
                    <Link
                        to="/admin/candidates"
                        className="sm:self-start sm:mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                    >
                        <FiPlus size={17} />
                        Add Candidate
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur rounded-3xl border border-white shadow-xl shadow-slate-200/60 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search candidates..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Category Filter dropdown */}
                        <div ref={catDropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCatDropdown((v) => !v)
                                }
                                className="w-full md:w-[230px] flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all"
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    {categoryFilter === "all" ? (
                                        <FiFilter
                                            size={14}
                                            className="text-slate-400"
                                        />
                                    ) : (
                                        <FiHash
                                            size={14}
                                            className="text-blue-500"
                                        />
                                    )}
                                    <span
                                        className={`truncate ${
                                            categoryFilter === "all"
                                                ? "text-slate-500"
                                                : "font-medium text-slate-700"
                                        }`}
                                    >
                                        {selectedCategoryName}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    {categoryFilter !== "all" && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategoryFilter("all");
                                            }}
                                            className="w-5 h-5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                            title="Clear filter"
                                        >
                                            <FiX size={11} />
                                        </button>
                                    )}
                                    <FiChevronDown
                                        size={15}
                                        className={`text-slate-400 transition-transform  duration-200 ${
                                            showCatDropdown
                                                ? "rotate-180 text-blue-500"
                                                : ""
                                        }`}
                                    />
                                </span>
                            </button>
                            {showCatDropdown && (
                                <div className="absolute right-0 z-50 mt-2 w-full md:w-[280px] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 py-2 overflow-hidden">
                                    <ul className="max-h-72 overflow-y-auto">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCategoryFilter("all");
                                                    setShowCatDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                                                    categoryFilter === "all"
                                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                All Categories
                                                {categoryFilter === "all" && (
                                                    <span className="text-[11px] text-blue-500">
                                                        Active
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                        <div className="h-px bg-slate-100 mx-2" />
                                        {categories.map((c) => {
                                            const active =
                                                categoryFilter === c._id;
                                            return (
                                                <li key={c._id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCategoryFilter(
                                                                c._id
                                                            );
                                                            setShowCatDropdown(
                                                                false
                                                            );
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                                                            active
                                                                ? "bg-blue-50 text-blue-700 font-semibold"
                                                                : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <FiHash
                                                                size={12}
                                                                className="text-slate-400"
                                                            />
                                                            {c.name}
                                                        </span>
                                                        {active && (
                                                            <span className="text-[11px] text-blue-500">
                                                                Active
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Visual Filter icon */}
                        <button
                            type="button"
                            onClick={fetchTalents}
                            className="h-[50px] px-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
                            title="Refresh"
                        >
                            <FiFilter size={17} />
                        </button>
                    </div>

                    {/* Result strip */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredTalents.length}
                            </span>{" "}
                            of {meta.total} candidates
                        </span>
                        {(search || categoryFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("all");
                                }}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <FiX size={11} /> Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-50 to-blue-50/60 text-slate-600 text-xs uppercase tracking-wider">
                                    <th className="text-left pl-8 pr-6 py-5 font-semibold">
                                        Profile
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Name
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        C_ID
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Age
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Categories
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Portfolio
                                    </th>
                                    <th className="text-right pl-6 pr-8 py-5 font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : filteredTalents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-8 py-20 text-center"
                                        >
                                            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 mb-4">
                                                <FiUser size={30} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                No candidates found
                                            </h3>
                                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                                {search ||
                                                categoryFilter !== "all"
                                                    ? "Try adjusting your search or filters."
                                                    : "Add your first candidate to get started."}
                                            </p>
                                            {!search &&
                                                categoryFilter === "all" && (
                                                    <Link
                                                        to="/admin/candidates"
                                                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                                                    >
                                                        <FiPlus size={14} />
                                                        Add Candidate
                                                    </Link>
                                                )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTalents.map((t) => (
                                        <TalentRow
                                            key={t._id}
                                            talent={t}
                                            onView={() =>
                                                navigate(
                                                    `/talents/${t._id}`
                                                )
                                            }
                                            onEdit={() =>
                                                navigate(
                                                    `/admin/candidates?edit=${t._id}`
                                                )
                                            }
                                            onDelete={() =>
                                                setConfirmDelete(t)
                                            }
                                            deleting={deletingId === t._id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <DeleteModal
                    talent={confirmDelete}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete)}
                    deleting={deletingId === confirmDelete._id}
                />
            )}
        </div>
    );
};

/* ============ Talent Row ============ */
const TalentRow = ({
    talent: t,
    onView,
    onEdit,
    onDelete,
    deleting,
}) => {
    const catList = t.categories || [];
    const imgCount = (t.portfolioImages || []).length;
    const vidCount = (t.portfolioVideos || []).length;
    return (
        <tr className="group hover:bg-blue-50/30 transition-colors">
            <td className="pl-8 pr-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white shadow-md">
                            <img
                                src={
                                    t.profileImage?.url ||
                                    DEFAULT_PROFILE
                                }
                                alt={t.name}
                                onError={(e) => {
                                    e.currentTarget.src = DEFAULT_PROFILE;
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 leading-tight">
                        {t.name}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]">
                        {t.email}
                    </span>
                </div>
            </td>
            <td className="px-6 py-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                    <FiHash size={10} className="text-slate-400" />
                    {t.c_id || "—"}
                </span>
            </td>
            <td className="px-6 py-5 text-slate-700 font-medium">
                {t.age ? (
                    <span>{t.age} yrs</span>
                ) : (
                    <span className="text-slate-300">—</span>
                )}
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                    {catList.length === 0 && (
                        <span className="text-xs text-slate-400">
                            —
                        </span>
                    )}
                    {catList.slice(0, 2).map((c) => (
                        <span
                            key={c._id}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-100 text-blue-700 text-xs font-semibold"
                        >
                            {c.name}
                        </span>
                    ))}
                    {catList.length > 2 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                            +{catList.length - 2}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-3 text-xs">
                    <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                            imgCount > 0
                                ? "text-slate-700"
                                : "text-slate-400"
                        }`}
                    >
                        <FiImage
                            size={13}
                            className={
                                imgCount > 0
                                    ? "text-blue-500"
                                    : "text-slate-300"
                            }
                        />
                        {imgCount}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                            vidCount > 0
                                ? "text-slate-700"
                                : "text-slate-400"
                        }`}
                    >
                        <FiVideo
                            size={13}
                            className={
                                vidCount > 0
                                    ? "text-fuchsia-500"
                                    : "text-slate-300"
                            }
                        />
                        {vidCount}
                    </span>
                </div>
            </td>
            <td className="pl-6 pr-8 py-5">
                <div className="flex items-center justify-end gap-2">
                    <ActionIcon
                        label="View"
                        onClick={onView}
                        className="hover:bg-blue-50 hover:text-blue-600 text-slate-400"
                    >
                        <FiEye size={15} />
                    </ActionIcon>
                    <ActionIcon
                        label="Edit"
                        onClick={onEdit}
                        className="hover:bg-amber-50 hover:text-amber-600 text-slate-400"
                    >
                        <FiEdit2 size={15} />
                    </ActionIcon>
                    <ActionIcon
                        label="Delete"
                        onClick={onDelete}
                        loading={deleting}
                        className="hover:bg-red-50 hover:text-red-600 text-slate-400"
                    >
                        <FiTrash2 size={15} />
                    </ActionIcon>
                </div>
            </td>
        </tr>
    );
};

/* ============ Action Icon Button ============ */
const ActionIcon = ({
    onClick,
    children,
    className = "",
    label,
    loading,
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading}
        title={label}
        className={`w-10 h-10 rounded-xl border border-slate-100 bg-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
        {loading ? (
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
        ) : (
            children
        )}
    </button>
);

/* ============ Skeleton Row ============ */
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="pl-8 pr-6 py-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-200" />
        </td>
        <td className="px-6 py-5">
            <div className="h-4 w-32 bg-slate-200 rounded mb-1.5" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
        </td>
        <td className="px-6 py-5">
            <div className="h-5 w-14 bg-slate-200 rounded-lg" />
        </td>
        <td className="px-6 py-5">
            <div className="h-4 w-12 bg-slate-200 rounded" />
        </td>
        <td className="px-6 py-5">
            <div className="h-5 w-20 bg-slate-200 rounded-lg" />
        </td>
        <td className="px-6 py-5">
            <div className="h-4 w-16 bg-slate-200 rounded" />
        </td>
        <td className="pl-6 pr-8 py-5">
            <div className="flex justify-end gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
            </div>
        </td>
    </tr>
);

/* ============ Delete Confirm Modal ============ */
const DeleteModal = ({ talent, onCancel, onConfirm, deleting }) => (
    <div className="fixed inset-0  flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
            <div className="px-8 pt-8 pb-6 text-center">
                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center text-red-500 shadow-inner">
                    <FiTrash2 size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Delete Candidate?
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    You are about to permanently delete{" "}
                    <span className="font-semibold text-slate-800">
                        {talent.name}
                    </span>{" "}
                    ({talent.c_id || ""}). This cannot be undone.
                </p>
            </div>
            <div className="px-8 pb-8 flex items-center justify-end gap-3 bg-slate-50/60 pt-5 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={deleting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl disabled:opacity-70 transition-all"
                >
                    {deleting ? (
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
                            Deleting...
                        </>
                    ) : (
                        <>
                            <FiTrash2 size={14} />
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
);

export default AdminAllTalents;
