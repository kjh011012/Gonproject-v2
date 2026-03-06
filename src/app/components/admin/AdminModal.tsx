import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function AdminModal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  if (!open) return null;
  const w = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl ${w} w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// 2-step destructive confirm modal
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  requireReason?: boolean;
  reason?: string;
  onReasonChange?: (v: string) => void;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "확인",
  requireReason,
  reason,
  onReasonChange,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={requireReason && !reason?.trim()}
            className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm hover:bg-[#1F2937] cursor-pointer disabled:opacity-40 disabled:cursor-default flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <AlertTriangle size={14} />
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} className="text-[#111827]" />
        </div>
        <div>
          <p className="text-sm text-[#374151] leading-relaxed">{message}</p>
          <p className="text-xs text-gray-400 mt-1">상태 변경 시 고객 화면에도 반영됩니다</p>
        </div>
      </div>
      {requireReason && (
        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>사유 입력 (필수)</label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange?.(e.target.value)}
            placeholder="사유를 입력해 주세요..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
      )}
    </AdminModal>
  );
}
