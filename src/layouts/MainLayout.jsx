import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import menuItems from "../components/Sidebar/menuConfig";



const MainLayout = () => {
  return (
    <div className="layout">

      <Sidebar menuItems={menuItems} />

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;