// =========================================================
// SellerCustomerList.jsx
// Seller Customer Management
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Alert,
    Box,
    Snackbar
} from "@mui/material";

import SellerCustomerToolbar
    from "./SellerCustomerToolbar";

import SellerCustomerStatistics
    from "./SellerCustomerStatistics";

import SellerCustomerSearch
    from "./SellerCustomerSearch";

import SellerCustomerTable
    from "./SellerCustomerTable";

import SellerCustomerPagination
    from "./SellerCustomerPagination";

import SellerCustomerModal
    from "./SellerCustomerModal";

import DeleteSellerCustomerDialog
    from "./DeleteSellerCustomerDialog";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

const SELLER_ID = 6;


// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [customers, setCustomers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD ALL SELLER CUSTOMERS
    //
    // Node:
    // GET /api/seller-customers/seller/6
    //
    // ASP.NET:
    // GET /api/SellerCustomer/seller/6
    // =====================================================

    const loadSellerCustomers = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const url =
                    `${SERVER_URL}/api/seller-customers/seller/${SELLER_ID}`;


                console.log(
                    "================================================"
                );

                console.log(
                    "GET SELLER CUSTOMERS"
                );

                console.log(
                    "SELLER ID:",
                    SELLER_ID
                );

                console.log(
                    "NODE URL:",
                    url
                );

                console.log(
                    "================================================"
                );


                const response =
                    await fetch(
                        url,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                // =================================================
                // RESPONSE CHECK
                // =================================================

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        `HTTP ${response.status}: ${errorText}`
                    );

                }


                // =================================================
                // READ RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "GET SELLER CUSTOMERS RESPONSE:",
                    data
                );


                // =================================================
                // NORMALIZE RESPONSE
                // =================================================

                let customerList = [];


                if (Array.isArray(data)) {

                    customerList =
                        data;

                }
                else if (
                    Array.isArray(
                        data?.data
                    )
                ) {

                    customerList =
                        data.data;

                }
                else if (
                    Array.isArray(
                        data?.customers
                    )
                ) {

                    customerList =
                        data.customers;

                }
                else if (
                    Array.isArray(
                        data?.Customers
                    )
                ) {

                    customerList =
                        data.Customers;

                }


                console.log(
                    "NORMALIZED CUSTOMER LIST:",
                    customerList
                );


                setCustomers(
                    customerList
                );


                // =================================================
                // RESET PAGE
                // =================================================

                setPage(1);

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

        },
        []
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            loadSellerCustomers();

        },
        [
            loadSellerCustomers
        ]
    );


    // =====================================================
    // SEARCH + STATUS FILTER
    // =====================================================

    const filteredCustomers =
        useMemo(
            () => {

                let result =
                    [...customers];


                // =============================================
                // SEARCH TEXT
                // =============================================

                const search =
                    searchText
                        .trim()
                        .toLowerCase();


                if (search) {

                    result =
                        result.filter(
                            (item) => {

                                const customerCode =
                                    String(
                                        item?.customerCode ??
                                        item?.CustomerCode ??
                                        ""
                                    )
                                        .toLowerCase();


                                const customerName =
                                    String(
                                        item?.customerName ??
                                        item?.CustomerName ??
                                        ""
                                    )
                                        .toLowerCase();


                                const contactPerson =
                                    String(
                                        item?.contactPerson ??
                                        item?.ContactPerson ??
                                        ""
                                    )
                                        .toLowerCase();


                                const email =
                                    String(
                                        item?.email ??
                                        item?.Email ??
                                        ""
                                    )
                                        .toLowerCase();


                                const phone =
                                    String(
                                        item?.phone ??
                                        item?.Phone ??
                                        ""
                                    )
                                        .toLowerCase();


                                const gstin =
                                    String(
                                        item?.gstin ??
                                        item?.GSTIN ??
                                        ""
                                    )
                                        .toLowerCase();


                                const city =
                                    String(
                                        item?.city ??
                                        item?.City ??
                                        ""
                                    )
                                        .toLowerCase();


                                const state =
                                    String(
                                        item?.state ??
                                        item?.State ??
                                        ""
                                    )
                                        .toLowerCase();


                                const country =
                                    String(
                                        item?.country ??
                                        item?.Country ??
                                        ""
                                    )
                                        .toLowerCase();


                                const postalCode =
                                    String(
                                        item?.postalCode ??
                                        item?.PostalCode ??
                                        ""
                                    )
                                        .toLowerCase();


                                return (

                                    customerCode
                                        .includes(search)

                                    ||

                                    customerName
                                        .includes(search)

                                    ||

                                    contactPerson
                                        .includes(search)

                                    ||

                                    email
                                        .includes(search)

                                    ||

                                    phone
                                        .includes(search)

                                    ||

                                    gstin
                                        .includes(search)

                                    ||

                                    city
                                        .includes(search)

                                    ||

                                    state
                                        .includes(search)

                                    ||

                                    country
                                        .includes(search)

                                    ||

                                    postalCode
                                        .includes(search)

                                );

                            }
                        );

                }


                // =============================================
                // STATUS FILTER
                // =============================================

                if (
                    statusFilter !==
                    "All"
                ) {

                    result =
                        result.filter(
                            (item) => {

                                const isActive =
                                    item?.isActive ??
                                    item?.IsActive ??
                                    false;


                                if (
                                    statusFilter ===
                                    "Active"
                                ) {

                                    return (
                                        isActive ===
                                        true
                                    );

                                }


                                if (
                                    statusFilter ===
                                    "Inactive"
                                ) {

                                    return (
                                        isActive ===
                                        false
                                    );

                                }


                                return true;

                            }
                        );

                }


                return result;

            },
            [
                customers,
                searchText,
                statusFilter
            ]
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredCustomers.length /
                pageSize
            )
        );


    // =====================================================
    // KEEP PAGE VALID
    // =====================================================

    useEffect(
        () => {

            if (
                page >
                totalPages
            ) {

                setPage(
                    totalPages
                );

            }

        },
        [
            page,
            totalPages
        ]
    );


    // =====================================================
    // PAGED CUSTOMERS
    // =====================================================

    const pagedCustomers =
        useMemo(
            () => {

                const startIndex =
                    (page - 1) *
                    pageSize;


                const endIndex =
                    startIndex +
                    pageSize;


                return filteredCustomers.slice(
                    startIndex,
                    endIndex
                );

            },
            [
                filteredCustomers,
                page,
                pageSize
            ]
        );


    // =====================================================
    // OPEN CREATE CUSTOMER
    // =====================================================

    const handleAdd = () => {

        console.log(
            "OPEN CREATE SELLER CUSTOMER"
        );


        setSelectedCustomer(
            null
        );


        setModalOpen(
            true
        );

    };


    // =====================================================
    // VIEW CUSTOMER
    //
    // Route:
    // /seller-customers/details/6/3
    //
    // SellerCustomerView.jsx loads the aggregate itself.
    // =====================================================

    const handleView = (row) => {

        console.log(
            "================================================"
        );

        console.log(
            "VIEW SELLER CUSTOMER"
        );

        console.log(
            "ROW:",
            row
        );

        console.log(
            "================================================"
        );


        const customerId =
            row?.CustomerId ??
            row?.customerId;


        if (
            customerId ===
            undefined ||
            customerId ===
            null ||
            String(customerId).trim() === ""
        ) {

            console.error(
                "Customer ID missing:",
                row
            );


            setError(
                "Customer ID is missing."
            );


            return;

        }


        navigate(
            `/seller-customers/details/${SELLER_ID}/${customerId}`
        );

    };


    // =====================================================
    // EDIT CUSTOMER
    //
    // Route:
    // /seller-customers/edit/6/3
    // =====================================================

    const handleEdit = (row) => {

        console.log(
            "================================================"
        );

        console.log(
            "EDIT SELLER CUSTOMER"
        );

        console.log(
            "ROW:",
            row
        );

        console.log(
            "================================================"
        );


        const customerId =
            row?.CustomerId ??
            row?.customerId;


        if (
            customerId ===
            undefined ||
            customerId ===
            null ||
            String(customerId).trim() === ""
        ) {

            console.error(
                "Customer ID missing:",
                row
            );


            setError(
                "Customer ID is missing."
            );


            return;

        }


        navigate(
            `/seller-customers/edit/${SELLER_ID}/${customerId}`
        );

    };


    // =====================================================
    // OPEN DELETE DIALOG
    // =====================================================

    const handleDeleteOpen = (row) => {

        console.log(
            "================================================"
        );

        console.log(
            "OPEN DELETE SELLER CUSTOMER"
        );

        console.log(
            "ROW:",
            row
        );

        console.log(
            "================================================"
        );


        setSelectedCustomer(
            row
        );


        setDeleteOpen(
            true
        );

    };


    // =====================================================
    // SAVE CUSTOMER
    //
    // CREATE:
    // POST /api/seller-customers
    //
    // UPDATE:
    // PUT /api/seller-customers/6/customers/{id}
    // =====================================================

    const handleSave = async (
        data
    ) => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "================================================"
            );

            console.log(
                "SAVE SELLER CUSTOMER"
            );

            console.log(
                "FORM DATA:",
                data
            );

            console.log(
                "================================================"
            );


            // =================================================
            // CUSTOMER ID
            // =================================================

            const customerId =
                data?.customerId ??
                data?.CustomerId;


            let response;


            // =================================================
            // UPDATE
            // =================================================

            if (
                customerId !==
                    undefined &&
                customerId !==
                    null &&
                String(customerId).trim() !== ""
            ) {

                const url =
                    `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${customerId}`;


                console.log(
                    "UPDATE CUSTOMER URL:",
                    url
                );


                response =
                    await fetch(
                        url,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    data
                                )
                        }
                    );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const url =
                    `${SERVER_URL}/api/seller-customers`;


                console.log(
                    "CREATE CUSTOMER URL:",
                    url
                );


                response =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    {
                                        ...data,

                                        SellerId:
                                            SELLER_ID
                                    }
                                )
                        }
                    );

            }


            // =================================================
            // RESPONSE CHECK
            // =================================================

            if (
                !response.ok
            ) {

                const errorText =
                    await response.text();


                console.error(
                    "SAVE CUSTOMER ERROR RESPONSE:",
                    errorText
                );


                throw new Error(
                    `HTTP ${response.status}: ${errorText}`
                );

            }


            // =================================================
            // RELOAD CUSTOMER LIST
            // =================================================

            await loadSellerCustomers();


            // =================================================
            // CLOSE MODAL
            // =================================================

            setModalOpen(
                false
            );


            setSelectedCustomer(
                null
            );


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
    //
    // Node:
    // DELETE /api/seller-customers/6/customers/{id}
    //
    // ASP.NET:
    // DELETE /api/SellerCustomer/6/customers/{id}
    // =====================================================

    const handleDelete = async (
        customerId
    ) => {

        try {

            setLoading(true);

            setError("");


            // =================================================
            // VALIDATE CUSTOMER ID
            // =================================================

            if (
                customerId ===
                    undefined ||
                customerId ===
                    null ||
                String(customerId).trim() === ""
            ) {

                throw new Error(
                    "Customer ID is required."
                );

            }


            const url =
                `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${customerId}`;


            console.log(
                "================================================"
            );

            console.log(
                "DELETE SELLER CUSTOMER"
            );

            console.log(
                "CUSTOMER ID:",
                customerId
            );

            console.log(
                "NODE URL:",
                url
            );

            console.log(
                "================================================"
            );


            const response =
                await fetch(
                    url,
                    {
                        method: "DELETE",

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            // =================================================
            // RESPONSE CHECK
            // =================================================

            if (
                !response.ok
            ) {

                const errorText =
                    await response.text();


                console.error(
                    "DELETE CUSTOMER ERROR RESPONSE:",
                    errorText
                );


                throw new Error(
                    `HTTP ${response.status}: ${errorText}`
                );

            }


            // =================================================
            // RELOAD LIST
            // =================================================

            await loadSellerCustomers();


            // =================================================
            // CLOSE DELETE DIALOG
            // =================================================

            setDeleteOpen(
                false
            );


            setSelectedCustomer(
                null
            );


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

    const handlePageChange = (
        newPage
    ) => {

        setPage(
            Number(newPage)
        );

    };


    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (
        size
    ) => {

        const newSize =
            Number(size);


        setPageSize(
            newSize
        );


        setPage(
            1
        );

    };


    // =====================================================
    // CLOSE CREATE / EDIT MODAL
    // =====================================================

    const handleModalClose = () => {

        setModalOpen(
            false
        );


        setSelectedCustomer(
            null
        );

    };


    // =====================================================
    // CLOSE DELETE DIALOG
    // =====================================================

    const handleDeleteClose = () => {

        setDeleteOpen(
            false
        );


        setSelectedCustomer(
            null
        );

    };


    // =====================================================
    // CLEAR ERROR
    // =====================================================

    const handleClearError = () => {

        setError("");

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <SellerCustomerToolbar

                onAdd={
                    handleAdd
                }

                onRefresh={
                    loadSellerCustomers
                }

                onExport={() => {

                    console.log(
                        "EXPORT SELLER CUSTOMERS"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <SellerCustomerStatistics

                customers={
                    customers
                }

            />


            {/* =================================================
                SEARCH + STATUS FILTER
            ================================================= */}

            <SellerCustomerSearch

                searchText={
                    searchText
                }

                setSearchText={
                    (value) => {

                        setSearchText(
                            value
                        );

                        setPage(
                            1
                        );

                    }
                }

                statusFilter={
                    statusFilter
                }

                setStatusFilter={
                    (value) => {

                        setStatusFilter(
                            value
                        );

                        setPage(
                            1
                        );

                    }
                }

            />


            {/* =================================================
                CUSTOMER TABLE
            ================================================= */}

            <SellerCustomerTable

                customers={
                    pagedCustomers
                }

                loading={
                    loading
                }

                onView={
                    handleView
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDeleteOpen
                }

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading && (

                <SellerCustomerPagination

                    page={
                        page
                    }

                    totalPages={
                        totalPages
                    }

                    pageSize={
                        pageSize
                    }

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


            {/* =================================================
                CREATE CUSTOMER MODAL
            ================================================= */}

            <SellerCustomerModal

                open={
                    modalOpen
                }

                customer={
                    selectedCustomer
                }

                onClose={
                    handleModalClose
                }

                onSave={
                    handleSave
                }

            />


            {/* =================================================
                DELETE CUSTOMER DIALOG
            ================================================= */}

            <DeleteSellerCustomerDialog

                open={
                    deleteOpen
                }

                customer={
                    selectedCustomer
                }

                onClose={
                    handleDeleteClose
                }

                onDeleted={
                    handleDelete
                }

            />


            {/* =================================================
                ERROR SNACKBAR
            ================================================= */}

            <Snackbar

                open={
                    Boolean(error)
                }

                autoHideDuration={
                    6000
                }

                onClose={
                    handleClearError
                }

            >

                <Alert

                    severity="error"

                    onClose={
                        handleClearError
                    }

                    sx={{
                        width:
                            "100%"
                    }}

                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default SellerCustomerList;