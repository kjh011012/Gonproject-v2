import { createHashRouter } from "react-router";
import { PublicLayout } from "./components/layouts/PublicLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { AboutIntroPage } from "./pages/AboutIntro";
import { GreetingPage } from "./pages/Greeting";
import { ServicesPage } from "./pages/Services";
import { JoinPage } from "./pages/Join";
import { CommunityPage } from "./pages/Community";
import { CommunityDetailPage } from "./pages/CommunityDetail";
import { NoticesPage } from "./pages/Notices";
import { InquiriesPage } from "./pages/Inquiries";
import { LoginPage } from "./pages/Login";
import { MyPagePage } from "./pages/MyPage";
import { SubpagePlaceholder } from "./pages/SubpagePlaceholder";
import { PeoplePage } from "./pages/People";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminApplications } from "./pages/admin/Applications";
import { AdminNotices } from "./pages/admin/AdminNotices";
import { AdminInquiries } from "./pages/admin/AdminInquiries";
import { AdminMembers } from "./pages/admin/AdminMembers";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminTransactions } from "./pages/admin/AdminTransactions";
import { AdminBlacklistPage } from "./pages/admin/AdminBlacklistPage";
import { AdminCalendarPage } from "./pages/admin/AdminCalendarPage";
import { AdminOpsConsolePage } from "./pages/admin/AdminOpsConsolePage";
import { AdminCatalogPage } from "./pages/admin/AdminCatalogPage";
import { AdminStaffPage } from "./pages/admin/AdminStaffPage";
import { AdminEventsPage } from "./pages/admin/AdminEventsPage";
import { AdminMediaDocsPage } from "./pages/admin/AdminMediaDocsPage";
import { AdminPhotosPage } from "./pages/admin/AdminPhotosPage";
import { AdminMediaLibPage } from "./pages/admin/AdminMediaLibPage";
import { AdminTemplatesPage } from "./pages/admin/AdminTemplatesPage";
import { AdminFAQPage } from "./pages/admin/AdminFAQPage";
import { AdminOpsSettingsPage } from "./pages/admin/AdminOpsSettingsPage";
import { AdminAccountsPage } from "./pages/admin/AdminAccountsPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { AdminAuditPage } from "./pages/admin/AdminAuditPage";
import { AdminTrashPage } from "./pages/admin/AdminTrashPage";
import {
  AdminReports,
  AdminExport,
} from "./pages/admin/AdminPlaceholder";

export const router = createHashRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      /* ── 조합소개 ── */
      { path: "about", Component: AboutIntroPage },
      { path: "about/greeting", Component: GreetingPage },
      { path: "about/history", Component: SubpagePlaceholder },
      { path: "about/organization", Component: SubpagePlaceholder },
      { path: "about/people", Component: PeoplePage },
      { path: "about/directions", Component: SubpagePlaceholder },
      /* ── 사업소 안내 ── */
      { path: "services", Component: ServicesPage },
      { path: "services/rights", Component: SubpagePlaceholder },
      { path: "services/clinic", Component: SubpagePlaceholder },
      { path: "services/homecare", Component: SubpagePlaceholder },
      { path: "services/nursing", Component: SubpagePlaceholder },
      /* ── 커뮤니티 ── */
      { path: "community", Component: CommunityPage },
      { path: "community/press", Component: CommunityPage },
      { path: "community/resources", Component: CommunityPage },
      { path: "community/daily", Component: CommunityPage },
      { path: "community/:type/:id", Component: CommunityDetailPage },
      { path: "notices", Component: CommunityPage },
      /* ── 참여 ── */
      { path: "volunteer", Component: SubpagePlaceholder },
      { path: "donate", Component: SubpagePlaceholder },
      /* ── 조합원 (LOCKED - do not modify JoinPage) ── */
      { path: "join", Component: JoinPage },
      { path: "join/we-are", Component: AboutPage },
      /* ── 기타 ── */
      { path: "inquiries", Component: InquiriesPage },
      { path: "login", Component: LoginPage },
      { path: "mypage", Component: MyPagePage },
      { path: "search", Component: SubpagePlaceholder },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      // 조합원
      { path: "members", Component: AdminMembers },
      { path: "applications", Component: AdminApplications },
      { path: "blacklist", Component: AdminBlacklistPage },
      { path: "transactions", Component: AdminTransactions },
      // 서비스
      { path: "services", Component: AdminServices },
      { path: "calendar", Component: AdminCalendarPage },
      { path: "ops-console", Component: AdminOpsConsolePage },
      { path: "catalog", Component: AdminCatalogPage },
      { path: "staff", Component: AdminStaffPage },
      // 콘텐츠
      { path: "notices", Component: AdminNotices },
      { path: "events", Component: AdminEventsPage },
      { path: "media-docs", Component: AdminMediaDocsPage },
      { path: "photos", Component: AdminPhotosPage },
      { path: "media-lib", Component: AdminMediaLibPage },
      // 문의/CS
      { path: "inquiries", Component: AdminInquiries },
      { path: "templates", Component: AdminTemplatesPage },
      { path: "faq", Component: AdminFAQPage },
      // 리포트
      { path: "reports", Component: AdminReports },
      { path: "export", Component: AdminExport },
      // 설정 (각각 독립 페이지)
      { path: "settings", Component: AdminOpsSettingsPage },
      { path: "roles", Component: AdminAccountsPage },
      { path: "notifications", Component: AdminNotificationsPage },
      { path: "audit", Component: AdminAuditPage },
      { path: "trash", Component: AdminTrashPage },
    ],
  },
]);
