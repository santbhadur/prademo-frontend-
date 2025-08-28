import React, { useState, useEffect } from "react";

export default function CreateBill() {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/logo")
      .then((res) => res.json())
      .then((data) => {
        if (data.filePath) {
          setLogoUrl("http://localhost:5000" + data.filePath);
        }
      })
      .catch((err) => console.error("Error fetching logo:", err));
  }, []);

  if (!logoUrl) {
    return <p>No logo found</p>;
  }

  return (
    <img
      src={logoUrl}
      alt="Company Logo"
      style={{ width: "200px", display: "block", margin: "20px auto" }}
    />
  );
}
