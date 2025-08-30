import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Main from "../page/Main";

export default function Logo() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
   const [logoUrl, setLogoUrl] = useState("");
  // ✅ Page load hone par latest logo fetch karo

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);

    try {
      const res = await axios.post("https://prademo-bankend-x6ny.vercel.app/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Image uploaded successfully!");
      setUploadedFile(res.data.filePath); // ✅ uploaded image ka path save karo
      fileInputRef.current.value = ""; // ✅ input box reset
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    }
  };



  return (
     <>
          <Main />
          <div className="container test m-2">
      <h1 className="mb-3 text-primary fw-bold">Upload Logo</h1>
      <Form onSubmit={handleUpload}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Logo</Form.Label>
          <Form.Control
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Upload
        </Button>
      </Form>

    <img
      src={logoUrl}
      alt="Company Logo"
      style={{ width: "200px", display: "block", margin: "20px auto" }}
    />
      
    
    </div>
    </>
  );
}
