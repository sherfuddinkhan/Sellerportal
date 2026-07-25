import Card from "../../../components/Card";

import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginFooter from "./LoginFooter";

import "./Login.css";

const Login = () => {
  const handleLogin = async (formData) => {
    console.log("Login Request:", formData);

    // Next Step
    // await authService.login(formData);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <LoginHeader />

        <LoginForm onLogin={handleLogin} />

        <LoginFooter />
      </Card>
    </div>
  );
};

export default Login;