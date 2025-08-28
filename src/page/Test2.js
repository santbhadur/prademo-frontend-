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

export default function Test2() {
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
  const [gstType, setGstType] = useState("CGST/SGST");

  // discount states
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);

  // ✅ Fetch next GST bill number
  useEffect(() => {
    fetch("https://prademo-bankend.vercel.app/api/bills/next-bills")
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


  // Add item
  const handleAddItem = () => {
    if (!itemName || !price || !qty || !unit || !gst) {
      alert("Please fill all item fields including GST");
      return;
    }

    const baseTotal = parseFloat(price) * parseFloat(qty);
    const gstAmount = (baseTotal * parseFloat(gst)) / 100;

    const newItem = {
      itemName,
      price: parseFloat(price),
      qty: parseFloat(qty),
      unit,
      gst: parseFloat(gst),
      gstAmount,
      total: baseTotal + gstAmount,
    };

    setItems([...items, newItem]);

    // reset inputs
    setItemName("");
    setPrice("");
    setQty("");
    setUnit("");
    setGst("");
  };

  // subtotal, discount & total calculation
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const totalGst = items.reduce((sum, it) => sum + it.gstAmount, 0);
  let discountAmount =
    discountType === "percent"
      ? (subtotal * discountValue) / 100
      : discountValue;
  if (discountAmount > subtotal) discountAmount = subtotal;
  const grandTotal = subtotal - discountAmount + totalGst;

  // ✅ Submit Bill to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !phoneNumber || items.length === 0) {
      alert("Please fill all details and add at least 1 item.");
      return;
    }

    let cgstTotal = 0, sgstTotal = 0, igstTotal = 0;
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
      const res = await fetch(
        "http://localhost:5000/api/billss",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(billData),
        }
      );

      if (res.ok) {
        alert("GST Bill Created Successfully ✅");
        navigate("/GstPreview", { state: { billData } }); // redirect
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
      <h5 className="mb-3 text-primary fw-bold">Create GST Bill</h5>
      <form onSubmit={handleSubmit}>
        {/* Bill Details */}
        <div className="row mb-3">
          <div className="col-md-4 ">
            <Form.Group>
              <Form.Label className="fw-bold">Bill Number</Form.Label><br></br>
              <Form.Control type="number" value={billNumber} readOnly />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Label className="fw-bold">Bill Date</Form.Label><br></br>
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

        {/* Customer */}
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
                    style={{ cursor: "pointer" }}>
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
        <div className="col-md-4">
            <Form.Label className="fw-bold">GST Type</Form.Label>
            <Form.Select value={gstType} onChange={(e) => setGstType(e.target.value)}>
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
            <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">Select Unit</option>
              <option value="gram">Gram</option>
              <option value="kg">Kg</option>
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
          Add Item
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
                  <th>GST %</th>
                  <th>GST Amt</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.itemName}</td>
                    <td>₹{it.price}</td>
                    <td>{it.qty}</td>
                    <td>{it.gst}%</td>
                    <td>₹{it.gstAmount.toFixed(2)}</td>
                    <td>₹{it.total.toFixed(2)}</td>
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
            <div className="row mt-2">
            <div className="col-sm-6">
              <Form.Select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percent">Discount %</option>
                
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
