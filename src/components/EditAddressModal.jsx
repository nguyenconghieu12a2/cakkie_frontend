import React, { useState, useEffect } from "react";
import axios from "axios";

const EditAddressModal = ({ userId, address, onClose, onUpdateAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(
    address.provinceCode || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    recievedName: address.receivedName || "",
    detailAddress: address.detailAddress || "",
    wardsCode: address.wardCode || "",
    isDefault: address.default || false,
  });

  useEffect(() => {
    axios
      .get("/api/provinces")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .post("/api/districts", { provinceCode: selectedProvince })
        .then((response) => {
          setDistricts(response.data);
          const matchedDistrict = response.data.find(
            (district) => district.fullNameEn === address.districtName
          );
          if (matchedDistrict) {
            setSelectedDistrict(matchedDistrict.code);
          }
        })
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, address.districtName]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .post("/api/wards", { districtCode: selectedDistrict })
        .then((response) => {
          setWards(response.data);
          const matchedWard = response.data.find(
            (ward) => ward.fullNameEn === address.wardName
          );
          if (matchedWard) {
            setFormData((prevData) => ({
              ...prevData,
              wardsCode: matchedWard.code,
            }));
          }
        })
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict, address.wardName]);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setFormData((prevData) => ({ ...prevData, wardsCode: "" }));
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setFormData((prevData) => ({ ...prevData, wardsCode: "" }));
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
    if (!validateForm()) return;

    const addressData = {
      recievedName: formData.recievedName,
      detailAddress: formData.detailAddress,
      districtsCode: selectedDistrict,
      wardsCode: formData.wardsCode,
      isDefault: formData.isDefault,
    };

    try {
      await axios.put(
        `/api/user/${userId}/address/${address.addressId}/update`,
        addressData
      );
      onUpdateAddress({ ...address, ...addressData }); // Pass updated address back to MyAddress
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please check your input and try again.");
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h3 className="custom-modal-title">Edit Address</h3>
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
            Save
          </button>
          <button type="button" onClick={onClose} className="custom-cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
