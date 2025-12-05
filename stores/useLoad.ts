import { create } from "zustand"

export const CAMP_API_KEY = "CAMPS"
export const CAMP_BY_ID_API_KEY = "CAMPBYID"
export const DASHBOARD = "DASHBOARD"
export const BOOKINGS = "BOOKINGS"

export interface ApiState {
    loading: Record<string, boolean>,
    error: Record<string, string | null>,
    start: (key: string) => void,
    stop:(key:string)=>void,
    success: (key: string) => void,
    fail: (key: string, error: string) => void,
    apiRequest: <T>(key: string, request: () => Promise<T>) => Promise<T>
}


export const useApiStore = create<ApiState>((set, get) => ({
    loading: {},
    error: {},
    start: (key) => {
        set((s) => ({
            loading: { ...s.loading, [key]: true },
            error: { ...s.error, [key]: null }
        }))
    },
    apiRequest: async (key, request) => {
        const { start, success, fail } = get()
        try {
            start(key)
            const result = await request()
            success(key)
            return result
        } catch (e: any) {
            fail(key, e?.message || "unknown error")
            throw e
        } finally {
            // ensures loading resets even on unexpected flow break
            get().success(key);
        }
    },
    success(key) {
        set((s) => ({
            loading: { ...s.loading, [key]: false }
        }))
    },
    stop(key) {
        set((s)=>({
            loading:{...s.loading,[key]:false}
        }))
    },
    fail(key, error) {
        set((s) => ({
            loading: { ...s.loading, [key]: false },
            error: { ...s.error, [key]: error }
        }))
    },
}))

