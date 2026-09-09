import { FiTrash2 } from "react-icons/fi";

const DeleteModal = ({
    title = "Delete Item?",
    item = {},
    itemNameKey = "name",
    itemIdentifierKey,
    message,
    confirmLabel = "Delete",
    confirmLoadingLabel = "Deleting...",
    cancelLabel = "Cancel",
    onCancel,
    onConfirm,
    deleting = false,
}) => {
    const name = item?.[itemNameKey] ?? "";
    const identifier = itemIdentifierKey ? item?.[itemIdentifierKey] ?? "" : "";

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
                <div className="px-8 pt-8 pb-6 text-center">
                    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-linear-to-br from-red-50 to-rose-100 flex items-center justify-center text-red-500 shadow-inner">
                        <FiTrash2 size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {title}
                    </h3>
                    {message ? (
                        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                            {message}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                            You are about to permanently delete{" "}
                            {name ? (
                                <span className="font-semibold text-slate-800">
                                    {name}
                                </span>
                            ) : (
                                "this item"
                            )}
                            {identifier ? (
                                <>
                                    {" "}
                                    ({identifier}).
                                </>
                            ) : (
                                "."
                            )}{" "}
                            This cannot be undone.
                        </p>
                    )}
                </div>
                <div className="px-8 pb-8 flex items-center justify-end gap-3 bg-slate-50/60 pt-5 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl disabled:opacity-70 transition-all"
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
                                {confirmLoadingLabel}
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={14} />
                                {confirmLabel}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
