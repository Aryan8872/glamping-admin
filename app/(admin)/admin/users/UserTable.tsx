"use client";
import {
  User,
  USER_STATUS,
  USER_TYPE,
  userStatusIconMap,
  userTypeIconMap,
} from "@/app/features/users/types/UserTypes";
import { enumToOptions } from "@/utils/enumToOptions";
import { BiSearch } from "react-icons/bi";
import { EnumDropdown } from "@/components/EnumDropdown";
import { useState } from "react";
import { updateUser } from "@/app/features/users/services/userService";

export default function UserTable({ userDatas }: { userDatas: User[] }) {
  const [status, setStatus] = useState<Record<number, USER_STATUS>>(() =>
    userDatas.reduce((accumulatedArray, currentUser) => {
      accumulatedArray[currentUser.id] = currentUser.userStatus;
      return accumulatedArray;
    }, {} as Record<number, USER_STATUS>)
  );

  const [userType, setUserType] = useState<Record<number, USER_TYPE>>(() =>
    userDatas.reduce((accumulatedArray, currentUser) => {
      accumulatedArray[currentUser.id] = currentUser.userType;
      return accumulatedArray;
    }, {} as Record<number, USER_TYPE>)
  );

  const statusOptions = enumToOptions(USER_STATUS);
  const userRoleOptions = enumToOptions(USER_TYPE);

  const handleStatusChange = async (
    userId: number,
    payload: { userStatus: USER_STATUS }
  ) => {
    // Update local state
    setStatus((prev) => ({ ...prev, [userId]: payload.userStatus }));
    await updateUser(userId, payload);
  };
  const handleRoleChange = async (
    userId: number,
    payload: { userType: USER_TYPE }
  ) => {
    setUserType((prev) => ({ ...prev, [userId]: payload.userType }));
    await updateUser(userId, payload);
  };

  return (
    <div className="w-full mt-10">
      <div className="w-full flex justify-between  px-5 py-5 bg-white rounded-t-2xl ">
        <div className="flex flex-[0.6] py-3 px-3  items-center rounded-lg bg-[#F3F4F6] gap-2">
          <BiSearch size={18} className="" color={"black"} />
          <input
            className="w-full h-full focus:outline-none rounded-lg relative"
            placeholder="Search "
          />
        </div>

        <div className="flex gap-3  font-semibold">
          <div className="flex gap-2 items-center bg-[#F3F4F6] px-3 rounded-lg">
            <span>Role:</span>
            {/* <Select
              components={animatedComponents}
              className="!focus:outline-none !border-0"
              defaultValue={roleOption[0]}
              options={roleOption}
            /> */}
          </div>
          <div className="flex gap-2 items-center bg-[#F3F4F6] px-3 rounded-lg">
            <span>Status:</span>
          </div>
        </div>
      </div>
      <table className="w-full table-auto text-left mt-3">
        <thead className="text-gray-700 bg-[#F9FAFB] ">
          <tr>
            <th className="px-4 py-2 font-semibold">User</th>
            <th className="px-4 py-2 font-semibold">Role</th>
            <th className="px-4 py-2 font-semibold">Phone Number</th>
            <th className="px-4 py-2 font-semibold">Status</th>
            <th className="px-4 py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userDatas?.map((user, index) => (
            <tr
              key={user.email ?? index}
              className="border-b text-[15px] border-black/10 bg-white"
            >
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  {user.fullName}
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 ">
                <EnumDropdown
                  options={userRoleOptions}
                  iconMap={userTypeIconMap}
                  value={userType[user.id]}
                  onChange={(val) =>
                    handleRoleChange(user.id, { userType: val as USER_TYPE })
                  }
                  placeholder="Select role"
                />
              </td>

              <td className="px-4 text-gray-500 py-3 ">{user.phoneNumber}</td>
              <td className="px-4 py-3  text-gray-500 ">
                <EnumDropdown
                  options={statusOptions}
                  value={status[user.id]}
                  iconMap={userStatusIconMap}
                  onChange={(val) =>
                    handleStatusChange(user.id, {
                      userStatus: val as USER_STATUS,
                    })
                  }
                  placeholder="Select role"
                />
              </td>

              <td className="px-4 py-3 ">
                <div className="flex items-center gap-2">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white font-semibold rounded-b-2xl flex justify-between text-sm py-6 px-3 items-center">
        <span>Showing 1 to 10 of 10 entries</span>
        <div className="flex gap-2">
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}
