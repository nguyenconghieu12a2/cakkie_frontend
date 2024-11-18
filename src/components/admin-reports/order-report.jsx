import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const api = "/api/admin/reports/orders"

// Function to parse a date string in "YYYY-MM-DD" format from input and "DD-MM-YYYY" from JSON data
const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Check for "YYYY-MM-DD" format from <input type="date">
  if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
    return new Date(dateString);
  }

  // Check for "DD-MM-YYYY" format from JSON data
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // JavaScript Date months are zero-indexed
};

// Function to format date as "DD-MM-YYYY"
const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Orders = ({startDate, endDate}) => {
  const [order, setOrder] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);


  const fetchOrderReport = async() =>{
    try{
      const response = await axios.get(`${api}`);
      applyDateFilter(response.data);
      setOrder(response.data);
    }catch(error){
      console.error("fetch error: ", error);
    }
  }

  const applyDateFilter = (data) => {
    const filteredData = data.filter((order) => {
      const orderDate = parseDate(order.startDate);
      const start = startDate ? parseDate(startDate) : null;
      const end = endDate ? parseDate(endDate) : null;

      return (
        (!start || orderDate >= start) &&
        (!end || orderDate <= end)
      );
    });

    setFilteredOrder(filteredData);
  };

  useEffect(() => {
    fetchOrderReport();
  }, []);

  useEffect(() => {
    if (startDate || endDate) {
      applyDateFilter(order);

      //Reset the current page to 1 when data is filtered
      setCurrentPage(1);
    }

  }, [startDate, endDate, order, itemPerPage]);

  const totalResult = filteredOrder.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = filteredOrder.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleItemPerPageChange = (e) => {
    setItemPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="card-body">
      <div className="items-per-page">
        <div>
          <label>Items per page: </label>
          <select value={itemPerPage} onChange={handleItemPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date Start</th>
            <th>Date End</th>
            <th>Orders</th>
            <th>Products</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {/* Check if there are no banned customers to display */}
        {order.length === 0 || filteredOrder.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
              <div className="no-data-message">No orders found.</div>
            </td>
          </tr>
        ) : (
        pagedResult.map((odr, index) => {
            const formattedStartDate = formatDate(parseDate(odr.startDate));
            const formattedEndDate = formatDate(parseDate(odr.endDate));
            return (
              <tr key={index}>
                <td>{formattedStartDate}</td>
                <td>{formattedEndDate}</td>
                <td>{odr.products}</td>
                <td>{odr.quantity}</td>
                <td>{odr.total}</td>
              </tr>
            );
          }))}
        </tbody>
      </table>
      <div className="pagging">     
        <Pagination className="custom-pagination">
            <Pagination.First
              onClick={goToFirstPage}
              disabled={currentPage <= 1}
            />
            <Pagination.Prev
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            />

            <Pagination.Item>
              {currentPage} / {totalPages}
            </Pagination.Item>

            <Pagination.Next
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            />
            <Pagination.Last
              onClick={goToLastPage}
              disabled={currentPage >= totalPages}
            />
          </Pagination>
        </div>   
    </div>
  );
};
export default Orders;
