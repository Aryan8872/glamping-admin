"use server"
import { revalidateTag } from "next/cache";
import { apiCreateUser, apiGetAllUsers, apiGetUserById, apiUpdateUser, USER_TAG } from "../api/userApi";
import { User, UserSchema } from "../types/UserTypes";

export async function getUserList(params: any = {}): Promise<{ data: User[], total: number, page: number, perPage: number }> {
  const res = await apiGetAllUsers(params);
  const parsed = UserSchema.array().safeParse(res.data);
  if (!parsed.success) {
    console.log(parsed.error);
    return { data: [], total: 0, page: 1, perPage: 15 };
  }
  return { ...res, data: parsed.data };
}

export async function getUserDetail(id: number): Promise<User> {
  const item = await apiGetUserById(id);
  return UserSchema.parse(item);
}

export async function createUser(data: Partial<User> | FormData) {
  return await apiCreateUser(data);
}

export async function updateUser(id: number, data: Partial<User> | FormData) {
  const result = await apiUpdateUser(id, data);
  revalidateTag(`${USER_TAG}-${id}`, { expire: 0 }) //marks as stale immediately and immediately revalidates
  revalidateTag(USER_TAG, "max") //revalidate in background 
  return result
}

// export async function deleteUser(id: number) {
//   return await apiDeletEu(id);
// }
