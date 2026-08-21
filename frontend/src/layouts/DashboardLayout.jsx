import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar/DashboardSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader/DashboardHeader";
import BottomNav from "../components/Dashboard/BottomNav/BottomNav";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar only for desktop */}
      <DashboardSidebar />

      <div className="dashboard-main">
        {/* Header */}
        <DashboardHeader />

        {/* Outlet renders nested route */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
