import { HttpGet, HttpPatch, HttpPost } from "@/lib/http/http"
import { User } from "../types/UserTypes"

export const USER_TAG = "users"
const userbyIdTagGenerator = (id:number)=>{
    return `${USER_TAG}-${id}`
}
export async function apiGetAllUsers(): Promise<User[]> {
    const res = await HttpGet(`user/all`, {
        next: {
            revalidate: 60,
            tags: [USER_TAG]
        }
    })
    // const responseSchema = z.object({
    //     message: z.string(),
    //     data: z.array(GalleryItemSchema),
    // });
    // console.log(res.data)

    // const validated = responseSchema.safeParse(json);
    // if (!validated.success) {
    //     console.error("Zod validation error:", validated.error.format());
    //     return [];
    // }

    // return validated.data.data;
    return res.data 
}

export async function apiGetUserById(id: number): Promise<User> {
    const tag = userbyIdTagGenerator(id)
    const res = await HttpGet(`user/${id}`,{next:{tags:[tag]}});
    return res.data;
}


export async function apiCreateUser(payload: Partial<User>) {
    const res = await HttpPost("user/new", payload);
    return res.data;
}
export async function apiUpdateUser(
    id: number,
    payload: Partial<User>
) {
    const res = await HttpPatch(`user/${id}`, payload);
    return res.data;
}
