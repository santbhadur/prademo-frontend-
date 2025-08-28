// src/pages/EditBill.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/bills/${id}`)
      .then((res) => res.json())
      .then((data) => setBill(data));
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/bills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    });
    navigate("/table");
  };

  if (!bill) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Bill</h2>
      <input
        type="text"
        value={bill.customerName}
        onChange={(e) => setBill({ ...bill, customerName: e.target.value })}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
