import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Typography
} from "@mui/material";

import axios from "axios";

import SalesInvoiceToolbar from "./SalesInvoiceToolbar";
import SalesInvoiceStatistics from "./SalesInvoiceStatistics";
import SalesInvoiceSearch from "./SalesInvoiceSearch";
import SalesInvoiceTable from "./SalesInvoiceTable";
import SalesInvoicePagination from "./SalesInvoicePagination";
import SalesInvoiceModal from "./SalesInvoiceModal";
import SalesInvoiceView from "./SalesInvoiceView";
import DeleteSalesInvoiceDialog from "./DeleteSalesInvoiceDialog";

import "./SalesInvoices.css";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

const DEFAULT_PAGE_SIZE = 10;


// =========================================================
// COMPONENT
// =========================================================

const SalesInvoiceList = () => {

    const [salesInvoices, setSalesInvoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(DEFAULT_PAGE_SIZE);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedInvoice, setSelectedInvoice] =
        useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });


    // =========================================================
    // LOAD SALES INVOICES
    // =========================================================

    const loadSalesInvoices = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
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

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadSalesInvoices();

    }, []);


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredInvoices = useMemo(() => {

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
                    invoice.salesInvoiceId;

                const salesOrderId =
                    invoice.SalesOrderId ??
                    invoice.salesOrderId;

                const customerId =
                    invoice.CustomerId ??
                    invoice.customerId;

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

                    String(invoiceId ?? "")
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(salesOrderId ?? "")
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(customerId ?? "")
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

    const statistics = useMemo(() => {

        const totalInvoices =
            salesInvoices.length;


        const totalAmount =
            salesInvoices.reduce(
                (sum, item) => {

                    const amount =
                        item.TotalAmount ??
                        item.totalAmount ??
                        0;

                    return sum + Number(amount);

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

                    return sum + Number(amount);

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

                    return sum + Number(amount);

                },
                0
            );


        const result = {
            totalInvoices,
            totalAmount,
            paidAmount,
            balanceAmount
        };


        console.log(
            "SALES INVOICE STATISTICS:",
            result
        );


        return result;

    }, [salesInvoices]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalRecords =
        filteredInvoices.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
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

    }, [searchText]);


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

        setSelectedInvoice(null);

        setModalOpen(true);

    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (invoice) => {

        setSelectedInvoice(invoice);

        setModalOpen(true);

    };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (invoice) => {

        setSelectedInvoice(invoice);

        setViewOpen(true);

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (invoice) => {

        setSelectedInvoice(invoice);

        setDeleteOpen(true);

    };


    // =========================================================
    // SAVE
    // CREATE / UPDATE
    // =========================================================

    const handleSave = async (invoice) => {

        try {

            const invoiceId =
                invoice.SalesInvoiceId ??
                invoice.salesInvoiceId;


            // =====================================================
            // UPDATE
            // =====================================================

            if (invoiceId) {

                await axios.put(
                    `${SERVER_URL}/api/sales-invoices/${invoiceId}`,
                    invoice
                );


                setSnackbar({
                    open: true,
                    severity: "success",
                    message:
                        "Sales Invoice updated successfully."
                });

            }


            // =====================================================
            // CREATE
            // =====================================================

            else {

                await axios.post(
                    `${SERVER_URL}/api/sales-invoices`,
                    invoice
                );


                setSnackbar({
                    open: true,
                    severity: "success",
                    message:
                        "Sales Invoice created successfully."
                });

            }


            // =====================================================
            // CLOSE MODAL
            // =====================================================

            setModalOpen(false);

            setSelectedInvoice(null);


            // =====================================================
            // RELOAD
            // =====================================================

            await loadSalesInvoices();

        }
        catch (error) {

            console.error(
                "SAVE SALES INVOICE ERROR:",
                error
            );

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.response?.data?.message ||
                    "Unable to save Sales Invoice."
            });

        }

    };


    // =========================================================
    // DELETE CONFIRM
    // =========================================================

    const handleDeleteConfirm = async (id) => {

        try {

            await axios.delete(
                `${SERVER_URL}/api/sales-invoices/${id}`
            );


            setDeleteOpen(false);

            setSelectedInvoice(null);


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

        <Box className="sales-invoices-container">

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
            {/* CREATE / EDIT MODAL */}
            {/* ================================================= */}

            <SalesInvoiceModal
                open={modalOpen}
                item={selectedInvoice}
                onClose={() => {

                    setModalOpen(false);

                    setSelectedInvoice(null);

                }}
                onSave={handleSave}
            />


            {/* ================================================= */}
            {/* VIEW */}
            {/* ================================================= */}

            <SalesInvoiceView
                open={viewOpen}
                item={selectedInvoice}
                onClose={() => {

                    setViewOpen(false);

                    setSelectedInvoice(null);

                }}
            />


            {/* ================================================= */}
            {/* DELETE */}
            {/* ================================================= */}

            <DeleteSalesInvoiceDialog
                open={deleteOpen}
                item={selectedInvoice}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedInvoice(null);

                }}
                onDeleted={handleDeleteConfirm}
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
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default SalesInvoiceList;