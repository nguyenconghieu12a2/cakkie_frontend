import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/Header.css";

const Header = ({ Title }) => {
  return (
    <Navbar className="custom-navbar" data-bs-theme="dark">
      <Container className="header">
        <Navbar.Brand href="#home">
          <img src="./images/logos.jpg" className="logo" href="#" alt="a pic"/>
        </Navbar.Brand>
        <Nav className="me-auto    nav">
          <Nav href="#home" className="logoName">CAKKIE</Nav>
          <Nav href="#Title">{Title}</Nav>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
