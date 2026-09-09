import { useState, useEffect, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiPlus,
    FiChevronDown,
    FiEdit2,
    FiTrash2,
    FiFilter,
    FiX,
    FiHash,
    FiLayers,
    FiUsers,
    FiToggleLeft,
    FiToggleRight,
    FiSave,
    FiUpload,
} from "react-icons/fi";
import { categoryUrl, talentUrl, apiClient } from "../config/config";
import DeleteModal from "../components/common/DeleteModal";

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    /* -------- Create / Edit modal -------- */
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formName, setFormName] = useState("");
    const [formIsActive, setFormIsActive] = useState(true);
    const [submittingForm, setSubmittingForm] = useState(false);

    const [togglingId, setTogglingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const statusDropdownRef = useRef(null);

    /* -------- Fetchers -------- */
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(categoryUrl.getAll);
            const list = res.data.categories || [];
            setCategories(list);

            const counts = {};
            const promises = list.map(async (c) => {
                try {
                    const r = await apiClient.get(`${talentUrl.catWise}/${c._id}`);
                    counts[c._id] = (r.data.talents || []).length;
                } catch {
                    counts[c._id] = 0;
                }
            });
            await Promise.all(promises);
            setCategoryCounts(counts);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* Close status dropdown on outside click */
    useEffect(() => {
        const onClickOutside = (e) => {
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(e.target)
            ) {
                setShowStatusDropdown(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    /* -------- Derived -------- */
    const totalCategories = categories.length;
    const activeCount = categories.filter((c) => c.isActive).length;

    const filteredCategories = useMemo(() => {
        const q = search.trim().toLowerCase();
        return categories.filter((c) => {
            const matchSearch =
                !q ||
                (c.name || "").toLowerCase().includes(q) ||
                (c.slug || "").toLowerCase().includes(q);
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && c.isActive) ||
                (statusFilter === "inactive" && !c.isActive);
            return matchSearch && matchStatus;
        });
    }, [categories, search, statusFilter]);

    const statusLabel =
        statusFilter === "all"
            ? "All Statuses"
            : statusFilter === "active"
              ? "Active"
              : "Inactive";

    /* -------- Form handlers -------- */
    const openCreate = () => {
        setEditingId(null);
        setFormName("");
        setFormIsActive(true);
        setShowForm(true);
    };

    const openEdit = (c) => {
        setEditingId(c._id);
        setFormName(c.name || "");
        setFormIsActive(c.isActive !== false);
        setShowForm(true);
    };

    const closeForm = () => {
        if (submittingForm) return;
        setShowForm(false);
        setEditingId(null);
        setFormName("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const name = formName.trim();
        if (!name) {
            toast.error("Category name is required");
            return;
        }
        try {
            setSubmittingForm(true);
            const payload = { name: name, isActive: formIsActive };

            if (editingId) {
                await apiClient.put(`${categoryUrl.update}${editingId}`, payload);
                toast.success("Category updated successfully!");
            } else {
                await apiClient.post(categoryUrl.create, payload);
                toast.success("Category created successfully!");
            }
            setShowForm(false);
            setEditingId(null);
            setFormName("");
            await fetchCategories();
        } catch (err) {
            console.error("Save category error:", err);
            toast.error(
                err?.response?.data?.message ||
                    (editingId
                        ? "Failed to update category"
                        : "Failed to create category")
            );
        } finally {
            setSubmittingForm(false);
        }
    };

    /* -------- Toggle isActive (inline) -------- */


    /* -------- Delete -------- */
    const handleDelete = async (c) => {
        try {
            setDeletingId(c._id);
            await apiClient.delete(`${categoryUrl.delete}${c._id}`);
            setCategories((prev) => prev.filter((x) => x._id !== c._id));
            toast.success(`${c.name} deleted`);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
            setConfirmDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-blue-50/40 px-6 py-8 lg:px-10 lg:py-10">
            <div className="max-w-[1400px] mx-auto">
                {/* ---------- HEADER ---------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        {/* <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-semibold border border-blue-200/50">
                                <FiLayers size={12} />
                                Category Manager
                            </span>
                        </div> */}
                 <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
    All Categories
</h1>
                        {/* <p className="text-slate-500 text-sm mt-2">
                            {totalCategories} categor{totalCategories === 1 ? "y" : "ies"} •{" "}
                            <span className="text-emerald-600 font-medium">
                                {activeCount} active
                            </span>{" "}
                            •{" "}
                            <span className="text-slate-400 font-medium">
                                {totalCategories - activeCount} inactive
                            </span>
                        </p> */}
                    </div>
                    <button
                        onClick={openCreate}
                        className="sm:self-start sm:mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                    >
                        <FiPlus size={17} />
                        Add Category
                    </button>
                </div>

                {/* ---------- FILTERS ---------- */}
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
                                placeholder="Search categories..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Status filter dropdown */}
                        {/* <div ref={statusDropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setShowStatusDropdown((v) => !v)}
                                className="w-full md:w-[200px] flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 transition-all"
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    {statusFilter === "all" ? (
                                        <FiFilter size={14} className="text-slate-400" />
                                    ) : statusFilter === "active" ? (
                                        <FiToggleRight size={14} className="text-emerald-500" />
                                    ) : (
                                        <FiToggleLeft size={14} className="text-slate-400" />
                                    )}
                                    <span
                                        className={`truncate ${
                                            statusFilter === "all"
                                                ? "text-slate-500"
                                                : "font-medium text-slate-700"
                                        }`}
                                    >
                                        {statusLabel}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    {statusFilter !== "all" && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStatusFilter("all");
                                            }}
                                            className="w-5 h-5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                            title="Clear filter"
                                        >
                                            <FiX size={11} />
                                        </button>
                                    )}
                                    <FiChevronDown
                                        size={15}
                                        className={`text-slate-400 transition-transform duration-200 ${
                                            showStatusDropdown
                                                ? "rotate-180 text-indigo-500"
                                                : ""
                                        }`}
                                    />
                                </span>
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 z-50 mt-2 w-full md:w-[220px] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 py-2 overflow-hidden">
                                    <ul className="max-h-72 overflow-y-auto">
                                        {[
                                            { key: "all", label: "All Statuses" },
                                            { key: "active", label: "Active" },
                                            { key: "inactive", label: "Inactive" },
                                        ].map((opt) => {
                                            const active = statusFilter === opt.key;
                                            return (
                                                <li key={opt.key}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setStatusFilter(opt.key);
                                                            setShowStatusDropdown(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                                                            active
                                                                ? "bg-indigo-50 text-indigo-700 font-semibold"
                                                                : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {opt.label}
                                                        {active && (
                                                            <span className="text-[11px] text-indigo-500">
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
                        </div> */}

                        <button
                            type="button"
                            onClick={fetchCategories}
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
                                {filteredCategories.length}
                            </span>{" "}
                            of {totalCategories} categor
                            {totalCategories === 1 ? "y" : "ies"}
                        </span>
                        {(search || statusFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <FiX size={11} /> Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* ---------- TABLE CARD ---------- */}
                <div className="bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm " >
                            <thead>
                                <tr className="text-center  text-xs uppercase tracking-wider">
                                    <th className="text-left pl-8 pr-6 py-5 font-semibold">
                                        #
                                    </th>
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Category Name
                                    </th>
                                    {/* <th className="text-left px-6 py-5 font-semibold">
                                        Slug
                                    </th> */}
                                    <th className="text-left px-6 py-5 font-semibold">
                                        Talents
                                    </th>
                                    {/* <th className="text-left px-6 py-5 font-semibold">
                                        Status
                                    </th> */}
                                    {/* <th className="text-right pl-6 pr-8 py-5 font-semibold">
                                        Actions
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 mb-4">
                                                <FiLayers size={30} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                No categories found
                                            </h3>
                                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                                {search || statusFilter !== "all"
                                                    ? "Try adjusting your search or filters."
                                                    : "Add your first category to get started."}
                                            </p>
                                            {!search && statusFilter === "all" && (
                                                <button
                                                    onClick={openCreate}
                                                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-400 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                                                >
                                                    <FiPlus size={14} />
                                                    Add Category
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((c, idx) => (
                                        <CategoryRow
                                            key={c._id}
                                            index={idx}
                                            category={c}
                                            talentCount={categoryCounts[c._id] || 0}
                                            onEdit={() => openEdit(c)}
                                            onToggle={() => toggleActive(c)}
                                            onDelete={() => setConfirmDelete(c)}
                                            toggling={togglingId === c._id}
                                            deleting={deletingId === c._id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ---------- CREATE / UPDATE MODAL ---------- */}
            {showForm && (
                <CategoryFormModal
                    editingId={editingId}
                    name={formName}
                    setName={setFormName}
                    isActive={formIsActive}
                    setIsActive={setFormIsActive}
                    submitting={submittingForm}
                    onSubmit={handleFormSubmit}
                    onCancel={closeForm}
                />
            )}

            {/* ---------- DELETE MODAL ---------- */}
            {confirmDelete && (
                <DeleteModal
                    title="Delete Category?"
                    item={confirmDelete}
                    itemNameKey="name"
                    itemIdentifierKey="slug"
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete)}
                    deleting={deletingId === confirmDelete._id}
                />
            )}
        </div>
    );
};

/* ============ Category Row ============ */
const CategoryRow = ({
    index,
    category: c,
    talentCount,
    onEdit,
    onToggle,
    onDelete,
    toggling,
    deleting,
}) => {
    const disabled = toggling || deleting;
    return (
        <tr className="group hover:bg-indigo-50/30 transition-colors ">
            <td className="pl-8 pr-6 py-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                    <FiHash size={10} className="text-slate-400" />
                    {String(index + 1).padStart(2, "0")}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                        <FiLayers size={16} />
                    </div> */}
                    <span className="font-semibold text-slate-800 leading-tight">
                        {c.name}
                    </span>
                </div>
            </td>
            {/* <td className="px-6 py-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono">
                    /{c.slug || "—"}
                </span>
            </td> */}
            <td className="px-6 py-5">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-xs ${
                        talentCount > 0
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                    }`}
                >
                    <FiUsers size={11} />
                    {talentCount} talent{talentCount === 1 ? "" : "s"}
                </span>
            </td>
            {/* <td className="px-6 py-5">
                <button
                    type="button"
                    onClick={onToggle}
                    disabled={disabled}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                        c.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                    }`}
                >
                    {toggling ? (
                        <svg
                            className="animate-spin w-3.5 h-3.5"
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
                    ) : c.isActive ? (
                        <FiToggleRight size={14} className="text-emerald-600" />
                    ) : (
                        <FiToggleLeft size={14} className="text-slate-400" />
                    )}
                    {c.isActive ? "Active" : "Inactive"}
                </button>
            </td> */}
            <td className="pl-6 pr-8 py-5">
                <div className="flex items-center justify-end gap-2">
                    <ActionIcon
                        label="Edit"
                        onClick={onEdit}
                        className="hover:bg-amber-50 hover:text-amber-600 text-slate-400"
                        disabled={disabled}
                    >
                        <FiEdit2 size={15} />
                    </ActionIcon>
                    <ActionIcon
                        label="Delete"
                        onClick={onDelete}
                        loading={deleting}
                        className="hover:bg-red-50 hover:text-red-600 text-slate-400"
                        disabled={disabled}
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
    disabled,
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading || disabled}
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

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="pl-8 pr-6 py-5">
            <div className="h-5 w-10 bg-slate-200 rounded-lg" />
        </td>
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div>
                    <div className="h-4 w-28 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-5">
            <div className="h-5 w-24 bg-slate-200 rounded-lg" />
        </td>
        <td className="px-6 py-5">
            <div className="h-5 w-16 bg-slate-200 rounded-lg" />
        </td>
        <td className="px-6 py-5">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </td>
        <td className="pl-6 pr-8 py-5">
            <div className="flex justify-end gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
            </div>
        </td>
    </tr>
);

/* ============ Create / Update Form Modal ============ */
const CategoryFormModal = ({
    editingId,
    name,
    setName,
    isActive,
    setIsActive,
    submitting,
    onSubmit,
    onCancel,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out] z-50">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
                <form onSubmit={onSubmit}>
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-300 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                {editingId ? <FiEdit2 size={18} /> : <FiPlus size={18} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                    {editingId ? "Edit Category" : "Add New Category"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editingId
                                        ? "Update existing category details"
                                        : "Create a new talent category"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Name field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-0.5">
                                    Category Name
                                </label>
                                <div className="relative">
                                    <FiLayers
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Singer, Dancer, Model..."
                                        autoFocus
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* isActive toggle */}
                            {/* <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">
                                        Active status
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        Inactive categories are hidden from public browsing
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsActive((v) => !v)}
                                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                                        isActive ? "bg-indigo-600" : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            isActive ? "translate-x-6" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div> */}
                        </div>
                    </div>

                    <div className="px-8 pb-8 flex items-center justify-end gap-3 bg-slate-50/60 pt-5 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !name.trim()}
                            className="relative inline-flex items-center gap-2.5 px-7 py-2.5 rounded-2xl bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-700 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
                        >
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
                                    {editingId ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                <>
                                    <FiSave size={14} />
                                    {editingId ? "Update Category" : "Save Category"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategory;
