import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "../../styles/productAdd.css";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import AddDescriptionTitle from "./admin-add-description";

function AddModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <>
      <Form>
        <Container>
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" autoFocus />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Category Name</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="addProduct__size">Size</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  id="addProduct__size"
                >
                  <option value="1">M</option>
                  <option value="2">L</option>
                  <option value="3">XL</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Product Image</Form.Label>
                <Form.Control type="file" autoFocus />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Product Item Image</Form.Label>
                <Form.Control type="file" autoFocus />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Quantity in Stock</Form.Label>
                <Form.Control type="text" autoFocus />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" autoFocus />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="btn__create--des mt-3">
                <Modal show={show} onHide={handleClose}>
                  <AddDescriptionTitle />
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleClose}
                      className="btn__create"
                    >
                      Create
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default AddModal;
