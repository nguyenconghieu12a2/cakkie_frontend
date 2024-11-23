import React, {useEffect, useState} from 'react';
import '../../../styles/admin-customers/report-table.css'
import axios from 'axios';

const api = "/api/admin/customer-statistic-order/complete";

const CompleteTable = ({ onClose, cusId }) =>{
    const [completeOrder, setCompleteOrder] = useState([]);

    const fetchCompleteOrder = async (id) =>{
        try{
            const response = await axios.get(`${api}/${id}`);
            setCompleteOrder(response.data);
        }catch(error){
            console.error("fetch complete error: ", error);
        }
    }
    
    useEffect(() => {
        if(cusId){
            fetchCompleteOrder(cusId);
        }
    }, [cusId]);

    return(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Completed Order:</h2>
          <table className="order-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Order Date</th>
                <th>Approved Date</th>
                <th>Shipping Date</th>
                <th>Arrived Date</th>
                <th>Order Total</th>
                {/* <th>Actions</th> */}
                </tr>
            </thead>
            <tbody>
            {completeOrder.length > 0 ? (
              completeOrder.map((completeO, i) => (
                <tr key={i}>
                  <td>{completeO.orderId}</td>
                  <td>{completeO.orderDate}</td>
                  <td>{completeO.approvedDate}</td>
                  <td>{completeO.shippingDate}</td>
                  <td>{completeO.arrivedDate}</td>
                  <td>{completeO.orderTotal}</td>
                  {/* <td>Add any actions if needed</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No completed orders found.</td>
              </tr>
            )}
            </tbody>
          </table>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
      </div>
    </div>
    );
}

export default CompleteTable;