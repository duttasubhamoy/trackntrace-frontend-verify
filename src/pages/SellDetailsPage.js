import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig"; // Import the centralized axios instance

const SellDetailsPage = () => {
  const [companies, setCompanies] = useState([]); // To store companies fetched from API
  const [selectedCompany, setSelectedCompany] = useState(""); // To store the selected company ID
  const [startDate, setStartDate] = useState(""); // To store the selected start date
  const [endDate, setEndDate] = useState(""); // To store the selected end date
  const [sellDetails, setSellDetails] = useState([]); // To store sell details
  const [error, setError] = useState(""); // For error handling

  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/seller-companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies. Please try again.");
      }
    };

    fetchCompanies();
  }, []);

  // Calculate the total amount (sum of all MRP values)
  const totalAmount = sellDetails.reduce((sum, detail) => sum + detail.mrp, 0);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if the date range is more than 6 months
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff > 183) {
      setError("The date range must not exceed 6 months.");
      return;
    }

    try {
      const response = await axiosInstance.post("/all-seller-sale", {
        company_id: selectedCompany,
        start_date: startDate,
        end_date: endDate,
      });

      setSellDetails(response.data); // Set the response data as sell details
      setError(""); // Clear error if any
    } catch (error) {
      console.error("Error fetching sell details:", error);
      setError("Failed to fetch sell details. Please try again.");
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Sell Details</h2>

      {/* Error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Dropdown */}
        <div>
          <label htmlFor="company" className="block text-lg font-medium">
            Select Company
          </label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          >
            <option value="">-- Select a company --</option>
            {companies.map((company) => (
              <option key={company.company_id} value={company.company_id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Picker */}
        <div>
          <label htmlFor="start-date" className="block text-lg font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* End Date Picker */}
        <div>
          <label htmlFor="end-date" className="block text-lg font-medium">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => {
              if (new Date(e.target.value) > new Date(startDate)) {
                setEndDate(e.target.value);
              } else {
                setError("End date must be greater than start date.");
              }
            }}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Show Sell Details
        </button>
      </form>

      {/* Sell Details Table */}
      {sellDetails.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Sell Details</h3>
          {/* Total Amount */}
          <div className="mt-4 mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <h4 className="text-xl font-semibold">Total Amount</h4>
            <p className="text-lg">{`₹ ${totalAmount.toFixed(2)}`}</p>
          </div>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Batch Number</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">MRP</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {sellDetails.map((detail) => (
                <tr key={detail.batch_id}>
                  <td className="border px-4 py-2">{detail.batch_number}</td>
                  <td className="border px-4 py-2">{detail.product_name}</td>
                  <td className="border px-4 py-2">{detail.mrp}</td>
                  <td className="border px-4 py-2">
                    {new Date(detail.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellDetailsPage;
