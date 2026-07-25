import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );


      console.log(response.data);


      // Save token if returned
      if(response.data.token)
      {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }


      alert("Login Successful");


    }
    catch(error){

      console.log(error);
      alert("Login Failed");

    }

  };


  return (

    <div className="login-container">

      <div className="login-card">

        <h2>Login</h2>


        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button 
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </button>


        <div className="register-link">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </div>


      </div>

    </div>

  );

};

export default Login;