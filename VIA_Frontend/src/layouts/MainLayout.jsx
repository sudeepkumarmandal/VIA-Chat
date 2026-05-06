import { Outlet } from "react-router-dom";
import Navbar from "../client/components/Navbar";
import { useState, useEffect } from "react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 min-h-0">
        <Outlet context={{ sidebarOpen, setSidebarOpen, isMobile }} />
      </div>
    </div>
  );
}
