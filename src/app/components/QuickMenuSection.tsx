import { type LucideIcon } from "lucide-react";
import { Link } from "react-router";

export interface QuickMenuItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  accent: string;
}

interface QuickMenuSectionProps {
  items: QuickMenuItem[];
  isSenior?: boolean;
  className?: string;
}

export function QuickMenuSection({
  items,
  isSenior,
  className = "",
}: QuickMenuSectionProps) {
  return (
    <section className={`relative ${className}`}>
      <nav aria-label="홈 주요 서비스 바로가기">
        <div className="overflow-hidden rounded-[18px] shadow-[0_16px_30px_-26px_rgba(17,31,38,0.3)]">
          <div className="grid grid-cols-1 divide-y divide-white/15 md:grid-cols-2 md:divide-y-0 md:divide-x lg:grid-cols-4">
            {items.map((item, index) => {
              const Icon = item.icon;
              const descId = `quick-menu-desc-${index}`;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  aria-describedby={
                    item.description ? descId : undefined
                  }
                  className="group flex min-h-[108px] flex-col items-center justify-center gap-2 px-4 py-4 text-center transition-[filter] duration-200 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25 focus-visible:ring-inset md:min-h-[118px] md:px-5"
                  style={{ backgroundColor: item.accent }}
                >
                  <div className="shrink-0 text-white">
                    <Icon size={isSenior ? 28 : 24} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 text-center">
                    <h3
                      className={`text-white ${isSenior ? "text-[20px] leading-[1.35]" : "text-[17px] leading-[1.3]"}`}
                      style={{ fontWeight: 700 }}
                    >
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p
                        id={descId}
                        className={`mt-1 text-white/84 ${isSenior ? "text-[15px] leading-[1.45]" : "text-[12px] leading-relaxed"}`}
                      >
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </section>
  );
}
