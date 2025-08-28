import React, { useState, useEffect } from "react";
import Main from "./page/Main"; // Navbar और sidebar वाला component
import { Table, Form, Button, InputGroup } from "react-bootstrap";


export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !stock) {
      alert("⚠️ Please fill all fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stock: parseInt(stock), unit }),
      });
      if (res.ok) {
        alert("✅ Product added");
        setName("");
        setStock("");
        setUnit("pcs");
        fetchProducts();
      } else {
        alert("❌ Error adding product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Main />
      <div className="container mt-3 p-3 shadow rounded bg-light">
        <h4 className="text-primary mb-3">🛒 Inventory Management</h4>

        <Form onSubmit={handleAddProduct} className="mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <Form.Control
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="gram">gram</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Button type="submit" className="w-100">
                Add Product
              </Button>
            </div>
          </div>
        </Form>

        {/* Products Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.stock}</td>
                <td>{p.unit}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
