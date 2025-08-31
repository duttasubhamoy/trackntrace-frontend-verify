import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import QrInfo from "../components/QrInfo";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const QrDetailsPage = () => {
  //for url like "/v?uid=cdd229d6881b9c3a917d8cced904187d" use below code
  //const [searchParams] = useSearchParams();
  //const key = searchParams.get("uid");
  //for url like "/cdd229d6881b9c3a917d8cced904187d" use below code
  const { key } = useParams();
  const [qrData, setQrData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(""); // New state for OTP
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false); // Modal for OTP input
  const [showCashback, setShowCashback] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [cashbackClaimed, setCashbackClaimed] = useState(false);
  const [redeemClaimed, setRedeemClaimed] = useState(false);
  const [schemeId, setSchemeId] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [errorMessage, setErrorMessage] = useState(null); // New state for error message
  const [name, setName] = useState(""); // Add name field
  const [retailerName, setRetailerName] = useState(""); // Add retailer name field
  const [submitLoading, setSubmitLoading] = useState(false);
  const [otpSubmitLoading, setOtpSubmitLoading] = useState(false);

  // Function to show fake product alert
  const showFakeProductAlert = () => {
    alert("Fake product detected. Please verify the QR code.");
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchCashbackAmount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/qr/${key}/cashback`);
      const {
        cashback_amount: cashbackAmount,
        cashback_claimed: cashbackClaimed,
        redeem_claimed: redeemClaimed,
        scheme_id: schemeId,
      } = response.data;

      setCashbackClaimed(cashbackClaimed);
      setRedeemClaimed(redeemClaimed);
      setSchemeId(schemeId);

      // Only show scheme modal if scheme exists and not redeemed
      if (schemeId && schemeId !== "null" && !redeemClaimed) {
        setShowModal(true); // ask for mobile
        setShowRedeem(true); // show scheme div after redeem flow
        setShowCashback(false);
      } else if (cashbackAmount > 0 && !cashbackClaimed) {
        setShowModal(true); // ask for mobile for cashback
        setShowCashback(true);
        setShowRedeem(false);
      } else {
        // No scheme/cashback, just show product info
        setShowRedeem(false);
        setShowCashback(false);
        requestLocationUpdated();
      }
      setErrorMessage(null);
    } catch (error) {
      // Only set error message for actual errors
      if (error.response && error.response.status !== 200) {
        setErrorMessage("No Product Data found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQrData = async (lat, lon, mobile = null, otp = null) => {
    setIsLoading(true); // Set loading to true before fetching data
    const body = { latitude: lat, longitude: lon };
    if (mobile) body.mobile = mobile;
    if (otp) body.otp = otp;
    if (name) body.name = name; // Add name field
    if (retailerName) body.retailer_name = retailerName; // Add retailer name field

    try {
      const response = await axios.post(`${API_BASE_URL}/qr/${key}`, body);
      const data = response.data;

      // Update product file URLs (added lines)
      // if (data.product) {
      //   const baseUrl = `${API_BASE_URL}/`; // Replace with your actual base URL
      //   data.product.video_file = data.product.video_file
      //     ? `${baseUrl}${data.product.video_file}`
      //     : null; // Add video file URL
      //   data.product.image_file = data.product.image_file
      //     ? `${baseUrl}${data.product.image_file}`
      //     : null; // Add image file URL
      //   data.product.pdf_file = data.product.pdf_file
      //     ? `${baseUrl}${data.product.pdf_file}`
      //     : null; // Add PDF file URL
      // }

      setQrData(data); // Updated QR data with file URLs
      setIsCompleted(true);
    } catch (error) {
      setErrorMessage("No Product Data found.");
    } finally {
      setIsLoading(false); // Set loading to false after fetching data
    }
  };

  const requestLocationUpdated = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mobile) {
            fetchQrData(
              position.coords.latitude,
              position.coords.longitude,
              mobile,
              otp
            );
            setShowRedeem(true);
            setShowCashback(true);
          } else {
            fetchQrData(position.coords.latitude, position.coords.longitude);
            setShowRedeem(false);
            setShowCashback(false);
          }
          setShowModal(false);
          setShowOtpModal(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          fetchLocationFromIPUpdated();
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchLocationFromIPUpdated();
    }
  };

  const fetchLocationFromIPUpdated = () => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((ipResponse) => {
        const ipAddress = ipResponse.data.ip;
        return axios.get(
          `https://api.ipgeolocation.io/ipgeo?apiKey=c3448732606b441d9fda734931ee304e&ip=${ipAddress}`
        );
      })
      .then((locationResponse) => {
        const { latitude, longitude } = locationResponse.data;
        if (mobile) {
          fetchQrData(latitude, longitude, mobile, otp);
          setShowRedeem(true);
          setShowCashback(true);
        } else {
          fetchQrData(latitude, longitude);
          setShowRedeem(false);
          setShowCashback(false);
        }
        setShowModal(false);
        setShowOtpModal(false);
      })
      .catch((err) => {
        console.error("Error fetching location from IP:", err);
        setErrorMessage("No Product Data found..");
        fetchQrData(null, null);
      });
  };

  const handleMobileSubmit = async () => {
    if (mobile.trim() && mobile.length === 10 && !submitLoading) {
      setSubmitLoading(true);
      try {
        await axios.post(`${API_BASE_URL}/send-otp-customer`, {
          mobile,
        });
        setShowModal(false);
        setShowOtpModal(true);
      } catch (error) {
        setErrorMessage("No Product Data found....");
        console.error("Error sending OTP:", error);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move focus to the next input if available
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.trim().length === 4 && !otpSubmitLoading) {
      setOtpSubmitLoading(true);
      try {
        await requestLocationUpdated();
      } finally {
        setOtpSubmitLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCashbackAmount();
  }, [key]);

  useEffect(() => {
    if (showThankYou) {
      setTimeout(() => setShowThankYou(false), 3000);
    }
  }, [showThankYou]);

  return (
    <div>
      {/* Display Circular Progress only when loading and no modals are active */}
      {isLoading && !showModal && !showOtpModal && (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-center text-red-500 font-bold mt-6">
          {errorMessage}
        </div>
      )}

      {/* Modal for mobile number input */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl">
            <h3 className="mb-4 text-lg font-bold">
              Enter Mobile Number to redeem Scheme
            </h3>
            <input
              type="tel"
              pattern="[0-9]*"
              value={mobile}
              maxLength="10"
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Mobile Number"
              className="border px-4 py-2 rounded w-full text-center mb-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleMobileSubmit();
              }}
              disabled={submitLoading}
            />
            <input
              type="text"
              value={name}
              maxLength="50"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="border px-4 py-2 rounded w-full text-center mb-2"
              disabled={submitLoading}
            />
            <input
              type="text"
              value={retailerName}
              maxLength="50"
              onChange={(e) => setRetailerName(e.target.value)}
              placeholder="Retailer Name (optional)"
              className="border px-4 py-2 rounded w-full text-center mb-2"
              disabled={submitLoading}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleMobileSubmit}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  submitLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitLoading}
              >
                {submitLoading ? "submitting.." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for OTP input */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl">
            <h3 className="mb-4 text-lg font-bold">Enter OTP</h3>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="tel"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={otp[index] || ""}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleOtpSubmit();
                  }}
                  className="border px-4 py-2 rounded text-center w-12 text-lg"
                  disabled={otpSubmitLoading}
                />
              ))}
            </div>
            <button
              onClick={handleOtpSubmit}
              className={`bg-blue-500 text-white px-6 py-2 rounded-lg ${
                otpSubmitLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={otpSubmitLoading}
            >
              {otpSubmitLoading ? "submitting.." : "Submit OTP"}
            </button>
          </div>
        </div>
      )}

      {/* Display QR Information */}
      {!isLoading && qrData && (
        <QrInfo
          qrData={qrData}
          showCashback={showCashback}
          showRedeem={showRedeem}
          redeemClaimed={redeemClaimed}
          cashbackClaimed={cashbackClaimed}
          mobile={mobile}
        />
      )}
    </div>
  );
};

export default QrDetailsPage;
