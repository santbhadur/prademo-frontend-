import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Offcanvas, Nav } from "react-bootstrap";
import "../App.css";
import Loader from "../Loader";
import Switch from "@mui/material/Switch";

export default function Main() {
  const [show, setShow] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); // ✅ current route lene ke liye

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);

    if (newChecked) {
      navigate("/All-Gst-Bills"); 
    } else {
      navigate("/"); 
    }
  };

  // ✅ Route ke hisaab se switch ki state sync karega
  useEffect(() => {
    if (location.pathname === "/All-Gst-Bills") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetch("https://prademo-bankend-x6ny.vercel.app/api/logo")
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setLogoUrl(data.url);
        }
      })
      .catch((err) => console.error("Error fetching logo:", err));

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
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

          <button className="btn btn-light d-lg-none" onClick={handleShow}>
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

            {/* ✅ Switch */}
            <Nav.Item className="mb-2">
              <span>Non-GST</span>
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <span>GST</span>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
