import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { PersonFill, TelephoneFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";

import Main from "./page/Main";

export default function Test() {
  const navigate = useNavigate();

  // customer states
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

  // edit mode
  const [editIndex, setEditIndex] = useState(null);

  // discount states
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);
     const [showExtra, setShowExtra] = useState(false);
  // ऊपर states में add करें
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  // ✅ Fetch next bill number
  useEffect(() => {
    fetch("https://prademo-bankend-zojh.vercel.app/api/bills/next-bill")
      .then((res) => res.json())
      .then((data) => setBillNumber(data.nextBillNumber))
      .catch((err) => console.error("Error fetching bill number:", err));
  }, []);

  // Contact Picker API
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

  // Add or Update Item
  const handleAddItem = () => {
    if (!itemName || !price || !qty || !unit) {
      alert("⚠️ Please fill all item fields");
      return;
    }

    const newItem = {
      itemName,
      price: parseFloat(price),
      qty: parseFloat(qty),
      unit,
    };

    if (editIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      // Add new item
      setItems([...items, newItem]);
    }

    // reset inputs
    setItemName("");
    setPrice("");
    setQty("");
    setUnit("");
  };

  // Edit item
  const handleEdit = (index) => {
    const item = items[index];
    setItemName(item.itemName);
    setPrice(item.price);
    setQty(item.qty);
    setUnit(item.unit);
    setEditIndex(index);
  };

  // Delete item
  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // ✅ Totals calculation
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  let discountAmount =
    discountType === "percent"
      ? (subtotal * discountValue) / 100
      : discountValue;
  if (discountAmount > subtotal) discountAmount = subtotal;
  const grandTotal = subtotal - discountAmount;

  // Submit Bill
  const handleSubmit = async (e) => {
    e.preventDefault();

    const billData = {
      billNumber,
      billDate: value.format("DD/MM/YYYY"),
      customerName,
      phoneNumber,
       address,   // ✅ नया field
       gstin,  
      items,
      discountType,
      discountValue,
      subtotal,
      discountAmount,
      grandTotal,
    };

    try {
      const response = await fetch(
        "https://prademo-bankend-zojh.vercel.app/api/bills",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(billData),
        }
      );

      if (response.ok) {
        alert("✅ Bill saved successfully!");
        navigate("/share-pdf", { state: { billData } });

        // reset
        setItems([]);
        setCustomerName("");
        setPhoneNumber("");
        setDiscountValue(0);

        const res = await fetch(
          "https://prademo-bankend-zojh.vercel.app/api/bills/next-bills"
        );
        const data = await res.json();
        setBillNumber(data.nextBillNumber);
      } else {
        alert("❌ Error saving bill");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Main />
      <div className="container test mt-3 p-3 shadow rounded bg-light">
        <h4 className="mb-3 text-primary fw-bold">🧾 Create Bill</h4>
        <form onSubmit={handleSubmit}>
          {/* Bill fields */}
          <div className="row mb-3">
            <div className="col-sm-6">
              <Form.Group controlId="formBillNumber">
                <Form.Label className="fw-bold">Bill Number</Form.Label>
                <Form.Control type="number" value={billNumber} readOnly />
              </Form.Group>
            </div>
            <div className="col-sm-6">
              <Form.Group controlId="formBillDate">
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
          </div>

          {/* Customer fields */}
          <div className="row mb-3">
            <div className="col-sm-12">
              <Form.Group>
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
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-12">
              <Form.Group>
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
          </div>
           {/* Toggle Extra Customer Details */}
          <span className="mb-0"
            style={{ marginBottom: "5px", color: "blue", cursor: "pointer" }}
            onClick={() => setShowExtra(!showExtra)}
          >
            {showExtra
              ? "Additional Customer Details -"
              : "Additional Customer Details +"}
          </span>
          {showExtra && (
            <>
              <Form.Group className="mb-3 mt-2">
  <Form.Label className="fw-bold">Address</Form.Label>
  <InputGroup>
    <Form.Control
      type="text"
      placeholder="Enter address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </InputGroup>
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label className="fw-bold">GSTIN No</Form.Label>
  <InputGroup>
    <Form.Control
      type="text"
      placeholder="Enter Gstin No"
      value={gstin}
      onChange={(e) => setGstin(e.target.value)}
    />
  </InputGroup>
</Form.Group>

            </>
          )}

          {/* Items Section */}
          <h5 className="mt-4 text-secondary">➕ Add Items</h5>
          <div className="row mb-3">
            <div className="col-sm-6">
              <Form.Label className="fw-bold">Item Name</Form.Label>
              <Form.Control
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="col-sm-6">
              <Form.Label className="fw-bold">Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-6">
              <Form.Label className="fw-bold">Pcs</Form.Label>
              <Form.Control
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
            <div className="col-sm-6">
              <Form.Label className="fw-bold">Unit</Form.Label>
              <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="">Select Unit</option>
                <option value="gram">Gram</option>
                <option value="CRT">CRT</option>
                <option value="pcs">Pcs</option>
              </Form.Select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddItem}
          >
            {editIndex !== null ? "Update Item" : "Add Item"}
          </button>

          {/* Items Table */}
          {items.length > 0 && (
            <>
              <table className="table table-bordered mt-3">
                <thead className="table-secondary">
                  <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Pcs</th>
                    <th>Total</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, index) => (
                    <tr key={index}>
                      <td>{it.itemName}</td>
                      <td>₹{it.price}</td>
                      <td>{it.qty}</td>
                      <td>₹{(it.price * it.qty).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-3">
                <h6>Subtotal: ₹{subtotal.toFixed(2)}</h6>
                <div className="row mt-2">
                  <div className="col-sm-6">
                    <Form.Select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <option value="percent">Discount %</option>
                      <option value="flat">Flat Discount</option>
                    </Form.Select>
                  </div>
                  <div className="col-sm-6">
                    <Form.Control
                      type="number"
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
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
}
