const ProductReview = () => {
  return (
    <div className="card-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date Start</th>
            <th>Date End</th>
            <th>Approved Review</th>
            <th>Rejected Review</th>
            <th>Total Review</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>21/07/2024</td>
            <td>27/07/2024</td>
            <td>25</td>
            <td>5</td>
            <td>30</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default ProductReview;
