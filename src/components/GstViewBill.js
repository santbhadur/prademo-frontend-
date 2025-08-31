import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import defaultLogo from "../Images/logo.png"; // <-- fallback logo import
import Main from "../page/Main";

export default function GstViewBill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
 useEffect(() => {
       fetch("https://prademo-bankend-x6ny.vercel.app/api/logo")
     .then((res) => res.json())
     .then((data) => {
       console.log("API Response:", data);  // ✅ ये डालकर देख
       if (data.url) {
         setLogoUrl(data.url);
       }
     })
     .catch((err) => console.error("Error fetching logo:", err));
   
     }, []);

  // Date formatting helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`https://prademo-bankend-zojh.vercel.app/api/billss/${id}`);
        const data = await res.json();
        setBill(data);
        console(data)
      } catch (err) {
        console.error("Error fetching bill:", err);
      }
    };
    fetchBill();
  }, [id]);

  if (!bill) return <p>Loading bill...</p>;

  return (
    <>
      <Main />
      <div className="container test1 m-2">
        
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {/* Header */}
              <tr>
                <td colSpan="10" style={{ border: "1px solid black", padding: "10px" }}>
                  <h4 className="text-center">GST Bill Detail</h4>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      style={{ height: "80px", marginRight: "10px" }}
                    />

                    <div style={{ fontSize: "14px" }}>
                      <h4 className="mb-0">Shree Bhagti Bhandar Gem Stone</h4>
                      <p className="mb-0">
                        142 Exculess shopping space, Bhimrad Althan, Surat Gujarat 395017
                      </p>
                      <p className="mb-0">Mobile: 9054498684</p>
                      <p className="mb-0">GSTIN: __________________</p>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Bill Info */}
              <tr>
                <td colSpan="5" style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  <h6>Bill Details</h6>
                </td>
                <td colSpan="5" style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  <h6>Bill To</h6>
                </td>
              </tr>
              <tr>
                <td colSpan="5" style={{ border: "1px solid black", padding: "8px" }}>
                  <p className="mb-0">Bill No: {bill.billNumber}</p>
                  <p className="mb-0">Bill Date: {formatDate(bill.billDate)}</p>
                  <p className="mb-0">Bill Type: {bill.gstType}</p>
                </td>
                <td colSpan="5" style={{ border: "1px solid black", padding: "8px" }}>
                  <p className="mb-0">Customer Name: {bill.customerName}</p>
                  <p>Mobile: {bill.phoneNumber}</p>
                </td>
              </tr>

              {/* Table Headers */}
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>No</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Item Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>HSN/SAC</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Qty</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Rate</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Taxable Value</th>
                {bill.gstType === "CGST/SGST" ? (
                  <>
                    <th style={{ border: "1px solid black", padding: "8px" }}>CGST</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>SGST</th>
                  </>
                ) : (
                  <th colSpan="2" style={{ border: "1px solid black", padding: "8px" }}>
                    IGST
                  </th>
                )}
                <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
              </tr>

              {/* Items */}
              {bill.items.map((it, idx) => {
                const gstAmount = it.gstAmount || 0; // fallback if undefined
                let sgst = 0,
                  cgst = 0,
                  igst = 0;

                if (bill.gstType === "CGST/SGST") {
                  sgst = (gstAmount / 2);
                  cgst = (gstAmount / 2);
                } else {
                  igst = gstAmount;
                }

                return (
                  <tr key={idx}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{it.itemName}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>123456</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {it.qty.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>₹{it.price.toFixed(2)}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      ₹{(it.price * it.qty)}
                    </td>
                    {bill.gstType === "CGST/SGST" ? (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>₹{sgst.toFixed(2)}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>₹{cgst.toFixed(2)}</td>
                      </>
                    ) : (
                      <td colSpan="2" style={{ border: "1px solid black", padding: "8px" }}>
                        ₹{igst.toFixed(2)}
                      </td>
                    )}
                    <td style={{ border: "1px solid black", padding: "8px" }}>₹{it.total}</td>
                  </tr>
                );
              })}

              {/* Totals */}
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                >
                  <b>Sub Total:</b>
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>₹{bill.subtotal.toFixed(2)}</td>
              </tr>

              {bill.gstType === "CGST/SGST" ? (
                <>
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                    >
                      <b>CGST:</b>
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>₹{bill.cgstTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                    >
                      <b>SGST:</b>
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>₹{bill.sgstTotal.toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                  >
                    <b>IGST:</b>
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>₹{bill.igstTotal.toFixed(2)}</td>
                </tr>
              )}

              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                >
                  <b>Discount:</b>
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  ₹{bill.discountAmount.toFixed(2)} (
                  {bill.discountType === "percent" ? `${bill.discountValue}%` : "Flat"})
                </td>
              </tr>
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}
                >
                  <b>TOTAL AMOUNT:</b>
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <b>₹{bill.grandTotal.toFixed(2)}</b>
                </td>
              </tr>

              {/* Signature */}
              <tr>
                <td colSpan="5" style={{ border: "1px solid black" }}></td>
                <td colSpan="5" style={{ textAlign: "center", border: "1px solid black" }}>
                  <p>Authorized Signatory</p>
                </td>
              </tr>
            </tbody>
          </table>
          <Link to="/" className="btn btn-secondary mt-2">
            Back
          </Link>
        
      </div>
    </>
  );
}
