// =========================================================
// InvoiceTaxDetailsList.jsx
// =========================================================

import React, {useEffect,useMemo,useState,useCallback} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Box,Grid,Typography,CircularProgress,Snackbar,Alert,Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import InvoiceTaxDetailToolbar from "./InvoiceTaxDetailToolbar";
import InvoiceTaxDetailStatistics from "./InvoiceTaxDetailStatistics";
import InvoiceTaxDetailSearch from "./InvoiceTaxDetailSearch";
import InvoiceTaxDetailTable from "./InvoiceTaxDetailTable";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/InvoiceTaxDetail`;

// =========================================================
// NORMALIZE API RESPONSE
// =========================================================

const normalizeResponse = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items;
    }

    if (Array.isArray(responseData?.result)) {
        return responseData.result;
    }

    return [];
};

// =========================================================
// GET RECORD ID - SUPPORT CAMELCASE AND PASCALCASE
// =========================================================

const getRecordId = (item) =>
    item?.invoiceTaxDetailId ??
    item?.InvoiceTaxDetailId ??
    item?.id ??
    item?.Id;

// =========================================================
// INVOICE TAX DETAILS LIST
// =========================================================

const InvoiceTaxDetailsList = ({
    onCreate,
    onView,
    onEdit,
    onDelete
}) => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [taxDetails, setTaxDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // =====================================================
    // GET ALL INVOICE TAX DETAILS
    // =====================================================

    const fetchTaxDetails = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL);

            const records = normalizeResponse(response.data);

            setTaxDetails(records);
        } catch (err) {
            console.error(
                "GET ALL INVOICE TAX DETAILS ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load invoice tax details."
            );

            setTaxDetails([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTaxDetails();
    }, [fetchTaxDetails]);

    // =====================================================
    // SEARCH ACTUAL DATABASE FIELDS
    // =====================================================

    const filteredTaxDetails = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return taxDetails;
        }

        return taxDetails.filter((item) => {
            const searchableValues = [
                item.invoiceTaxDetailId ?? item.InvoiceTaxDetailId,
                item.salesInvoiceId ?? item.SalesInvoiceId,
                item.channelProductId ?? item.ChannelProductId,
                item.taxPercentage ?? item.TaxPercentage,
                item.centralGst ?? item.CentralGst,
                item.stateGst ?? item.StateGst,
                item.integratedGst ?? item.IntegratedGst,
                item.compensationCess ?? item.CompensationCess,
                item.sellerId ?? item.SellerId,
                item.customerId ?? item.CustomerId
            ];

            return searchableValues.some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term)
            );
        });
    }, [taxDetails, searchTerm]);

    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedTaxDetails = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredTaxDetails.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredTaxDetails, page, rowsPerPage]);

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {
        await fetchTaxDetails();
    };

    // =====================================================
    // CREATE
    // =====================================================

const handleCreate = () => {
    navigate("/invoice-tax-details/create");
};

    // =====================================================
    // VIEW
const handleView = (row) => {
    const id =
        row.invoiceTaxDetailId ??
        row.InvoiceTaxDetailId;

    if (id == null) {
        console.error("Invoice tax detail ID is missing:", row);
        return;
    }

    navigate(`/invoice-tax-details/details/${id}`);
};

// EDIT
const handleEdit = (row) => {
    const id =
        row.invoiceTaxDetailId ??
        row.InvoiceTaxDetailId;

    if (id == null) {
        console.error("Invoice tax detail ID is missing:", row);
        return;
    }

    navigate(`/invoice-tax-details/${id}/edit`);
};



    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (item) => {
        const id = getRecordId(item);

        if (id == null) {
            setError(
                "Cannot delete invoice tax detail: record ID is missing."
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete invoice tax detail ${id}?`
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (typeof onDelete === "function") {
                // Use the parent's configured delete operation.
                await onDelete(item);
            } else {
                // Use the Node.js proxy DELETE endpoint.
                await axios.delete(`${API_URL}/${id}`);
            }

            // Refresh records after successful deletion.
            const response = await axios.get(API_URL);
            const records = normalizeResponse(response.data);

            setTaxDetails(records);

            setSuccess(
                "Invoice tax detail deleted successfully."
            );

            // Keep the selected page within the valid range.
            const lastPage = Math.max(
                0,
                Math.ceil(
                    records.filter((record) => {
                        const term = searchTerm.trim().toLowerCase();

                        if (!term) return true;

                        return [
                            record.invoiceTaxDetailId ?? record.InvoiceTaxDetailId,
                            record.salesInvoiceId ?? record.SalesInvoiceId,
                            record.channelProductId ?? record.ChannelProductId,
                            record.taxPercentage ?? record.TaxPercentage,
                            record.centralGst ?? record.CentralGst,
                            record.stateGst ?? record.StateGst,
                            record.integratedGst ?? record.IntegratedGst,
                            record.compensationCess ?? record.CompensationCess,
                            record.sellerId ?? record.SellerId,
                            record.customerId ?? record.CustomerId
                        ].some((value) =>
                            String(value ?? "")
                                .toLowerCase()
                                .includes(term)
                        );
                    }).length / rowsPerPage
                ) - 1
            );

            setPage((currentPage) =>
                Math.min(currentPage, lastPage)
            );
        } catch (err) {
            console.error(
                "DELETE INVOICE TAX DETAIL ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete invoice tax detail."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CLOSE NOTIFICATIONS
    // =====================================================

    const handleCloseError = (_, reason) => {
        if (reason === "clickaway") return;
        setError("");
    };

    const handleCloseSuccess = (_, reason) => {
        if (reason === "clickaway") return;
        setSuccess("");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
            <Grid container spacing={3}>

                {/* PAGE HEADING */}

                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Invoice Tax Details
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Manage invoice tax rates, GST components,
                                seller and customer details.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap"
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                Refresh
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreate}
                            >
                                Create Invoice Tax Detail
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* TOOLBAR */}

                <Grid item xs={12}>
                    <InvoiceTaxDetailToolbar
                        onCreate={handleCreate}
                        onRefresh={handleRefresh}
                    />
                </Grid>

                {/* STATISTICS */}

                <Grid item xs={12}>
                    <InvoiceTaxDetailStatistics
                        data={taxDetails}
                        loading={loading}
                    />
                </Grid>

                {/* SEARCH */}

                <Grid item xs={12}>
                    <InvoiceTaxDetailSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={handleRefresh}
                        loading={loading}
                    />
                </Grid>

                {/* LOADING INDICATOR */}

                {loading && (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5
                            }}
                        >
                            <CircularProgress size={22} />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Processing invoice tax details...
                            </Typography>
                        </Box>
                    </Grid>
                )}

                {/* TABLE */}

                <Grid item xs={12}>
                    {error && taxDetails.length === 0 ? (
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={fetchTaxDetails}
                                >
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    ) : (
                        <InvoiceTaxDetailTable
                            data={paginatedTaxDetails}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalCount={filteredTaxDetails.length}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={
                                handleRowsPerPageChange
                            }
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </Grid>

                {/* NO RESULTS */}

                {!loading &&
                    !error &&
                    filteredTaxDetails.length === 0 && (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                {searchTerm
                                    ? "No invoice tax details match your search."
                                    : "No invoice tax details found. Create a record to get started."}
                            </Alert>
                        </Grid>
                    )}
            </Grid>

            {/* ERROR NOTIFICATION */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={handleCloseError}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* SUCCESS NOTIFICATION */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={handleCloseSuccess}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={handleCloseSuccess}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InvoiceTaxDetailsList;
