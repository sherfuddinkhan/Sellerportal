// =========================================================
// SellerCustomerList.jsx
// Seller Customer Management
// Create: Separate page
// View/Edit: Separate pages
// Delete: Confirmation dialog
// API: Node.js proxy on port 5000
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Snackbar,
} from "@mui/material";

import SellerCustomerToolbar from "./SellerCustomerToolbar";
import SellerCustomerStatistics from "./SellerCustomerStatistics";
import SellerCustomerSearch from "./SellerCustomerSearch";
import SellerCustomerTable from "./SellerCustomerTable";
import SellerCustomerPagination from "./SellerCustomerPagination";
import DeleteSellerCustomerDialog from "./DeleteSellerCustomerDialog";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";
const SELLER_ID = 6;

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerList = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================
   const [deleteLoading, setDeleteLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // GET CUSTOMER ID
    // Supports camelCase and PascalCase API responses
    // =====================================================

    const getCustomerId = useCallback((row) => {
        return (
            row?.customerId ??
            row?.CustomerId ??
            row?.sellerCustomerId ??
            row?.SellerCustomerId ??
            row?.id ??
            row?.Id ??
            null
        );
    }, []);

    // =====================================================
    // LOAD SELLER CUSTOMERS
    //
    // Node:
    // GET /api/seller-customers/seller/6
    //
    // ASP.NET:
    // GET /api/SellerCustomer/seller/6
    // =====================================================

    const loadSellerCustomers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const url =
                `${SERVER_URL}/api/seller-customers/seller/${SELLER_ID}`;

            console.log("GET SELLER CUSTOMERS:", url);

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                },
            });

            console.log(
                "SELLER CUSTOMERS RESPONSE:",
                response.data
            );

            const data = response.data;

            let customerList = [];

            if (Array.isArray(data)) {
                customerList = data;
            } else if (Array.isArray(data?.data)) {
                customerList = data.data;
            } else if (Array.isArray(data?.Data)) {
                customerList = data.Data;
            } else if (Array.isArray(data?.customers)) {
                customerList = data.customers;
            } else if (Array.isArray(data?.Customers)) {
                customerList = data.Customers;
            } else if (Array.isArray(data?.items)) {
                customerList = data.items;
            } else if (Array.isArray(data?.Items)) {
                customerList = data.Items;
            }

            setCustomers(customerList);
            setPage(1);
        } catch (err) {
            console.error(
                "LOAD SELLER CUSTOMERS ERROR:",
                err.response?.data || err.message
            );

            setCustomers([]);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load seller customers."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadSellerCustomers();
    }, [loadSellerCustomers]);

    // =====================================================
    // CREATE CUSTOMER
    // Navigate to separate Create page
    // =====================================================

    const handleAdd = () => {
        navigate("/seller-customers/create");
    };

    // =====================================================
    // SEARCH + STATUS FILTER
    // =====================================================

    const filteredCustomers = useMemo(() => {
        let result = [...customers];

        const search = searchText.trim().toLowerCase();

        if (search) {
            result = result.filter((item) => {
                const searchableFields = [
                    item?.customerCode ?? item?.CustomerCode,
                    item?.customerName ?? item?.CustomerName,
                    item?.contactPerson ?? item?.ContactPerson,
                    item?.email ?? item?.Email,
                    item?.phone ?? item?.Phone,
                    item?.gstin ?? item?.GSTIN,
                    item?.city ?? item?.City,
                    item?.state ?? item?.State,
                    item?.country ?? item?.Country,
                    item?.postalCode ?? item?.PostalCode,
                ];

                return searchableFields.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            });
        }

        if (statusFilter !== "All") {
            result = result.filter((item) => {
                const activeValue =
                    item?.isActive ?? item?.IsActive ?? false;

                const isActive =
                    activeValue === true ||
                    activeValue === 1 ||
                    String(activeValue).toLowerCase() === "true";

                return statusFilter === "Active"
                    ? isActive
                    : !isActive;
            });
        }

        return result;
    }, [customers, searchText, statusFilter]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCustomers.length / pageSize)
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const pagedCustomers = useMemo(() => {
        const startIndex = (page - 1) * pageSize;

        return filteredCustomers.slice(
            startIndex,
            startIndex + pageSize
        );
    }, [filteredCustomers, page, pageSize]);

    // =====================================================
    // VIEW CUSTOMER
    // Route:
    // /seller-customers/details/6/{customerId}
    // =====================================================

    const handleView = (row) => {
        const customerId = getCustomerId(row);

        if (customerId === null || customerId === "") {
            setError("Customer ID is missing.");
            return;
        }

        navigate(
            `/seller-customers/details/${SELLER_ID}/${customerId}`
        );
    };

    // =====================================================
    // EDIT CUSTOMER
    // Route:
    // /seller-customers/edit/6/{customerId}
    // =====================================================

    const handleEdit = (row) => {
        const customerId = getCustomerId(row);

        if (customerId === null || customerId === "") {
            setError("Customer ID is missing.");
            return;
        }

        navigate(
            `/seller-customers/edit/${SELLER_ID}/${customerId}`
        );
    };

    // =====================================================
    // OPEN DELETE CONFIRMATION DIALOG
    // =====================================================

    const handleDeleteOpen = (customer) => {
        if (!customer) {
            setError("Please select a customer to delete.");
            return;
        }

        const customerId = getCustomerId(customer);

        if (customerId === null || customerId === "") {
            setError("Customer ID is missing.");
            return;
        }

        setSelectedCustomer(customer);
        setDeleteOpen(true);
    };

    // =====================================================
    // DELETE CUSTOMER
    //
    // Node:
    // DELETE /api/seller-customers/6/customers/{customerId}
    //
    // ASP.NET:
    // DELETE /api/SellerCustomer/6/customers/{customerId}
    // =====================================================
