import React from "react";
import "../../styles/dashboard/dashboard.css";

const Card = ({ title, value, description, icon, color }) => {
  return (
    <div
      className="card shadow-sm p-3 mb-5 rounded"
      style={{ width: "15rem", background: "#E4E4E4" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 style={{ width: "15rem", color: "#E5A80B", fontWeight: "bold" }}>
            {title}
          </h5>
          <h2 className="value-report">{value}</h2>
          {/* <p style={{ color }}>{description}</p> */}
        </div>
        <div className="icon">
          <i className={`bi ${icon} fs-1`}></i>
        </div>
      </div>
    </div>
  );
};

export default Card;
