"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GamificationService } from "@/services/gamification.service";
import { useAuth } from "@/contexts/AuthContext";

export default function AvatarGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAvatar = async () => {
            // Wait for auth to load
            if (isLoading) return;

            // Only students (roleId 5) need an avatar
            if (user && user.roleId !== 5) {
                setChecking(false);
                return;
            }

            // Skip check if we are already on the selection page
            if (pathname === '/dashboard/avatar-selection') {
                setChecking(false);
                return;
            }

            try {
                // Check local storage first for speed (optional optimization)
                const localSelected = localStorage.getItem('bestkids-avatar-selected');
                if (localSelected === 'true') {
                    setChecking(false);
                    return;
                }

                // Verify with backend
                const profile = await GamificationService.getProfile();

                if (!profile.selectedAvatarId) {
                    console.log("No avatar selected, redirecting to selection page...");
                    router.push('/dashboard/avatar-selection');
                } else {
                    // Update local storage to avoid future calls
                    localStorage.setItem('bestkids-avatar-selected', 'true');
                    // Also store the ID if we can
                    localStorage.setItem('bestkids-selected-avatar', String(profile.selectedAvatarId));
                }
            } catch (error) {
                console.error("Failed to check avatar status", error);
                // On error, we probably shouldn't block the user, or maybe we should?
                // For now, let them pass to avoid locking them out if API fails
            } finally {
                setChecking(false);
            }
        };

        checkAvatar();
    }, [pathname, router]);

    // Non-blocking check to avoid hydration mismatch and improve UX
    return <>{children}</>;
}
