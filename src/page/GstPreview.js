import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import defaultLogo from "../Images/logo1.jpeg";
import Main from "../page/Main";

export default function GstPreview() {
  const contentRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const billData = location.state?.billData;
  const [logoUrl, setLogoUrl] = useState("");

  // 🔹 Helper Function to format numbers
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "";
  return Number(num) % 1 === 0 ? String(Number(num)) : Number(num).toFixed(2);
};

  useEffect(() => {
    fetch("https://prademo-bankend-x6ny.vercel.app/api/logo")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
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

  const handleDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "BhagtiBhandar.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

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
        iframe.contentWindow.print();
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
      <div className="container test mt-3">
        <div ref={contentRef} className="invoice-container">
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                {/* Header */}
                <tr>
                  <td colSpan="10" className="p-2">
                    <h4 className="text-center">Invoice</h4>
                    <div className="d-flex align-items-center flex-wrap">
                      <img
                        src={ defaultLogo}
                        alt="Company Logo"
                        style={{ height: "70px", marginRight: "10px" }}
                      />
                      <div style={{ fontSize: "14px" }}>
                        <h5 className="mb-0">Shree Bhagti Bhandar Gem Stone</h5>
                        <p className="mb-0">
                          142 Exculess shopping space, Bhimrad Althan, Surat
                          Gujarat 395017
                        </p>
                        <p className="mb-0">Mobile: 9054498684</p>
                        <p className="mb-0">GSTIN: __________________</p>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Bill Info */}
                <tr>
                  <td colSpan="5" className="p-2">
                    <h6>Bill Details</h6>
                  </td>
                  <td colSpan="5" className="p-2">
                    <h6>Bill To</h6>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="p-2">
                    <p className="mb-0">Bill No: {billData.billNumber}</p>
                    <p className="mb-0">Bill Date: {billData.billDate}</p>
                    <p className="mb-0">Bill Type: {billData.gstType}</p>
                  </td>
                  <td colSpan="5" className="p-2">
                    <p className="mb-0">Customer: {billData.customerName}</p>
                    <p>Mobile: {billData.phoneNumber}</p>
                  </td>
                </tr>

                {/* Table Headers */}
                <tr>
                  <th>No</th>
                  <th>Item Name</th>
                  <th>HSN/SAC</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Taxable</th>
                  {billData.gstType === "CGST/SGST" ? (
                    <>
                      <th>CGST</th>
                      <th>SGST</th>
                    </>
                  ) : (
                    <th colSpan="2">IGST</th>
                  )}
                  <th>Amount</th>
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
                      <td>{idx + 1}</td>
                      <td>{it.itemName}</td>
                      <td>123456</td>
                      <td>
                        {it.qty} {it.unit}
                      </td>
                      <td>₹{it.price}</td>
                      <td>₹{it.taxable?.toFixed(2)}</td>
                      {billData.gstType === "CGST/SGST" ? (
                        <>
                          <td>₹{sgst}</td>
                          <td>₹{cgst}</td>
                        </>
                      ) : (
                        <td colSpan="2">₹{Number(igst).toFixed(2)}</td>
                      )}
                      <td>₹{formatNumber(it.total)}</td>
                    </tr>
                  );
                })}

                {/* Totals */}
                <tr>
                  <td colSpan="8" className="text-end fw-bold">
                    Sub Total:
                  </td>
                  <td>₹{formatNumber(billData.subtotal)}</td>
                </tr>

                {billData.gstType === "CGST/SGST" ? (
                  <>
                    <tr>
                      <td colSpan="8" className="text-end fw-bold">
                        CGST:
                      </td>
                      <td>₹{formatNumber(billData.cgstTotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan="8" className="text-end fw-bold">
                        SGST:
                      </td>
                      <td>₹{formatNumber(billData.sgstTotal)}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="8" className="text-end fw-bold">
                      IGST:
                    </td>
                    <td>₹{formatNumber(billData.igstTotal)}</td>
                  </tr>
                )}

                <tr>
                  <td colSpan="8" className="text-end fw-bold">
                    Discount:
                  </td>
                  <td>
                    ₹{formatNumber(billData.discountAmount)} (
                    {formatNumber(billData.discountType) === "percent"
                      ? `${formatNumber(billData.discountValue)}%`
                      : "Flat"}
                    )
                  </td>
                </tr>

                <tr>
                  <td colSpan="8" className="text-end fw-bold">
                    TOTAL:
                  </td>
                  <td>
                    <b>₹{formatNumber(billData.grandTotal)}</b>
                  </td>
                </tr>

                {/* Signature */}
                <tr>
                  <td colSpan="5"></td>
                  <td colSpan="5" className="text-center">
                    <p>Authorized Signatory</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h5 className="text-center mt-3">Thank you</h5>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          <button className="btn btn-success" onClick={handleShare}>
            📤 Share WhatsApp
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="btn btn-danger" onClick={handleDownload}>
            ⬇️ Download
          </button>
        </div>
      </div>
    </>
  );
}
