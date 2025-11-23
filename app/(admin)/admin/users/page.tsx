import PrimaryButton from "@/components/PrimaryFilledButton";
import { FaUserPlus } from "react-icons/fa";
import UserTable from "./UserTable";
import { getUserList } from "@/app/features/users/services/userService";

export default async function Users() {
  const userData = await getUserList()
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full flex justify-between">
        <p className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">User Management</span>
          <span className="text-sm text-gray-500">Manage your users</span>
        </p>

        <PrimaryButton text="Add User" icon={<FaUserPlus size={17} />} />
      </div>

      <div><UserTable userDatas={userData} /></div>
    </div>
  );
}
