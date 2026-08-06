import { useState } from "react";
import { NavLink } from "react-router-dom";
import {FaChevronDown,FaChevronRight,FaBars,FaTimes,} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ menuItems = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

      <div className="sidebar-header">

        <h2>{sidebarOpen ? "Seller Portal" : "SP"}</h2>

        <button
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      <ul className="sidebar-menu">

        {menuItems.map((item) => (

          <li key={item.id}>

            {item.children ? (

              <>
                <div
                  className="sidebar-item"
                  onClick={() => toggleMenu(item.id)}
                >
                  <span>{item.label}</span>

                  {openMenus[item.id]
                    ? <FaChevronDown />
                    : <FaChevronRight />}
                </div>

                {openMenus[item.id] && (

                  <ul className="submenu">

                    {item.children.map((child) => (

                      <li key={child.id}>

                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            isActive
                              ? "submenu-item active"
                              : "submenu-item"
                          }
                        >
                          {child.label}
                        </NavLink>

                      </li>

                    ))}

                  </ul>

                )}

              </>

            ) : (

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
              >
                {item.label}
              </NavLink>

            )}

          </li>

        ))}

      </ul>

    </aside>
  );
};

export default Sidebar;