import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";


const INITIAL_FORM_STATE = {

  fullName: "",
  email: "",
  password: "",
  mobile: "",
  companyName: "",
  gstin: "",
  address: "",
  city: "",
  state: "",
  pincode: ""

};



const Register = () => {


  const [formData, setFormData] = useState(
    INITIAL_FORM_STATE
  );


  const [status, setStatus] = useState({

    loading: false,
    error: null,
    success: null

  });



  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev)=>({

      ...prev,
      [name]: value

    }));

  };




  const handleSubmit = async (e) => {

    e.preventDefault();


    setStatus({

      loading:true,
      error:null,
      success:null

    });



    try {


      const response = await axios.post(

        "http://localhost:5000/api/auth/register",

        formData

      );



      setStatus({

        loading:false,

        error:null,

        success:
          response.data.message ||
          "Registration successful!"

      });



      setFormData(INITIAL_FORM_STATE);



    }
    catch(error){


      setStatus({

        loading:false,

        error:
        error.response?.data?.message ||
        "Registration failed. Please try again.",

        success:null

      });


    }


  };




  return (

    <div className="register-container">


      <div className="register-card">


        <h2>Create an Account</h2>



        {status.error &&

          <div className="alert alert-error">

            {status.error}

          </div>

        }



        {status.success &&

          <div className="alert alert-success">

            {status.success}

          </div>

        }




        <form onSubmit={handleSubmit}>


          <input
            className="register-input"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />



          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />



          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />



          <input
            className="register-input"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="gstin"
            placeholder="GSTIN"
            value={formData.gstin}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />



          <input
            className="register-input"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />



          <button
            className="register-button"
            type="submit"
            disabled={status.loading}
          >

            {status.loading ? "Submitting..." : "Register"}

          </button>



        </form>



        <div className="login-link">

          Already have an account?{" "}

          <Link to="/">

            Login

          </Link>


        </div>


      </div>


    </div>

  );


};


export default Register;