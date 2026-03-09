import {
  Activity,
  HandHeart,
  MapPin,
  Stethoscope,
} from "lucide-react";
import type { QuickMenuItem } from "../components/QuickMenuSection";

export const HOME_QUICK_MENU_ITEMS: QuickMenuItem[] = [
  {
    title: "방문진료 신청",
    description: "",
    href: "/services/homecare",
    icon: Stethoscope,
    eyebrow: "찾아가는 진료",
    accent: "#5E7698",
  },
  {
    title: "돌봄서비스",
    description: "",
    href: "/services/nursing",
    icon: HandHeart,
    eyebrow: "건강 돌봄",
    accent: "#4E6E90",
  },
  {
    title: "건강활동 및 모임",
    description: "",
    href: "/community",
    icon: Activity,
    eyebrow: "건강 활동",
    accent: "#3E8C86",
  },
  {
    title: "오시는길",
    description: "",
    href: "/about/directions",
    icon: MapPin,
    eyebrow: "위치 안내",
    accent: "#416E58",
  },
];
