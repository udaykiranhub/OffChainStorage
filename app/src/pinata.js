import React, { useState } from "react";
import { Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import "./pinata.css";

const UploadToIPFS = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  // Pinata API credentials
  const pinataApiKey = "75c526e04508ec0f932a";
  const pinataSecretKey =
    "9ef8f4375fb7fbf5a5644330bcf8cd8af15c0c7d69b2c54fe1a2c78a4144b1ec";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Metadata (optional)
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    try {
      setUploadStatus("Uploading to IPFS...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        },
        body: formData,
      });

      const result = await response.json();
      setIpfsHash(result.IpfsHash);
      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file. Please try again.");
    }
  };

return (
<Row className="justify-content-center mt-5">

    <Col md={6} sm={12} lg={5}>
   
    <Card className="card">
    <Card.Header className="bg-primary text-white text-center">
            <h4>Store Profile in IPFS</h4>
        </Card.Header>
     <Card.Body>
           
            <Form onSubmit={handleUpload}>
              <Form.Group controlId="file" className="mb-3">
                <Form.Label>Select File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  className="border-primary"
                />
              </Form.Group>
        <div className="text-center">
             <Button type="submit" variant="success">
                  Upload
            </Button>
              </div>
            </Form>
     </Card.Body>
     {uploadStatus && (
     <Alert className="m-3 text-center" variant="info">
              {uploadStatus}
            </Alert>
          )}
        {ipfsHash && (
         <div className="text-center p-3">
           <h5>IPFS Hash:</h5>
              <a  href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer"
            className="text-primary" >
          
             {ipfsHash}
              </a>
         <h5 style={{color:"red"}}>See Your profile</h5>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default UploadToIPFS;
