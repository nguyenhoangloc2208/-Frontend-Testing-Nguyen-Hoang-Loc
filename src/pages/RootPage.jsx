import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const RootPage = () => {
  return (
    <div className="flex relative w-full">
      <div className="lg:block hidden">
        <Navbar menu={false} />
      </div>
      <div className="flex-1">
        <Header />
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default RootPage;
