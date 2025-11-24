
export type ResponsePayload = {
    message: string;
    data: any;
};

export type HttpError = {
    status: number;
    message: string;
    body?: unknown;
};

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// -------------------------------
// 🔵 INTERNAL: Build full URL
// -------------------------------
function buildUrl(path: string) {
    return path.startsWith("http")
        ? path
        : `${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}/${path}`;
}

// -------------------------------
// 🔵 INTERNAL: Determine Retryable Error
// -------------------------------
function isRetryableError(e: any) {
    return (
        e?.name === "AbortError" || // timeout
        e?.status === 0 ||          // network fail
        e?.status >= 500            // server failures
    );
}

// -------------------------------
// 🟦 HTTP GET
// -------------------------------
export async function HttpGet(
    path: string,
    opts?: {
        headers?: Record<string, string>;
        timeout?: number;
        retries?: number;
        cache?: RequestCache;
        next?: { revalidate?: number; tags?: string[] };
    }
) {
    const url = buildUrl(path);
    const controller = new AbortController();
    const timeout = opts?.timeout ?? 10000;
    const maxRetries = Math.min(opts?.retries ?? 1, 3);

    const timer = setTimeout(() => controller.abort(), timeout);

    let attempt = 0;
    let lastErr: any;

    while (attempt <= maxRetries) {
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    ...(opts?.headers || {})
                },
                cache: opts?.cache,
                next: opts?.next,
                signal: controller.signal
            });

            clearTimeout(timer);

            const isJson = res.headers
                .get("content-type")
                ?.includes("application/json");

            const data = isJson ? await res.json() : await res.text();
            if (!res.ok) {
                const error: HttpError = {
                    status: res.status,
                    body: data,
                    message:
                        res.statusText ||
                        (data as any)?.message ||
                        "Request failed"
                };

                if (
                    [408, 429, 500, 502, 503, 504].includes(res.status) &&
                    attempt < maxRetries
                ) {
                    await delay(200 * (attempt + 1));
                    attempt++;
                    continue;
                }

                throw error;
            }
            return data

        } catch (e: any) {
            lastErr = e;
            attempt++;

            if (!isRetryableError(e) || attempt > maxRetries) break;

            await delay(200 * attempt);
        }
    }

    throw lastErr || { status: 0, message: "Network error" };
}

// -------------------------------
// 🟥 HTTP POST
// -------------------------------
export async function HttpPost(
    path: string,
    body: any,
    opts?: {
        headers?: Record<string, string>;
        timeout?: number;
        retries?: number;
        cache?: RequestCache;
        next?: { revalidate?: number; tags?: string[] };
    }
) {
    const url = buildUrl(path);
    const controller = new AbortController();
    const timeout = opts?.timeout ?? 10000;
    const maxRetries = Math.min(opts?.retries ?? 1, 3);

    const timer = setTimeout(() => controller.abort(), timeout);

    let attempt = 0;
    let lastErr: any;

    while (attempt <= maxRetries) {
        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                cache: opts?.cache,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...(opts?.headers || {})
                },
                next: opts?.next,
                signal: controller.signal
            });

            clearTimeout(timer);

            const isJson = res.headers
                .get("content-type")
                ?.includes("application/json");

            const data = isJson ? await res.json() : await res.text();

            if (!res.ok) {
                const error: HttpError = {
                    status: res.status,
                    body: data,
                    message:
                        res.statusText ||
                        (data as any)?.message ||
                        "Failed to POST data"
                };

                if (
                    [408, 429, 500, 502, 503, 504].includes(res.status) &&
                    attempt < maxRetries
                ) {
                    await delay(200 * (attempt + 1));
                    attempt++;
                    continue;
                }

                throw error;
            }

            return data;
        } catch (e: any) {
            lastErr = e;
            attempt++;

            if (!isRetryableError(e) || attempt > maxRetries) break;
            await delay(200 * attempt);
        }
    }

    throw lastErr || { status: 0, message: "Network error" };
}


