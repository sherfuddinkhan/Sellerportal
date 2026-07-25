import logo from "../../../assets/hero.png";

const LoginHeader = () => {
  return (
    <div className="login-header">
      <img
        src={logo}
        alt="Seller Portal"
        className="logo-image"
      />

      <h1>Seller Portal</h1>

      <h2>Welcome Back</h2>

      <p>Sign in to continue</p>
    </div>
  );
};

export default LoginHeader;