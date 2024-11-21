import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddDiscreteDiscount = ({ show, handleClose, handleSave }) => {
  const [addedDiscount, setAddedDiscount] = useState({
    discountName: "",
    description: "",
    discountRate: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddedDiscount({ ...addedDiscount, [name]: value });
  };

  const transformToJSONDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const [date, time] = dateTimeStr.split("T");
    return `${date} ${time}:00`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!addedDiscount.discountName.trim())
      newErrors.discountName = "Discount name is required.";
    if (!addedDiscount.description.trim())
      newErrors.description = "Description is required.";
    if (!addedDiscount.discountRate || !addedDiscount.discountRate.trim())
      newErrors.discountRate = "Valid discount rate is required.";
    //check discount rate in range 0.1-100
    if (
      Number(addedDiscount.discountRate) <= 0 ||
      Number(addedDiscount.discountRate) > 100
    )
      newErrors.discountRate = "Discount rate must be in range 0 to 100.";
    if (!addedDiscount.startDate)
      newErrors.startDate = "Start date is required.";
    if (!addedDiscount.endDate) newErrors.endDate = "End date is required.";

    //check start date after end date
    if (new Date(addedDiscount.startDate) >= new Date(addedDiscount.endDate))
      newErrors.dateRange = "Start date must be before end date.";

    //check the end date is not before end date
    const currentDateTime = new Date();
    if (new Date(addedDiscount.endDate) < currentDateTime)
      newErrors.endDate =
        "End date cannot be before the current date and time.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Transform startDate and endDate to the desired format
      const transformedDiscount = {
        ...addedDiscount,
        startDate: transformToJSONDateTime(addedDiscount.startDate),
        endDate: transformToJSONDateTime(addedDiscount.endDate),
      };
      handleSave(transformedDiscount);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Discrete Discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="discountName">
            <Form.Label>Discount Name</Form.Label>
            <Form.Control
              type="text"
              name="discountName"
              value={addedDiscount.discountName}
              onChange={handleChange}
              placeholder="Enter discount name"
              isInvalid={!!errors.discountName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.discountName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={addedDiscount.description}
              onChange={handleChange}
              placeholder="Enter description"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="discountRate">
            <Form.Label>Discount Rate</Form.Label>
            <Form.Control
              type="number"
              name="discountRate"
              value={addedDiscount.discountRate}
              onChange={handleChange}
              placeholder="Enter discount rate"
              isInvalid={!!errors.discountRate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.discountRate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              value={addedDiscount.startDate}
              onChange={handleChange}
              isInvalid={!!errors.startDate || !!errors.dateRange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.startDate || errors.dateRange}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={addedDiscount.endDate}
              onChange={handleChange}
              isInvalid={!!errors.endDate || !!errors.dateRange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.endDate || errors.dateRange}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="px-2 py-2">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="px-4 py-2">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDiscreteDiscount;
