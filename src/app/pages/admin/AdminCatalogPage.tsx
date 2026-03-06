import { Eye } from "lucide-react";
import { ServicesPage } from "../Services";

export function AdminCatalogPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center gap-2 text-[#111827]">
          <Eye size={16} className="text-[#1F6B78]" />
          <h1 className="text-base" style={{ fontWeight: 700 }}>서비스 카탈로그 미러링</h1>
        </div>
        <p className="mt-1 text-xs text-[#6B7280]">
          이 화면은 고객 서비스 페이지(`/services`)를 동일하게 미러링한 보기입니다.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <ServicesPage />
      </div>
    </div>
  );
}
