import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
    getVendorInfoList,
    getVendorStatusEnums,
    updateVendorVerification
}
    from '../components/services/VendorInfoService'; // Adjust the import path as needed

const VendorInfoDetailsApproveTables = () => {
    const [vendorList, setVendorList] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [enumOptions, setEnumOptions] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [remarkMap, setRemarkMap] = useState({});

    useEffect(() => {
        fetchVendorList();
        fetchEnumOptions();
    }, []);

    const fetchVendorList = () => {
        getVendorInfoList()
            .then((response) => {
                setVendorList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching vendor data:", error);
            });
    };

    const fetchEnumOptions = () => {
        getVendorStatusEnums()
            .then((res) => {
                setEnumOptions(res.data);
            })
            .catch((err) => {
                console.error("Failed to load status enum values", err);
            });
    };
    const handleSubmit = (vendorId) => {
        const selectedStatus = statusMap[vendorId];
        const remark = remarkMap[vendorId];

        if (!selectedStatus) {
            alert("Please select a status.");
            return;
        }
        if (!remark) {
            alert("Please enter a remark.");
            return;
        }

        const payload = {
            vendorDetailsVerification: selectedStatus,
            remark: remark,
        };

        updateVendorVerification(vendorId, payload)
            .then(() => {
                alert("Verification updated successfully!");
                fetchVendorList();
                // Optionally clear input and dropdown for this vendor
                setStatusMap((prev) => ({ ...prev, [vendorId]: "" }));
                setRemarkMap((prev) => ({ ...prev, [vendorId]: "" }));
            })
            .catch((error) => {
                console.error("Error updating vendor verification:", error);
                alert("Failed to update verification status.");
            });
    };


    const handleCompanyClick = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedVendor(null);
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
           
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Verification Remark</th>
                        <th>Vendor Verification Details </th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>           
                    {vendorList.map((vendor) => (
                        <tr key={vendor.id}>
                            <td>{vendor.id}</td>
                            <td>
                                <button
                                    className="btn btn-link p-0"
                                    onClick={() => handleCompanyClick(vendor)}
                                >
                                    {vendor.companyName}
                                </button>
                            </td>
                            <td>{vendor.email}</td>
                            <td>{vendor.city}</td>
                            <td>{vendor.verificationRemark}</td>
                            <td>{vendor.vendorDetailsVerification}</td>
                            <td>
                                <select
                                    className="form-select"
                                    value={statusMap[vendor.id] || ""}
                                    onChange={(e) =>
                                        setStatusMap({ ...statusMap, [vendor.id]: e.target.value })
                                    }
                                >
                                    <option value="">Select Status</option>
                                    {enumOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter remark"
                                    value={remarkMap[vendor.id] || ""}
                                    onChange={(e) =>
                                        setRemarkMap({ ...remarkMap, [vendor.id]: e.target.value })
                                    }
                                />
                            </td>

                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleSubmit(vendor.id)}
                                >
                                    Submit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Vendor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVendor && (
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>Company</th>
                                    <td>{selectedVendor.companyName}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{selectedVendor.address}</td>
                                </tr>
                                <tr>
                                    <th>City</th>
                                    <td>{selectedVendor.city}</td>
                                </tr>
                                <tr>
                                    <th>Pin Code</th>
                                    <td>{selectedVendor.pinCode}</td>
                                </tr>
                                <tr>
                                    <th>Telephone</th>
                                    <td>{selectedVendor.telephone}</td>
                                </tr>
                                <tr>
                                    <th>Mobile</th>
                                    <td>{selectedVendor.mobile}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{selectedVendor.email}</td>
                                </tr>
                                <tr>
                                    <th>Contact Person</th>
                                    <td>{selectedVendor.contactPerson}</td>
                                </tr>
                                <tr>
                                    <th>PAN</th>
                                    <td>{selectedVendor.pan}</td>
                                </tr>
                                <tr>
                                    <th>GST</th>
                                    <td>{selectedVendor.gst}</td>
                                </tr>
                                <tr>
                                    <th>MSME</th>
                                    <td>{selectedVendor.msme}</td>
                                </tr>
                                <tr>
                                    <th>Service Type</th>
                                    <td>
                                        {selectedVendor.serviceType}
                                        {selectedVendor.serviceTypeOther && (
                                            <div>Other: {selectedVendor.serviceTypeOther}</div>
                                        )}
                                    </td>
                                </tr>


                                <tr>
                                    <th colSpan={2} style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
                                        Bank Details
                                    </th>
                                </tr>
                                <tr>
                                    <th>Bank Name</th>
                                    <td>{selectedVendor.bankDetails.bankName}</td>
                                </tr>
                                <tr>
                                    <th>Account Name</th>
                                    <td>{selectedVendor.bankDetails.accountName}</td>
                                </tr>
                                <tr>
                                    <th>Account Number</th>
                                    <td>{selectedVendor.bankDetails.accountNumber}</td>
                                </tr>
                                <tr>
                                    <th>IFSC Code</th>
                                    <td>{selectedVendor.bankDetails.ifscCode}</td>
                                </tr>
                                <tr>
                                    <th>Branch Address</th>
                                    <td>{selectedVendor.bankDetails.branchAddress}</td>
                                </tr>
                                <tr>
                                    <th>Cheque Image</th>
                                    <td>

                                        {selectedVendor.bankDetails.chequeImageUrl ? (
                                            <img
                                                src={selectedVendor.bankDetails.chequeImageUrl}
                                                alt="Cheque"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        ) : (
                                            "No image available"
                                        )}
                                    </td>
                                </tr>


                                <tr>
                                    <th colSpan={2} style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
                                        Directors
                                    </th>
                                </tr>
                                {selectedVendor.directors.map((director) => (
                                    <React.Fragment key={director.id}>
                                        <tr>
                                            <th>Name</th>
                                            <td>{director.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Designation</th>
                                            <td>{director.designation}</td>
                                        </tr>
                                        {director.address && (
                                            <tr>
                                                <th>Address</th>
                                                <td>{director.address}</td>
                                            </tr>
                                        )}
                                        {director.phone && (
                                            <tr>
                                                <th>Phone</th>
                                                <td>{director.phone}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan={2}>
                                                <hr />
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VendorInfoDetailsApproveTables;
