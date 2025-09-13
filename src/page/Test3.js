// src/page/CreateGstBill.js
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { PersonFill, TelephoneFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import Main from "../page/Main";

export default function CreateGstBill() {
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
  const [gst, setGst] = useState("");
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [gstType, setGstType] = useState("CGST/SGST");

  // discount states
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);

  // extra details
  const [showExtra, setShowExtra] = useState(false);
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  // ✅ Fetch next GST bill number
  useEffect(() => {
    fetch("https://prademo-bankend-zojh.vercel.app/api/bills/next-bills")
      .then((res) => res.json())
      .then((data) => setBillNumber(data.nextBillNumber))
      .catch((err) => console.error("Error fetching bill number:", err));
  }, []);

  // ✅ Pick contact (if supported)
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

  // ✅ Add or Update Item
  const handleAddItem = () => {
    if (!itemName || !price || !qty || !unit || !gst) {
      alert("Please fill all item details before adding.");
      return;
    }

    const gross = parseFloat(price) * parseFloat(qty);
    const gstPercent = parseFloat(gst);

    const taxable = gross;
    const gstAmount = (gross * gstPercent) / 100;
    const total = taxable + gstAmount;

    const newItem = {
      itemName,
      price: parseFloat(price),
      qty: parseFloat(qty),
      unit,
      gst: gstPercent,
      taxable,
      gstAmount,
      total,
    };

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    // reset inputs
    setItemName("");
    setPrice("");
    setQty("");
    setUnit("");
    setGst("");
  };

  // ✅ Delete Item
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // ✅ Edit Item
  const handleEditItem = (index) => {
    const item = items[index];
    setItemName(item.itemName);
    setPrice(item.price);
    setQty(item.qty);
    setUnit(item.unit);
    setGst(item.gst);
    setEditIndex(index);
  };

  // ✅ Subtotal, Discount, GST, GrandTotal calculation
  const subtotal = items.reduce((sum, it) => sum + it.taxable, 0);
  const totalGst = items.reduce((sum, it) => sum + it.gstAmount, 0);

  let discountAmount =
    discountType === "percent"
      ? (subtotal * discountValue) / 100
      : discountValue;
  if (discountAmount > subtotal) discountAmount = subtotal;

  const grandTotal = subtotal + totalGst - discountAmount;

  // ✅ Submit Bill to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName) {
      alert("Please enter Customer Name.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter Customer Mobile Number.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least 1 item.");
      return;
    }

    let cgstTotal = 0,
      sgstTotal = 0,
      igstTotal = 0;
    if (gstType === "CGST/SGST") {
      cgstTotal = totalGst / 2;
      sgstTotal = totalGst / 2;
    } else {
      igstTotal = totalGst;
    }

    const billData = {
      billNumber,
      billDate: value.format("DD/MM/YYYY"),
      customerName,
      phoneNumber,
      address,
      gstin,
      gstType,
      items,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      gstAmount: totalGst,
      grandTotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
    };

    try {
      const res = await fetch("https://prademo-bankend-zojh.vercel.app/api/billss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (res.ok) {
        alert("GST Bill Created Successfully ✅");
        navigate("/GstPreview", { state: { billData } });
      } else {
        alert("Error creating GST Bill ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error ❌");
    }
  };

  return (
    <>
      <Main />
      <div className="container test mt-3 p-3 shadow rounded bg-light">
        <h5 className="mb-3 text-primary fw-bold">Create GST Bill </h5>
        <form onSubmit={handleSubmit}>
          {/* Bill Details */}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Group>
                <Form.Label className="fw-bold">Bill Number</Form.Label>
                <Form.Control type="number" value={billNumber} readOnly />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label className="fw-bold">Bill Date</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </LocalizationProvider>
              </Form.Group>
            </div>
          </div>

          {/* Customer Info */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Customer Name</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
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

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Customer Mobile</Form.Label>
            <InputGroup>
              <Form.Control
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <InputGroup.Text>
                <TelephoneFill />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Toggle Extra Customer Details */}
          <span
            className="mb-0"
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

          <div className="col-md-4 mb-3">
            <Form.Label className="fw-bold">GST Type</Form.Label>
            <Form.Select
              value={gstType}
              onChange={(e) => setGstType(e.target.value)}
            >
              <option value="CGST/SGST">CGST/SGST (Local customer)</option>
              <option value="IGST">IGST (Central/outstation customer)</option>
            </Form.Select>
          </div>

          {/* Items */}
          <h5 className="mt-4">Add Items</h5>
          <div className="row mb-3">
            <div className="col-md-3">
              <Form.Label className="fw-bold">Item Name</Form.Label>
              <Form.Control
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="fw-bold">Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="fw-bold">Qty</Form.Label>
              <Form.Control
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="fw-bold">Unit</Form.Label>
              <Form.Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="">Select Unit</option>
                <option value="gram">Gram</option>
                <option value="CRT">CRT</option>
                <option value="pcs">Pcs</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Label className="fw-bold">GST %</Form.Label>
              <Form.Select value={gst} onChange={(e) => setGst(e.target.value)}>
                <option value="">--Select GST--</option>
                <option value="5">5%</option>
                <option value="8">8%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="30">30%</option>
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
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Taxable</th>
                    <th>GST %</th>
                    <th>Total</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.itemName}</td>
                      <td>₹{it.price}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.taxable.toFixed(2)}</td>
                      <td>{it.gst}%</td>
                      <td>₹{it.total.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditItem(idx)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteItem(idx)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <h6>Subtotal: ₹{subtotal.toFixed(2)}</h6>
              <h6>GST: ₹{totalGst.toFixed(2)}</h6>
              <h6>Discount: ₹{discountAmount.toFixed(2)}</h6>
              <h5 className="fw-bold text-success">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </h5>

              {/* Discount Section */}
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

              <div>
                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}
