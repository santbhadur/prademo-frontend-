import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Main from "../page/Main";

export default function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  // 🔹 Fetch bill data
  useEffect(() => {
    const fetchBill = async () => {
      const res = await fetch(
        `https://prademo-bankend-zojh.vercel.app/api/bills/${id}`
      );
      const data = await res.json();
      setBill(recalculate(data)); // initial calculation
    };
    fetchBill();
  }, [id]);

  // 🔹 Calculation function
  const recalculate = (billData, changedField = null) => {
    let subtotal = billData.items?.reduce(
      (sum, item) =>
        sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );

    let discountPercent = parseFloat(billData.discountPercent) || 0;
    let discountAmount = parseFloat(billData.discountAmount) || 0;

    if (changedField === "percent") {
      discountAmount = (subtotal * discountPercent) / 100;
    } else if (changedField === "amount") {
      discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
    } else {
      discountAmount = (subtotal * discountPercent) / 100;
    }

    let grandTotal = subtotal - discountAmount;

    return {
      ...billData,
      subtotal: subtotal.toFixed(2),
      discountPercent: discountPercent.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

  // 🔹 Handle input change (customer + discounts)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill((prev) => {
      let updated = { ...prev, [name]: value };
      let changedField =
        name === "discountPercent"
          ? "percent"
          : name === "discountAmount"
          ? "amount"
          : null;
      return recalculate(updated, changedField);
    });
  };

  // 🔹 Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...bill.items];
    updatedItems[index][field] = value;
    setBill((prev) => recalculate({ ...prev, items: updatedItems }));
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...bill,
      discountPercent: parseFloat(bill.discountPercent),
      discountAmount: parseFloat(bill.discountAmount),
      subtotal: parseFloat(bill.subtotal),
      grandTotal: parseFloat(bill.grandTotal),
    };

    const res = await fetch(
      `https://prademo-bankend-zojh.vercel.app/api/bills/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      alert("✅ Bill updated successfully");
      navigate(`/`);
    } else {
      alert("❌ Error updating bill");
    }
  };

  if (!bill) return <p>Loading bill...</p>;

  return (
    <>
      <Main />
      <div className="container test mt-3">
        <h3>Edit Bill</h3>
        <form onSubmit={handleSubmit}>
          {/* Customer Details */}
          <div className="mb-3">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={bill.customerName || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={bill.phoneNumber || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Items */}
          <h5>Items</h5>
          {bill.items.map((item, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemChange(index, "itemName", e.target.value)
                  }
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) =>
                    handleItemChange(index, "qty", e.target.value)
                  }
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div>
          ))}

          {/* Bill Level Discount */}
          <div className="row">
            <div className="col">
              <label>Discount (%)</label>
              <input
                type="number"
            
                name="discountPercent"
                value={bill.discountPercent}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col">
              <label>Discount Amount</label>
              <input
                type="number"
                
                name="discountAmount"
                value={bill.discountAmount}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="mb-3 mt-3">
            <label>Subtotal</label>
            <input
              type="text"
              value={bill.subtotal}
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Grand Total</label>
            <input
              type="text"
              value={bill.grandTotal}
              readOnly
              className="form-control"
            />
          </div>

          {/* Buttons */}
          <button type="submit" className="btn btn-primary">
            Update Bill
          </button>
          <Link to="/" className="btn btn-secondary ms-2">
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
}
