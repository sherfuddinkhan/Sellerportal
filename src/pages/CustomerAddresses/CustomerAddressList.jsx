
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import CustomerAddressToolbar from "./CustomerAddressToolbar";
import CustomerAddressStatistics from "./CustomerAddressStatistics";
import CustomerAddressSearch from "./CustomerAddressSearch";
import CustomerAddressTable from "./CustomerAddressTable";
import CustomerAddressPagination from "./CustomerAddressPagination";
import CustomerAddressModal from "./CustomerAddressModal";
import CustomerAddressView from "./CustomerAddressView";
import DeleteCustomerAddressDialog from "./DeleteCustomerAddressDialog";

// ============================================================
// API URLS
// ============================================================

// GET ALL:
// GET http://localhost:5000/api/customerAddress/all

// GET BY CUSTOMER:
// GET http://localhost:5000/api/customer-addresses/customer/3

// GET BY SELLER + CUSTOMER:
// GET http://localhost:5000/api/customer-addresses/seller/6/customer/3

// GET BY ID:
// GET http://localhost:5000/api/customer-addresses/1

// CREATE:
// POST http://localhost:5000/api/customer-addresses

// UPDATE:
// PUT http://localhost:5000/api/customer-addresses/1

// DELETE:
// DELETE http://localhost:5000/api/customer-addresses/1

const API_URL = "http://localhost:5000/api/customer-addresses";

const GET_ALL_URL =
    "http://localhost:5000/api/customerAddress/all";

// ============================================================
// NORMALIZE ADDRESS
// Supports camelCase, PascalCase and common ID variants.
// ============================================================

const normalizeAddress = (item = {}) => ({
    CustomerAddressId:
        item.CustomerAddressId ??
        item.customerAddressId ??
        item.CustomerAddressID ??
        item.customerAddressID ??
        item.Id ??
        item.id ??
        0,

    CustomerId:
        item.CustomerId ??
        item.customerId ??
        0,

    AddressType:
        item.AddressType ??
        item.addressType ??
        "",

    AddressLine1:
        item.AddressLine1 ??
        item.addressLine1 ??
        "",

    AddressLine2:
        item.AddressLine2 ??
        item.addressLine2 ??
        "",

    City:
        item.City ??
        item.city ??
        "",

    State:
        item.State ??
        item.state ??
        "",

    Country:
        item.Country ??
        item.country ??
        "",

    PostalCode:
        item.PostalCode ??
        item.postalCode ??
        "",

    IsDefault:
        item.IsDefault ??
        item.isDefault ??
        false,

    CreatedDate:
        item.CreatedDate ??
        item.createdDate ??
        null
});

// ============================================================
// EXTRACT ARRAY FROM API RESPONSE
// ============================================================

const extractAddresses = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items;
    }

    if (Array.isArray(responseData?.$values)) {
        return responseData.$values;
    }

    if (Array.isArray(responseData?.Data)) {
        return responseData.Data;
    }

    if (Array.isArray(responseData?.Items)) {
        return responseData.Items;
    }

    return [];
};

// ============================================================
// COMPONENT
// ============================================================

const CustomerAddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [addressTypeFilter, setAddressTypeFilter] =
        useState("All");

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // MESSAGE
    // ========================================================

    const showMessage = useCallback(
        (message, severity = "success") => {
            setSnackbar({
                open: true,
                message,
                severity
            });
        },
        []
    );

    // ========================================================
    // LOAD ALL CUSTOMER ADDRESSES
    // ========================================================

    const loadCustomerAddresses = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axios.get(GET_ALL_URL);

            console.log(
                "Customer Addresses API Response:",
                response.data
            );

            const data = extractAddresses(response.data);

            setAddresses(data.map(normalizeAddress));
        } catch (error) {
            console.error(
                "Load Customer Addresses Error:",
                {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            );

            setAddresses([]);

            showMessage(
                error.response?.data?.details ||
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to load customer addresses.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadCustomerAddresses();
    }, [loadCustomerAddresses]);

    // ========================================================
    // SEARCH AND FILTER
    // ========================================================

    const filteredAddresses = useMemo(() => {
        let result = [...addresses];

        if (searchText.trim()) {
            const search = searchText.trim().toLowerCase();

            result = result.filter((item) =>
                [
                    item.AddressType,
                    item.AddressLine1,
                    item.AddressLine2,
                    item.City,
                    item.State,
                    item.Country,
                    item.PostalCode,
                    String(item.CustomerId),
                    String(item.CustomerAddressId)
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                )
            );
        }

        if (addressTypeFilter !== "All") {
            result = result.filter(
                (item) =>
                    item.AddressType.toLowerCase() ===
                    addressTypeFilter.toLowerCase()
            );
        }

        return result;
    }, [addresses, searchText, addressTypeFilter]);

    // ========================================================
    // RESET PAGE WHEN FILTER CHANGES
    // ========================================================

    useEffect(() => {
        setPage(1);
    }, [searchText, addressTypeFilter, pageSize]);

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAddresses.length / pageSize)
    );

    const pagedAddresses = useMemo(() => {
        const startIndex = (page - 1) * pageSize;

        return filteredAddresses.slice(
            startIndex,
            startIndex + pageSize
        );
    }, [filteredAddresses, page, pageSize]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    // ========================================================
    // CREATE / UPDATE CUSTOMER ADDRESS
    // ========================================================

    const handleSave = async (data) => {
        const customerAddressId = Number(
            data?.CustomerAddressId ??
            data?.customerAddressId ??
            data?.CustomerAddressID ??
            data?.customerAddressID ??
            data?.Id ??
            data?.id ??
            0
        );

        const customerId = Number(
            data?.CustomerId ??
            data?.customerId ??
            0
        );

        if (!Number.isInteger(customerId) || customerId <= 0) {
            showMessage(
                "Please provide a valid customer ID.",
                "error"
            );
            return;
        }

        if (
            customerAddressId !== 0 &&
            (
                !Number.isInteger(customerAddressId) ||
                customerAddressId < 0
            )
        ) {
            showMessage(
                "Invalid customer address ID.",
                "error"
            );
            return;
        }

        const payload = {
            customerAddressId:
                customerAddressId > 0
                    ? customerAddressId
                    : 0,

            customerId,

            addressType:
                data?.AddressType ??
                data?.addressType ??
                "",

            addressLine1:
                data?.AddressLine1 ??
                data?.addressLine1 ??
                "",

            addressLine2:
                data?.AddressLine2 ??
                data?.addressLine2 ??
                "",

            city:
                data?.City ??
                data?.city ??
                "",

            state:
                data?.State ??
                data?.state ??
                "",

            country:
                data?.Country ??
                data?.country ??
                "",

            postalCode:
                data?.PostalCode ??
                data?.postalCode ??
                "",

            isDefault:
                data?.IsDefault ??
                data?.isDefault ??
                false,

            createdDate:
                data?.CreatedDate ??
                data?.createdDate ??
                null
        };

        try {
            setLoading(true);

            if (customerAddressId > 0) {
                await axios.put(
                    `${API_URL}/${customerAddressId}`,
                    payload
                );

                showMessage(
                    "Customer address updated successfully.",
                    "success"
                );
            } else {
                await axios.post(
                    API_URL,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                showMessage(
                    "Customer address created successfully.",
                    "success"
                );
            }

            setModalOpen(false);
            setSelectedAddress(null);

            await loadCustomerAddresses();
        } catch (error) {
            console.error(
                "Save Customer Address Error:",
                {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            );

            showMessage(
                error.response?.data?.details ||
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to save customer address.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // DELETE CUSTOMER ADDRESS
    // ========================================================

    const handleDelete = async (id) => {
        const addressId = Number(
            id?.CustomerAddressId ??
            id?.customerAddressId ??
            id?.CustomerAddressID ??
            id?.customerAddressID ??
            id?.Id ??
            id?.id ??
            id
        );

        if (
            !Number.isInteger(addressId) ||
            addressId <= 0
        ) {
            console.error(
                "Invalid customer address ID:",
                id
            );

            showMessage(
                "Cannot delete: customer address ID is missing or invalid.",
                "error"
            );

            return;
        }

        try {
            setLoading(true);

            await axios.delete(`${API_URL}/${addressId}`);

            setDeleteOpen(false);
            setSelectedAddress(null);

            showMessage(
                "Customer address deleted successfully.",
                "success"
            );

            await loadCustomerAddresses();
        } catch (error) {
            console.error(
                "Delete Customer Address Error:",
                {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            );

            showMessage(
                error.response?.data?.details ||
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to delete customer address.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // VIEW
    // ========================================================

    const handleView = (row) => {
        setSelectedAddress(row);
        setViewOpen(true);
    };

    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (row) => {
        const address = normalizeAddress(row);

        if (
            !Number.isInteger(Number(address.CustomerAddressId)) ||
            Number(address.CustomerAddressId) <= 0
        ) {
            console.error(
                "Cannot edit address without a valid ID:",
                row
            );

            showMessage(
                "Cannot edit: customer address ID is missing.",
                "error"
            );

            return;
        }

        setSelectedAddress(address);
        setModalOpen(true);
    };

    // ========================================================
    // DELETE DIALOG
    // ========================================================

    const handleDeleteClick = (row) => {
        const address = normalizeAddress(row);

        if (
            !Number.isInteger(Number(address.CustomerAddressId)) ||
            Number(address.CustomerAddressId) <= 0
        ) {
            console.error(
                "Cannot delete address without a valid ID:",
                row
            );

            showMessage(
                "Cannot delete: customer address ID is missing.",
                "error"
            );

            return;
        }

        setSelectedAddress(address);
        setDeleteOpen(true);
    };

    // ========================================================
    // ADD
    // ========================================================

    const handleAdd = () => {
        setSelectedAddress(null);
        setModalOpen(true);
    };

    // ========================================================
    // CLOSE HANDLERS
    // ========================================================

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedAddress(null);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedAddress(null);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setSelectedAddress(null);
    };

    // ========================================================
    // PAGE SIZE
    // ========================================================

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        setPage(1);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            sx={{
                p: 3,
                position: "relative"
            }}
        >
            <CustomerAddressToolbar
                onAdd={handleAdd}
                onRefresh={loadCustomerAddresses}
                onExport={() =>
                    console.log("Export Customer Addresses")
                }
            />

            <CustomerAddressStatistics
                addresses={addresses}
            />

            <CustomerAddressSearch
                searchText={searchText}
                setSearchText={setSearchText}
                addressTypeFilter={addressTypeFilter}
                setAddressTypeFilter={setAddressTypeFilter}
            />

            {loading && addresses.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 6
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <CustomerAddressTable
                    addresses={pagedAddresses}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            <CustomerAddressPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={filteredAddresses.length}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
            />

            <CustomerAddressModal
                open={modalOpen}
                address={selectedAddress}
                onClose={handleModalClose}
                onSave={handleSave}
            />

            <CustomerAddressView
                open={viewOpen}
                address={selectedAddress}
                onClose={handleViewClose}
            />

            <DeleteCustomerAddressDialog
                open={deleteOpen}
                address={selectedAddress}
                onClose={handleDeleteClose}
                onDeleted={handleDelete}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomerAddressList;