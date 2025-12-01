"use client";

import { useState } from "react";
import {
  User,
  USER_STATUS,
  USER_TYPE,
  userStatusIconMap,
  userTypeIconMap,
} from "@/app/features/users/types/UserTypes";
import { enumToOptions } from "@/utils/enumToOptions";
import { updateUser } from "@/app/features/users/services/userService";
import { EnumDropdown } from "@/components/EnumDropdown";
import GenericTable, { Column } from "@/app/components/GenericTable";
import { BiEdit, BiTrash } from "react-icons/bi";

interface UserTableProps {
  userDatas: User[];
}

export default function UserTable({ userDatas }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(userDatas);
  const [status, setStatus] = useState<Record<number, USER_STATUS>>(() =>
    userDatas.reduce((acc, user) => {
      acc[user.id] = user.userStatus;
      return acc;
    }, {} as Record<number, USER_STATUS>)
  );

  const [userType, setUserType] = useState<Record<number, USER_TYPE>>(() =>
    userDatas.reduce((acc, user) => {
      acc[user.id] = user.userType;
      return acc;
    }, {} as Record<number, USER_TYPE>)
  );

  const statusOptions = enumToOptions(USER_STATUS);
  const userRoleOptions = enumToOptions(USER_TYPE);

  const handleStatusChange = async (
    userId: number,
    payload: { userStatus: USER_STATUS }
  ) => {
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

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    console.log("Edit user:", user);
  };

  const handleDelete = (user: User) => {
    // TODO: Implement delete functionality
    console.log("Delete user:", user);
  };

  const columns: Column<User>[] = [
    {
      header: "User",
      cell: (user) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{user.fullName}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (user) => (
        <EnumDropdown
          options={userRoleOptions}
          iconMap={userTypeIconMap}
          value={userType[user.id]}
          onChange={(val) =>
            handleRoleChange(user.id, { userType: val as USER_TYPE })
          }
          placeholder="Select role"
        />
      ),
    },
    {
      header: "Phone Number",
      cell: (user) => (
        <span className="text-gray-700">{user.phoneNumber || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <EnumDropdown
          options={statusOptions}
          value={status[user.id]}
          iconMap={userStatusIconMap}
          onChange={(val) =>
            handleStatusChange(user.id, { userStatus: val as USER_STATUS })
          }
          placeholder="Select status"
        />
      ),
    },
    {
      header: "Actions",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit user"
          >
            <BiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete user"
          >
            <BiTrash size={18} />
          </button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="mt-6">
      <GenericTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
      />
    </div>
  );
}
