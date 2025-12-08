"use client";

import { useState } from "react";
import GenericTable, { Column } from "@/app/components/GenericTable";
import { User, USER_TYPE } from "@/app/features/users/types/UserTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import EditUser from "@/app/features/users/ui/EditUser";

interface UserTableProps {
  userDatas: User[];
}

export default function UserTable({ userDatas }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(userDatas);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
      header: "Featured",
      cell: (user) => {
        if (user.userType !== USER_TYPE.CAMPHOST)
          return <span className="text-gray-300">-</span>;

        return (
          <button
            onClick={async () => {
              try {
                const { updateUser } = await import(
                  "@/app/features/users/services/userService"
                );
                await updateUser(user.id, { isFeatured: !user.isFeatured });
                // Update local state
                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === user.id ? { ...u, isFeatured: !u.isFeatured } : u
                  )
                );
              } catch (e) {
                console.error("Failed to toggle featured status", e);
                alert("Failed to update featured status");
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              user.isFeatured
                ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {user.isFeatured ? "Featured" : "Standard"}
          </button>
        );
      },
    },
    {
      header: "Actions",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Edit user"
            onClick={() => setSelectedUser(user)}
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

      {selectedUser && (
        <EditUser
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            // Trigger a refresh or update local state
            // For now, we might need a full refresh or pass a refresh callback
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
