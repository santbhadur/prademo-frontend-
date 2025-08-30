import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "./page/Main";
import defaultLogo from "./Images/logo.png"; // ✅ Default image

export default function SharePdf() {
  const contentRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const billData = location.state?.billData;

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

  if (!billData) {
    return (
      <div className="container mt-5">
        <h3>No Bill Data Found</h3>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Create New Bill
        </button>
      </div>
    );
  }

  // ✅ PDF Share/Download function
  const handleShare = async () => {
    try {
      const element = contentRef.current;

      const opt = {
        margin: 0.5,
        filename: "BhagtiBhandar.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf().set(opt).from(element).output("blob");

      const file = new File([pdfBlob], "BhagtiBhandar.pdf", {
        type: "application/pdf",
      });

      const data = {
        files: [file],
        title: "Invoice PDF",
        text: "Invoice from Bhagti Bhandar",
      };

      if (navigator.share && navigator.canShare(data)) {
        await navigator.share(data);
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "BhagtiBhandar.pdf";
        a.click();
        alert("PDF downloaded. Attach it manually in WhatsApp.");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  return (
    <>
      <Main />
      <div className="container test m-2 ">
        <div ref={contentRef}>
          {/* Invoice Table */}
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              <tr>
                <td colSpan="6" style={{ border: "1px solid black", padding: "10px" }}>
                  <h4 className="text-center">Invoice</h4>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* ✅ User uploaded OR default logo */}
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      style={{ height: 80, marginRight: "20px" }}
                      onError={(e) => (e.target.src = defaultLogo)} // fallback if error
                    />
                    <div style={{ fontSize: "14px" }}>
                      <h4 className="mb-0">Shree Bhagti Bhandar Gem Stone</h4>
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

              {/* Bill details */}
              <tr>
                <td colSpan="3" style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  <h6> Bill Details </h6>
                </td>
                <td colSpan="3" style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  <h6>Bill to</h6>
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                  <p className="mb-0">Bill No: {billData.billNumber}</p>
                  <p className="mb-0">Bill Date: {billData.billDate}</p>
                  <p className="mb-0">Bill type</p>
                </td>
                <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                  <p className="mb-0">Customer Name: {billData.customerName}</p>
                  <p>Mobile: {billData.phoneNumber}</p>
                </td>
              </tr>

              {/* Items header */}
              <tr>
                <th style={{ border: "1px solid black", paddingLeft: "8px" }}>No</th>
                <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Item Name</th>
                <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Qty</th>
                <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Rate</th>
                <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Amount</th>
              </tr>

              {/* Items list */}
              {billData.items.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid black", paddingLeft: "8px" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid black", paddingLeft: "8px" }}>{it.itemName}</td>
                  <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                    {it.qty} {it.unit}
                  </td>
                  <td style={{ border: "1px solid black", paddingLeft: "8px" }}>₹{it.price}</td>
                  <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                    ₹{(it.price * it.qty).toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Totals */}
              <tr>
                <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                  <b>Sub Total:</b>
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>₹{billData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                  <b>Discount:</b>
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  ₹{billData.discountAmount} (
                  {billData.discountType === "percent"
                    ? `${billData.discountValue}%`
                    : "Flat"}
                  )
                </td>
              </tr>
              <tr>
                <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                  <b>TOTAL AMOUNT:</b>
                </td>
                <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                  <b>₹{billData.grandTotal.toFixed(2)}</b>
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
          <h4 className="text-center mt-3">Thank you</h4>
        </div>

        <button className="btn btn-success mt-3" onClick={handleShare}>
          📤 Share / Download PDF
        </button>
      </div>
    </>
  );
}
