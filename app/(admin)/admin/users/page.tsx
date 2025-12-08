"use client";

import PrimaryButton from "@/components/PrimaryFilledButton";
import { FaUserPlus } from "react-icons/fa";
import UserTable from "./UserTable";
// import { getUserList } from "@/app/features/users/services/userService";
import { useEffect, useState } from "react";
import { User } from "@/app/features/users/types/UserTypes";
import { getUserList } from "@/app/features/users/services/userService";
import AddUser from "@/app/features/users/ui/AddUser";

export const dynamic = "force-dynamic";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUserList();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full flex justify-between">
        <p className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">User Management</span>
          <span className="text-sm text-gray-500">Manage your users</span>
        </p>

        <PrimaryButton
          text="Add User"
          icon={<FaUserPlus size={17} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            Loading users...
          </div>
        ) : (
          <UserTable userDatas={users} />
        )}
      </div>

      {isAddModalOpen && (
        <AddUser
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
