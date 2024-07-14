import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const RootPage = () => {
  return (
    <div className="flex relative w-full">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default RootPage;
