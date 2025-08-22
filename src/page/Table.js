import React, { useState, useEffect } from "react";
import logo from "../Images/logo.png";
import { Link } from "react-router-dom";

export default function Table() {
  const [search, setSearch] = useState("");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ for sidebar toggle

  // Fetch bills from backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("https://prademo-bankend-zojh.vercel.app/api/bills");
        const data = await response.json();
        setBills(data);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Filter bills based on search
  const filteredBills = bills.filter(
    (bill) =>
      bill.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      bill.billNumber?.toString().includes(search)
  );

  return (
    <>
      {/* Header */}
      <div
        className="div1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          background: "#f8f8f8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" style={{ height: "50px" }} />
          <h1 style={{ marginLeft: "20px" }}>Billing Dashboard</h1>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-btn"
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            display: "none",
          }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar + Main wrapper */}
      <div className="content" style={{ display: "flex" }}>
        {/* Sidebar */}
        <div
          className={`div2 ${isMenuOpen ? "open" : ""}`}
          style={{
            background: "#333",
            color: "white",
            minWidth: "200px",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <ul style={{ padding: "20px", listStyle: "none", marginBottom:"10px" }}>
            <li style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                  padding:"10px 20px",
                  backgroundColor:"#f8f8f8",
                  margin:"10px",
                  borderRadius:"5px",
                  marginBottom:"10px",
                }}>
              <Link
                to="/demo"
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                ➕ Create Bill
              </Link>
            </li>
            <li
             style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                  padding:"10px 20px",
                  backgroundColor:"#f8f8f8",
                  margin:"10px",
                  borderRadius:"5px"

                }}>
              <Link
                to="/CreateGstBill"
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Create GST Bill
              </Link>
            </li>
            <li
             style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                  padding:"10px 20px",
                  backgroundColor:"#f8f8f8",
                  margin:"10px",
                  borderRadius:"5px"

                }}>
              <Link
                to="/Logo"
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Add Logo
              </Link>
            </li>
            <li>⚙️ Settings</li>
          </ul>
        </div>

        {/* Main content */}
        <div className="main" style={{ flex: 1 }}>
          <div style={{ width: "90%", margin: "0 auto" }}>
            <h2>All Bills</h2>

            {/* Search bar */}
            <input
              type="text"
              placeholder="Search by bill number or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="searchBar"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            {/* Loading state */}
            {loading ? (
              <p>Loading bills...</p>
            ) : (
              <div
                className="tableContainer"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table
                  className="infoTable"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead style={{ backgroundColor: "#f2f2f2" }}>
                    <tr>
                      <th>Bill No</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Subtotal</th>
                      <th>Discount</th>
                      <th>Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => (
                        <tr key={bill._id}>
                          <td>{bill.billNumber}</td>
                          <td>
                            {new Date(bill.billDate).toLocaleDateString()}
                          </td>
                          <td>{bill.customerName}</td>
                          <td>{bill.phoneNumber}</td>
                          <td>₹{bill.subtotal}</td>
                          <td>
                            {bill.discountType === "percent"
                              ? `${bill.discountValue}%`
                              : `₹${bill.discountValue}`}
                          </td>
                          <td>₹{bill.grandTotal}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS inside component */}
      <style>
        {`
          /* Hide sidebar on mobile by default */
          @media (max-width: 768px) {
            .menu-btn {
              display: block !important;
            }
            .div2 {
              position: fixed;
              top: 0;
              left: 0;
              height: 88%;
              margin-top:13.6%;
              transform: translateX(-100%);
              z-index: 1000;
            }
            .div2.open {
              transform: translateX(0);
            }
            .main {
              margin-left: 0 !important;
            }
          }
        `}
      </style>
    </>
  );
}
