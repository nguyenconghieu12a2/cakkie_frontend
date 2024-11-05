import React, {useEffect, useState} from 'react';
import '../../../styles/customers/report-table.css'
import axios from 'axios';

const api = "/api/admin/customer-statistic-order/cancel";

const CancelTable = ({ onClose, cusId }) =>{
    const [cancelOrder, setCancelOrder] = useState([]);

    const fetchCancelOrder = async (id) =>{
        try{
            const response = await axios.get(`${api}/${id}`);
            setCancelOrder(response.data);
        }catch(error){
            console.error("fetch cancel error: ", error);
        }
    }
    
    useEffect(() => {
        if(cusId){
            fetchCancelOrder(cusId);
        }
    }, [cusId]);

    return(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Canceled Order:</h2>
          <table className="order-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Order Date</th>
                <th>Approved Date</th>
                <th>Cancel Date</th>
                <th>Cancel Reason</th>
                <th>Order Total</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {cancelOrder.length > 0 ? (
              cancelOrder.map((cancelO, i) => (
                <tr key={i}>
                  <td>{cancelO.orderId}</td>
                  <td>{cancelO.orderDate}</td>
                  <td>{cancelO.approvedDate}</td>
                  <td>{cancelO.cancelDate}</td>
                  <td>{cancelO.cancelReason}</td>
                  <td>{cancelO.orderTotal}</td>
                  <td>{/* Add any actions if needed */}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No cancel orders found.</td>
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

export default CancelTable;