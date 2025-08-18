// src/page/Demo.js
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { PersonFill, TelephoneFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Demo() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [value, setValue] = useState(dayjs());
  const [billNumber, setBillNumber] = useState(""); 

  // item states
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [items, setItems] = useState([]);

  // discount states
  const [discountType, setDiscountType] = useState("percent"); // "percent" or "flat"
  const [discountValue, setDiscountValue] = useState(0);

  // ✅ Fetch next bill number from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/bills/next-bill")
      .then((res) => res.json())
      .then((data) => setBillNumber(data.nextBillNumber))
      .catch((err) => console.error("Error fetching bill number:", err));
  }, []);

  const pickContact = async () => {
    try {
      if ("contacts" in navigator && "select" in navigator.contacts) {
        const contacts = await navigator.contacts.select(["name", "tel"], {
          multiple: false,
        });
        if (contacts.length > 0) {
          const contact = contacts[0];
          if (contact.name?.length > 0) setCustomerName(contact.name[0]);
          if (contact.tel?.length > 0) setPhoneNumber(contact.tel[0]);
        }
      } else {
        alert("Contact Picker API not supported in this browser.");
      }
    } catch (error) {
      console.error("Error picking contact:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    let discountAmount =
      discountType === "percent"
        ? (subtotal * discountValue) / 100
        : discountValue;
    if (discountAmount > subtotal) discountAmount = subtotal;
    const grandTotal = subtotal - discountAmount;

    const billData = {
      billNumber,
      billDate: value.format("DD/MM/YYYY"),
      customerName,
      phoneNumber,
      items,
      discountType,
      discountValue,
      subtotal,
      discountAmount,
      grandTotal,
    };

    try {
      const response = await fetch("http://localhost:5000/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (response.ok) {
        alert("Bill saved successfully!");
        navigate("/share-pdf", { state: { billData } });

        // reset
        setItems([]);
        setCustomerName("");
        setPhoneNumber("");
        setDiscountValue(0);

        const res = await fetch("http://localhost:5000/api/bills/next-bill");
        const data = await res.json();
        setBillNumber(data.nextBillNumber);
      } else {
        alert("Error saving bill");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddItem = () => {
    if (!itemName || !price || !qty || !unit) {
      alert("Please fill all item fields");
      return;
    }
    const newItem = {
      itemName,
      price: parseFloat(price),
      qty: parseFloat(qty),
      unit,
    };
    setItems([...items, newItem]);

    setItemName("");
    setPrice("");
    setQty("");
    setUnit("");
  };

  // subtotal, discount & total calculation
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  let discountAmount =
    discountType === "percent"
      ? (subtotal * discountValue) / 100
      : discountValue;
  if (discountAmount > subtotal) discountAmount = subtotal;
  const grandTotal = subtotal - discountAmount;

  return (
    <div className="container mt-5 ">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          {/* Bill Number */}
          <div className="col-md-4">
            <Form.Group className="mb-3" controlId="formBillNumber">
              <Form.Label className="fw-bold">Bill Number</Form.Label>
              <Form.Control type="number" value={billNumber} readOnly />
            </Form.Group>
          </div>

          {/* Bill Date */}
          <div className="col-md-4">
            <Form.Group className="mb-3" controlId="formBillDate">
              <Form.Label className="fw-bold">Bill Date</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Form.Group>
          </div>

          {/* Customer Name */}
          <Form.Group className=" col-md-8 mb-3" controlId="formCustomerName">
            <Form.Label className="fw-bold">Customer Name</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <InputGroup.Text
                onClick={pickContact}
                style={{ cursor: "pointer" }}
              >
                <PersonFill />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Customer Mobile */}
          <Form.Group className="col-md-8" controlId="formCustomerMobile">
            <Form.Label className="fw-bold">Customer Mobile</Form.Label>
            <InputGroup>
              <Form.Control
                type="tel"
                placeholder="Enter mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <InputGroup.Text>
                <TelephoneFill />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </div>

        {/* Items Section */}
        <h5 className="mt-4">Add Items</h5>

        <div className="row mb-3">
          <div className="col-md-4">
            <Form.Label className="fw-bold">Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <Form.Label className="fw-bold">Pcs</Form.Label>
            <Form.Control
              type="number"
              placeholder="Pcs"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <Form.Label className="fw-bold">Unit</Form.Label>
            <Form.Select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="gram">Gram</option>
              <option value="kg">Kg</option>
              <option value="pcs">Pcs</option>
            </Form.Select>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleAddItem}
        >
          Add Item
        </button>

        {/* Items Table */}
        {items.length > 0 && (
          <>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Pcs</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, index) => (
                  <tr key={index}>
                    <td>{it.itemName}</td>
                    <td>{it.price}</td>
                    <td>{it.qty}</td>
                    
                    <td>{(it.price * it.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Discount & Totals */}
            <div className="mt-3">
              <h6>Subtotal: ₹{subtotal.toFixed(2)}</h6>

              <div className="row mt-2">
                <div className="col-md-3">
                  <Form.Select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percent">Discount %</option>
                    
                  </Form.Select>
                </div>
                <div className="col-md-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Discount"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              <h6 className="mt-2">Discount: ₹{discountAmount.toFixed(2)}</h6>
              <h5 className="fw-bold text-success">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </h5>
            </div>
          </>
        )}

        <div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
