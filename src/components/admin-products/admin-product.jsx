import { useEffect, useState } from "react";
import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-product/product.css";
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
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AvatarHeader from "../admin-header/admin-header.jsx";

//API
//Get Product
const api = "/api/admin/admin-product";

//Update Product
const updatePro = "/api/admin/product/update";

//Add Product
const addPro = "/api/admin/add/admin-product";

//Delete Product
const deletePro = "/api/admin/product/delete";

//Description Title
const desTitle = "/api/admin/desTitles";

//Add des info
const addDes = "/api/admin/product/add-desinfo";

//Show Category
const getCategories = "/api/admin/categories";

//Show size
const getSize = "/api/admin/sizes";

//Add size, quantity, price
const addSize = "/api/admin/add-size";

const Product = () => {
  // Logout
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("jwtAdmin");
    // onLogout();
    navigate("/admin-login");
  };

  //Search Logic
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = product.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  //Logic
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
      const result = await axios.get(`${api}`);
      console.log("Product count:", result.data.length);
      setProduct(result.data);
      setFilteredOrders(result.data);
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
      const result = await axios.get(`${desTitle}`);
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
    const categoryResult = await axios.get(`${getCategories}`);
    setCategories(categoryResult.data);

    const sizeResult = await axios.get(`${getSize}`);
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
        setTimeout(() => {
          setImageError("");
        }, 3000);
        setProductImage(null);
        return;
      }

      if (fileSizeInMB > 1) {
        setImageError("File size exceeds 1 MB. Please upload a smaller image.");
        setTimeout(() => {
          setImageError("");
        }, 3000);
        setProductImage(null);
        return;
      }

      if (fileType === "image/jpeg" || fileType === "image/png") {
        setProductImage(file);
        setTimeout(() => {
          setImageError("");
        }, 3000);
        setImageError("");
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setTimeout(() => {
          setImageError("");
        }, 3000);
        setProductImage(null);
      }
    }
  };

  //Error and success create product
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (
      !newProduct.name ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.qtyInStock
    ) {
      setCreateError("Please fill all the required fields!");
      setTimeout(() => setCreateError(""), 3000);
      return;
    }

    // Validation: Check if product name length is valid
    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    if (newProduct.name.trim().length < 3) {
      setCreateError("Product name must be at least 3 characters long.");
      setTimeout(() => setCreateError(""), 3000);
      return;
    } else if (!regex.test(newProduct.name)) {
      setCreateError(
        "Product name cannot start with whitespace or contain special characters!"
      );
      setTimeout(() => setCreateError(""), 3000);
      return;
    }

    if (newProduct.size) {
      const validSizes = ["S", "M", "L"];
      const numericRangeRegex = /^\d+\s*x\s*\d+$/;

      if (
        !validSizes.includes(newProduct.size.toUpperCase()) &&
        !numericRangeRegex.test(newProduct.size)
      ) {
        setCreateError(
          "Invalid size format. Please use 'S', 'M', 'L', or 'number x number' (e.g., '5 x 10')."
        );
        setTimeout(() => setCreateError(""), 3000);
        return;
      }
    }

    // Validation: Check if price is a positive number
    if (isNaN(newProduct.price) || Number(newProduct.price) <= 1000) {
      setCreateError(
        "Price must be a positive number and greater than 1.000 VND."
      );
      setTimeout(() => setCreateError(""), 3000);
      return;
    }

    // Validation: Check if quantity in stock is a positive integer
    if (isNaN(newProduct.qtyInStock) || Number(newProduct.qtyInStock) < 0) {
      setCreateError("Quantity in stock must be a positive number.");
      setTimeout(() => setCreateError(""), 3000);
      return;
    }

    // Check if product already exists in the selected category
    const existingProduct = product.find(
      (p) =>
        p.categoryId === parseInt(newProduct.categoryId) &&
        p.productName.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (existingProduct) {
      setCreateError(
        "This product is already in the system. Please go to 'Add Size' to add a new size."
      );
      setTimeout(() => {
        setCreateError("");
      }, 3000);
      return;
    }
    // Proceed with product creation
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
      const response = await axios.post(`${addPro}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setCreateSuccess("Product created successfully!");
        setTimeout(() => setCreateSuccess(""), 3000);
        loadProduct();
        handleClose();
      } else {
        setCreateError("Unexpected error. Please try again.");
        setTimeout(() => setCreateError(""), 3000);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setCreateError("Failed to create product. Please try again.");
      setTimeout(() => setCreateError(""), 3000);
    }
  };

  // State for updating product
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

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
        oldQtyInStock: item.quantity,
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

  //Validate image
  const validateImage = (file) => {
    if (!file) {
      return "No file selected. Please choose an image.";
    }

    const fileType = file.type;
    const fileName = file.name;
    const fileSizeInMB = file.size / (1024 * 1024);

    const invalidFileNameRegex = /[^a-zA-Z0-9-_().]/;
    if (invalidFileNameRegex.test(fileName)) {
      return "File name contains spaces or special characters. Please rename it.";
    }

    if (fileSizeInMB > 1) {
      return "File size exceeds 1 MB. Please upload a smaller image.";
    }

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      return "Only .jpg and .png files are allowed.";
    }

    return ""; // No errors
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setUpdateError("");
    setUpdateSuccess("");

    if (editProductImage) {
      const error = validateImage(editProductImage);
      if (error) {
        setUpdateError(error);
        setTimeout(() => setUpdateError(""), 3000);
        return;
      }
    }

    // Validation: Check if all required fields are filled
    if (
      !editProduct.name ||
      !editProduct.categoryId ||
      !editProduct.description ||
      editProduct.sizes.length === 0
    ) {
      setUpdateError("Please fill all the required fields!");
      setTimeout(() => setUpdateError(""), 3000);
      return;
    }

    // Validation: Check if product name length and format are valid
    const nameRegex = /^[a-zA-Z0-9,.]+([ ]?[a-zA-Z0-9,.]+)*$/;
    if (editProduct.name.trim().length < 3) {
      setUpdateError("Product name must be at least 3 characters long.");
      setTimeout(() => setUpdateError(""), 3000);
      return;
    } else if (!nameRegex.test(editProduct.name)) {
      setUpdateError(
        "Product name cannot start with whitespace or contain special characters!"
      );
      setTimeout(() => setUpdateError(""), 3000);
      return;
    }

    // Validation: Check sizes
    if (editProduct.sizes.length > 0) {
      const validSizes = ["S", "M", "L"];
      const numericRangeRegex = /^\d+\s*x\s*\d+$/;

      for (const sizeData of editProduct.sizes) {
        if (sizeData.size) {
          if (
            !validSizes.includes(sizeData.size.toUpperCase()) &&
            !numericRangeRegex.test(sizeData.size)
          ) {
            setUpdateError(
              "Invalid size format. Please use 'S', 'M', 'L', or 'number x number' (e.g., '5 x 10')."
            );
            setTimeout(() => setUpdateError(""), 3000);
            return;
          }
        }

        // Validation: Check price for each size
        if (isNaN(sizeData.price) || Number(sizeData.price) <= 0) {
          setUpdateError(
            `Price for size ${sizeData.size} must be a positive number.`
          );
          setTimeout(() => setUpdateError(""), 3000);
          return;
        }

        // Validation: Check quantity in stock for each size
        if (isNaN(sizeData.qtyInStock) || Number(sizeData.qtyInStock) < 0) {
          setUpdateError(
            `Quantity for size ${sizeData.size} must be a non-negative number.`
          );
          setTimeout(() => setUpdateError(""), 3000);
          return;
        }

        if (sizeData.qtyInStock < sizeData.oldQtyInStock) {
          setUpdateError(
            `Quantity for size ${sizeData.size} cannot be less than the current stock (${sizeData.oldQtyInStock}).`
          );
          setTimeout(() => setUpdateError(""), 3000);
          return;
        }
      }
    }

    // Prepare updated product data
    const updatedProductData = {
      productId: editProduct.productId,
      categoryId: editProduct.categoryId,
      name: editProduct.name.trim(),
      description: editProduct.description.trim(),
      productRating: editProduct.productRating || 0,
      isDelete: editProduct.isDelete || 1,
      sizes: editProduct.sizes,
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

    // Send update request
    try {
      const response = await axios.put(
        `${updatePro}/${updatedProductData.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUpdateSuccess("Product updated successfully!");
        setTimeout(() => setUpdateSuccess(""), 3000);
        loadProduct(); // Reload products after successful update
        // handleClose1(); // Close the modal
      } else {
        setUpdateError("Unexpected error. Please try again.");
        setTimeout(() => setUpdateError(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      setUpdateError("Failed to update product. Please try again.");
      setTimeout(() => setUpdateError(""), 3000);
    }
  };

  //Create description
  const [desError, setDesError] = useState("");
  const [desSuccess, setDesSuccess] = useState("");

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
    setDesError("");
    setDesSuccess("");

    if (!newDesInfo.desTitleID || !newDesInfo.desInfo) {
      setDesError(
        "Please select a description title and enter description information."
      );
      setTimeout(() => setDesError(""), 3000);
      return;
    }

    const desRegex = /^[a-zA-Z0-9,.]+([ ]?[a-zA-Z0-9,.]+)*$/;
    if (!desRegex.test(newDesInfo.desInfo.trim())) {
      setDesError(
        "Description information cannot start with whitespace or contain special characters!"
      );
      setTimeout(() => setDesError(""), 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${addDes}/${currentProductId}`,
        newDesInfo
      );

      if (response.status === 201 || response.status === 200) {
        setDesSuccess("Description information added successfully!");
        setTimeout(() => setDesSuccess(""), 3000);

        setDesInfo({ desTitleID: "", desInfo: "", isDelete: 1 });
      } else {
        setDesError("Unexpected response. Please try again.");
        setTimeout(() => setDesError(""), 3000);
      }
    } catch (error) {
      console.error("Error adding description info:", error);
      setDesError("Failed to add description information. Please try again.");
      setTimeout(() => setDesError(""), 3000);
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
        await axios.delete(`${deletePro}/${deleteProId}`);
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

  //Create new size
  const [alertMessage, setAlertMessage] = useState("");
  const [successSize, setSuccessSize] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newSize, setNewSize] = useState({
    size: "",
    qtyInStock: 0,
    price: 0,
  });

  // Function to handle size, price, and quantity input changes
  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setNewSize({
      ...newSize,
      [name]: value,
    });
  };

  const handleAddSize = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !selectedProductId ||
      !newSize.size ||
      !newSize.qtyInStock ||
      !newSize.price
    ) {
      setAlertMessage("Please fill in all fields.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    const validSizes = ["S", "M", "L"];
    const numericRangeRegex = /^\d+\s*x\s*\d+$/;

    if (
      !validSizes.includes(newSize.size.toUpperCase()) &&
      !numericRangeRegex.test(newSize.size)
    ) {
      setAlertMessage(
        "Invalid size format. Please use 'S', 'M', 'L', or 'number x number' (e.g., '5 x 10')."
      );
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    if (isNaN(newSize.qtyInStock) || newSize.qtyInStock <= 0) {
      setAlertMessage("Quantity must be a positive number.");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    const parsedProductId = parseInt(selectedProductId, 10);
    if (isNaN(parsedProductId)) {
      setAlertMessage("Invalid Product ID.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${addSize}/${parsedProductId}`,
        {
          size: newSize.size,
          qtyInStock: newSize.qtyInStock,
          price: newSize.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessSize("Size added successfully!");
        setTimeout(() => {
          setSuccessSize("");
        }, 3000);
        setAlertMessage("");
        setLgShow1(false);
        loadProduct();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAlertMessage(error.response.data);
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      } else {
        setAlertMessage("Error adding size. Please try again.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    }
  };

  //Format Price
  const formatCurrency = (value) => {
    if (!value) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(value)
      .replace("₫", "VND");
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayData = filteredOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  return (
    <>
      <div className="main__wrap">
        <Sidebar onLogout={handleLogoutClick} />
        <div className="product__wrap">
          <div className="product__head">
            <div className="product__head--wrap">
              <h3 className="product__title">Product</h3>
              <AvatarHeader />
            </div>
            <p className="admin__breadcumb">
              <Link to="/dashboard">Home</Link> / Catlog / Product
            </p>
            <hr />
          </div>

          <div className="search__bar">
            <Container>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search__input"
                  />
                </Col>
              </Row>
            </Container>
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
                  <Tabs defaultActiveKey="description" id="product-tabs">
                    <Tab eventKey="description" title="Description">
                      <Container>
                        <Row>
                          <Col>
                            <p className="description__add">
                              You can add a new product by navigating to the tab
                              labeled <strong>"Add Product"</strong>. This is
                              where you can enter all the necessary details to
                              register a brand-new product in the system. These
                              details typically include the product's name,
                              description, category, price, and other essential
                              attributes. <br /> <br />
                              If the product you are working with already exists
                              in the system, and you simply want to add a new
                              size or update specific size-related information
                              (such as stock quantity or price for a particular
                              size), then you should head over to the
                              <strong>"Add Size"</strong> tab.
                            </p>
                          </Col>
                        </Row>
                      </Container>
                    </Tab>
                    <Tab eventKey="add-product" title="Add Product">
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
                                <Form.Group
                                  className="mb-3"
                                  controlId="categoryId"
                                >
                                  <Form.Label>Category Name</Form.Label>
                                  <Form.Select
                                    name="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">Select Category</option>
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
                                  <Form.Control
                                    type="text"
                                    name="size"
                                    value={newProduct.size}
                                    onChange={handleChange}
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
                                  <Form.Label>Product Image</Form.Label>
                                  <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="qtyInStock"
                                >
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
                            {imageError && (
                              <Alert variant="danger">{imageError}</Alert>
                            )}
                            {createError && (
                              <Alert variant="danger">{createError}</Alert>
                            )}
                            {createSuccess && (
                              <Alert variant="success">{createSuccess}</Alert>
                            )}
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
                    </Tab>
                    <Tab eventKey="add-size" title="Add Size">
                      <Modal.Body>
                        <Form onSubmit={handleAddSize}>
                          <Container>
                            <Row>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="productName"
                                >
                                  <Form.Label>Product Name</Form.Label>
                                  <Form.Select
                                    name="productId"
                                    value={selectedProductId}
                                    onChange={(e) =>
                                      setSelectedProductId(e.target.value)
                                    }
                                    required
                                  >
                                    <option value="">Select Product</option>
                                    {product.map((productItem) => (
                                      <option
                                        key={productItem.productId}
                                        value={productItem.productId}
                                      >
                                        {productItem.productName}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Form.Group className="mb-3" controlId="size">
                                  <Form.Label>Size</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="size"
                                    value={newSize.size}
                                    onChange={handleSizeInputChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="qtyInStock"
                                >
                                  <Form.Label>Quantity</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="qtyInStock"
                                    value={newSize.qtyInStock || ""}
                                    onChange={handleSizeInputChange}
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
                                    value={newSize.price}
                                    onChange={handleSizeInputChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button variant="success" type="submit">
                                Save
                              </Button>
                            </Modal.Footer>
                            {alertMessage && (
                              <Alert variant="danger">{alertMessage}</Alert>
                            )}
                            {successSize && (
                              <Alert variant="success">{successSize}</Alert>
                            )}
                          </Container>
                        </Form>
                      </Modal.Body>
                    </Tab>
                  </Tabs>
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
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => {
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
                                src={`/images/${item.productImage}`}
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
                            <td className="td">
                              {formatCurrency(currentSize.price)}
                            </td>
                            <td className="td">
                              <div className="icon-container">
                                <div className="icon-container1">
                                  {/* Create description information */}
                                  <FaRegSquarePlus
                                    className="product__icon1 product__icon--menu"
                                    onClick={() => {
                                      setCurrentProductId(item.productId);
                                      handleShow2();
                                    }}
                                  />

                                  <Link
                                    to={`/product/detail/${item.productId}`}
                                    className="link__icon"
                                  >
                                    <FaBars className="product__icon1 product__icon--menu" />
                                  </Link>
                                </div>

                                <div className="icon-container2">
                                  {/* Update Product */}
                                  <FaPenToSquare
                                    className="product__icon1 product__icon--edit"
                                    onClick={() => openEditModal(item)}
                                  />

                                  <FaTrash
                                    className="product__icon1 product__icon--delete"
                                    onClick={() =>
                                      handleShowDelete(item.productId)
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
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

      {/* Modal Update Product */}
      <Modal size="lg" show={lgShow1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Container>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="productName">
                    <Form.Label>Product Name</Form.Label>
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
                  <Form.Group className="mb-3" controlId="categoryId">
                    <Form.Label>Category Name</Form.Label>
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
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
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
                  <Form.Group className="mb-3" controlId="productImage">
                    <Form.Label>Product Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="productImage"
                      onChange={(e) => setEditProductImage(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {editProduct.sizes.map((sizeData, index) => (
                <Row key={index}>
                  <Col>
                    <Form.Group className="mb-3" controlId={`size-${index}`}>
                      <Form.Label>Size</Form.Label>
                      <Form.Control
                        type="text"
                        name="size"
                        value={sizeData.size}
                        onChange={(e) =>
                          handleSizeChangeUpdate(index, "size", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId={`qtyInStock-${index}`}
                    >
                      <Form.Label>Quantity in Stock</Form.Label>
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
                    <Form.Group className="mb-3" controlId={`price-${index}`}>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={sizeData.price}
                        onChange={(e) =>
                          handleSizeChangeUpdate(index, "price", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ))}

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose1}>
                  Close
                </Button>
                <Button variant="warning" type="submit">
                  Update
                </Button>
              </Modal.Footer>
              {updateError && <Alert variant="danger">{updateError}</Alert>}
              {updateSuccess && (
                <Alert variant="success">{updateSuccess}</Alert>
              )}
              {imageError && <Alert variant="danger">{imageError}</Alert>}
            </Container>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Add Product Description */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="desTitleID">
              <Form.Label>Description Title</Form.Label>
              <Form.Select
                name="desTitleID"
                value={newDesInfo.desTitleID}
                onChange={handleDesInfoChange}
              >
                <option value="">Select Description Title</option>
                {desTitles.map((title, index) => (
                  <option key={index} value={index + 1}>
                    {title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="desInfo">
              <Form.Label>Description Information</Form.Label>
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
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddDesInfo}>
            Create
          </Button>
        </Modal.Footer>
        {desError && <Alert variant="danger">{desError}</Alert>}
        {desSuccess && <Alert variant="success">{desSuccess}</Alert>}
      </Modal>

      {/* Modal Delete Product */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal>
    </>
  );
};

export default Product;
