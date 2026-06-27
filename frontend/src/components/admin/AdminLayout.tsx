import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutProps {
  breadcrumb: string;
  children: React.ReactNode;
}

export default function AdminLayout({ breadcrumb, children }: AdminLayoutProps) {
  return (
    <div className="admin-container d-flex">
      <AdminSidebar />
      <main
        className="admin-main flex-grow-1"
        style={{ marginLeft: "300px", height: "100vh", overflowY: "auto" }}
      >
        <AdminTopBar breadcrumb={breadcrumb} />
        <div className="admin-content container-fluid mt-4 px-4 pb-4">
          {children}
        </div>
      </main>
    </div>
  );
}