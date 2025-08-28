import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Offcanvas, Nav } from "react-bootstrap";
import "../App.css"; // Custom CSS import

export default function Main() {
  const [show, setShow] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    return <p>...Loading</p>;
  }

  return (
    <>
      {/* Header */}
      <Navbar expand="lg" className="custom-navbar shadow-sm">
        <Container fluid>
          <div className="d-flex align-items-center">
            <img src={logoUrl} alt="Logo" style={{ height: "50px" }} />
            <h4 className="text mb-0 ms-2 text-white">
              Shree Bhagti Bhandar Gem Stone
            </h4>
          </div>

          {/* Toggle button for mobile */}
          <button
            className="btn btn-light d-lg-none"
            onClick={handleShow}
          >
            ☰
          </button>
        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="lg"
        className="custom-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="sidebar-title">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column sidebar-links">
            <Nav.Item className="mb-2">
              <NavLink to="/" className="sidebar-link">
                ➕ Create Bill
              </NavLink>
            </Nav.Item>

            <Nav.Item className="mb-2">
              <NavLink to="/All-Gst-Bills" className="sidebar-link">
                Create GST Bill
              </NavLink>
            </Nav.Item>

            <Nav.Item className="mb-2">
              <NavLink to="/Add-Logo" className="sidebar-link">
                Add Logo
              </NavLink>
            </Nav.Item>

            <Nav.Item className="mb-2">
              <NavLink to="/settings" className="sidebar-link settings-link">
                ⚙️ Settings
              </NavLink>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
