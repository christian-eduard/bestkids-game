"use client";

import Sidebar from '@/components/Sidebar';
import AvatarGuard from '@/components/guards/AvatarGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
                <AvatarGuard>
                    {/* Mobile Header (Visible only on small screens) */}
                    <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f4e7f4] dark:border-[#3d253d]">
                        <div className="flex items-center gap-2">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOo7d2ndHqvovt17mkoWD9MsRE9IVZoM6DawZqQrwLO8wxkaMmIFZsj1N275i8fviAH4GIovh0yrOv0V3e4U3hk_JzVlFBvSd3jhXtgnZLEeVM3i-uV-dEPYaXvZHg0murjYVlLGd1tkPH8toRRrUlHaoyAWfWHh6e8JVADooHO0M2pRqzj5cvZ3eQ8TW4qQYDkWaut8d0LMtNZLxhi7ISlPH23bKFMNDt8siYuEWcKQD45x-qwS6zO6J3pPr9o_-J6vgBEeXs8Ek")' }}></div>
                            <span className="font-bold text-lg text-text-main dark:text-white">BestKids</span>
                        </div>
                        <button className="p-2 rounded-full bg-white dark:bg-card-dark shadow-sm text-text-main dark:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </AvatarGuard>
            </main>
        </div>
    );
}
