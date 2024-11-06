import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";

function UpdateOrder() {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    // Fetch the cities data when the component mounts
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the data", error);
      });
  }, []);

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict(""); // Reset district and wards when city changes
    setWards([]);
    if (cityId) {
      const city = cities.find((c) => c.Id === cityId);
      setDistricts(city?.Districts || []);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setWards([]);
    if (districtId) {
      const district = districts.find((d) => d.Id === districtId);
      setWards(district?.Wards || []);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Form.Label htmlFor="order__status">Order Status</Form.Label>
            <Form.Select aria-label="Order status select" id="order__status">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Form.Label htmlFor="address">Customer Address</Form.Label>
          <Col>
            <Form.Select
              aria-label="City select"
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value={""}>Choose your city</option>
              {cities.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Select
              aria-label="District select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedCity}
            >
              <option value={""}>Choose your district</option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Select
              aria-label="Ward select"
              value={selectedWard}
              onChange={handleWardChange}
              disabled={!selectedDistrict}
            >
              <option value={""}>Choose your ward</option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label htmlFor="user__phone">User Phone</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              aria-describedby="user__phone"
            />
            <Form.Text id="user__phone" muted></Form.Text>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label htmlFor="user__email">User Email</Form.Label>
            <Form.Control
              type="email"
              id="inputPassword5"
              aria-describedby="user__email"
            />
            <Form.Text id="user__email" muted></Form.Text>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UpdateOrder;
