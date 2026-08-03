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

import apiService from "../../services/apiService";

import SalesInvoiceToolbar from "./SalesInvoiceToolbar";
import SalesInvoiceStatistics from "./SalesInvoiceStatistics";
import SalesInvoiceSearch from "./SalesInvoiceSearch";
import SalesInvoiceTable from "./SalesInvoiceTable";
import SalesInvoicePagination from "./SalesInvoicePagination";
import SalesInvoiceModal from "./SalesInvoiceModal";
import SalesInvoiceView from "./SalesInvoiceView";
import DeleteSalesInvoiceDialog from "./DeleteSalesInvoiceDialog";
import SalesInvoiceCard from "./SalesInvoiceCard";

import "./SalesInvoices.css";

const DEFAULT_PAGE_SIZE = 10;

const SalesInvoiceList = () => {

    const [salesInvoices, setSalesInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const loadSalesInvoices = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getSalesInvoices();

            setSalesInvoices(
                response.data || []
            );

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Failed to load Sales Invoices."
            });

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSalesInvoices();

    }, []);

    const filteredInvoices = useMemo(() => {

        if (!searchText.trim())
            return salesInvoices;

        const value = searchText.toLowerCase();

        return salesInvoices.filter((invoice) =>

            invoice.InvoiceNumber
                ?.toLowerCase()
                .includes(value)

            ||

            invoice.PaymentStatus
                ?.toLowerCase()
                .includes(value)

            ||

            invoice.Status
                ?.toLowerCase()
                .includes(value)

            ||

            invoice.Remarks
                ?.toLowerCase()
                .includes(value)

            ||

            String(invoice.SalesInvoiceId)
                .includes(value)

            ||

            String(invoice.SalesOrderId)
                .includes(value)

        );

    }, [salesInvoices, searchText]);

    const totalRecords =
        filteredInvoices.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(totalRecords / pageSize)
        );

    const pagedInvoices =
        filteredInvoices.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    useEffect(() => {

        if (page > totalPages) {

            setPage(1);

        }

    }, [totalPages, page]);

    const handleAdd = () => {

        setSelectedInvoice(null);
        setModalOpen(true);

    };

    const handleEdit = (invoice) => {

        setSelectedInvoice(invoice);
        setModalOpen(true);

    };

    const handleView = (invoice) => {

        setSelectedInvoice(invoice);
        setViewOpen(true);

    };

    const handleDelete = (invoice) => {

        setSelectedInvoice(invoice);
        setDeleteOpen(true);

    };
        const handleSave = async (invoice) => {

        try {

            if (invoice.SalesInvoiceId) {

                await apiService.updateSalesInvoice(
                    invoice.SalesInvoiceId,
                    invoice
                );

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Invoice updated successfully."
                });

            } else {

                await apiService.createSalesInvoice(
                    invoice
                );

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Invoice created successfully."
                });

            }

            setModalOpen(false);

            loadSalesInvoices();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to save Sales Invoice."
            });

        }

    };



    const handleDeleteConfirm = async (id) => {

        try {

            await apiService.deleteSalesInvoice(id);

            setDeleteOpen(false);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Sales Invoice deleted successfully."
            });

            loadSalesInvoices();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to delete Sales Invoice."
            });

        }

    };



    const statistics = useMemo(() => {

        const totalInvoices =
            salesInvoices.length;

        const totalAmount =
            salesInvoices.reduce(
                (sum, item) =>
                    sum + Number(item.TotalAmount || 0),
                0
            );

        const paidAmount =
            salesInvoices.reduce(
                (sum, item) =>
                    sum + Number(item.PaidAmount || 0),
                0
            );

        const balanceAmount =
            salesInvoices.reduce(
                (sum, item) =>
                    sum + Number(item.BalanceAmount || 0),
                0
            );

        return {

            totalInvoices,

            totalAmount,

            paidAmount,

            balanceAmount

        };

    }, [salesInvoices]);



    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >

                <CircularProgress />

            </Box>

        );

    }



    return (

        <Box className="sales-invoices-container">

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Sales Invoices

            </Typography>



            <SalesInvoiceToolbar
                onAdd={handleAdd}
                onRefresh={loadSalesInvoices}
            />



            <SalesInvoiceStatistics
                statistics={statistics}
            />



            <SalesInvoiceSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />



            <Grid container spacing={3}>

                <Grid item xs={12}>

                    <SalesInvoiceTable
                        items={pagedInvoices}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Grid>

            </Grid>



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



            <SalesInvoiceModal
                open={modalOpen}
                item={selectedInvoice}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />



            <SalesInvoiceView
                open={viewOpen}
                item={selectedInvoice}
                onClose={() => setViewOpen(false)}
            />



            <DeleteSalesInvoiceDialog
                open={deleteOpen}
                item={selectedInvoice}
                onClose={() => setDeleteOpen(false)}
                onDeleted={handleDeleteConfirm}
            />



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