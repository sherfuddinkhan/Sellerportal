import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardHome from "./pages/Dashboard/DashboardHome";

import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Inventory from "./pages/Inventory/Inventory";
import Customers from "./pages/Customers/Customers";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Dashboard Layout */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        >

          <Route
            index
            element={<DashboardHome />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="inventory"
            element={<Inventory />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;