import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/product.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaPenToSquare,
  FaTrash,
  FaBars,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

function Product() {
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setLgShow(false);

  const [lgShow1, setLgShow1] = useState(false);
  const handleClose1 = () => setLgShow1(false);

  // Model Create des
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [product, setProduct] = useState([]);
  const loadProduct = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/api/admin-product`);
      console.log("Product count:", result.data.length);
      setProduct(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    loadProduct();
    loadCategoriesAndSizes();
    loadDesTitles();
  }, []);

  const [desTitles, setDesTitles] = useState([]);
  const loadDesTitles = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/desTitles");
      setDesTitles(result.data);
    } catch (error) {
      console.error("Error fetching description titles:", error);
    }
  };

  const [selectedSize, setSelectedSize] = useState({});
  const handleSizeChange = (productName, selectedSize) => {
    const selectedProduct = product.find((p) => p.productName === productName);
    const sizeDetail = selectedProduct.productItem.find(
      (s) => s.size === selectedSize
    );
    setSelectedSize({ ...selectedSize, [productName]: sizeDetail });
  };

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const loadCategoriesAndSizes = async () => {
    const categoryResult = await axios.get(
      "http://localhost:8080/api/categories"
    );
    setCategories(categoryResult.data);

    const sizeResult = await axios.get("http://localhost:8080/api/sizes");
    setSizes(sizeResult.data);
  };

  const [newProduct, setNewProduct] = useState({
    categoryId: "",
    name: "",
    description: "",
    productRating: 0,
    isDelete: 0,
    size: "",
    qtyInStock: 0,
    price: 0,
  });
  const [productImage, setProductImage] = useState(null);

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const [imageError, setImageError] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSizeInMB = file.size / (1024 * 1024);

      const invalidFileNameRegex = /[^a-zA-Z0-9-_().]/;
      if (invalidFileNameRegex.test(fileName)) {
        setImageError(
          "File name contains spaces or special characters. Please rename it."
        );
        setProductImage(null);
        return;
      }

      if (fileSizeInMB > 1) {
        setImageError("File size exceeds 1 MB. Please upload a smaller image.");
        setProductImage(null);
        return;
      }

      if (fileType === "image/jpeg" || fileType === "image/png") {
        setProductImage(file);
        setImageError("");
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setProductImage(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingProduct = product.find(
      (p) =>
        p.categoryId === newProduct.categoryId &&
        p.productName === newProduct.name &&
        p.productItem.some((item) => item.size === newProduct.size)
    );

    if (existingProduct) {
      const existingProductItem = existingProduct.productItem.find(
        (item) => item.size === newProduct.size
      );

      const updatedQty =
        existingProductItem.quantity + Number(newProduct.qtyInStock);

      try {
        await axios.put(
          `http://localhost:8080/api/product/${existingProduct.productId}/update`,
          {
            categoryId: newProduct.categoryId,
            name: newProduct.name,
            description: newProduct.description,
            productImage: productImage,
            productRating: newProduct.productRating,
            isDelete: newProduct.isDelete,
            size: newProduct.size,
            qtyInStock: updatedQty,
            price: newProduct.price,
          }
        );

        console.log("Product updated successfully");
        loadProduct();
        handleClose();
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    } else {
      const formData = new FormData();
      formData.append("categoryId", newProduct.categoryId);
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("productImage", productImage);
      formData.append("productRating", newProduct.productRating);
      formData.append("isDelete", 1);
      formData.append("size", newProduct.size);
      formData.append("qtyInStock", newProduct.qtyInStock);
      formData.append("price", newProduct.price);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/add/admin-product",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Product created successfully:", response.data);
          loadProduct();
          handleClose();
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Failed to create product:", error);
      }
    }
  };

  // State for updating product
  const [editProduct, setEditProduct] = useState({
    categoryId: "",
    name: "",
    description: "",
    productRating: 0,
    isDelete: 0,
    sizes: [],
  });
  const [editProductImage, setEditProductImage] = useState(null);

  // Open edit modal with existing product data
  const openEditModal = (product) => {
    setEditProduct({
      productId: product.productId,
      categoryId: product.categoryId,
      name: product.productName,
      description: product.description,
      productRating: product.productRating,
      isDelete: product.isDelete,
      sizes: product.productItem.map((item) => ({
        oldSize: item.size,
        size: item.size,
        qtyInStock: item.quantity,
        price: item.price,
      })),
    });
    setLgShow1(true);
  };

  // Handle changes for size data (change name of existing size, quantity, or price)
  const handleSizeChangeUpdate = (index, field, value) => {
    const updatedSizes = [...editProduct.sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: value,
    };
    setEditProduct({ ...editProduct, sizes: updatedSizes });
  };

  // Handle updating product submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedProductData = {
      productId: editProduct.productId,
      categoryId: editProduct.categoryId || 0,
      name: editProduct.name || "",
      description: editProduct.description || "",
      productRating: editProduct.productRating || 0,
      isDelete: editProduct.isDelete || 1,
      sizes: editProduct.sizes.length > 0 ? editProduct.sizes : [],
    };

    const formData = new FormData();
    formData.append("categoryId", updatedProductData.categoryId);
    formData.append("name", updatedProductData.name);
    formData.append("description", updatedProductData.description);
    formData.append("productRating", updatedProductData.productRating);
    formData.append("isDelete", updatedProductData.isDelete);
    formData.append("sizes", JSON.stringify(updatedProductData.sizes));

    if (editProductImage) {
      formData.append("productImage", editProductImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/product/${updatedProductData.productId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Product updated successfully:", response.data);
        loadProduct();
        handleClose1();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  //Create description
  const [newDesInfo, setDesInfo] = useState({
    desTitleID: "",
    desInfo: "",
    isDelete: 1,
  });

  const [currentProductId, setCurrentProductId] = useState(null);

  const handleDesInfoChange = (e) => {
    const { name, value } = e.target;
    setDesInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddDesInfo = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/product/${currentProductId}/add-desinfo`,
        newDesInfo
      );
      console.log("Description info added successfully");
      setDesInfo({ desTitleID: "", desInfo: "", isDelete: 1 });
      handleClose2();
    } catch (error) {
      console.error("Error adding description info:", error);
    }
  };

  //Delete Product
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setDeleteProId(id);
    setShowDelete(true);
  };

  const [deleteProId, setDeleteProId] = useState(null);
  const deleteProduct = async () => {
    try {
      const productToDelete = product.find((p) => p.productId === deleteProId);
      const canDelete = productToDelete.productItem.every(
        (item) => item.quantity <= 1
      );

      if (canDelete) {
        await axios.delete(
          `http://localhost:8080/api/product/delete/${deleteProId}`
        );
        handleCloseDelete();
        loadProduct();
      } else {
        setError(
          "Cannot delete this product because one or more sizes have quantity greater than 1."
        );
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(product.length / itemsPerPage);
  const displayData = product.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="product__wrap">
          <div className="product__head">
            <h3 className="product__title">Product</h3>
            <Breadcrumb>
              <Breadcrumb.Item link>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
              <Breadcrumb.Item active>Product</Breadcrumb.Item>
            </Breadcrumb>
            <hr />
          </div>

          <div className="product__body__wrap">
            <div className="product__body">
              <div className="product__body--head">
                <h4 className="product__body--title">Product</h4>
                <FaRegSquarePlus
                  className="product__icon--add"
                  onClick={() => setLgShow(true)}
                />
                <Modal size="lg" show={lgShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <Container>
                        <Row>
                          <Col>
                            <Form.Group
                              className="mb-3"
                              controlId="productName"
                            >
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleChange}
                                autoFocus
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" controlId="categoryId">
                              <Form.Label>Category Name</Form.Label>
                              <Form.Select
                                name="categoryId"
                                value={newProduct.categoryId}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.cateName}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group
                              className="mb-3"
                              controlId="description"
                            >
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                as="textarea"
                                name="description"
                                value={newProduct.description}
                                onChange={handleChange}
                                rows={2}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" controlId="size">
                              <Form.Label>Size</Form.Label>
                              <Form.Select
                                name="size"
                                value={newProduct.size}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Size</option>
                                {sizes.map((size, index) => (
                                  <option key={index} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group
                              className="mb-3"
                              controlId="productImage"
                            >
                              <Form.Label>Product Image</Form.Label>
                              <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" controlId="qtyInStock">
                              <Form.Label>Quantity in Stock</Form.Label>
                              <Form.Control
                                type="number"
                                name="qtyInStock"
                                value={newProduct.qtyInStock}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group className="mb-3" controlId="price">
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button
                            variant="success"
                            type="submit"
                            onSubmit={handleSubmit}
                          >
                            Create
                          </Button>
                        </Modal.Footer>
                      </Container>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>

              <div className="product__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Category Name</th>
                      <th className="th">Product Name</th>
                      <th className="th">Description</th>
                      <th className="th">Product Image</th>
                      <th className="th">Size</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Price</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => {
                      const currentSize =
                        selectedSize[item.productName] || item.productItem[0];
                      return (
                        <tr key={item.productId}>
                          <td className="td">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="td">{item.categoryName}</td>
                          <td className="td">{item.productName}</td>
                          <td className="td">{item.description}</td>
                          <td className="td">
                            <img
                              src={`../images/${item.productImage}`}
                              alt={item.productName}
                              className="product__image"
                            />
                          </td>
                          <td className="td">
                            <Form.Select
                              value={currentSize.size}
                              onChange={(e) =>
                                handleSizeChange(
                                  item.productName,
                                  e.target.value
                                )
                              }
                            >
                              {item.productItem.map((sizeOption, i) => (
                                <option key={i} value={sizeOption.size}>
                                  {sizeOption.size}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td className="td">{currentSize.quantity}</td>
                          <td className="td">{currentSize.price} VND</td>
                          <td className="td">
                            <div className="icon-container">
                              <div className="icon-container1">
                                <FaRegSquarePlus
                                  className="product__icon1 product__icon--menu"
                                  onClick={() => {
                                    setCurrentProductId(item.productId);
                                    handleShow2();
                                  }}
                                />
                                <Modal show={show2} onHide={handleClose2}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>
                                      Add Product Description
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="desTitleID"
                                      >
                                        <Form.Label>
                                          Description Title
                                        </Form.Label>
                                        <Form.Select
                                          name="desTitleID"
                                          value={newDesInfo.desTitleID}
                                          onChange={handleDesInfoChange}
                                        >
                                          <option value="">
                                            Select Description Title
                                          </option>
                                          {desTitles.map((title, index) => (
                                            <option
                                              key={index}
                                              value={index + 1}
                                            >
                                              {title}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="desInfo"
                                      >
                                        <Form.Label>
                                          Description Information
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="desInfo"
                                          value={newDesInfo.desInfo}
                                          onChange={handleDesInfoChange}
                                        />
                                      </Form.Group>
                                    </Form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose2}
                                    >
                                      Close
                                    </Button>
                                    <Button
                                      variant="success"
                                      onClick={handleAddDesInfo}
                                    >
                                      Create
                                    </Button>
                                  </Modal.Footer>
                                </Modal>

                                <Link
                                  to={`/product/detail/${item.productId}`}
                                  className="link__icon"
                                >
                                  <FaBars className="product__icon1 product__icon--menu" />
                                </Link>
                              </div>

                              <div className="icon-container2">
                                <FaPenToSquare
                                  className="product__icon1 product__icon--edit"
                                  onClick={() => openEditModal(item)}
                                />
                                <Modal
                                  size="lg"
                                  show={lgShow1}
                                  onHide={handleClose1}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Update Product</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form onSubmit={handleUpdateSubmit}>
                                      <Container>
                                        <Row>
                                          <Col>
                                            <Form.Group
                                              className="mb-3"
                                              controlId="productName"
                                            >
                                              <Form.Label>
                                                Product Name
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                name="name"
                                                value={editProduct.name}
                                                onChange={(e) =>
                                                  setEditProduct({
                                                    ...editProduct,
                                                    name: e.target.value,
                                                  })
                                                }
                                                required
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col>
                                            <Form.Group
                                              className="mb-3"
                                              controlId="categoryId"
                                            >
                                              <Form.Label>
                                                Category Name
                                              </Form.Label>
                                              <Form.Select
                                                name="categoryId"
                                                value={editProduct.categoryId}
                                                onChange={(e) =>
                                                  setEditProduct({
                                                    ...editProduct,
                                                    categoryId: e.target.value,
                                                  })
                                                }
                                                required
                                              >
                                                <option value="">
                                                  Select Category
                                                </option>
                                                {categories.map((category) => (
                                                  <option
                                                    key={category.id}
                                                    value={category.id}
                                                  >
                                                    {category.cateName}
                                                  </option>
                                                ))}
                                              </Form.Select>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <Form.Group
                                              className="mb-3"
                                              controlId="description"
                                            >
                                              <Form.Label>
                                                Description
                                              </Form.Label>
                                              <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={editProduct.description}
                                                onChange={(e) =>
                                                  setEditProduct({
                                                    ...editProduct,
                                                    description: e.target.value,
                                                  })
                                                }
                                                rows={2}
                                                required
                                              />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <Form.Group
                                              className="mb-3"
                                              controlId="productImage"
                                            >
                                              <Form.Label>
                                                Product Image
                                              </Form.Label>
                                              <Form.Control
                                                type="file"
                                                name="productImage"
                                                onChange={(e) =>
                                                  setEditProductImage(
                                                    e.target.files[0]
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                        {editProduct.sizes.map(
                                          (sizeData, index) => (
                                            <Row key={index}>
                                              <Col>
                                                <Form.Group
                                                  className="mb-3"
                                                  controlId={`size-${index}`}
                                                >
                                                  <Form.Label>Size</Form.Label>
                                                  <Form.Control
                                                    type="text"
                                                    name="size"
                                                    value={sizeData.size}
                                                    onChange={(e) =>
                                                      handleSizeChangeUpdate(
                                                        index,
                                                        "size",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col>
                                                <Form.Group
                                                  className="mb-3"
                                                  controlId={`qtyInStock-${index}`}
                                                >
                                                  <Form.Label>
                                                    Quantity in Stock
                                                  </Form.Label>
                                                  <Form.Control
                                                    type="number"
                                                    name="qtyInStock"
                                                    value={sizeData.qtyInStock}
                                                    onChange={(e) =>
                                                      handleSizeChangeUpdate(
                                                        index,
                                                        "qtyInStock",
                                                        e.target.value
                                                      )
                                                    }
                                                    required
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col>
                                                <Form.Group
                                                  className="mb-3"
                                                  controlId={`price-${index}`}
                                                >
                                                  <Form.Label>Price</Form.Label>
                                                  <Form.Control
                                                    type="number"
                                                    name="price"
                                                    value={sizeData.price}
                                                    onChange={(e) =>
                                                      handleSizeChangeUpdate(
                                                        index,
                                                        "price",
                                                        e.target.value
                                                      )
                                                    }
                                                    required
                                                  />
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          )
                                        )}

                                        <Modal.Footer>
                                          <Button
                                            variant="secondary"
                                            onClick={handleClose1}
                                          >
                                            Close
                                          </Button>
                                          <Button
                                            variant="warning"
                                            type="submit"
                                          >
                                            Update
                                          </Button>
                                        </Modal.Footer>
                                      </Container>
                                    </Form>
                                  </Modal.Body>
                                </Modal>

                                <FaTrash
                                  className="product__icon1 product__icon--delete"
                                  onClick={() =>
                                    handleShowDelete(item.productId)
                                  }
                                />
                                <Modal
                                  show={showDelete}
                                  onHide={handleCloseDelete}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Delete Product</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    Are you sure you want to delete this
                                    product?
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleCloseDelete}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="danger"
                                      onClick={deleteProduct}
                                    >
                                      Delete
                                    </Button>
                                  </Modal.Footer>
                                  {error && (
                                    <Alert variant="danger">{error}</Alert>
                                  )}
                                </Modal>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-right"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
