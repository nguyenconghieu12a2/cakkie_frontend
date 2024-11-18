import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const apiEditDiscrete = "/api/admin/edit-discrete-discount";

const EditDiscreteDiscount = ({ show, handleClose, discount, fetchData }) => {
  const { discountCategoryId } = useParams();
  const [editedDiscount, setEditedDiscount] = useState({
    id: "",
    discountName: "",
    description: "",
    discountRate: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");

  // Function to transform datetime from dd-mm-yyyy hh-mm-ss to yyyy-mm-ddThh:mm:ss
  const transformToDateTimeLocal = (dateTimeStr) => {
    if (!dateTimeStr) return ""; // Handle empty input gracefully

    // Split the date and time components
    const [date, time] = dateTimeStr.split(" ");

    if (!date || !time) return ""; // Handle cases where date or time is missing

    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split("-"); // Use only hours and minutes

    // Validate that all required components are present
    if (!day || !month || !year || !hours || !minutes) return "";

    // Return the formatted string in "yyyy-MM-ddTHH:mm"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const transformToJSONDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";

    const [date, time] = dateTimeStr.split("T"); // Split into date and time
    return `${date} ${time}:00`; // Combine into "yyyy-MM-dd HH:mm:ss"
  };

  useEffect(() => {
    if (discount) {
      setEditedDiscount({
        id: discount.discountId || "",
        discountName: discount.discountName || "",
        description: discount.description || "",
        discountRate:
          typeof discount.discountRate === "string"
            ? parseFloat(discount.discountRate.replace("%", "")) || 0
            : discount.discountRate || 0, // Handle number directly
        startDate: transformToDateTimeLocal(discount.startDate),
        endDate: transformToDateTimeLocal(discount.endDate),
      });
    }
  }, [discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    // check if any input is empty or consists of only whitespace
    if (!editedDiscount.discountName.trim()) {
      return "Discount Name are required and cannot be empty or just whitespace.";
    }

    if (!editedDiscount.description.trim()) {
      return "Description are required and cannot be empty or just whitespace.";
    }
    if (editedDiscount.discountRate === "") {
      return "Discount Rate are required and cannot be empty or just whitespace.";
    }

    // check if discount rate is between 0 and 100
    if (editedDiscount.discountRate <= 0 || editedDiscount.discountRate > 100) {
      return "Discount rate must be in range 0 to 100.";
    }

    // check if start date is after the end date
    const transformedStartDate = transformToJSONDateTime(
      editedDiscount.startDate
    );
    const transformedEndDate = transformToJSONDateTime(editedDiscount.endDate);

    if (new Date(transformedStartDate) > new Date(transformedEndDate)) {
      return "Start date cannot be later than end date.";
    }

    // check if end date is before the current date
    const currentDate = new Date();
    if (new Date(transformedEndDate) < currentDate) {
      return "End date cannot be before the current date.";
    }

    return ""; // No errors
  };

  const handleSave = async () => {
    const validationError = validateInputs();

    if (validationError) {
      setError(validationError);
      return;
    }

    const transformedStartDate = transformToJSONDateTime(
      editedDiscount.startDate
    );
    const transformedEndDate = transformToJSONDateTime(editedDiscount.endDate);

    setError(""); //clear previous error

    try {
      const payload = {
        id: editedDiscount.id,
        name: editedDiscount.discountName,
        description: editedDiscount.description,
        discountRate: editedDiscount.discountRate,
        startDate: transformedStartDate,
        endDate: transformedEndDate,
      };

      const response = await axios.put(
        `${apiEditDiscrete}/${editedDiscount.id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        if (fetchData) fetchData(discountCategoryId); // Reload the data
        handleClose(); // Close the modal after successful save
      } else {
        console.error("Error updating discount:", response.data);
      }
    } catch (error) {
      console.error("Error saving updated discount:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Discrete Discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group className="mb-3" controlId="discountName">
            <Form.Label>Discount ID</Form.Label>
            <Form.Control
              type="text"
              name="discountId"
              value={editedDiscount.id}
              onChange={handleChange}
              placeholder="Enter discount Id"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="discountName">
            <Form.Label>Discount Name</Form.Label>
            <Form.Control
              type="text"
              name="discountName"
              value={editedDiscount.discountName}
              onChange={handleChange}
              placeholder="Enter discount name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={editedDiscount.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="discountRate">
            <Form.Label>Discount Rate</Form.Label>
            <Form.Control
              type="number"
              name="discountRate"
              value={editedDiscount.discountRate}
              onChange={handleChange}
              placeholder="Enter discount rate"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              value={editedDiscount.startDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={editedDiscount.endDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDiscreteDiscount;
