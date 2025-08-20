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
    <div className="container m-5 ">
      <div
        ref={contentRef}
        
      >
        {/* Single Table */}
        <table className="" style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td
                colSpan="6"
              style={{ border: "1px solid black", padding: "10px" }}>
                <h4 className="text-center">Invoice</h4>
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
               <h6> Bill Details </h6>
            </td>
            <td className="mb-0" colSpan="3" style={{ border: "1px solid black", paddingLeft: "8px" }}><h6>Bill to</h6></td>
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
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>No</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Item Name</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Qty</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px"  }}>Rate</th>
              <th style={{ border: "1px solid black", paddingLeft: "8px" }}>Amount</th>
            </tr>

            {/* Item Rows */}
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
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>Sub Total:</b>
              </td>
              <td style={{ border: "1px solid black", paddingLeft: "8px" }}>₹{billData.subtotal}</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", border: "1px solid black", paddingLeft: "8px" }}>
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>Discount:</b>
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
                <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>TOTAL AMOUNT:</b>
              </td>
              <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                <b>₹{billData.grandTotal}</b>
              </td>
            </tr>

            {/* Signature */}
            <tr>
              <td colSpan="3" style={{ border: "1px solid black" }}>
                
              </td>
              <td colSpan="2" style={{ textAlign: "center", border: "1px solid black" }}>
                <p>Authorized Signatory</p>
                <img src={logo} alt="Signature" style={{ height: 60 }} />
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
  );
}
