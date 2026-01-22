import { create } from "zustand";
import { authFetch } from "@/lib/http/authHttp";

interface User {
    id: number;
    fullName: string;
    email: string;
    userType: string;
    profilePicture?: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    loading: true,
    initialized: false,

    checkAuth: async () => {
        try {
            const res = await authFetch("auth/me");
            set({ user: res.data, loading: false, initialized: true });
        } catch {
            set({ user: null, loading: false, initialized: true });
        }
    },

    setUser: (user) => set({ user }),

    logout: async () => {
        try {
            await authFetch("auth/logout", { method: "POST" });
        } finally {
            set({ user: null });
            window.location.href = "/login";
        }
    },
}));
