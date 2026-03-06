import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description?: string;
}

export function AdminPlaceholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#F2EBDD] flex items-center justify-center mx-auto mb-4">
          <Construction size={28} className="text-[#7A6C55]" />
        </div>
        <h2 className="text-lg text-[#111827] mb-2" style={{ fontWeight: 700 }}>{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description || "이 페이지는 준비 중입니다. Supabase 연동 후 데이터 기반으로 구현됩니다."}
        </p>
      </div>
    </div>
  );
}

// Remaining placeholder pages (Reports & Export)
export function AdminReports() {
  return <AdminPlaceholder title="운영 리포트" description="일/주/월 운영 리포트를 생성하고 확인합니다." />;
}

export function AdminExport() {
  return <AdminPlaceholder title="데이터 내보내기" description="조합원, 서비스, 입금 데이터를 CSV/엑셀로 내보냅니다." />;
}
