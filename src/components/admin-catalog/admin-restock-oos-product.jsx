import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/admin-catalog/admin-restock-oos.css';

const RestockModal = ({ show, handleClose, productName }) => {
  const [stock, setStock] = useState(0);

  const handleSave = () => {
    // Handle save logic here (e.g., API call)
    console.log(`Restocked ${productName} with ${stock} items.`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Restock Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="stock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestockModal;
