import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmReplaceModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Replace</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Replace current discount by this discount?</p>
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

export default ConfirmReplaceModal;
