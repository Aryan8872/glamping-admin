import { HttpError, buildUrl } from "./http";

export async function authFetch(
    path: string,
    init?: RequestInit & { retries?: number }
): Promise<any> {
    const url = buildUrl(path);
    const maxRetries = init?.retries ?? 1;
    let attempt = 0;

    const request = async () => {
        const res = await fetch(url, {
            ...init,
            credentials: "include", // Essential for session cookies
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        });

        if (res.status === 401 && !path.includes("/auth/refresh") && attempt < maxRetries) {
            // Attempt to refresh session
            const refreshed = await refreshSession();
            if (refreshed) {
                attempt++;
                return request(); // Retry original request
            }
        }

        const isJson = res.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await res.json() : await res.text();

        if (!res.ok) {
            throw {
                status: res.status,
                message: data?.message || "Request failed",
                body: data,
            } as HttpError;
        }

        return data;
    };

    return request();
}

async function refreshSession(): Promise<boolean> {
    try {
        const res = await fetch(buildUrl("auth/refresh"), {
            method: "POST",
            credentials: "include",
        });
        return res.ok;
    } catch {
        return false;
    }
}
