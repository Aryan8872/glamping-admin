import { HttpGet, HttpPatch, HttpPost } from "@/lib/http/http"
import { User } from "../types/UserTypes"

export const USER_TAG = "users"
const userbyIdTagGenerator = (id: number) => {
    return `${USER_TAG}-${id}`
}
export async function apiGetAllUsers(params: any = {}): Promise<{ data: User[], total: number, page: number, perPage: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const res = await HttpGet(`user/all?${query.toString()}`, {
        next: {
            revalidate: 60,
            tags: [USER_TAG]
        }
    });
    return res;
}

export async function apiGetUserById(id: number): Promise<User> {
    const tag = userbyIdTagGenerator(id)
    const res = await HttpGet(`user/${id}`, { next: { tags: [tag] } });
    return res.data;
}


export async function apiCreateUser(payload: Partial<User> | FormData) {
    const res = await HttpPost("user/new", payload);
    return res.data;
}
export async function apiUpdateUser(
    id: number,
    payload: Partial<User> | FormData
) {
    const res = await HttpPatch(`user/${id}`, payload);
    return res.data;
}
