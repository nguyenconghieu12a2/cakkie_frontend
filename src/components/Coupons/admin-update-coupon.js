import Form from "react-bootstrap/Form"

function EditCoupon() {
  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Code</Form.Label>
          <Form.Control type="text" value={"SU24"} autoFocus />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>Coupon Name</Form.Label>
          <Form.Control type="text" value={"Summer 2024"} autoFocus />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="text" value={"10"} autoFocus />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label>Price Discount</Form.Label>
          <Form.Control type="text" value={"10000"} autoFocus />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label>Start Date</Form.Label>
          <Form.Control value={"10/12/2024"} autoFocus />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label>End Date</Form.Label>
          <Form.Control value={"15/12/2024"} autoFocus />
        </Form.Group>
      </Form>
    </>
  );
}

export default EditCoupon;
