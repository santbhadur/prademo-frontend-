import React, { useState, useEffect } from "react";

export default function CreateBill() {
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
