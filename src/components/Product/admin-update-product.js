import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../styles/productUpdate.css";

function UpdateProduct() {
  
  return (
    <>
      <Form>
        <Container>
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                htmlFor="update__name"
              >
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" autoFocus id="update__name" value={"Chocolate Cake"}/>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>Category Name</Form.Label>
                <Form.Select aria-label="Default select example">
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
              >
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} value={"Socola ngon"}/>
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
              >
                <Form.Label>Product Image</Form.Label>
                <Form.Control type="file" autoFocus/>
                <img className="cake__image" alt="Cake"/>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Product Item Image</Form.Label>
                <Form.Control type="file" autoFocus />
                <img  alt="Cake" className="cake__image"/>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>Quatity in Stock</Form.Label>
                <Form.Control type="text" autoFocus/>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" autoFocus />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Wight</Form.Label>
                <Form.Control type="text" autoFocus value={"500grams"}/>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default UpdateProduct;
