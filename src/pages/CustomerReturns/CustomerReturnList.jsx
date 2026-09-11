// =========================================================
// CustomerReturnList.jsx
// Customer Return Management Page
//
// Architecture:
// React
//   ↓
// Node server.js
//   ↓
// ASP.NET Core API
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Snackbar,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import CustomerReturnToolbar
    from "./CustomerReturnToolbar";

import CustomerReturnStatistics
    from "./CustomerReturnStatistics";

import CustomerReturnSearch
    from "./CustomerReturnSearch";

import CustomerReturnTable
    from "./CustomerReturnTable";

import CustomerReturnPagination
    from "./CustomerReturnPagination";

import CustomerReturnModal
    from "./CustomerReturnModal";

import DeleteCustomerReturnDialog
    from "./DeleteCustomerReturnDialog";


// =========================================================
// CONFIGURATION
// =========================================================

// React calls Node only.
// React does NOT call ASP.NET directly.

const SERVER_URL =
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/customer-returns`;


// =========================================================
// CUSTOMER RETURN ID HELPER
// =========================================================

const getCustomerReturnId = (item) => {

    if (!item) {
        return null;
    }

    const rawId =
        item.CustomerReturnId ??
        item.customerReturnId ??
        item.Id ??
        item.id;

    const numericId =
        Number(rawId);

    if (
        !Number.isInteger(numericId) ||
        numericId <= 0
    ) {
        return null;
    }

    return numericId;
};


// =========================================================
// RESPONSE NORMALIZER
// =========================================================

const normalizeReturnsResponse = (
    responseData
) => {

    if (
        Array.isArray(responseData)
    ) {
        return responseData;
    }

    if (
        Array.isArray(
            responseData?.data
        )
    ) {
        return responseData.data;
    }

    if (
        Array.isArray(
            responseData?.items
        )
    ) {
        return responseData.items;
    }

    if (
        Array.isArray(
            responseData?.returns
        )
    ) {
        return responseData.returns;
    }

    if (
        Array.isArray(
            responseData?.customerReturns
        )
    ) {
        return responseData.customerReturns;
    }

    return [];
};


// =========================================================
// API ERROR MESSAGE
// =========================================================

const getApiErrorMessage = (
    error,
    fallbackMessage
) => {

    const responseData =
        error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    if (
        responseData?.message
    ) {
        return responseData.message;
    }

    if (
        responseData?.error
    ) {
        return responseData.error;
    }

    if (
        responseData?.title
    ) {
        return responseData.title;
    }

    return (
        error?.message ||
        fallbackMessage
    );
};


// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnList = () => {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [returns, setReturns] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [selectedReturn, setSelectedReturn] =
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

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD CUSTOMER RETURNS
    // =====================================================

    const loadReturns = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");

                console.log(
                    "================================================"
                );

                console.log(
                    "GET CUSTOMER RETURNS"
                );

                console.log(
                    "URL:",
                    API_URL
                );

                console.log(
                    "================================================"
                );


                const response =
                    await axios.get(
                        API_URL,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },

                            timeout: 30000,
                        }
                    );


                console.log(
                    "GET CUSTOMER RETURNS RESPONSE:",
                    response.data
                );


                const data =
                    normalizeReturnsResponse(
                        response.data
                    );


                setReturns(data);

            }
            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "GET CUSTOMER RETURNS ERROR"
                );

                console.error(
                    "STATUS:",
                    err?.response?.status
                );

                console.error(
                    "RESPONSE:",
                    err?.response?.data
                );

                console.error(
                    "ERROR:",
                    err
                );

                console.error(
                    "================================================"
                );


                setReturns([]);

                setError(
                    getApiErrorMessage(
                        err,
                        "Unable to load customer returns."
                    )
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

    useEffect(() => {

        loadReturns();

    }, [
        loadReturns,
    ]);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredReturns =
        useMemo(() => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            if (!search) {
                return returns;
            }


            return returns.filter(
                (item) => {

                    const returnId =
                        item?.CustomerReturnId ??
                        item?.customerReturnId ??
                        "";

                    const invoiceId =
                        item?.SalesInvoiceId ??
                        item?.salesInvoiceId ??
                        "";

                    const productId =
                        item?.ProductId ??
                        item?.productId ??
                        "";

                    const sellerId =
                        item?.SellerId ??
                        item?.sellerId ??
                        "";

                    const customerId =
                        item?.CustomerId ??
                        item?.customerId ??
                        "";

                    const returnNumber =
                        item?.ReturnNumber ??
                        item?.returnNumber ??
                        "";

                    const returnDate =
                        item?.ReturnDate ??
                        item?.returnDate ??
                        "";

                    const quantity =
                        item?.Quantity ??
                        item?.quantity ??
                        "";

                    const returnAmount =
                        item?.ReturnAmount ??
                        item?.returnAmount ??
                        "";

                    const reason =
                        item?.Reason ??
                        item?.reason ??
                        "";

                    const status =
                        item?.Status ??
                        item?.status ??
                        "";


                    return (

                        String(returnId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(invoiceId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(productId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(sellerId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(customerId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(returnNumber)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(returnDate)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(quantity)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(returnAmount)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(reason)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(status)
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            returns,
            searchText,
        ]);


    // =====================================================
    // RESET PAGE AFTER SEARCH
    // =====================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredReturns.length /
                pageSize
            )
        );


    // =====================================================
    // KEEP PAGE VALID
    // =====================================================

    useEffect(() => {

        if (
            page > totalPages
        ) {

            setPage(
                totalPages
            );

        }

    }, [
        page,
        totalPages,
    ]);


    const pagedReturns =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;

            const endIndex =
                startIndex +
                pageSize;

            return filteredReturns.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredReturns,
            page,
            pageSize,
        ]);


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        if (loading) {
            return;
        }

        setSelectedReturn(null);

        setModalOpen(true);

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (row) => {

        const returnId =
            getCustomerReturnId(row);


        console.log(
            "VIEW CUSTOMER RETURN ID:",
            returnId
        );


        if (!returnId) {

            console.error(
                "Customer Return ID is missing:",
                row
            );

            setError(
                "Invalid Customer Return ID."
            );

            return;
        }


        navigate(
            `/customer-returns/details/${returnId}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        const returnId =
            getCustomerReturnId(row);


        console.log(
            "EDIT CUSTOMER RETURN ID:",
            returnId
        );


        if (!returnId) {

            console.error(
                "Customer Return ID is missing:",
                row
            );

            setError(
                "Invalid Customer Return ID."
            );

            return;
        }


        navigate(
            `/customer-returns/edit/${returnId}`
        );

    };


    // =====================================================
    // OPEN DELETE DIALOG
    //
    // IMPORTANT:
    // This function MUST be inside the component.
    // =====================================================

    const handleDeleteDialog = (row) => {

        if (!row) {

            setError(
                "Customer Return data is missing."
            );

            return;
        }


        const returnId =
            getCustomerReturnId(row);


        console.log(
            "================================================"
        );

        console.log(
            "DELETE DIALOG"
        );

        console.log(
            "ROW:",
            row
        );

        console.log(
            "CUSTOMER RETURN ID:",
            returnId
        );

        console.log(
            "================================================"
        );


        if (!returnId) {

            console.error(
                "Cannot open delete dialog. Invalid ID:",
                row
            );

            setError(
                "Invalid Customer Return ID."
            );

            return;
        }


        // Force normalized numeric ID
        // into selected row.

        setSelectedReturn({
            ...row,
            CustomerReturnId:
                returnId,
        });

        setDeleteOpen(true);

    };


    // =====================================================
    // DELETE CUSTOMER RETURN
    //
    // This function receives ONLY the ID
    // from DeleteCustomerReturnDialog.
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        const returnId =
            Number(id);


        console.log(
            "================================================"
        );

        console.log(
            "DELETE CUSTOMER RETURN"
        );

        console.log(
            "ID RECEIVED:",
            id
        );

        console.log(
            "NUMERIC ID:",
            returnId
        );

        console.log(
            "================================================"
        );


        // =================================================
        // VALIDATE
        // =================================================

        if (
            !Number.isInteger(
                returnId
            ) ||
            returnId <= 0
        ) {

            console.error(
                "INVALID DELETE ID:",
                id
            );

            setError(
                "Invalid Customer Return ID."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            const deleteUrl =
                `${API_URL}/${returnId}`;


            console.log(
                "DELETE URL:",
                deleteUrl
            );


            // =================================================
            // DELETE
            // =================================================

            const response =
                await axios.delete(
                    deleteUrl,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


            console.log(
                "DELETE RESPONSE:",
                response.status,
                response.data
            );


            // =================================================
            // CLOSE DIALOG
            // =================================================

            setDeleteOpen(false);

            setSelectedReturn(null);


            // =================================================
            // REFRESH
            // =================================================

            await loadReturns();

            setPage(1);


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Customer return deleted successfully."
            );

        }
        catch (err) {

            console.error(
                "================================================"
            );

            console.error(
                "DELETE CUSTOMER RETURN ERROR"
            );

            console.error(
                "STATUS:",
                err?.response?.status
            );

            console.error(
                "RESPONSE:",
                err?.response?.data
            );

            console.error(
                "ERROR:",
                err
            );

            console.error(
                "================================================"
            );


            setError(
                getApiErrorMessage(
                    err,
                    `Unable to delete customer return. HTTP ${
                        err?.response?.status ||
                        "Network Error"
                    }`
                )
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSave = async (
        data
    ) => {

        if (loading) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const customerReturnId =
                getCustomerReturnId(
                    data
                );


            // =================================================
            // UPDATE
            // =================================================

            if (
                customerReturnId
            ) {

                console.log(
                    "UPDATE CUSTOMER RETURN:",
                    customerReturnId
                );


                await axios.put(
                    `${API_URL}/${customerReturnId}`,
                    data,
                    {
                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


                setSuccess(
                    "Customer return updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "CREATE CUSTOMER RETURN:",
                    data
                );


                await axios.post(
                    API_URL,
                    data,
                    {
                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


                setSuccess(
                    "Customer return created successfully."
                );

            }


            // =================================================
            // REFRESH
            // =================================================

            await loadReturns();

            setPage(1);

            setModalOpen(false);

            setSelectedReturn(null);

        }
        catch (err) {

            console.error(
                "================================================"
            );

            console.error(
                "SAVE CUSTOMER RETURN ERROR"
            );

            console.error(
                "STATUS:",
                err?.response?.status
            );

            console.error(
                "RESPONSE:",
                err?.response?.data
            );

            console.error(
                "ERROR:",
                err
            );

            console.error(
                "================================================"
            );


            setError(
                getApiErrorMessage(
                    err,
                    "Unable to save customer return."
                )
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        setModalOpen(false);

        setSelectedReturn(null);

    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleCloseDelete = () => {

        if (loading) {
            return;
        }

        setDeleteOpen(false);

        setSelectedReturn(null);

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        newPage
    ) => {

        const numericPage =
            Number(newPage);


        if (
            !Number.isInteger(
                numericPage
            )
        ) {
            return;
        }


        if (
            numericPage < 1 ||
            numericPage > totalPages
        ) {
            return;
        }


        setPage(
            numericPage
        );

    };


    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (
        size
    ) => {

        const numericSize =
            Number(size);


        if (
            !Number.isInteger(
                numericSize
            ) ||
            numericSize <= 0
        ) {
            return;
        }


        setPageSize(
            numericSize
        );

        setPage(1);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
                width: "100%",
                boxSizing: "border-box",
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <CustomerReturnToolbar
                onAdd={handleAdd}
                onRefresh={loadReturns}
                onExport={() => {

                    console.log(
                        "Export Customer Returns"
                    );

                }}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <CustomerReturnStatistics
                returns={returns}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <CustomerReturnSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <CustomerReturnTable
                items={pagedReturns}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteDialog}
            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <CustomerReturnPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={
                    filteredReturns.length
                }
                onPageChange={
                    handlePageChange
                }
                onPageSizeChange={
                    handlePageSizeChange
                }
            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <CustomerReturnModal
                open={modalOpen}
                item={selectedReturn}
                onClose={handleCloseModal}
                onSave={handleSave}
            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteCustomerReturnDialog
                open={deleteOpen}
                item={selectedReturn}
                onClose={handleCloseDelete}
                onDeleted={handleDelete}
            />


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() => {
                    setError("");
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => {
                        setError("");
                    }}
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => {
                    setSuccess("");
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => {
                        setSuccess("");
                    }}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnList;
