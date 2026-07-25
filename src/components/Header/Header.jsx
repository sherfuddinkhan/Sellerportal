import "./Header.css";

const Header = ({
  title = "Seller Portal",
  userName = "Guest",
  onLogout,
}) => {
  return (
    <header className="header">

      <div className="header-left">
        <h2>{title}</h2>
      </div>

      <div className="header-right">

        <span className="user-name">
          Welcome, {userName}
        </span>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Header;