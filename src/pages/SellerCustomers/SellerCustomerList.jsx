// =========================================================
// SellerCustomerList.jsx
// Seller Customer Management
// =========================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar,
} from "@mui/material";

import SellerCustomerToolbar from "./SellerCustomerToolbar";
import SellerCustomerStatistics from "./SellerCustomerStatistics";
import SellerCustomerSearch from "./SellerCustomerSearch";
import SellerCustomerTable from "./SellerCustomerTable";
import SellerCustomerPagination from "./SellerCustomerPagination";
import SellerCustomerModal from "./SellerCustomerModal";
import SellerCustomerView from "./SellerCustomerView";
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

    // =====================================================
    // STATE
    // =====================================================

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    const loadSellerCustomers = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/seller-customers/seller/${SELLER_ID}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    `HTTP ${response.status}: ${errorText}`
                );
            }

            const data = await response.json();

            console.log(
                "Seller Customers API Response:",
                data
            );

            const customerList = Array.isArray(data)
                ? data
                : [];

            setCustomers(customerList);

        }
        catch (err) {

            console.error(
                "Load Seller Customers Error:",
                err
            );

            setCustomers([]);

            setError(
                err.message ||
                "Failed to load seller customers."
            );

        }
        finally {

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
    // SEARCH + FILTER
    // =====================================================

    const filteredCustomers = useMemo(() => {

        let result = [...customers];

        // -----------------------------------------------
        // SEARCH
        // -----------------------------------------------

        const search = searchText
            .trim()
            .toLowerCase();

        if (search) {

            result = result.filter((item) => {

                return (

                    String(
                        item.customerCode ??
                        item.CustomerCode ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.customerName ??
                        item.CustomerName ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.contactPerson ??
                        item.ContactPerson ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.email ??
                        item.Email ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.phone ??
                        item.Phone ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.gstin ??
                        item.GSTIN ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.city ??
                        item.City ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.state ??
                        item.State ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)
                );

            });
        }


        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        if (statusFilter !== "All") {

            result = result.filter((item) => {

                const isActive =
                    item.isActive ??
                    item.IsActive ??
                    false;

                return statusFilter === "Active"
                    ? isActive === true
                    : isActive === false;

            });

        }

        return result;

    }, [
        customers,
        searchText,
        statusFilter,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCustomers.length /
            pageSize
        )
    );


    const pagedCustomers =
        filteredCustomers.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =====================================================
    // SAVE CUSTOMER
    // =====================================================

    const handleSave = async (data) => {

        try {

            setLoading(true);

            const customerId =
                data.customerId ??
                data.CustomerId;

            let response;


            // =================================================
            // UPDATE
            // =================================================

            if (customerId) {

                response = await fetch(
                    `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${customerId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(data),
                    }
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                response = await fetch(
                    `${SERVER_URL}/api/seller-customers`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            ...data,
                            SellerId: SELLER_ID,
                        }),
                    }
                );

            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    `HTTP ${response.status}: ${errorText}`
                );
            }


            await loadSellerCustomers();

            setModalOpen(false);

            setSelectedCustomer(null);

        }
        catch (err) {

            console.error(
                "Save Seller Customer Error:",
                err
            );

            setError(
                err.message ||
                "Failed to save customer."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE CUSTOMER
    // =====================================================

    const handleDelete = async (customerId) => {

        try {

            setLoading(true);

            const response = await fetch(
                `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${customerId}`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    `HTTP ${response.status}: ${errorText}`
                );
            }


            await loadSellerCustomers();

            setDeleteOpen(false);

            setSelectedCustomer(null);

        }
        catch (err) {

            console.error(
                "Delete Seller Customer Error:",
                err
            );

            setError(
                err.message ||
                "Failed to delete customer."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (newPage) => {

        setPage(newPage);

    };


    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (size) => {

        setPageSize(size);

        setPage(1);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* ============================================
                TOOLBAR
            ============================================ */}

            <SellerCustomerToolbar

                onAdd={() => {

                    setSelectedCustomer(null);

                    setModalOpen(true);

                }}

                onRefresh={loadSellerCustomers}

                onExport={() => {

                    console.log(
                        "Export Seller Customers"
                    );

                }}

            />


            {/* ============================================
                STATISTICS
            ============================================ */}

            <SellerCustomerStatistics
                customers={customers}
            />


            {/* ============================================
                SEARCH
            ============================================ */}

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


            {/* ============================================
                TABLE
            ============================================ */}

           <SellerCustomerTable
    customers={pagedCustomers}
    loading={loading}

    onView={(row) => {

        console.log("VIEW CUSTOMER:", row);

        const customerId =
            row.CustomerId ??
            row.customerId;

        if (!customerId) {

            console.error(
                "Customer ID missing:",
                row
            );

            return;
        }

        navigate(
            `/seller-customers/${customerId}`
        );
    }}

    onEdit={(row) => {

        console.log("EDIT CUSTOMER:", row);

        const customerId =
            row.CustomerId ??
            row.customerId;

        if (!customerId) {

            console.error(
                "Customer ID missing:",
                row
            );

            return;
        }

        navigate(
            `/seller-customers/edit/${customerId}`
        );
    }}

    onDelete={(row) => {

        setSelectedCustomer(row);

        setDeleteOpen(true);

    }}
/>


            {/* ============================================
                PAGINATION
            ============================================ */}

            {!loading && (

                <SellerCustomerPagination

                    page={page}

                    totalPages={totalPages}

                    pageSize={pageSize}

                    totalRecords={
                        filteredCustomers.length
                    }

                    onPageChange={
                        handlePageChange
                    }

                    onPageSizeChange={
                        handlePageSizeChange
                    }

                />

            )}


            {/* ============================================
                CREATE / EDIT
            ============================================ */}

            <SellerCustomerModal

                open={modalOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedCustomer(null);

                }}

                onSave={handleSave}

            />


            {/* ============================================
                VIEW
            ============================================ */}

            <SellerCustomerView

                open={viewOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedCustomer(null);

                }}

            />


            {/* ============================================
                DELETE
            ============================================ */}

            <DeleteSellerCustomerDialog

                open={deleteOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedCustomer(null);

                }}

                onDeleted={handleDelete}

            />


            {/* ============================================
                ERROR
            ============================================ */}

            <Snackbar

                open={Boolean(error)}

                autoHideDuration={6000}

                onClose={() => setError("")}

            >

                <Alert
                    severity="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default SellerCustomerList;
