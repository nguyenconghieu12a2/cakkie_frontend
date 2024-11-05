import React, {useEffect, useState} from 'react';
import '../../../styles/customers/report-table.css'
import axios from 'axios';

const api = "/api/admin/customer-statistic-order/processing";

const ProcessingTable = ({ onClose, cusId }) =>{
    const [processingOrder, setProcessingOrder] = useState([]);

    const fetchProcessingOrder = async (id) =>{
        try{
            const response = await axios.get(`${api}/${id}`);
            setProcessingOrder(response.data);
        }catch(error){
            console.error("fetch processing error: ", error);
        }
    }
    
    useEffect(() => {
        if(cusId){
            fetchProcessingOrder(cusId);
        }
    }, [cusId]);

    return(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Processing Order:</h2>
          <table className="order-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Order Date</th>
                <th>Approved Date</th>
                <th>Shipping Date</th>
                <th>Order Total</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {processingOrder.length > 0 ? (
              processingOrder.map((processO, i) => (
                <tr key={i}>
                  <td>{processO.orderId}</td>
                  <td>{processO.orderDate}</td>
                  <td>{processO.approvedDate}</td>
                  <td>{processO.shippingDate}</td>
                  <td>{processO.orderTotal}</td>
                  <td>{/* Add any actions if needed */}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No processing orders found.</td>
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

export default ProcessingTable;