import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Main from "../page/Main";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Table1() {
  const [search, setSearch] = useState("");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch bills from backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("https://prademo-bankend-zojh.vercel.app/api/billss");
        const data = await response.json();
        setBills(data);
        console.log(data);
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

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      await fetch(`https://prademo-bankend-zojh.vercel.app/api/billss/${id}`, {
        method: "DELETE",
      });
      setBills(bills.filter((bill) => bill._id !== id));
    } catch (err) {
      console.error("Error deleting bill:", err);
    }
  };

  return (
    <>
      <Main />
      <div className="container test1 mt-2">
        <div>
          {/* Header with button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="mb-3 text-primary fw-bold">All GST Bills</h2>
            <Link to="/Create-Gst-Bill">
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                + Create Bill
              </button>
            </Link>
          </div>

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
                    <th>View</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.length > 0 ? (
                    filteredBills.map((bill) => (
                      <tr key={bill._id}>
                        <td>{bill.billNumber}</td>
                        <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                        <td>{bill.customerName}</td>
                        <td>{bill.phoneNumber}</td>
                        <td>₹{bill.subtotal.toFixed(2)}</td>
                        <td>
                          {bill.discountType === "percent"
                            ? `${bill.discountValue}%`
                            : `₹${bill.discountValue}`}
                        </td>
                        <td><button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate(`/view-bills/${bill._id}`)}
                        >
                          View
                        </button></td>
                        <td>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(bill._id)}
                          >
                            <Grid size={8}>
                              <DeleteIcon />
                            </Grid>

                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
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
    </>
  );
}
