import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import "../../styles/dashboard/dashboard.css";
import axios from "axios";

const api1 = "/api/admin/chart-orders";
const api2 = "/api/admin/chart-customers";
const api3 = "/api/admin/min-max-year-orders";
const api4 = "/api/admin/min-max-year-customers";

const Chart = () => {
  const currentYear = new Date().getFullYear();
  const [chartOrder, setChartOrder] = useState([]);
  const [chartCustomer, setChartCustomer] = useState([]);
  const [minmaxYearOrder, setMinmaxYearOrder] = useState({});
  const [minmaxYearCustomer, setMinmaxYearCustomer] = useState({});
  const [selectedYearOrder, setSelectedYearOrder] = useState(currentYear);
  const [selectedYearCustomer, setSelectedYearCustomer] = useState(currentYear);
  const [error, setError] = useState(null);

  const fetchYearOrder = async () => {
    try {
      const response = await axios.get(`${api3}`);
      setMinmaxYearOrder(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchYearCustomer = async () => {
    try {
      const response = await axios.get(`${api4}`);
      setMinmaxYearCustomer(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChartOrder = async (year) => {
    try {
      const response = await axios.get(`${api1}/${year}`);
      setChartOrder(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChartCustomer = async (year) => {
    try {
      const response = await axios.get(`${api2}/${year}`);
      setChartCustomer(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchYearOrder();
    fetchYearCustomer();
  }, []);

  useEffect(() => {
    if (selectedYearOrder) {
      fetchChartOrder(selectedYearOrder);
    }
  }, [selectedYearOrder]);

  useEffect(() => {
    if (selectedYearCustomer) {
      fetchChartCustomer(selectedYearCustomer);
    }
  }, [selectedYearCustomer]);

  const handleYearOrderChange = (event) => {
    setSelectedYearOrder(event.target.value);
  };

  const handleYearCustomerChange = (event) => {
    setSelectedYearCustomer(event.target.value);
  };

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
        data: chartOrder,
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
        data: chartCustomer,
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
        ticks: {
          precision: 0, // Ensure that only integer values are shown
          stepSize: 1, // Ensure that each tick increment is 1
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Row>
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <select
              style={{ marginLeft: "40px", padding: "5px 5px"}}
              name="yearOrder"
              onChange={handleYearOrderChange}
              value={selectedYearOrder}
            >
              {minmaxYearOrder.minYear &&
                minmaxYearOrder.maxYear &&
                Array.from(
                  {
                    length:
                      minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1,
                  },
                  (v, i) => minmaxYearOrder.minYear + i
                ).map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
            </select>
            <Bar data={dataBar} options={optionsBar} />
          </div>
        </Col>
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <select
              style={{ marginLeft: "50px", padding: "5px 5px" }}
              name="yearCustomer"
              onChange={handleYearCustomerChange}
              value={selectedYearCustomer}
            >
              {minmaxYearCustomer.minYear &&
                minmaxYearCustomer.maxYear &&
                Array.from(
                  {
                    length:
                      minmaxYearCustomer.maxYear -
                      minmaxYearCustomer.minYear +
                      1,
                  },
                  (v, i) => minmaxYearCustomer.minYear + i
                ).map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
            </select>
            <Line data={dataLine} options={optionsLine} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Chart;
