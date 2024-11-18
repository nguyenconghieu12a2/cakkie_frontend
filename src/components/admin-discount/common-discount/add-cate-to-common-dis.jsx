import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddCategoryToCommon = ({
  show,
  handleClose,
  handleAddCategory,
  notAppliedCate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(Number(e.target.value));
    console.log("Selected category ID:", e.target.value);
  };

  const handleSubmit = () => {
    // Find the selected category by ID
    const category = notAppliedCate.find(
      (nac) => nac.cateId === selectedCategory
    );

    console.log("Category found:", category); // Debugging the category found

    if (category) {
      handleAddCategory(category);
    } else {
      console.log("No category selected or invalid category"); // Debugging the error case
    }

    handleClose(); // Close modal after submission
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Category to Common Discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="categorySelect">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Select a category"
            >
              <option value="">Select a category</option>
              {notAppliedCate.map((nac) => (
                <option key={nac.cateId} value={nac.cateId}>
                  {nac.cateName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={!selectedCategory || selectedCategory === ""}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCategoryToCommon;
