import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { Outlet } from "react-router-dom";

function Dashboard() {

  return (
      <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default Dashboard;
