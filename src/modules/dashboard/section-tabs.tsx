"use client";

import { useEffect, useRef, useState } from "react";
import { s, UsersRound } from "lucide-react";

const SECTIONS = [
  { id: "section-atiradores", label: "Atiradores", Icon: Users },
  { id: "section-familiares", label: "Familiares", Icon: UsersRound },
] as const;

export function DashboardSectionTabs() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    }, options);

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80; // height of any sticky headers
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="sticky top-0 z-20 mb-4 bg-slate-50/95 backdrop-blur-sm border border-slate-200 rounded-sm shadow-sm">
      <div className="flex items-center gap-1 p-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 hidden sm:block">
          Seções
        </span>
        {SECTIONS.map(({ id, label, Icon }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isActive
                  ? "bg-green-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
