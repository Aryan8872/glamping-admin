"use client";

import { useState } from "react";
import GenericTable, { Column } from "@/app/components/GenericTable";
import { User, USER_TYPE } from "@/app/features/users/types/UserTypes";
import { BiEdit, BiTrash } from "react-icons/bi";

interface UserTableProps {
  userDatas: User[];
}

export default function UserTable({ userDatas }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(userDatas);

  const getUserTypeLabel = (type: USER_TYPE) => {
    switch (type) {
      case USER_TYPE.ADMIN:
        return "Admin";
      case USER_TYPE.CAMPHOST:
        return "Camp Host";
      case USER_TYPE.USER:
        return "User";
      case USER_TYPE.SUPERADMIN:
        return "Super Admin";
      default:
        return "Unknown";
    }
  };

  const getUserTypeColor = (type: USER_TYPE) => {
    switch (type) {
      case USER_TYPE.ADMIN:
        return "bg-purple-100 text-purple-700 border-purple-200";
      case USER_TYPE.CAMPHOST:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case USER_TYPE.USER:
        return "bg-green-100 text-green-700 border-green-200";
      case USER_TYPE.SUPERADMIN:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const columns: Column<User>[] = [
    {
      header: "Name",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      cell: (user) => (
        <span className="text-gray-700">{user.phoneNumber || "N/A"}</span>
      ),
    },
    {
      header: "User Type",
      cell: (user) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(
            user.userType
          )}`}
        >
          {getUserTypeLabel(user.userType)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            user.userStatus === "ENABLED"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}
        >
          {user.userStatus}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Edit user"
          >
            <BiEdit
              size={18}
              className="text-gray-600 group-hover:text-blue-600"
            />
          </button>
          <button
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Delete user"
          >
            <BiTrash
              size={18}
              className="text-gray-600 group-hover:text-red-600"
            />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-3">
      <GenericTable
        title="Users"
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
      />
    </div>
  );
}
