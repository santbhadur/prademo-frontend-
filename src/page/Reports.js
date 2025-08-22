import React, { useEffect, useState } from "react";

export default function Reports() {
  const [bills, setBills] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch bills
  const fetchBills = async () => {
    try {
      let url = "http://localhost:5000/api/bills";
      if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setBills(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Calculate totals
  const totalBills = bills.length;
  const totalSales = bills.reduce((sum, b) => sum + b.grandTotal, 0);
  const totalDiscount = bills.reduce((sum, b) => {
    return b.discountType === "percent"
      ? sum + (b.subtotal * b.discountValue) / 100
      : sum + b.discountValue;
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Reports</h2>

      {/* Date Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          From:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "20px" }}>
          To:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button
          onClick={fetchBills}
          style={{ marginLeft: "20px", padding: "5px 10px" }}
        >
          Apply Filter
        </button>
      </div>

      {loading ? (
        <p>Loading report...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ background: "#f1f1f1", padding: "20px", borderRadius: "10px", flex: 1 }}>
              <h3>Total Bills</h3>
              <p>{totalBills}</p>
            </div>
            <div style={{ background: "#d1e7dd", padding: "20px", borderRadius: "10px", flex: 1 }}>
              <h3>Total Sales</h3>
              <p>₹{totalSales}</p>
            </div>
            <div style={{ background: "#f8d7da", padding: "20px", borderRadius: "10px", flex: 1 }}>
              <h3>Total Discounts</h3>
              <p>₹{totalDiscount}</p>
            </div>
          </div>

          {/* Bills Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead style={{ background: "#f2f2f2" }}>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>
                  <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td>{bill.customerName}</td>
                  <td>₹{bill.grandTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
