"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function StudentNavBar() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/dashboard",
            label: "Inicio",
            icon: "/assets/game/icon-home.png",
            color: "border-b-[#E5A500]"
        },
        {
            href: "/dashboard/worlds",
            label: "Jugar",
            icon: "/assets/game/icon-play.png",
            color: "border-b-[#1899D6]"
        },
        {
            href: "/dashboard/achievements",
            label: "Logros",
            icon: "/assets/game/icon-trophy.png",
            color: "border-b-[#E5A500]"
        },
        {
            href: "/dashboard/profile",
            label: "Perfil",
            icon: "/assets/game/icon-profile.png",
            color: "border-b-[#A568CC]"
        },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-[32px] border-4 border-[#E5E5E5] shadow-[0_8px_0_#E5E5E5] z-50 flex items-end gap-4 animate-bounce-in min-w-[340px] justify-between">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            relative group flex flex-col items-center justify-center p-2 rounded-[24px] transition-all duration-300
                            ${isActive ? '-translate-y-4 scale-110' : 'hover:-translate-y-2'}
                        `}
                    >
                        {/* 3D Icon Container */}
                        <div className={`
                            relative w-16 h-16 transition-transform duration-300 drop-shadow-md select-none
                            ${isActive ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'}
                        `}>
                            <Image
                                src={item.icon}
                                alt={item.label}
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        {/* Label Pill (Solo visible al hover o activo si se desea, pero mejor siempre visible en hover para limpieza) */}
                        <span className={`
                            absolute -bottom-8 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white border-2 border-[#E5E5E5] text-[#4B4B4B] shadow-sm whitespace-nowrap transition-all duration-300
                            ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'}
                        `}>
                            {item.label}
                        </span>

                        {/* Active Indicator Dot */}
                        {isActive && (
                            <div className="absolute -top-1 w-2 h-2 bg-[#58CC02] rounded-full ring-2 ring-white animate-pulse" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
