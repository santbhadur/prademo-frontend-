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

  // 🔹 Recalculate totals with CGST / SGST / IGST
  const recalculate = (billData, changedField = null) => {
    let subtotal = 0;
    let cgstTotal = 0,
      sgstTotal = 0,
      igstTotal = 0;

    // 🔹 Items calculation
    const items = billData.items?.map((item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.price) || 0;
      const gstPercent = Number(item.gst ?? billData.gstPercent) || 0;

      const taxable = qty * rate; // ✅ taxable amount
      let gstAmount = (taxable * gstPercent) / 100; // ✅ GST on taxable

      let cgst = 0,
        sgst = 0,
        igst = 0;

      if (billData.gstType === "CGST/SGST") {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
        cgstTotal += cgst;
        sgstTotal += sgst;
      } else {
        igst = gstAmount;
        igstTotal += igst;
      }

      subtotal += taxable;

      return {
        ...item,
        taxable,      // ✅ add taxable in each item
        gstAmount,    // ✅ add gstAmount in each item
        cgst,
        sgst,
        igst,
        total: taxable + gstAmount, // gross total
      };
    });

    let discountValue = parseFloat(billData.discountValue) || 0;
    let discountAmount = parseFloat(billData.discountAmount) || 0;

    // 🔹 Discount calculation
    if (changedField === "percent") {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (changedField === "amount") {
      discountValue = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
    }

    // 🔹 Grand total
    let grandTotal =
      subtotal - discountAmount + cgstTotal + sgstTotal + igstTotal;

    return {
      ...billData,
      items,
      subtotal,
      discountValue,
      discountAmount,
      cgstTotal,
      sgstTotal,
      igstTotal,
      gstAmount: cgstTotal + sgstTotal + igstTotal, // ✅ total gst
      grandTotal,
    };
  };

  // 🔹 Fetch Bill Data
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(
          `https://prademo-bankend-zojh.vercel.app/api/billss/${id}`
        );
        const data = await res.json();

        // 🔹 Normalize GST & Discount
        const normalizedData = {
          ...data,
          gstPercent: data.gstPercent ?? data.items?.[0]?.gst ?? 0,
          discountValue: data.discountValue ?? 0,
          discountAmount: data.discountAmount ?? 0,
        };

        // 🔹 Pass through recalculate (update totals properly)
        const recalculatedData = recalculate(normalizedData);

        setBill(recalculatedData);
      } catch (err) {
        console.error("Error fetching GST bill:", err);
      }
    };
    fetchBill();
  }, [id]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedBill = {
      ...bill,
      [name]:
        name === "gstPercent" ||
        name === "discountValue" ||
        name === "discountAmount"
          ? Number(value)
          : value,
    };

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
    items[index][name] =
      name === "qty" || name === "price" ? Number(value) : value;

    let updatedBill = { ...bill, items };
    updatedBill = recalculate(updatedBill);
    setBill(updatedBill);
  };

  // 🔹 Save Edited Bill
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://prademo-bankend-zojh.vercel.app/api/billss/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bill), // ✅ full calculation save hoga
        }
      );
      if (res.ok) {
        const updatedBill = await res.json(); // ✅ updated bill response
        alert("GST Bill updated successfully!");
        navigate("/gst-pdf", { state: { billData: updatedBill } });
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

              {/* 🔹 Show Taxable + GST Amount */}
              <div className="mb-2">
                <label>Taxable:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formatNumber(item.taxable)}
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label>GST Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formatNumber(item.gstAmount)}
                  readOnly
                />
              </div>
            </div>
          ))}

          {/* Tax & Discount */}
          <div className="mb-2">
            <label>GST Type:</label>
            <select
              className="form-control"
              name="gstType"
              value={bill.gstType || "CGST/SGST"}
              onChange={handleChange}
            >
              <option value="CGST/SGST">CGST/SGST</option>
              <option value="IGST">IGST</option>
            </select>
          </div>

          <div className="mb-2">
            <label>GST %:</label>
            <input
              type="number"
              className="form-control"
              name="gstPercent"
              value={bill.gstPercent ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Discount percent:</label>
            <input
              type="number"
              className="form-control"
              name="discountValue"
              value={bill.discountValue ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Discount Value:</label>
            <input
              type="number"
              className="form-control"
              name="discountAmount"
              value={bill.discountAmount ?? ""}
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
            Update
          </button>
          <Link to="/gst-bills" className="btn btn-secondary">
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
}