// =====================================================
// DELETE CUSTOMER
// =====================================================

const handleDelete = async (customerId) => {
    if (
        customerId === null ||
        customerId === undefined ||
        String(customerId).trim() === ""
    ) {
        setError("Invalid customer ID.");
        return;
    }

    try {
        setDeleteLoading(true);
        setError("");

        const response = await axios.delete(
            `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${customerId}`
        );

        setCustomers((previousCustomers) =>
            previousCustomers.filter(
                (customer) =>
                    String(getCustomerId(customer)) !== String(customerId)
            )
        );

        setDeleteOpen(false);
        setSelectedCustomer(null);

        setSuccess(
            response.data?.message ||
            response.data?.Message ||
            "Seller customer deleted successfully."
        );
    } catch (err) {
        console.error(
            "DELETE SELLER CUSTOMER ERROR:",
            err.response?.data || err.message
        );

        setError(
            err.response?.data?.message ||
            err.response?.data?.Message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to delete seller customer."
        );
    } finally {
        setDeleteLoading(false);
    }
};


    // =====================================================
    // CLOSE DELETE DIALOG
    // =====================================================

  const handleDeleteClose = () => {
    if (deleteLoading) return;

    setDeleteOpen(false);
    setSelectedCustomer(null);
};
    // =====================================================
    // PAGINATION HANDLERS
    // =====================================================

    const handlePageChange = (newPage) => {
        setPage(Number(newPage));
    };

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        setPage(1);
    };

    // =====================================================
    // CLEAR NOTIFICATIONS
    // =====================================================

    const handleClearError = () => {
        setError("");
    };

    const handleClearSuccess = () => {
        setSuccess("");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>
            {/* TOOLBAR */}

            <SellerCustomerToolbar
                onAdd={handleAdd}
                onRefresh={loadSellerCustomers}
                onExport={() => {
                    console.log("EXPORT SELLER CUSTOMERS");
                }}
            />

            {/* STATISTICS */}

            <SellerCustomerStatistics
                customers={customers}
            />

            {/* SEARCH AND STATUS FILTER */}

            <SellerCustomerSearch
                searchText={searchText}
                setSearchText={(value) => {
                    setSearchText(value);
                    setPage(1);
                }}
                statusFilter={statusFilter}
                setStatusFilter={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                }}
            />

            {/* CUSTOMER TABLE */}

            <SellerCustomerTable
                customers={pagedCustomers}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteOpen}
            />

            {/* PAGINATION */}

            {!loading && (
                <SellerCustomerPagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalRecords={filteredCustomers.length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {/* DELETE CONFIRMATION DIALOG */}

         <DeleteSellerCustomerDialog
    open={deleteOpen}
    customer={selectedCustomer}
    onClose={handleDeleteClose}
    onDeleted={handleDelete}
    loading={deleteLoading}
/>

            {/* ERROR NOTIFICATION */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleClearError}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity="error"
                    onClose={handleClearError}
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* SUCCESS NOTIFICATION */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={handleClearSuccess}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity="success"
                    onClose={handleClearSuccess}
                    sx={{ width: "100%" }}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SellerCustomerList;
