import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QrDetailsPage from "./pages/QrDetailsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import RedeemDetailsPage from "./pages/RedeemDetailsPage";
import SellDetailsPage from "./pages/SellDetailsPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<DashboardPage />} />}
            />
            <Route
              path="/redeem-details"
              element={<ProtectedRoute element={<RedeemDetailsPage />} />}
            />
            <Route
              path="/sell-details"
              element={<ProtectedRoute element={<SellDetailsPage />} />}
            />
            <Route path="/v" element={<QrDetailsPage />} />
            <Route path="/:key" element={<QrDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
