import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Demo = () => {
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [gstValue, setGstValue] = useState("");
  const [unit, setUnit] = useState("");
  const [hsn, setHsn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Product: ${productName}\nPrice: ${sellingPrice}\nGST: ${gstValue}%\nUnit: ${unit}\nHSN: ${hsn}`
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Product Form</h3>
      <Form onSubmit={handleSubmit}>
        {/* Product Name */}
        <Form.Group className="mb-3" controlId="formProductName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            className="w-50"   // ✅ Reduced width (50%)
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>

        {/* Selling Price */}
        <Form.Group className="mb-3" controlId="formSellingPrice">
          <Form.Label>Selling Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            className="w-50"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </Form.Group>

        {/* GST Value */}
        <Form.Group className="mb-3" controlId="formGstValue">
          <Form.Label>GST (%)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter GST percentage"
            className="w-25"   // ✅ Even smaller width
            value={gstValue}
            onChange={(e) => setGstValue(e.target.value)}
          />
        </Form.Group>

        {/* Unit */}
        <Form.Group className="mb-3" controlId="formUnit">
          <Form.Label>Pcs</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Kg, Piece"
            className="w-25"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </Form.Group>

        {/* HSN Code */}
        <Form.Group className="mb-3" controlId="formHsn">
          <Form.Label>HSN Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter HSN code"
            className="w-25"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Demo;
