import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Main from "../page/Main";

// 🔹 Helper Function to format numbers
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "";
  return Number(num) % 1 === 0 ? String(Number(num)) : Number(num).toFixed(2);
};

export default function ViewBill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  // 🔹 Fetch Logo
  useEffect(() => {
    fetch("https://prademo-bankend-x6ny.vercel.app/api/logo")
      .then((res) => res.json())
      .then((data) => {
        if (data.url) setLogoUrl(data.url);
      })
      .catch((err) => console.error("Error fetching logo:", err));
  }, []);

  // 🔹 Fetch Bill
  useEffect(() => {
    const fetchBill = async () => {
      const res = await fetch(
        `https://prademo-bankend-zojh.vercel.app/api/bills/${id}`
      );
      const data = await res.json();
      setBill(data);
    };
    fetchBill();
  }, [id]);

  if (!bill) return <p>Loading bill...</p>;

  return (
    <>
      <Main />
      <div className="container test mt-2">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {/* Company Details */}
            <tr>
              <td colSpan="6" style={{ border: "1px solid black", padding: "10px" }}>
                <h4 className="Details text-center">Bill Details</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    style={{ height: 80, marginRight: "20px" }}
                  />
                  <div style={{ fontSize: "14px" }}>
                    <h4 className="Details text mb-0">
                      Shree Bhagti Bhandar Gem Stone
                    </h4>
                    <p className="mb-0">
                      142 Exculess shopping space, Bhimrad Althan, Surat Gujarat
                      395017
                    </p>
                    <p className="mb-0">Mobile: 9054498684</p>
                    <p className="mb-0">GSTIN: __________________</p>
                  </div>
                </div>
              </td>
            </tr>

            {/* Bill & Customer Info */}
            <tr>
              <td
                colSpan="3"
                style={{ border: "1px solid black", paddingLeft: "8px" }}
              >
                <h6>Bill Details</h6>
              </td>
              <td
                colSpan="3"
                style={{ border: "1px solid black", paddingLeft: "8px" }}
              >
                <h6>Bill to</h6>
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                <p className="mb-0">Bill No: {bill.billNumber}</p>
                <p className="mb-0">
                  Bill Date: {new Date(bill.billDate).toLocaleDateString("en-GB")}
                </p>
                <p className="mb-0">Bill type</p>
              </td>
              <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                <p className="mb-0">Customer Name: {bill.customerName}</p>
                <p>Mobile: {bill.phoneNumber}</p>
              </td>
            </tr>

            {/* Item Headers */}
            <tr>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>No</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>
                Item Name
              </th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Qty</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Rate</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Amount</th>
            </tr>

            {/* Item Rows */}
            {bill.items.map((it, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  {idx + 1}
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  {it.itemName}
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  {it.qty} {it.unit}
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  ₹{formatNumber(it.price)}
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  ₹{formatNumber(it.price * it.qty)}
                </td>
              </tr>
            ))}

            {/* Totals */}
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>Sub Total:</b>
              </td>
              <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                ₹{formatNumber(bill.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>Discount:</b>
              </td>
              <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                ₹{formatNumber(bill.discountAmount)} (
                {bill.discountType === "percent"
                  ? `${formatNumber(bill.discountValue)}%`
                  : "Flat"}
                )
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>
                  TOTAL AMOUNT:
                </b>
              </td>
              <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                <b>₹{formatNumber(bill.grandTotal)}</b>
              </td>
            </tr>

            {/* Signature */}
            <tr>
              <td colSpan="3" style={{ border: "1px solid black" }}></td>
              <td colSpan="2" style={{ textAlign: "center", border: "1px solid black" }}>
                <p>Authorized Signatory</p>
              </td>
            </tr>
          </tbody>
        </table>

        <Link to="/" className="mt-2 btn btn-primary">
          Back
        </Link>
      </div>
    </>
  );
}
