import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function AddDescriptionTitle() {
  const [_, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Add Product Description Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label htmlFor="description__value">Weight</Form.Label>
            <Form.Control type="text" value="120grams" autoFocus id="description__value"/>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
}

export default AddDescriptionTitle;