export async function HttpPut(path: string, body: any, opts?: { headers?: Record<string, string>, timeout?: number, retries?: number, cache?: RequestCache, next?: { revalidate?: number, tags?: string[] } }) {
    const url = buildUrl(path)
    const controller = new AbortController()
    const maxRetries = Math.min(opts?.retries ?? 1, 3)
    const timer = setTimeout(() => {
        controller.abort()
    }, opts?.timeout ?? 10000);
    let attempt = 0
    let lastErr: any

    while (attempt <= maxRetries) {
        try {
            const res = await fetch(url, {
                method: "PUT",
                cache: opts?.cache,
                body: JSON.stringify(body),
                headers: { Accept: "application/json", "Content-Type": "application/json", ...(opts?.headers || {}) },
                signal: controller.signal,
                next: opts?.next
            })
            clearTimeout(timer)
            const isJson = res.headers.get("content-type")?.includes("application/json")
            const data = isJson ? await res.json() : res.text()
            if (!res.ok) {
                const error: HttpError = {
                    message: res.statusText || (res as any).message || "Failed  update request",
                    status: res.status,
                    body: data
                }
                if (
                    [408, 429, 500, 502, 503, 504].includes(res.status) &&
                    attempt < maxRetries
                ) {
                    await delay(200 * (attempt + 1));
                    attempt++;
                    continue;
                }
                throw error
            }
            return data
        }
        catch (e) {

            lastErr = e
            attempt++

            if (!isRetryableError(e) || attempt > maxRetries) break

            await delay(200 * attempt)
        }

    }
    throw lastErr || { status: 0, message: "Network error" };

}

export async function HttpPatch(
    path: string,
    body?: any,
    opts?: {
        headers?: Record<string, string>;
        timeout?: number;
        retries?: number;
        cache?: RequestCache;
        next?: { revalidate?: number; tags?: string[] };
    }
) {
    const url = buildUrl(path);
    const controller = new AbortController();
    const timeout = opts?.timeout ?? 10000;
    const maxRetries = Math.min(opts?.retries ?? 1, 3);

    const timer = setTimeout(() => controller.abort(), timeout);

    let attempt = 0;
    let lastErr: any;

    while (attempt <= maxRetries) {
        try {
            const isFormData = body instanceof FormData;

            const res = await fetch(url, {
                method: "PUT",
                body: isFormData ? body : JSON.stringify(body),
                cache: opts?.cache,
                headers: {
                    Accept: "application/json",
                    ...(opts?.headers || {}),
                    // Don't set Content-Type manually for FormData!
                    ...(isFormData ? {} : { "Content-Type": "application/json" }),
                },
                signal: controller.signal,
                next: opts?.next
            });

            clearTimeout(timer);

            const isJson = res.headers.get("content-type")?.includes("application/json");
            const data = isJson ? await res.json() : await res.text();

            if (!res.ok) {
                const error: HttpError = {
                    status: res.status,
                    message:
                        res.statusText ||
                        (data as any)?.message ||
                        "Failed to patch resource",
                    body: data,
                };

                if ([408, 429, 500, 502, 503, 504].includes(res.status) && attempt < maxRetries) {
                    await delay(200 * (attempt + 1));
                    attempt++;
                    continue;
                }

                throw error;
            }

            return data;
        } catch (e: any) {
            lastErr = e;
            attempt++;

            if (!isRetryableError(e) || attempt > maxRetries) break;

            await delay(200 * attempt);
        }
    }

    throw lastErr || { status: 0, message: "Network error" };
}

export async function HttpDelete(
    path: string,
    opts?: {
        headers?: Record<string, string>;
        timeout?: number;
        retries?: number;
        cache?: RequestCache;
        body?: any;  // optional
        next?: { revalidate?: number; tags?: string[] };
    }
) {
    const url = buildUrl(path);
    const controller = new AbortController();
    const timeout = opts?.timeout ?? 10000;
    const maxRetries = Math.min(opts?.retries ?? 1, 3);

    const timer = setTimeout(() => controller.abort(), timeout);

    let attempt = 0;
    let lastErr: any;

    while (attempt <= maxRetries) {
        try {
            const res = await fetch(url, {
                method: "DELETE",
                cache: opts?.cache,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...(opts?.headers || {})
                },
                ...(opts?.body ? { body: JSON.stringify(opts.body) } : {}),
                signal: controller.signal,
                next: opts?.next
            });

            clearTimeout(timer);

            const isJson = res.headers.get("content-type")?.includes("application/json");
            const data = isJson ? await res.json() : await res.text();

            if (!res.ok) {
                const error: HttpError = {
                    status: res.status,
                    message:
                        res.statusText ||
                        (data as any)?.message ||
                        "Failed to delete resource",
                    body: data,
                };

                if ([408, 429, 500, 502, 503, 504].includes(res.status) && attempt < maxRetries) {
                    await delay(200 * (attempt + 1));
                    attempt++;
                    continue;
                }

                throw error;
            }

            return data;
        } catch (e: any) {
            lastErr = e;
            attempt++;

            if (!isRetryableError(e) || attempt > maxRetries) break;

            await delay(200 * attempt);
        }
    }

    throw lastErr || { status: 0, message: "Network error" };
}
