import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Header.css";

const MyComponent = () => {
  return (
    <Navbar className="custom-navbar" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">
          <img src="./images/logo.jpg" className="logo"></img>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Cakkie</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyComponent;
