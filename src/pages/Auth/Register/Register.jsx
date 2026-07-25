const handleSubmit = async (e) => {
  e.preventDefault();

  setStatus({
    loading: true,
    error: null,
    success: null
  });


  try {

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );


    setStatus({

      loading: false,

      error: null,

      success:
        response.data.message ||
        "Registration successful!"

    });


    setFormData(INITIAL_FORM_STATE);


  } 
  catch (error) {


    setStatus({

      loading: false,

      error:
        error.response?.data?.message ||
        "Registration failed. Please try again.",

      success: null

    });


  }

};