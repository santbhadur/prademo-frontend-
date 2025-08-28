import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../Images/logo.png";
import Main from "../page/Main";

export default function ViewBill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
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

  useEffect(() => {
    const fetchBill = async () => {
      const res = await fetch(`https://prademo-bankend-zojh.vercel.app/api/bills/${id}`);
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
      <table className="" style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      colSpan="6"
                    style={{ border: "1px solid black", padding: "10px" }}>
                      <h4 className="Details text-center">Bill Details</h4>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        style={{ height: 80, marginRight: "20px" }}
                      />   
                      <div style={{ fontSize:"14px"}}>
                        <h4 className=" Details text mb-0">Shree Bhagti Bhandar Gem Stone</h4>
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
                          <p className="mb-0">Bil No: {bill.billNumber}</p>
                         <p className="mb-0">Bill Date: {new Date(bill.billDate).toLocaleDateString("en-GB")}</p>
                          <p className="mb-0">Bill type</p>
                      </div>
                  </td>
                  <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                      <div>
                          <p className="mb-0">Constomer Name: {bill.customerName}</p>
                          <p >Mobile: {bill.phoneNumber}</p>
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
                  {bill.items.map((it, idx) => (
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
                    <td style={{ border: "1px solid black", paddingLeft: "8px" }}>₹{bill.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "right", border: "1px solid black", paddingLeft: "8px" }}>
                      <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>Discount:</b>
                    </td>
                    <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                      ₹{bill.discountAmount} (
                      {bill.discountType === "percent"
                        ? `${bill.discountValue}%`
                        : "Flat"}
                      )
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "right", border: "1px solid black" }}>
                      <b style={{ marginLeft: "5px", paddingLeft: "8px" }}>TOTAL AMOUNT:</b>
                    </td>
                    <td style={{ border: "1px solid black", paddingLeft: "8px" }}>
                      <b>₹{bill.grandTotal.toFixed(2)}</b>
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
                    
      <Link to="/" className="mt-2 btn btn-secondary">Back</Link>
    </div>
    </>
  );
}
