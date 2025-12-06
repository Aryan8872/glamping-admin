import React, { Suspense } from "react";
import SideBar from "../../SideBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-primary-bg flex min-h-screen  flex-row">
      <Suspense fallback={null}>
        <SideBar />
      </Suspense>
      <div className="flex flex-col px-5 gap-3 py-8 w-full overflow-y-auto scrollbar-hidden  min-h-screen  bg-primary-bg">
        {children}
      </div>
    </div>
  );
}
