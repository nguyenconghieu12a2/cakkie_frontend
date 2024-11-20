import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "../styles/best-seller.css";

const apiBestSeller = "/api/best-seller";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  const fetchBestSeller = async () => {
    try {
      const response = await axios.get(`${apiBestSeller}`);
      setBestSeller(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBestSeller();
  }, []);

  return (
    <div>
      <div className="bs-title-div">
        <h2 style={{ marginBottom: "0px" }}>Best Seller</h2>
      </div>
      <Container>
        <Row>
          {bestSeller.map((bs, i) => (
            <Col xl={3} md={6} sm={12}>
              <Link
                to={`/product/${bs.productId}`}
                style={{ textDecoration: "none", color: "black" }}
                state={{ userId: 1 }}
                key={bs.productId}
                className="flex flex-col items-center w-full h-full p-2"
              >
                <Card style={{ width: "100%", marginBottom: "20px" }}>
                  <Card.Img
                    variant="top"
                    src={`./${bs.productImage}.jpg`}
                    alt="image"
                    className="image"
                  />
                  <Card.Body>
                    <Card.Title className="bs-title text-truncate">
                      {bs.productName}
                    </Card.Title>
                    <Card.Text className="bs-price">
                      <strong>Price: {bs.productPrice}</strong>
                    </Card.Text>
                    <div className="separation">
                      <div>
                        <strong>Rate: </strong>
                        <p className="rating">
                          {bs.productRating
                            ? bs.productRating.toFixed(1)
                            : "0.0"}
                        </p>
                        <FaStar className="rating" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
export default BestSeller;
