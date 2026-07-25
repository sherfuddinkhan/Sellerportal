import "./Sidebar.css";

const Sidebar = ({
  menuItems = [],
  activeItem,
  onMenuClick,
}) => {
  return (
    <aside className="sidebar">

      <h2 className="sidebar-title">
        Seller Portal
      </h2>

      <ul className="sidebar-menu">

        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${
              activeItem === item.id ? "active" : ""
            }`}
            onClick={() => onMenuClick(item.id)}
          >
            {item.label}
          </li>
        ))}

      </ul>

    </aside>
  );
};

export default Sidebar;