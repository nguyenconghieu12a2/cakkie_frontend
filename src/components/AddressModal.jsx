import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressModal = ({ userId, onClose, onAddAddress }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const [formData, setFormData] = useState({
        recievedName: '',
        detailAddress: '',
        districtsCode: '',
        wardsCode: '',
        isDefault: false,
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/provinces')
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Error fetching provinces:", error));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setWards([]);

        axios.post('http://localhost:8080/api/districts', { provinceCode })
            .then(response => setDistricts(response.data))
            .catch(error => console.error("Error fetching districts:", error));
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);

        axios.post('http://localhost:8080/api/wards', { districtCode })
            .then(response => setWards(response.data))
            .catch(error => console.error("Error fetching wards:", error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const addressData = {
            recievedName: formData.recievedName,
            detailAddress: formData.detailAddress,
            districtsCode: selectedDistrict,
            wardsCode: formData.wardsCode,
            isDefault: formData.isDefault,
        };
    
        try {
            const response = await axios.post(`http://localhost:8080/api/user/${userId}/address/add`, addressData);
            const newAddressData = response.data;
            console.log("New Address Response:", newAddressData);  // Log to inspect
    
            const provinceName = provinces.find(prov => prov.code === selectedProvince)?.fullNameEn || "No Province";
            const districtName = districts.find(dist => dist.code === selectedDistrict)?.fullNameEn || "No District";
            const wardName = wards.find(ward => ward.code === formData.wardsCode)?.fullNameEn || "No Ward";
    
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
                            onChange={(e) => setFormData({ ...formData, recievedName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="custom-form-group">
                        <input
                            type="text"
                            name="detailAddress"
                            placeholder="Detail Address"
                            className="custom-form-control"
                            value={formData.detailAddress}
                            onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                            required
                        />
                    </div>
                    <div className="custom-form-group-horizontal">
                        <select
                            className="custom-form-control"
                            onChange={handleProvinceChange}
                            value={selectedProvince}
                            disabled={provinces.length === 0}
                            required
                        >
                            <option value="" disabled>Select Province</option>
                            {provinces.map(province => (
                                <option key={province.code} value={province.code}>{province.fullNameEn}</option>
                            ))}
                        </select>
                        <select
                            className="custom-form-control"
                            onChange={handleDistrictChange}
                            value={selectedDistrict}
                            disabled={!selectedProvince || districts.length === 0}
                            required
                        >
                            <option value="" disabled>Select District</option>
                            {districts.map(district => (
                                <option key={district.code} value={district.code}>{district.fullNameEn}</option>
                            ))}
                        </select>
                        <select
                            className="custom-form-control"
                            onChange={(e) => setFormData({ ...formData, wardsCode: e.target.value })}
                            value={formData.wardsCode}
                            disabled={!selectedDistrict || wards.length === 0}
                            required
                        >
                            <option value="" disabled>Select Ward</option>
                            {wards.map(ward => (
                                <option key={ward.code} value={ward.code}>{ward.fullNameEn}</option>
                            ))}
                        </select>
                    </div>
                    <div className="custom-form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            Set as default address
                        </label>
                    </div>
                    <button type="submit" className="custom-submit-btn">Submit</button>
                    <button type="button" onClick={onClose} className="custom-cancel-btn">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
