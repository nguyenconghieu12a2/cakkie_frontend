import React from "react";
import "../styles/test.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // You can use react-icons for the edit and delete icons

const Banners = () => {
  const banners = [
    {
      title: "Banner_1",
      description: "Sold out Winter",
      link: "1",
      imageUrl: "/path/to/image1",
    },
    {
      title: "Banner_1",
      description: "Sale off Spring",
      link: "2",
      imageUrl: "/path/to/image2",
    },
    {
      title: "Banner_1",
      description: "Black Friday",
      link: "3",
      imageUrl: "/path/to/image3",
    },
  ];

  return (
    <div className="container mt-4">
      <h3>Banners</h3>
      <p>Home / Banners</p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={index}>
              <td>{banner.title}</td>
              <td>{banner.description}</td>
              <td>
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  style={{ width: "100px" }}
                />
              </td>
              <td>{banner.link}</td>
              <td>
                <button className="btn btn-primary me-2">
                  <FaEdit />
                </button>
                <button className="btn btn-danger">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-danger">Removed banners</button>
    </div>
  );
};

export default Banners;
