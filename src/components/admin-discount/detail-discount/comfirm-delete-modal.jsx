import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Remotion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove the current category?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleConfirm}>
          Yes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
