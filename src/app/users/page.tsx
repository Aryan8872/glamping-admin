"use client";

import PrimaryButton from "@/components/PrimaryFilledButton";
import { PageHeading } from "@/components/PageHeading";
import { FaUserPlus } from "react-icons/fa";
import UserTable from "./UserTable";
// import { getUserList } from "@/features/users/services/userService";
import { useState } from "react";
import { User } from "@/features/users/types/UserTypes";
import { getUserList } from "@/features/users/services/userService";
import AddUser from "@/features/users/ui/AddUser";
import { useSearch } from "@/hooks/useSearch";

export const dynamic = "force-dynamic";

export default function Users() {
  const {
    data: users,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<User>({
    fetchFn: getUserList,
    perPage: 15,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-end">
        <PageHeading heading="User Management" subheading="Manage your users" />

        <PrimaryButton
          text="Add User"
          icon={<FaUserPlus size={17} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div>
        <UserTable
          userDatas={users}
          isLoading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          totalResults={total}
        />
      </div>

      {isAddModalOpen && (
        <AddUser
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
