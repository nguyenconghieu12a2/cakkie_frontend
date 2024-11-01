import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddressModal from './AddressModal';
import EditAddressModal from './EditAddressModal';
import '../style/MyAddress.css';

const MyAddress = ({ userId, reloadKey, refreshAddresses }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/${userId}/addresses`);
                setAddresses(response.data.sort((a, b) => b.default - a.default) || []);
            } catch (error) {
                console.error("Error fetching addresses:", error);
                setAddresses([]);
            }
        };

        if (userId) {
            fetchAddresses();
        }
    }, [userId, reloadKey]);

    const handleAddAddress = (newAddress) => {
        setAddresses((prevAddresses) => {
            const updatedAddresses = newAddress.default
                ? prevAddresses.map((address) => ({ ...address, default: false }))
                : prevAddresses;
            return [...updatedAddresses, newAddress].sort((a, b) => b.default - a.default);
        });
        setIsModalOpen(false);
        refreshAddresses();
    };

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setIsEditModalOpen(true);
    };

    const handleUpdateAddress = (updatedAddress) => {
        setAddresses((prevAddresses) =>
            prevAddresses
                .map((address) =>
                    address.addressId === updatedAddress.addressId ? updatedAddress : address
                )
                .sort((a, b) => b.default - a.default)
        );
        setIsEditModalOpen(false);
        refreshAddresses();
    };

    const handleSetDefault = async (addressId) => {
        try {
            await axios.put(`http://localhost:8080/api/user/${userId}/address/${addressId}/set-default`);
            setAddresses((prevAddresses) =>
                prevAddresses
                    .map((address) => ({
                        ...address,
                        default: address.addressId === addressId,
                    }))
                    .sort((a, b) => b.default - a.default)
            );
            refreshAddresses();
        } catch (error) {
            console.error("Error setting default address:", error);
        }
    };

    const handleDeleteAddress = async () => {
        if (!addressToDelete) return;
        try {
            await axios.delete(`http://localhost:8080/api/user/${userId}/address/${addressToDelete.addressId}/delete`);
            setAddresses((prevAddresses) =>
                prevAddresses
                    .filter((address) => address.addressId !== addressToDelete.addressId)
                    .sort((a, b) => b.default - a.default)
            );
            setIsDeleteModalOpen(false);
            refreshAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const confirmDeleteAddress = (address) => {
        setAddressToDelete(address);
        setIsDeleteModalOpen(true);
    };

    return (
        <main className="my-address-container">
            <div className="my-address-header">
                <h2 className="my-address-title">My Addresses</h2>
                <button className="my-address-add-btn" onClick={() => setIsModalOpen(true)}>
                    + Add New Address
                </button>
            </div>
            <div className="my-address-list">
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <div className="my-address-info" key={address.addressId}>
                            <div className="my-address-info-header">
                                <h4>{address.receivedName || "No Name"}</h4>
                                <span>{address.phone || "No Phone"}</span>
                            </div>
                            <p>{address.detailAddress || "No Address"}</p>
                            <div className="my-address-details">
                                <span>{address.provinceName || "No Province"}</span>,{" "}
                                <span>{address.districtName || "No District"}</span>,{" "}
                                <span>{address.wardName || "No Ward"}</span>
                            </div>
                            {address.default && (
                                <div className="my-address-tags">
                                    <span className="my-address-tag">Default</span>
                                </div>
                            )}
                            <div className="my-address-actions">
                                <button className="my-address-btn-edit" onClick={() => handleEditAddress(address)}>
                                    Edit
                                </button>
                                {!address.default && (
                                    <>
                                        <button
                                            className="my-address-btn-default"
                                            onClick={() => handleSetDefault(address.addressId)}
                                        >
                                            Set as default
                                        </button>
                                        <button
                                            className="my-address-btn-delete"
                                            onClick={() => confirmDeleteAddress(address)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No addresses found. Please add a new address.</p>
                )}
            </div>
            {isModalOpen && (
                <AddressModal
                    userId={userId}
                    onClose={() => setIsModalOpen(false)}
                    onAddAddress={handleAddAddress}
                />
            )}
            {isEditModalOpen && selectedAddress && (
                <EditAddressModal
                    userId={userId}
                    address={selectedAddress}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdateAddress={handleUpdateAddress}
                />
            )}
            {isDeleteModalOpen && (
                <div className="delete-confirmation-modal">
                    <div className="delete-confirmation-content">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this address?</p>
                        <button onClick={handleDeleteAddress} className="confirm-delete-btn">Yes, Delete</button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="cancel-delete-btn">Cancel</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MyAddress;
