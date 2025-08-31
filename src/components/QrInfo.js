import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import io from 'socket.io-client';
import { FaRegSmileBeam, FaRegSadTear } from "react-icons/fa";
import { MdPhoneAndroid } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const QrInfo = ({ qrData, 
  showCashback, 
  cashbackClaimed, 
  mobile, 
  redeemClaimed, 
  showRedeem 
}) => {
  const [showModal, setShowModal] = useState(false);
  //const [redeemId, setRedeemId] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [amountRedeemed, setAmountRedeemed] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  //const [isCashbackNull, setIsCashbackNull] = useState(false); // New state variable

  // Check if cashback is null and update isCashbackNull state
  // useEffect(() => {
  //   setIsCashbackNull(qrData?.cashback === null);
  // }, [qrData]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!qrData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  const { batch, product, cashback, scheme_id, scheme_data, company } = qrData;
  const { extra_fields: batchExtraFields } = batch;
  const { extra_fields: productExtraFields } = product;
  console.log(
    "QrInfo.js showRedeem:",
    showRedeem,
    "redeemClaimed:",
    redeemClaimed
  );

  // const handleRedeemClick = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.post("/create-redeem", {
  //       mobile: mobile,
  //       company_id: product.company_id,
  //     });

  //     const receivedRedeemId = response.data.redeem_id;
  //     setRedeemId(receivedRedeemId);
  //     setShowModal(true);

  //     // Initialize socket connection
  //     const socket = io(process.env.REACT_APP_API_BASE_URL);

  //     // Listen for redeem result
  //     socket.on('redeem_result', (data) => {
  //       if (data.amount_redeemed) {
  //         setAmountRedeemed(data.amount_redeemed);
  //       } else if (data.msg) {
  //         setErrorMessage(data.msg);
  //         setTimeout(() => closeModal(), 3000);
  //       }
  //       socket.disconnect();
  //     });

  //     // Emit redeem search event
  //     socket.emit('redeem_search', { redeem_id: receivedRedeemId });

  //   } catch (error) {
  //     console.error("Error creating redeem ID:", error);
  //     setErrorMessage("Error creating redeem ID. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setRedeemId(null);
  //   setAmountRedeemed(null);
  //   setErrorMessage(null);
  // };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center pt-4">
      {/* Top div: Scheme info, only if showRedeem is true */}
      {(showRedeem || redeemClaimed) && (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-6 flex flex-col items-center justify-center">
          {redeemClaimed ? (
            <>
              <div className="flex justify-center mb-2">
                <FaRegSadTear size={48} className="text-blue-400" />
              </div>
              <h3 className="text-center text-xl font-bold text-red-600">
                Scheme already claimed
              </h3>
            </>
          ) : (
            <>
              {/* Celebration or Sad animation based on scheme_item_name */}
              <div className="flex justify-center mb-2 animate-bounce">
                {qrData.scheme_data?.scheme_item_name === "no-scheme" ? (
                  <FaRegSadTear size={48} className="text-blue-400" />
                ) : (
                  <FaRegSmileBeam size={48} className="text-yellow-400" />
                )}
              </div>
              {/* Hide congratulation and below details if no_scheme */}
              {qrData.scheme_data?.scheme_item_name !== "no-scheme" ? (
                <>
                  <h3 className="text-center text-2xl font-bold text-green-600 mb-2">
                    CONGRATULATION
                  </h3>
                  <div className="text-center text-lg text-gray-800 mb-2">
                    {qrData.scheme_data?.scheme_item_description}
                  </div>
                  <h5 className="text-center text-base font-semibold text-gray-700 mb-1">
                    Docket no
                  </h5>
                  <div className="text-center text-xl font-bold text-red-600 mb-2">
                    {qrData.scheme_data?.docket_no}
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    Contact company with the docket no for more details.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center text-2xl font-bold text-yellow-600 mb-2">
                    Better Luck Next Time!
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">PRODUCT AUTHENTICATION</h1>
        <div className="text-sm text-gray-600 mt-2">
          <div className="flex items-center justify-center mt-2">
            <img
              src={require("../Images/asli_utpad_logo.png")} // Replace with your logo path
              alt="Logo"
              className="h-14 w-14 mr-2"
            />
            <p className="text-lg font-bold text-green-500">
              Thank you for purchasing Verified Product
            </p>
            <img
              src={require("../Images/verified_logo.png")} // Replace with your logo path
              alt="Logo"
              className="h-14 w-14 ml-2"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-4">
        <img
          src={`data:image/jpeg;base64,${product.image_file_data}`}
          alt="Product"
          className="max-w-full h-auto"
        />
      </div>
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        {/* <button
          onClick={toggleDetails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button> */}
      </div>

      {/* Bottom div: Product info table, always visible */}
      {showDetails && (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 border border-gray-400 rounded">
            <thead className="text-xs bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th colSpan="2" className="px-6 py-3 text-center">
                  Product Information
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  UID
                </th>
                <td className="px-6 py-4">{qrData.uid}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Product Name
                </th>
                <td className="px-6 py-4">{product.name}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Technical Name
                </th>
                <td className="px-6 py-4">{product.technical_name}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Company Registration Number
                </th>
                <td className="px-6 py-4">
                  {qrData.company_data?.registration_no || "-"}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Product Registration Number
                </th>
                <td className="px-6 py-4">
                  {qrData.product.cir_reg_no || "-"}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Batch Number
                </th>
                <td className="px-6 py-4">{batch.batch_number}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Mfg Date
                </th>
                <td className="px-6 py-4">{formatDate(batch.mfg_date)}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Exp Date
                </th>
                <td className="px-6 py-4">{formatDate(batch.exp_date)}</td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Cautionary Symbol
                </th>
                <td className="px-6 py-4 flex items-center">
                  {product.cautionary_symbol ? (
                    <>
                      {/* Display image based on cautionary symbol value */}
                      {product.cautionary_symbol
                        .toLowerCase()
                        .includes("red") && (
                        <img
                          src={require("../Images/red.png")}
                          alt="Red Cautionary Symbol"
                          className="h-10 w-10"
                        />
                      )}
                      {product.cautionary_symbol
                        .toLowerCase()
                        .includes("blue") && (
                        <img
                          src={require("../Images/blue.png")}
                          alt="Blue Cautionary Symbol"
                          className="h-10 w-10"
                        />
                      )}
                      {product.cautionary_symbol
                        .toLowerCase()
                        .includes("yellow") && (
                        <img
                          src={require("../Images/yellow.png")}
                          alt="Yellow Cautionary Symbol"
                          className="h-10 w-10"
                        />
                      )}
                      {product.cautionary_symbol
                        .toLowerCase()
                        .includes("green") && (
                        <img
                          src={require("../Images/green.png")}
                          alt="Green Cautionary Symbol"
                          className="h-10 w-10"
                        />
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Cautionary Symbol
                </th>
                <td className="px-6 py-4">
                  {product.cautionary_symbol || "-"}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Antidote Statement
                </th>
                <td className="px-6 py-4">
                  {product.antidote_statement || "-"}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Company Name
                </th>
                <td className="px-6 py-4">
                  {qrData.company_data?.name || "-"}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Customer Care No
                </th>
                <td className="px-6 py-4">
                  {qrData.company_data?.customer_care_no || "-"}
                </td>
              </tr>
              {/* Add extra fields if present */}
              {batchExtraFields &&
                Object.entries(batchExtraFields).map(([key, value]) => (
                  <tr key={key} className="bg-white border-b">
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {key}
                    </th>
                    <td className="px-6 py-4">{value}</td>
                  </tr>
                ))}
              {productExtraFields &&
                Object.entries(productExtraFields).map(([key, value]) => (
                  <tr key={key} className="bg-white border-b">
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {key}
                    </th>
                    <td className="px-6 py-4">{value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-center mt-4">
        <h5 className="text-lg font-semibold">Customer Care No.</h5>
        <p className="text-lg flex justify-center items-center">
          <MdPhoneAndroid
            className="mr-2"
            style={{ color: "#964B00" }}
            size={24}
          />
          {qrData.company_data?.customer_care_no || "-"}
          <FaWhatsapp className="ml-2" style={{ color: "#25D366" }} size={24} />
        </p>
      </div>
    </div>
  );
};


// Helper function to format date as DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default QrInfo;
