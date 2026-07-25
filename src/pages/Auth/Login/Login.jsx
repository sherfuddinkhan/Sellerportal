import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";


const Login = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });


  const [loading, setLoading] = useState(false);


  const [error, setError] = useState("");



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };



  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");


    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );


      console.log(response.data);


      // Save token
      if(response.data.token)
      {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }


      // Save user details
      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );


      alert("Login Successful");


      navigate("/dashboard");


    }
    catch(error)
    {

      console.log(error);


      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );

    }
    finally
    {
      setLoading(false);
    }

  };



  return (

    <div className="login-container">


      <div className="login-card">


        <h2>Login</h2>


        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}



        <form onSubmit={handleLogin}>


          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />



          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />



          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading ? "Logging in..." : "Login"}

          </button>



        </form>



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