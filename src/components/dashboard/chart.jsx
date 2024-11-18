import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import "../../styles/dashboard/dashboard.css";
import axios from "axios";

// day
const apiOrderDay = "/api/admin/chart-order-day";
const apiCustomerDay = "/api/admin/chart-customer-day";
//month
const apiOrderMonth = "/api/admin/chart-orders";
const apiCustomerMonth = "/api/admin/chart-customers";
const apiMinMaxYearOrder = "/api/admin/min-max-year-orders";
const apiMinMaxYearCustomer = "/api/admin/min-max-year-customers";
//quarterly
const apiOrderQuarter = "/api/admin/chart-order-quarter";
const apiCustomerQuarter = "/api/admin/chart-customer-quarter";
//year
const apiOrderYear = "/api/admin/chart-order-year";
const apiCustomerYear = "/api/admin/chart-customer-year";

const Chart = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const tenYearsAgo = currentYear - 10;
  const [orderDayInMonthOrder, setOrderDayInMonthOrder] = useState([]);
  const [orderDayInMonthCustomer, setOrderDayInMonthCustomer] = useState([]);
  const [chartOrderData, setChartOrderData] = useState([]);
  const [chartCustomerData, setChartCustomerData] = useState([]);
  // const [chartOrderMonth, setChartOrderMonth] = useState([]);
  // const [chartCustomerMonth, setChartCustomerMonth] = useState([]);
  const [minmaxYearOrder, setMinmaxYearOrder] = useState({});
  const [minmaxYearCustomer, setMinmaxYearCustomer] = useState({});
  // const [chartOrderYear, setChartOrderYear] = useState([]);
  // const [chartCustomerYear, setChartCustomerYear] = useState([]);
  const [selectedYearOrder, setSelectedYearOrder] = useState(currentYear);
  const [selectedYearCustomer, setSelectedYearCustomer] = useState(currentYear);
  const [selectedMonthOrder, setSelectedMonthOrder] = useState(currentMonth);
  const [selectedMonthCustomer, setSelectedMonthCustomer] = useState(currentMonth);
  const [viewOption, setViewOption] = useState("monthly"); // new state for view option
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try{
      if(viewOption === 'daily') {
        const orderResponse = await axios.get(`${apiOrderDay}/${selectedMonthOrder}/${selectedYearOrder}`);
        const customerResponse = await axios.get(`${apiCustomerDay}/${selectedMonthCustomer}/${selectedYearCustomer}`);
        setOrderDayInMonthOrder(orderResponse.data[0]?.dayset.map(ds => ds.days) || []);
        setOrderDayInMonthCustomer(customerResponse.data[0]?.dayset.map(ds => ds.days) || []);
        setChartOrderData(orderResponse.data[0]?.dayset.map(d => d.value) || []);
        setChartCustomerData(customerResponse.data[0]?.dayset.map(d => d.value) || []);
      }else if (viewOption === 'monthly'){
        const orderResponse = await axios.get(`${apiOrderMonth}/${selectedYearOrder}`);
        const customerResponse = await axios.get(`${apiCustomerMonth}/${selectedYearCustomer}`);
        setChartOrderData(orderResponse.data);
        setChartCustomerData(customerResponse.data);
      }else if(viewOption === 'quarterly'){
        const orderResponse = await axios.get(`${apiOrderQuarter}/${selectedYearOrder}`);
        const customerResponse = await axios.get(`${apiCustomerQuarter}/${selectedYearCustomer}`);
        setChartOrderData(orderResponse.data);
        setChartCustomerData(customerResponse.data);
      }else if (viewOption === 'yearly'){
        const orderResponse = await axios.get(`${apiOrderYear}`);
        const customerResponse = await axios.get(`${apiCustomerYear}`);
        setChartOrderData(orderResponse.data.map(y => y.value));
        setChartCustomerData(customerResponse.data.map(y => y.value));
      }
    }catch(err){
      setError(err.message);
    }
  }

  const fetchYearRange = async () =>{
    try{
      const orderYearResponse = await axios.get(`${apiMinMaxYearOrder}`);
      const customerYearResponse = await axios.get(`${apiMinMaxYearCustomer}`);
      setMinmaxYearOrder(orderYearResponse.data);
      setMinmaxYearCustomer(customerYearResponse.data);
    }catch(err){
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchYearRange();
  }, []);

  useEffect(() => {
    fetchData();
  }, [viewOption, selectedYearOrder, selectedYearCustomer, selectedMonthOrder, selectedMonthCustomer]);


  const handleViewOptionChange = (event) => {
    setViewOption(event.target.value);
  };

  const handleYearOrderChange = (event) => {
    setSelectedYearOrder(event.target.value);
  }

  const handleYearCustomerChange = (event) => {
    setSelectedYearCustomer(event.target.value);
  }

  const handleMonthOrderChange = (event) => {
    setSelectedMonthOrder(event.target.value);
  }

  const handleMonthCustomerChange = (event) => {
    setSelectedMonthCustomer(event.target.value);
  }

  // Define year range for yearly view
  const getYearRange = (maxYear) => {
    const startYear = Math.max(tenYearsAgo, maxYear - 10); // Ensure we go 10 years back or to the available min year
    return Array.from({ length: maxYear - startYear + 1 }, (_, i) => startYear + i);
  };

  const getLabelsOrder = () => {
    if (viewOption === "daily") {
      return orderDayInMonthOrder.map(day => day.toString());
    } else if (viewOption === "monthly") {
      // Monthly view option
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    } else if (viewOption === 'quarterly'){
      // Quarterly view option
      return ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
    } else if (viewOption === "yearly") {
      // Yearly view option
      return minmaxYearOrder.minYear && minmaxYearOrder.maxYear
        ? Array.from(
            { length: minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1 },
            (_, i) => (minmaxYearOrder.minYear + i).toString()
          )
        : [];
    }
  
    return [];
  };

  const getLabelsCustomer = () => {
    if (viewOption === "daily") {
      return orderDayInMonthCustomer.map(day => day.toString());
    } else if (viewOption === "monthly") {
      // Monthly view option
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    } else if (viewOption === 'quarterly'){
      // Quarterly view option
      return ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
    } else if (viewOption === "yearly") {
      // Yearly view option
      return minmaxYearOrder.minYear && minmaxYearOrder.maxYear
        ? Array.from(
            { length: minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1 },
            (_, i) => (minmaxYearOrder.minYear + i).toString()
          )
        : [];
    }
  
    return [];
  };

  const dataBar = {
    labels: getLabelsOrder(), // Set x-axis labels dynamically
    datasets: [
      {
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
        data: chartOrderData,
      },
    ],
  };
  
  const dataLine = {
    labels: getLabelsCustomer(), // Set x-axis labels dynamically
    datasets: [
      {
        fill: false,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        data: chartCustomerData,
      },
    ],
  };


  //old code here

  const renderFilters = () => {
    const yearRangeOrder = getYearRange(minmaxYearOrder.maxYear || currentYear);
    const yearRangeCustomer = getYearRange(minmaxYearCustomer.maxYear || currentYear);

    switch (viewOption) {
      case "daily":
        return (
          <>
             {/* Order Filters */}
             <Col md={6}>
              <label>Month:</label>
              <select className="sub-view-options" onChange={handleMonthOrderChange} value={selectedMonthOrder}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1} >
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <label>Year:</label>
              <select className="sub-view-options" onChange={handleYearOrderChange} value={selectedYearOrder}>
                {minmaxYearOrder.minYear && minmaxYearOrder.maxYear &&
                  Array.from(
                    { length: minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1 },
                    (v, i) => minmaxYearOrder.minYear + i
                  ).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Col>

            {/* Customer Filters */}
            <Col md={6}>
              <label>Month:</label>
              <select className="sub-view-options" onChange={handleMonthCustomerChange} value={selectedMonthCustomer}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <label>Year:</label>
              <select className="sub-view-options" onChange={handleYearCustomerChange} value={selectedYearCustomer}>
                {minmaxYearCustomer.minYear && minmaxYearCustomer.maxYear &&
                  Array.from(
                    { length: minmaxYearCustomer.maxYear - minmaxYearCustomer.minYear + 1 },
                    (v, i) => minmaxYearCustomer.minYear + i
                  ).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Col>
          </>
        );
      case "monthly":
        return (
          <>
          {/* Order Year Filter */}
          <Col md={6}>
            <label>Year:</label>
              <select className="sub-view-options" onChange={handleYearOrderChange} value={selectedYearOrder}>
                {minmaxYearOrder.minYear && minmaxYearOrder.maxYear &&
                  Array.from(
                    { length: minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1 },
                    (v, i) => minmaxYearOrder.minYear + i
                  ).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Col>

            {/* Customer Year Filter */}
            <Col md={6}>
              <label>Year:</label>
              <select className="sub-view-options" onChange={handleYearCustomerChange} value={selectedYearCustomer}>
                {minmaxYearCustomer.minYear && minmaxYearCustomer.maxYear &&
                  Array.from(
                    { length: minmaxYearCustomer.maxYear - minmaxYearCustomer.minYear + 1 },
                    (v, i) => minmaxYearCustomer.minYear + i
                  ).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Col>
          </>
        );
        case "quarterly":
          return (
            <>
            {/* Order Year Filter */}
            <Col md={6}>
              <label>Year:</label>
                <select className="sub-view-options" onChange={handleYearOrderChange} value={selectedYearOrder}>
                  {minmaxYearOrder.minYear && minmaxYearOrder.maxYear &&
                    Array.from(
                      { length: minmaxYearOrder.maxYear - minmaxYearOrder.minYear + 1 },
                      (v, i) => minmaxYearOrder.minYear + i
                    ).map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </Col>
  
              {/* Customer Year Filter */}
              <Col md={6}>
                <label>Year:</label>
                <select className="sub-view-options" onChange={handleYearCustomerChange} value={selectedYearCustomer}>
                  {minmaxYearCustomer.minYear && minmaxYearCustomer.maxYear &&
                    Array.from(
                      { length: minmaxYearCustomer.maxYear - minmaxYearCustomer.minYear + 1 },
                      (v, i) => minmaxYearCustomer.minYear + i
                    ).map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </Col>
            </>
          );  
      case "yearly":
        return (
          <>
           {/* <label>Order - Year Range:</label>
            <select onChange={handleYearOrderChange} value={selectedYearOrder}>
              {yearRangeOrder.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <label>Customer - Year Range:</label>
            <select onChange={handleYearCustomerChange} value={selectedYearCustomer}>
              {yearRangeCustomer.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select> */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-container">
      <div>
        <select onChange={handleViewOptionChange} value={viewOption} className="view-options">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Year</option>
        </select>
      </div>
      <Row>
        {renderFilters()}
      </Row>
      <Row> 
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <Bar data={dataBar} 
              options={{
                plugins: {
                  title: {
                    display: true,
                    text:  viewOption === "daily" ? "Daily Orders" : viewOption === "monthly" ? "Monthly Orders" : viewOption === "quarterly" ? "Quarterly Orders" : "Yearly Orders", // Chart title
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
                      text: viewOption === "daily" ? "Days" : viewOption === "monthly" ? "Months" : viewOption === "quarterly" ? "Quarterly" : "Years",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Numbers of Orders",
                    },
                    ticks: {
                      callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                      },
                      stepSize: 1, // Ensure step size is 1 for integers
                    },
                  },
                },
              }} />
          </div>
        </Col>
        <Col md={6} className="chart">
          <div style={{ height: "100%", width: "100%", margin: "20px" }}>
            <Line data={dataLine} 
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: viewOption === "daily" ? "Daily Customers Account Created" : viewOption === "monthly" ? "Monthly Customers Account Created" : viewOption === "quarterly" ? "Quarterly Customers Account Created" : "Yearly Customers Account Created", // Chart title
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
                      text: viewOption === "daily" ? "Days" : viewOption === "monthly" ? "Months" : viewOption === "quarterly" ? "Quarterly" : "Years",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Numbers of Customers",
                    },
                    ticks: {
                      callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                      },
                      stepSize: 1, // Ensure step size is 1 for integers
                    },
                  },
                },
              }} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Chart;
