"use client";

import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import ApplicationsMain from "@/components/dashboard/employer/ApplicationsMain";

// page.jsx
export default function Page() {
  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
        <EmployerNavbar />
        <SecondNavbar />
      </div>

      <div className="pt-14">
        <EmployerSidebar />
        <ApplicationsMain />
      </div>
    </>
  );
}



// export default function Page() {
//   return (
//     <>
//       {/* Fixed Nav */}
      
//       {/* Body */}
//       <div className="flex pt-28">
//         <EmployerSidebar />
//         <ApplicationsMain />
//       </div>
//     </>
//   );
// }