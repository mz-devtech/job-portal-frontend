import AdminNavbar from "@/components/AdminNavbar";
import AdminSettingsMain from "@/components/dashboard/admin/AdminSettingsMain";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";

const Page = () => {
  return (
    <>
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNavbar />
      </div>

      {/* Dashboard Body */}
      <div className="flex pt-28">
        <AdminSidebar />

        {/* Main Content */}
        <main
          className="
            w-full
            min-h-screen
            bg-gray-50
            px-4 py-4
            sm:px-6 sm:py-6
            md:ml-[260px]
            md:w-[calc(100%-260px)]
            md:h-[calc(100vh-7rem)]
            md:overflow-y-auto
          "
        >
          <AdminSettingsMain />
        </main>
      </div>
    </>
  );
};

export default Page;