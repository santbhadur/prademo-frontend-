import React, { useRef, useState, useEffect } from "react"; // <-- useState & useEffect import
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // <-- axios import
import defaultLogo from "../Images/logo.png"; // <-- fallback logo import
import Main from "../page/Main";

export default function GstPreview() {
  const contentRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const billData = location.state?.billData;
   const [logoUrl, setLogoUrl] = useState("");
 
      useEffect(() => {
         fetch("https://prademo-bankend-zojh.vercel.app/api/logo")
           .then((res) => res.json())
           .then((data) => {
             if (data.filePath) {
               setLogoUrl("https://prademo-bankend-zojh.vercel.app/" + data.filePath);
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

   // ✅ Download PDF
  const handleDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "BhagtiBhandar.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save(); // directly download karega
  };

   // ✅ Print PDF
  const handlePrint = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "BhagtiBhandar.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("bloburl")
      .then((url) => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.contentWindow.print(); // ✅ directly print dialog khulega
      });
  };


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
    <div className="container test m-2">
      <div ref={contentRef}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {/* Header */}
            <tr>
              <td colSpan="10" style={{ border: "1px solid black", padding: "10px" }}>
                <h4 className="text-center">Invoice</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={ logoUrl}  alt="Company Logo" style={{ height:"80px", marginRight: "10px"}} />


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
                <p className="mb-0">Bill No: {billData.billNumber}</p>
                <p className="mb-0">Bill Date: {billData.billDate}</p>
                <p className="mb-0">Bill Type: {billData.gstType}</p>
              </td>
              <td colSpan="5" style={{ border: "1px solid black", padding: "8px" }}>
                <p className="mb-0">Customer Name: {billData.customerName}</p>
                <p>Mobile: {billData.phoneNumber}</p>
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
              {billData.gstType === "CGST/SGST" ? (
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
            {billData.items.map((it, idx) => {
              let sgst = 0,
                cgst = 0,
                igst = 0;
              if (billData.gstType === "CGST/SGST") {
                sgst = (it.gstAmount / 2).toFixed(2);
                cgst = (it.gstAmount / 2).toFixed(2);
              } else {
                igst = it.gstAmount.toFixed(2);
              }

              return (
                <tr key={idx}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{it.itemName}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>123456</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {it.qty} {it.unit}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>₹{it.price}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    ₹{(it.price * it.qty).toFixed(2)}
                  </td>
                  {billData.gstType === "CGST/SGST" ? (
                    <>
                      <td style={{ border: "1px solid black", padding: "8px" }}>₹ {sgst}</td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>₹ {cgst}</td>
                    </>
                  ) : (
                    <td colSpan="2" style={{ border: "1px solid black", padding: "8px" }}>
                      ₹{Number(igst).toFixed(2)}
                    </td>
                  )}
                  <td style={{ border: "1px solid black", padding: "8px" }}>₹{it.total.toFixed(2)}</td>
                </tr>
              );
            })}

            {/* Totals */}
            <tr>
              <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
                <b>Sub Total:</b>
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>₹{billData.subtotal.toFixed(2)}</td>
            </tr>

           {billData.gstType === "CGST/SGST" ? (
  <>
    <tr>
      <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
        <b>CGST:</b>
      </td>
      <td style={{ border: "1px solid black", padding: "8px" }}>₹{billData.cgstTotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
        <b>SGST:</b>
      </td>
      <td style={{ border: "1px solid black", padding: "8px" }}>₹{billData.sgstTotal.toFixed(2)}</td>
    </tr>
  </>
) : (
  <tr>
    <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
      <b>IGST:</b>
    </td>
    <td style={{ border: "1px solid black", padding: "8px" }}>₹{billData.igstTotal.toFixed(2)}</td>
  </tr>
)}

            <tr>
              <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
                <b>Discount:</b>
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                ₹{billData.discountAmount} (
                {billData.discountType === "percent" ? `${billData.discountValue}%` : "Flat"})
              </td>
            </tr>
            <tr>
              <td colSpan="8" style={{ textAlign: "right", border: "1px solid black", padding: "8px" }}>
                <b>TOTAL AMOUNT:</b>
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <b>₹{billData.grandTotal.toFixed(2)}</b>
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
        <h4 className="text-center mt-3">Thank you</h4>
      </div>

      <button className="btn btn-success mt-3 ml-2" onClick={handleShare}>
        📤 Share WhatsApp
      </button>
        <button className="btn btn-primary mt-3 ml-2" onClick={handlePrint}>
        🖨️ Print
      </button>
      <button className="btn btn-danger mt-3 ml-2" onClick={handleDownload}>
        ⬇️ Download
      </button>
    </div>
    </>
  );
}
