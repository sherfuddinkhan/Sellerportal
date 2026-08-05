import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "/pages/AuthManagement/Login/Login";
//import Register from "./pages/AuthManagement/Register";
//import Dashboard from "./pages/Dashboard/Dashboard";
//import Products from "./pages/Products";

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
        >

          <Route
            path="products"
            element={<Products />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;