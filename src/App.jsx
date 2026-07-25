import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Auth/Login/Login.jsx";
import Register from "./pages/Auth/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;