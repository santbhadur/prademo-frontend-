import React from "react";
import logo from "../Images/logo.png";

export default function Table() {
  return (
    <div className="container mt-5">
      <table style={{ borderCollapse: "collapse", width: "80%" }}>
        <tbody>
       
          <tr>
            <td
              colSpan="6"
              style={{ border: "1px solid black", padding: "10px" }}
            >
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
                    <p className="mb-0">Bil No: 1</p>
                    <p className="mb-0">Bill Date</p>
                    <p className="mb-0">Bill type</p>
                </div>
            </td>
            <td colSpan="3" style={{ border: "1px solid black", padding: "8px" }}>
                <div>
                    <p className="mb-0">Constomer Name</p>
                    <p >Mobile</p>
                </div>
            </td>
            
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>No</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>Item Name</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>Pcs</td>
            <td colSpan="1" style={{ border: "1px solid black", padding: "10px" }}>Rate</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>Amount</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
