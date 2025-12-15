import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig"; // Import your centralized axios instance


const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemId, setRedeemId] = useState("");
  const [qrId, setQrId] = useState(""); // New state for QR ID input
  const [message, setMessage] = useState("");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false); // State for Sale Modal
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRedeemId("");
    setMessage("");
  };

  const handleSaleModalOpen = () => {
    setIsSaleModalOpen(true);
  };

  const handleSaleModalClose = () => {
    setIsSaleModalOpen(false);
    setQrId("");
  };

  const handleRedeemSubmit = async () => {
    try {
      const response = await axiosInstance.post("/redeem-cashback", {
        redeem_id: redeemId,
      });

      const data = response.data;

      if (response.status === 201) {
        setMessage(`Cashback redeemed successfully: ${data.amount_redeemed}`);
      } else {
        setMessage(`Error: ${data.msg}`);
      }
    } catch (error) {
      setMessage(
        error.response
          ? `Error: ${error.response.data.msg}`
          : "An error occurred while redeeming cashback."
      );
    } finally {
      handleModalClose();
    }
  };

  const handleSaleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/seller-sale/${qrId}`, {});

      if (response.status === 201) {
        alert("Sale registered successfully.");
      } else {
        alert(`Error: ${response.data.msg}`);
      }
    } catch (error) {
      // Special handling for 409 Conflict
      if (error.response && error.response.status === 409) {
        alert("This QR Code has already been checked.");
      } else {
        alert(
          error.response
            ? `Error: ${error.response.data.msg}`
            : "An error occurred while registering the sale."
        );
      }
    } finally {
      handleSaleModalClose();
    }
  };

  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      await axiosInstance.post("/logout");

      // Remove tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {/* Logout Button */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Redeem Cashback Card Button */}
      <div
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-semibold py-12 px-24 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={handleModalOpen}
      >
        Redeem Cashback
      </div>

      {/* Register Sale Card Button */}
      <div
        className="ml-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-2xl font-semibold py-12 px-24 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={handleSaleModalOpen}
      >
        Register Sale
      </div>

      {/* Redeem Details Button */}
      <div
        className="ml-4 mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-2xl font-semibold py-12 px-24 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={() => navigate("/redeem-details")}
      >
        Redeem Details
      </div>

      {/* Sell Details Button */}
      <div
        className="ml-4 mt-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-2xl font-semibold py-12 px-24 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={() => navigate("/sell-details")}
      >
        Sell Details
      </div>

      {/* Modal for Redeem Cashback */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter Redeem ID
            </h2>
            <input
              type="text"
              value={redeemId}
              onChange={(e) => setRedeemId(e.target.value)}
              placeholder="Redeem ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleRedeemSubmit}
              >
                Submit
              </button>
            </div>
            {message && <p className="text-red-500 mt-4">{message}</p>}
          </div>
        </div>
      )}

      {/* Modal for Register Sale */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter QR ID
            </h2>
            <input
              type="text"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              placeholder="QR ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                onClick={handleSaleModalClose}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
                  !qrId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaleSubmit}
                disabled={!qrId}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;