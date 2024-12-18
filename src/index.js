import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./style/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Create root element for React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Performance measurement
reportWebVitals(); // You can pass a function like reportWebVitals(console.log) if you want to log metrics
