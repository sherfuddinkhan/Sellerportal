import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Snackbar,
    Typography
} from "@mui/material";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import SalesInvoiceToolbar
    from "./SalesInvoiceToolbar";

import SalesInvoiceStatistics
    from "./SalesInvoiceStatistics";

import SalesInvoiceSearch
    from "./SalesInvoiceSearch";

import SalesInvoiceTable
    from "./SalesInvoiceTable";

import SalesInvoicePagination
    from "./SalesInvoicePagination";

import DeleteSalesInvoiceDialog
    from "./DeleteSalesInvoiceDialog";

import "./SalesInvoices.css";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

const DEFAULT_PAGE_SIZE = 10;


// =========================================================
// COMPONENT
// =========================================================

const SalesInvoiceList = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [
        salesInvoices,
        setSalesInvoices
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        searchText,
        setSearchText
    ] = useState("");


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pageSize,
        setPageSize
    ] = useState(
        DEFAULT_PAGE_SIZE
    );


    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);


    const [
        selectedInvoice,
        setSelectedInvoice
    ] = useState(null);


    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        severity: "success",
        message: ""
    });


    // =========================================================
    // LOAD SALES INVOICES
    // =========================================================

    const loadSalesInvoices = useCallback(
        async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/sales-invoices`
                    );


                console.log(
                    "SALES INVOICES:",
                    response.data
                );


                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                setSalesInvoices(data);

            }
            catch (error) {

                console.error(
                    "LOAD SALES INVOICES ERROR:",
                    error
                );


                setSalesInvoices([]);


                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        error.response?.data?.message ||
                        "Failed to load Sales Invoices."
                });

            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadSalesInvoices();

    }, [
        loadSalesInvoices
    ]);


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredInvoices =
        useMemo(() => {

            const searchValue =
                searchText
                    .toLowerCase()
                    .trim();


            if (!searchValue) {

                return salesInvoices;

            }


            return salesInvoices.filter(
                (invoice) => {

                    const invoiceNumber =
                        invoice.InvoiceNumber ??
                        invoice.invoiceNumber ??
                        "";


                    const paymentStatus =
                        invoice.PaymentStatus ??
                        invoice.paymentStatus ??
                        "";


                    const status =
                        invoice.Status ??
                        invoice.status ??
                        "";


                    const remarks =
                        invoice.Remarks ??
                        invoice.remarks ??
                        "";


                    const invoiceId =
                        invoice.SalesInvoiceId ??
                        invoice.salesInvoiceId ??
                        "";


                    const salesOrderId =
                        invoice.SalesOrderId ??
                        invoice.salesOrderId ??
                        "";


                    const customerId =
                        invoice.CustomerId ??
                        invoice.customerId ??
                        "";


                    const companyName =
                        invoice.CompanyName ??
                        invoice.companyName ??
                        "";


                    return (

                        String(invoiceNumber)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(paymentStatus)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(status)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(remarks)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(invoiceId)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(salesOrderId)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(customerId)
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(companyName)
                            .toLowerCase()
                            .includes(searchValue)

                    );

                }
            );

        }, [
            salesInvoices,
            searchText
        ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics =
        useMemo(() => {

            const totalInvoices =
                salesInvoices.length;


            const totalAmount =
                salesInvoices.reduce(
                    (sum, item) => {

                        const amount =
                            item.TotalAmount ??
                            item.totalAmount ??
                            0;

                        return (
                            sum +
                            Number(amount)
                        );

                    },
                    0
                );


            const paidAmount =
                salesInvoices.reduce(
                    (sum, item) => {

                        const amount =
                            item.PaidAmount ??
                            item.paidAmount ??
                            0;

                        return (
                            sum +
                            Number(amount)
                        );

                    },
                    0
                );


            const balanceAmount =
                salesInvoices.reduce(
                    (sum, item) => {

                        const amount =
                            item.BalanceAmount ??
                            item.balanceAmount ??
                            0;

                        return (
                            sum +
                            Number(amount)
                        );

                    },
                    0
                );


            return {
                totalInvoices,
                totalAmount,
                paidAmount,
                balanceAmount
            };

        }, [
            salesInvoices
        ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalRecords =
        filteredInvoices.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );


    const pagedInvoices =
        filteredInvoices.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText
    ]);


    // =========================================================
    // PROTECT CURRENT PAGE
    // =========================================================

    useEffect(() => {

        if (page > totalPages) {

            setPage(totalPages);

        }

    }, [
        page,
        totalPages
    ]);


    // =========================================================
    // ADD
    // =========================================================

    const handleAdd = () => {

        navigate(
            "/sales-invoices/create"
        );

    };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (invoice) => {

        const invoiceId =
            invoice.SalesInvoiceId ??
            invoice.salesInvoiceId;


        if (!invoiceId) {

            return;

        }


        navigate(
            `/sales-invoices/details/${invoiceId}`
        );

    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (invoice) => {

        const invoiceId =
            invoice.SalesInvoiceId ??
            invoice.salesInvoiceId;


        if (!invoiceId) {

            return;

        }


        navigate(
            `/sales-invoices/edit/${invoiceId}`
        );

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (invoice) => {

        setSelectedInvoice(
            invoice
        );

        setDeleteOpen(true);

    };


    // =========================================================
    // PRINT
    // =========================================================

    const handlePrint = (invoice) => {

        const invoiceId =
            invoice.SalesInvoiceId ??
            invoice.salesInvoiceId;


        if (!invoiceId) {

            return;

        }


        navigate(
            `/sales-invoices/print/${invoiceId}`
        );

    };


    // =========================================================
    // DELETE CONFIRM
    // =========================================================

    const handleDeleteConfirm =
        async (id) => {

            try {

                await axios.delete(
                    `${SERVER_URL}/api/sales-invoices/${id}`
                );


                setDeleteOpen(
                    false
                );


                setSelectedInvoice(
                    null
                );


                setSnackbar({
                    open: true,
                    severity: "success",
                    message:
                        "Sales Invoice deleted successfully."
                });


                await loadSalesInvoices();

            }
            catch (error) {

                console.error(
                    "DELETE SALES INVOICE ERROR:",
                    error
                );


                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        error.response?.data?.message ||
                        "Unable to delete Sales Invoice."
                });

            }

        };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box
            className="sales-invoices-container"
        >

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Sales Invoices
            </Typography>


            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <SalesInvoiceToolbar
                onAdd={handleAdd}
                onRefresh={loadSalesInvoices}
                loading={loading}
            />


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <SalesInvoiceStatistics
                statistics={statistics}
            />


            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <SalesInvoiceSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                >

                    <SalesInvoiceTable
                        items={pagedInvoices}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPrint={handlePrint}
                    />

                </Grid>

            </Grid>


            {/* ================================================= */}
            {/* PAGINATION */}
            {/* ================================================= */}

            <SalesInvoicePagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}
            />


            {/* ================================================= */}
            {/* DELETE */}
            {/* ================================================= */}

            <DeleteSalesInvoiceDialog
                open={deleteOpen}
                item={selectedInvoice}
                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedInvoice(
                        null
                    );

                }}
                onDeleted={
                    handleDeleteConfirm
                }
                loading={loading}
            />


            {/* ================================================= */}
            {/* SNACKBAR */}
            {/* ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default SalesInvoiceList;