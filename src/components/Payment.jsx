import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const Payment = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiryDate") {
      const cleanedValue = value.replace(/[^0-9/]/g, "");
      if (cleanedValue.length === 2 && !cleanedValue.includes("/")) {
        setFormData({ ...formData, [name]: cleanedValue + "/" });
        return;
      }

      if (cleanedValue.length === 5) {
        const formatRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!formatRegex.test(cleanedValue)) {
          alert("Invalid format! Use MM/YY (e.g., 09/26).");
        } else {
          const [monthStr, yearStr] = cleanedValue.split("/");
          const year = parseInt(yearStr, 10);
          const currentYear = new Date().getFullYear() % 100;
          if (year < currentYear) {
            alert("Card expiry year must be in the future.");
          }
        }
      }

      setFormData({ ...formData, [name]: cleanedValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  // ✅ Confirm Order Handler (includes cart clear + redirect)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Get cart items
      const cartResponse = await fetch(`${API_BASE_URL}/api/cart`);
      const cartData = await cartResponse.json();

      if (!cartData.success || cartData.cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // 2️⃣ Calculate total (subtotal + shipping + tax)
      const total = cartData.total + 5 + cartData.total * 0.1;

      // 3️⃣ Post payment
      const paymentResponse = await fetch(`${API_BASE_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartData.cart,
          total,
          paymentMethod,
          shippingInfo: formData,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        // 4️⃣ Clear cart
        await fetch(`${API_BASE_URL}/api/cart/clear/all`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        alert(`Order placed successfully! Order ID: ${paymentData.orderId}`);
        navigate("/"); // 5️⃣ Redirect to home page
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while processing your order.");
    }
  };

  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" },
  ];

  const renderShippingStep = () => (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>Shipping Information</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {[
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "city",
          "state",
          "zipCode",
          "country",
        ].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={formData[field]}
            onChange={handleInputChange}
            required
            style={{
              gridColumn: field === "address" || field === "country" ? "1 / -1" : "",
              padding: "1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>Payment Method</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        {["card", "paypal"].map((method) => (
          <label
            key={method}
            style={{
              border: `2px solid ${paymentMethod === method ? "#e91e63" : "#e0e0e0"}`,
              padding: "1rem",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "center",
              background: paymentMethod === method ? "#f9f9f9" : "white",
            }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
              style={{ display: "none" }}
            />
            {method === "card" ? "💳 Credit Card" : "📱 PayPal"}
          </label>
        ))}
      </div>

      {paymentMethod === "card" && (
        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </div>
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on Card"
            value={formData.nameOnCard}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>Order Review</h2>
      <div style={summaryBox}>
        <div style={summaryRow}>
          <span>Subtotal (3 items):</span>
          <span>$47.97</span>
        </div>
        <div style={summaryRow}>
          <span>Shipping:</span>
          <span>$5.00</span>
        </div>
        <div style={summaryRow}>
          <span>Tax:</span>
          <span>$4.80</span>
        </div>
        <div style={{ ...summaryRow, fontWeight: "bold", fontSize: "1.2rem", color: "#e91e63" }}>
          <span>Total:</span>
          <span>$57.77</span>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3 style={subHeading}>Shipping Address</h3>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.address}</p>
        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
        <p>{formData.country}</p>
      </div>

      <div>
        <h3 style={subHeading}>Payment Method</h3>
        <p>{paymentMethod === "card" ? "Credit Card" : "PayPal"}</p>
        {paymentMethod === "card" && formData.cardNumber && (
          <p>Card ending in {formData.cardNumber.slice(-4)}</p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#e91e63", fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>Checkout</h1>

      {/* Progress Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "20px", left: 0, right: 0, height: "2px", background: "#e0e0e0", zIndex: 1 }} />
        {steps.map((step) => (
          <div key={step.number} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: currentStep >= step.number ? "#e91e63" : "#e0e0e0",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {step.number}
            </div>
            <span style={{ fontSize: "0.9rem", color: currentStep >= step.number ? "#e91e63" : "#666" }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderShippingStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}

        <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} style={backBtn}>
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} style={nextBtn}>
              Next
            </button>
          ) : (
            <button type="submit" style={confirmBtn}>
              Confirm Order
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Styling ---
const sectionStyle = {
  background: "white",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  marginBottom: "2rem",
};
const headingStyle = { marginBottom: "1.5rem", color: "#333" };
const subHeading = { marginBottom: "1rem", color: "#333" };
const inputStyle = { padding: "1rem", border: "2px solid #e0e0e0", borderRadius: "5px", fontSize: "1rem" };
const summaryBox = { background: "#f8f9fa", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" };
const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: "1rem" };
const backBtn = {
  background: "#666",
  color: "white",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
};
const nextBtn = {
  background: "#e91e63",
  color: "white",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginLeft: "auto",
};
const confirmBtn = {
  background: "#4caf50",
  color: "white",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  width: "100%",
};

export default Payment;
