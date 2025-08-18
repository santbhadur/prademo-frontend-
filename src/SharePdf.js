import React, { useRef } from "react";
 import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "./Images/logo.png";

export default function SharePdf() {
  const contentRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const billData = location.state?.billData;

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

  const handleShare = async () => {
    try {
      const element = contentRef.current;

      // PDF Options
      const opt = {
        margin: 0.5,
        filename: "BhagtiBhandar.pdf",
        image: { type: "jpeg", quality: 1 },   // High quality image
        html2canvas: { scale: 3 },             // 🔥 Higher scale = sharper text
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      // Generate blob with high quality
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
    <div className="container mt-5 aliten-item justification-content">
      <div
        ref={contentRef}
        className="container ml-5"
      >
        {/* Single Table */}
        <table style={{ borderCollapse: "collapse", width: "80%" }}>
          <tbody>
            <tr>
              <td
                colSpan="6"
              style={{ border: "1px solid black", padding: "10px" }}>
                <h6 className="text-center">Invoice</h6>
              <div style={{ display: "flex", alignItems: "center" }}>
              
                <img
                  src={logo}
                  alt="Company Logo"
                  style={{ height: 80, marginRight: "20px" }}
                />   
                <div style={{ fontSize:"14px"}}>
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
            <tr>
            <td className="mb-0" colSpan="3" style={{ border: "1px solid black", paddingLeft: "8px" }}>
                Bill Details
            </td>
            <td className="mb-0" colSpan="3" style={{ border: "1px solid black", paddingLeft: "8px" }}>Bill to</td>
        </tr>
        <tr>
            <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                <div>
                    <p className="mb-0">Bil No: {billData.billNumber}</p>
                    <p className="mb-0">Bill Date: {billData.billDate}</p>
                    <p className="mb-0">Bill type</p>
                </div>
            </td>
            <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                <div>
                    <p className="mb-0">Constomer Name: {billData.customerName}</p>
                    <p >Mobile: {billData.phoneNumber}</p>
                </div>
            </td>
            
          </tr>

            {/* Item Headers */}
            <tr>
              <th style={{ border: "1px solid black" }}>No</th>
              <th style={{ border: "1px solid black" }}>Item Name</th>
              <th style={{ border: "1px solid black" }}>Qty</th>
              <th style={{ border: "1px solid black" }}>Rate</th>
              <th style={{ border: "1px solid black" }}>Amount</th>
            </tr>

            {/* Item Rows */}
            {billData.items.map((it, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid black" }}>{idx + 1}</td>
                <td style={{ border: "1px solid black" }}>{it.itemName}</td>
                <td style={{ border: "1px solid black" }}>
                  {it.qty} {it.unit}
                </td>
                <td style={{ border: "1px solid black" }}>₹{it.price}</td>
                <td style={{ border: "1px solid black" }}>
                  ₹{(it.price * it.qty).toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Totals */}
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px" }}>Sub Total:</b>
              </td>
              <td style={{ border: "1px solid black" }}>₹{billData.subtotal}</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px" }}>Discount:</b>
              </td>
              <td style={{ border: "1px solid black" }}>
                ₹{billData.discountAmount} (
                {billData.discountType === "percent"
                  ? `${billData.discountValue}%`
                  : "Flat"}
                )
              </td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                <b style={{ marginLeft: "5px" }}>TOTAL AMOUNT:</b>
              </td>
              <td style={{ border: "1px solid black" }}>
                <b>₹{billData.grandTotal}</b>
              </td>
            </tr>

            {/* Signature */}
            <tr>
              <td colSpan="3" style={{ border: "1px solid black" }}>
                <i>Thank you!</i>
              </td>
              <td colSpan="2" style={{ textAlign: "center", border: "1px solid black" }}>
                <p>Authorized Signatory</p>
                <img src={logo} alt="Signature" style={{ height: 60 }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <hr />
        <p>
          <b style={{ marginLeft: "5px" }}>Bank Details:</b> __________________________
        </p>
        <p>
          <b style={{ marginLeft: "5px" }}>Terms & Conditions:</b> ____________________
        </p>
      </div>

      <button className="btn btn-success mt-3" onClick={handleShare}>
        📤 Share / Download PDF
      </button>
    </div>
  );
}
