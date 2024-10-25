import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import "../../styles/dashboard/dashboard.css";

const dataBar = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      //   label: "Monthly Orders",
      backgroundColor: [
        "#4E79A7",
        "#EFCB68",
        "#F28E2C",
        "#D43D51",
        "#4E79A7",
        "#EFCB68",
        "#F28E2C",
        "#D43D51",
        "#4E79A7",
        "#EFCB68",
        "#F28E2C",
        "#D43D51",
      ],
      data: [12, 19, 3, 5, 2, 3, 36, 7, 3, 14, 9, 33],
    },
  ],
};

const optionsBar = {
  plugins: {
    title: {
      display: true,
      text: "Monthly Orders", // Chart title
      font: {
        size: 20,
      },
    },
    legend: {
      display: false, // Completely hide the label
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Months", // X axis label
      },
    },
    y: {
      title: {
        display: true,
        text: "Number Of Orders", // Y axis label
      },
    },
  },
};

const dataLine = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      // label: "Monthly Users Account Created",
      fill: false,
      backgroundColor: "#36A2EB",
      borderColor: "#36A2EB",
      data: [65, 59, 80, 81, 56, 55, 76, 34, 13, 56, 78, 36],
    },
  ],
};

const optionsLine = {
  plugins: {
    title: {
      display: true,
      text: "Monthly Users Account Created", // Chart title
      font: {
        size: 20,
      },
    },
    legend: {
      display: false, // Completely hide the label
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Months", // X axis label
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Users", // Y axis label
      },
    },
  },
};

const Chart = () => {
  return (
    <div className="chart-container">
      <Row>
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <Bar data={dataBar} options={optionsBar} />
          </div>
        </Col>
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <Line data={dataLine} options={optionsLine} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Chart;
