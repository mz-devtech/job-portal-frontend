"use client";


import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import CompaniesMain from "@/components/dashboard/admin/CompaniesMain";

const CompaniesPage = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
       <AdminNavbar/>
      </div>

      <div className="flex pt-28">
        <AdminSidebar/>
        <main className="w-full min-h-screen bg-gray-50 px-6 py-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto">
          <CompaniesMain />
        </main>
      </div>
    </>
  );
};

export default CompaniesPage;
