import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressModal = ({ userId, onClose, onAddAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    recievedName: "",
    detailAddress: "",
    wardsCode: "",
    isDefault: false,
  });

  useEffect(() => {
    axios
      .get("/api/provinces")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setWards([]);
    setFormData({ ...formData, wardsCode: "" });

    axios
      .post("/api/districts", { provinceCode })
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setFormData({ ...formData, wardsCode: "" });

    axios
      .post("/api/wards", { districtCode })
      .then((response) => setWards(response.data))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recievedName.trim())
      newErrors.recievedName = "Recipient Name is required.";
    if (!formData.detailAddress.trim())
      newErrors.detailAddress = "Detail Address is required.";
    if (!selectedProvince.trim()) newErrors.province = "Province is required.";
    if (!selectedDistrict.trim()) newErrors.district = "District is required.";
    if (!formData.wardsCode.trim()) newErrors.ward = "Ward is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    const addressData = {
      recievedName: formData.recievedName,
      detailAddress: formData.detailAddress,
      districtsCode: selectedDistrict,
      wardsCode: formData.wardsCode,
      isDefault: formData.isDefault,
    };

    try {
      const response = await axios.post(
        `/api/user/${userId}/address/add`,
        addressData
      );
      const newAddressData = response.data;

      const provinceName =
        provinces.find((prov) => prov.code === selectedProvince)?.fullNameEn ||
        "No Province";
      const districtName =
        districts.find((dist) => dist.code === selectedDistrict)?.fullNameEn ||
        "No District";
      const wardName =
        wards.find((ward) => ward.code === formData.wardsCode)?.fullNameEn ||
        "No Ward";

      const newAddress = {
        addressId: newAddressData.addressId.id,
        receivedName: newAddressData.addressId.recievedName,
        detailAddress: newAddressData.addressId.detailAddress,
        provinceName,
        districtName,
        wardName,
        phone: newAddressData.userId.phone || "No Phone",
        default: newAddressData.isDefault === 1,
      };

      onAddAddress(newAddress);
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please check your input and try again.");
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h3 className="custom-modal-title">New Address</h3>
        <form onSubmit={handleSubmit}>
          <div className="custom-form-group">
            <input
              type="text"
              name="recievedName"
              placeholder="Recipient Name"
              className="custom-form-control"
              value={formData.recievedName}
              onChange={(e) =>
                setFormData({ ...formData, recievedName: e.target.value })
              }
              required
            />
            {errors.recievedName && (
              <p className="error-message">{errors.recievedName}</p>
            )}
          </div>
          <div className="custom-form-group">
            <input
              type="text"
              name="detailAddress"
              placeholder="Detail Address"
              className="custom-form-control"
              value={formData.detailAddress}
              onChange={(e) =>
                setFormData({ ...formData, detailAddress: e.target.value })
              }
              required
            />
            {errors.detailAddress && (
              <p className="error-message">{errors.detailAddress}</p>
            )}
          </div>
          <div className="custom-form-group-horizontal">
            <select
              className="custom-form-control"
              onChange={handleProvinceChange}
              value={selectedProvince}
              disabled={provinces.length === 0}
              required
            >
              <option value="" disabled>
                Select Province
              </option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.fullNameEn}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="error-message">{errors.province}</p>
            )}
            <select
              className="custom-form-control"
              onChange={handleDistrictChange}
              value={selectedDistrict}
              disabled={!selectedProvince || districts.length === 0}
              required
            >
              <option value="" disabled>
                Select District
              </option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.fullNameEn}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="error-message">{errors.district}</p>
            )}
            <select
              className="custom-form-control"
              onChange={(e) =>
                setFormData({ ...formData, wardsCode: e.target.value })
              }
              value={formData.wardsCode}
              disabled={!selectedDistrict || wards.length === 0}
              required
            >
              <option value="" disabled>
                Select Ward
              </option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.fullNameEn}
                </option>
              ))}
            </select>
            {errors.ward && <p className="error-message">{errors.ward}</p>}
          </div>
          <div className="custom-form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
              />
              Set as default address
            </label>
          </div>
          <button type="submit" className="custom-submit-btn">
            Submit
          </button>
          <button type="button" onClick={onClose} className="custom-cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
