"use client";

import { usePathname } from "next/navigation";
import SideBar from "./SideBar";
import { Suspense } from "react";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="w-full bg-primary-bg flex min-h-screen flex-row">
      <Suspense fallback={null}>
        <SideBar />
      </Suspense>
      <div className="flex flex-col px-3 md:px-5 gap-3 pt-20 pb-4 md:py-8 w-full overflow-y-auto min-h-screen bg-primary-bg lg:pt-8">
        {children}
      </div>
    </div>
  );
}
