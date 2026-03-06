import { useState } from "react";
import { Link } from "react-router";
import { User, ClipboardList, MessageSquare, Bell, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "접수확인": { bg: "bg-blue-50", text: "text-blue-600" },
  "상담중": { bg: "bg-amber-50", text: "text-amber-600" },
  "배정완료": { bg: "bg-purple-50", text: "text-purple-600" },
  "일정확정": { bg: "bg-cyan-50", text: "text-cyan-600" },
  "진행중": { bg: "bg-[#1F6B78]/10", text: "text-[#1F6B78]" },
  "완료": { bg: "bg-green-50", text: "text-green-600" },
};

const MY_APPLICATIONS = [
  { id: "SVC-2026-001", service: "재택의료", title: "방문진료 신청", date: "2026-02-28", status: "일정확정", steps: ["접수확인", "상담중", "배정완료", "일정확정", "진행중", "완료"], currentStep: 3 },
  { id: "SVC-2026-002", service: "마을 돌봄", title: "정기 돌봄 서비스 신청", date: "2026-03-01", status: "상담중", steps: ["접수확인", "상담중", "배정완료", "일정확정", "진행중", "완료"], currentStep: 1 },
  { id: "SVC-2025-048", service: "건강공동체", title: "건강교실 수강 신청", date: "2025-12-15", status: "완��", steps: ["접수확인", "상담중", "배정완료", "일정확정", "진행중", "완료"], currentStep: 5 },
];

const MY_INQUIRIES = [
  { id: "INQ-001", title: "돌봄 서비스 이용 시간 문의", date: "2026-02-20", status: "완료" },
  { id: "INQ-002", title: "조합원 할인 적용 방법", date: "2026-03-01", status: "처리중" },
];

export function MyPagePage() {
  const [tab, setTab] = useState("applications");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const app = selectedApp ? MY_APPLICATIONS.find((a) => a.id === selectedApp) : null;

  const TABS = [
    { id: "profile", label: "내 정보", icon: User },
    { id: "applications", label: "신청 내역", icon: ClipboardList },
    { id: "inquiries", label: "내 문의", icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl text-[#1A2332] mb-8" style={{ fontWeight: 700 }}>마이페이지</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-lg">
                <span>&#x1F33F;</span>
              </div>
              <div>
                <p className="text-[#1A2332]" style={{ fontWeight: 600 }}>홍길동 님</p>
                <p className="text-xs text-[#1F6B78]" style={{ fontWeight: 600 }}>조합원</p>
              </div>
            </div>
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>가입일: 2024-06-15</p>
              <p>조합원번호: M-2024-0123</p>
            </div>
          </div>
          <nav className="space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setSelectedApp(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
                    tab === t.id ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-[#6B7280] hover:bg-gray-50"
                  }`}
                  style={{ fontWeight: tab === t.id ? 600 : 400 }}
                >
                  <Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === "profile" && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg text-[#1A2332] mb-6" style={{ fontWeight: 700 }}>내 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "이름", value: "홍길동" },
                  { label: "연락처", value: "010-1234-5678" },
                  { label: "이메일", value: "hong@email.com" },
                  { label: "주소", value: "강원도 횡성군 횡성읍 중앙로 456" },
                  { label: "조합원 상태", value: "정회원 (1좌)" },
                  { label: "가입일", value: "2024-06-15" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-[#9CA3AF] mb-1">{f.label}</p>
                    <p className="text-sm text-[#1A2332]" style={{ fontWeight: 500 }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <button className="mt-8 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#4B5563] hover:bg-gray-50 cursor-pointer">
                정보 수정
              </button>
            </div>
          )}

          {tab === "applications" && !app && (
            <div>
              <h2 className="text-lg text-[#1A2332] mb-6" style={{ fontWeight: 700 }}>내 서비스 신청 내역</h2>
              <div className="space-y-4">
                {MY_APPLICATIONS.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedApp(a.id)}
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs ${STATUS_COLORS[a.status]?.bg || "bg-gray-50"} ${STATUS_COLORS[a.status]?.text || "text-gray-600"}`} style={{ fontWeight: 600 }}>
                            {a.status}
                          </span>
                          <span className="text-xs text-[#9CA3AF]">{a.service}</span>
                        </div>
                        <h3 className="text-[#1A2332] group-hover:text-[#1F6B78] transition-colors" style={{ fontWeight: 600 }}>{a.title}</h3>
                        <p className="text-xs text-[#9CA3AF] mt-1">{a.id} · {a.date}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "applications" && app && (
            <div>
              <button onClick={() => setSelectedApp(null)} className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#1A2332] mb-4 cursor-pointer">
                ← 목록으로
              </button>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${STATUS_COLORS[app.status]?.bg} ${STATUS_COLORS[app.status]?.text}`} style={{ fontWeight: 600 }}>
                    {app.status}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{app.id}</span>
                </div>
                <h2 className="text-xl text-[#1A2332] mb-2" style={{ fontWeight: 700 }}>{app.title}</h2>
                <p className="text-sm text-[#6B7280] mb-8">서비스: {app.service} · 신청일: {app.date}</p>

                {/* Timeline Stepper */}
                <h3 className="text-sm text-[#1A2332] mb-4" style={{ fontWeight: 700 }}>진행 상태</h3>
                <div className="space-y-4">
                  {app.steps.map((step, i) => {
                    const done = i <= app.currentStep;
                    const current = i === app.currentStep;
                    return (
                      <div key={step} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            done ? "bg-[#1F6B78] text-white" : "bg-gray-100 text-gray-400"
                          }`}>
                            {done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                          </div>
                          {i < app.steps.length - 1 && (
                            <div className={`w-0.5 h-8 ${done ? "bg-[#1F6B78]" : "bg-gray-200"}`} />
                          )}
                        </div>
                        <div className={`pt-1 ${current ? "text-[#1F6B78]" : done ? "text-[#1A2332]" : "text-[#9CA3AF]"}`}>
                          <p className="text-sm" style={{ fontWeight: current ? 700 : done ? 500 : 400 }}>
                            {step}
                            {current && <span className="ml-2 text-xs bg-[#1F6B78]/10 px-2 py-0.5 rounded-full">현재</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "inquiries" && (
            <div>
              <h2 className="text-lg text-[#1A2332] mb-6" style={{ fontWeight: 700 }}>내 문의 내역</h2>
              <div className="space-y-3">
                {MY_INQUIRIES.map((inq) => (
                  <div key={inq.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                            inq.status === "완료" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                          }`} style={{ fontWeight: 600 }}>
                            {inq.status}
                          </span>
                        </div>
                        <h3 className="text-[#1A2332]" style={{ fontWeight: 600 }}>{inq.title}</h3>
                        <p className="text-xs text-[#9CA3AF] mt-1">{inq.id} · {inq.date}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}