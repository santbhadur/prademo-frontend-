import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Main from "../page/Main";

// 🔹 Helper Function (decimal format fix)
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "";
  return Number(num) % 1 === 0 ? String(Number(num)) : Number(num).toFixed(2);
};

export default function GstEditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  // 🔹 Fetch Bill Data
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`https://prademo-bankend-mrry.vercel.app/api/billss/${id}`);
        const data = await res.json();
        setBill(data);
      } catch (err) {
        console.error("Error fetching GST bill:", err);
      }
    };
    fetchBill();
  }, [id]);

  // 🔹 Recalculate totals
  const recalculate = (billData, changedField = null) => {
    let subtotal = billData.items?.reduce(
      (sum, item) =>
        sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );

    let discountValue = parseFloat(billData.discountValue) || 0;
    let discountAmount = parseFloat(billData.discountAmount) || 0;

    // 🔹 Discount calculation
    if (changedField === "percent") {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (changedField === "amount") {
      discountValue = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
    }

    // 🔹 Apply GST
    let gstPercent = parseFloat(billData.gstPercent) || 0;
    let gstAmount = ((subtotal - discountAmount) * gstPercent) / 100;

    let grandTotal = subtotal - discountAmount + gstAmount;

    return {
      ...billData,
      subtotal,
      discountValue,
      discountAmount,
      gstPercent,
      gstAmount,
      grandTotal,
    };
  };

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedBill = { ...bill, [name]: value };

    if (name === "discountValue") {
      updatedBill = recalculate(updatedBill, "percent");
    } else if (name === "discountAmount") {
      updatedBill = recalculate(updatedBill, "amount");
    } else {
      updatedBill = recalculate(updatedBill);
    }

    setBill(updatedBill);
  };

  // 🔹 Handle Item Change
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...bill.items];
    items[index][name] = value;

    let updatedBill = { ...bill, items };
    updatedBill = recalculate(updatedBill);
    setBill(updatedBill);
  };

  // 🔹 Save Edited Bill
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://prademo-bankend-mrry.vercel.app/api/billss/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });
      if (res.ok) {
        alert("GST Bill updated successfully!");
        navigate("/All-Gst-Bills");
      } else {
        alert("Failed to update GST Bill");
      }
    } catch (err) {
      console.error("Error saving GST Bill:", err);
    }
  };

  if (!bill) return <p>Loading GST bill...</p>;

  return (
    <>
      <Main />
      <div className="container test mt-3">
        <h3>Edit GST Bill</h3>
        <form onSubmit={handleSave}>
          {/* Bill Info */}
          <div className="mb-2">
            <label>Bill Number:</label>
            <input
              type="text"
              className="form-control"
              name="billNumber"
              value={bill.billNumber || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Bill Date:</label>
            <input
              type="date"
              className="form-control"
              name="billDate"
              value={bill.billDate ? bill.billDate.slice(0, 10) : ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Customer Info */}
          <div className="mb-2">
            <label>Customer Name:</label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              value={bill.customerName || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Phone Number:</label>
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              value={bill.phoneNumber || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Items */}
          <h5 className="mt-3">Items</h5>
          {bill.items.map((item, idx) => (
            <div key={idx} className="card p-2 mb-2">
              <div className="mb-2">
                <label>Item Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="itemName"
                  value={item.itemName || ""}
                  onChange={(e) => handleItemChange(idx, e)}
                />
              </div>
              <div className="mb-2">
                <label>Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  name="qty"
                  value={item.qty || ""}
                  onChange={(e) => handleItemChange(idx, e)}
                />
              </div>
              <div className="mb-2">
                <label>Unit:</label>
                <input
                  type="text"
                  className="form-control"
                  name="unit"
                  value={item.unit || ""}
                  onChange={(e) => handleItemChange(idx, e)}
                />
              </div>
              <div className="mb-2">
                <label>Rate:</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={item.price || ""}
                  onChange={(e) => handleItemChange(idx, e)}
                />
              </div>
            </div>
          ))}

          {/* Tax & Discount */}
          <div className="mb-2">
            <label>GST %:</label>
            <input
              type="number"
              className="form-control"
              name="gstPercent"
              value={bill.gstPercent || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Discount percent:</label>
            <input
              type="number"
              className="form-control"
              name="discountValue"
              value={bill.discountValue || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Discount Value:</label>
            <input
              type="number"
              className="form-control"
              name="discountAmount"
              value={bill.discountAmount || ""}
              onChange={handleChange}
            />
          </div>

          {/* Total */}
          <div className="mb-2">
            <label>Grand Total:</label>
            <input
              type="text"
              className="form-control"
              value={`₹${formatNumber(bill.grandTotal)}`}
              readOnly
            />
          </div>

          {/* Buttons */}
          <button type="submit" className="btn btn-primary me-2">
            Save
          </button>
          <Link to="/gst-bills" className="btn btn-secondary">
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
}
