import { CheckCircle2, AlertTriangle, Clock, XCircle, Circle, Pause, Eye, Send, FileText, Ban } from "lucide-react";

// Status badge system using ONLY 3 brand colors + neutral (no red/orange)
type BadgeVariant = "primary" | "secondary" | "accent" | "neutral" | "primaryLight";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-[#1F6B78]/10 text-[#1F6B78] border-[#1F6B78]/20",
  secondary: "bg-[#67B89A]/10 text-[#2D7A5E] border-[#67B89A]/20",
  accent: "bg-[#F2EBDD] text-[#7A6C55] border-[#E5D9C3]",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  primaryLight: "bg-[#1F6B78]/5 text-[#1F6B78] border-[#1F6B78]/10",
};

// Member statuses
const MEMBER_STATUS: Record<string, { variant: BadgeVariant; icon: typeof Circle }> = {
  "가입신청": { variant: "accent", icon: Clock },
  "입금확인중": { variant: "accent", icon: AlertTriangle },
  "가입완료": { variant: "secondary", icon: CheckCircle2 },
  "정회원": { variant: "secondary", icon: CheckCircle2 },
  "휴면": { variant: "neutral", icon: Pause },
  "탈퇴": { variant: "neutral", icon: XCircle },
  "블랙리스트": { variant: "neutral", icon: Ban },
  "승인대기": { variant: "accent", icon: Clock },
};

// Service statuses
const SERVICE_STATUS: Record<string, { variant: BadgeVariant; icon: typeof Circle }> = {
  "접수됨": { variant: "primaryLight", icon: Circle },
  "접수대기": { variant: "primaryLight", icon: Circle },
  "확인중": { variant: "accent", icon: AlertTriangle },
  "상담중": { variant: "accent", icon: AlertTriangle },
  "일정대기": { variant: "accent", icon: Clock },
  "일정확정": { variant: "primary", icon: CheckCircle2 },
  "배정완료": { variant: "primary", icon: CheckCircle2 },
  "진행중": { variant: "primary", icon: Clock },
  "완료": { variant: "secondary", icon: CheckCircle2 },
  "취소": { variant: "neutral", icon: XCircle },
  "보류": { variant: "neutral", icon: Pause },
};

// Ticket statuses
const TICKET_STATUS: Record<string, { variant: BadgeVariant; icon: typeof Circle }> = {
  "새 문의": { variant: "accent", icon: AlertTriangle },
  "대기": { variant: "accent", icon: Clock },
  "처리중": { variant: "primary", icon: Clock },
  "답변완료": { variant: "secondary", icon: CheckCircle2 },
  "종료": { variant: "neutral", icon: CheckCircle2 },
  "완료": { variant: "secondary", icon: CheckCircle2 },
};

// Content statuses
const CONTENT_STATUS: Record<string, { variant: BadgeVariant; icon: typeof Circle }> = {
  "초안": { variant: "neutral", icon: FileText },
  "예약": { variant: "accent", icon: Clock },
  "게시": { variant: "secondary", icon: Eye },
  "게시중": { variant: "secondary", icon: Eye },
  "숨김": { variant: "neutral", icon: XCircle },
  "보관": { variant: "neutral", icon: Pause },
};

// Transaction statuses
const TRANSACTION_STATUS: Record<string, { variant: BadgeVariant; icon: typeof Circle }> = {
  "미매칭": { variant: "accent", icon: AlertTriangle },
  "자동매칭": { variant: "primaryLight", icon: Clock },
  "수동매칭": { variant: "primaryLight", icon: Clock },
  "확인완료": { variant: "secondary", icon: CheckCircle2 },
  "환급대기": { variant: "accent", icon: Clock },
  "환급완료": { variant: "neutral", icon: CheckCircle2 },
};

const ALL_STATUSES = { ...MEMBER_STATUS, ...SERVICE_STATUS, ...TICKET_STATUS, ...CONTENT_STATUS, ...TRANSACTION_STATUS };

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusBadge({ status, size = "sm", showIcon = true }: StatusBadgeProps) {
  const config = ALL_STATUSES[status] || { variant: "neutral" as BadgeVariant, icon: Circle };
  const Icon = config.icon;
  const style = VARIANT_STYLES[config.variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${style} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ fontWeight: 600 }}
    >
      {showIcon && <Icon size={size === "sm" ? 11 : 13} />}
      {status}
    </span>
  );
}

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md";
}

export function Badge({ variant = "neutral", children, size = "sm" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${VARIANT_STYLES[variant]} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ fontWeight: 600 }}
    >
      {children}
    </span>
  );
}
