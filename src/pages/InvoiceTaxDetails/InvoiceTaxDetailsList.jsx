import React, {
useEffect,
useMemo,
useState
} from "react";

import axios from "axios";

import {
Box,
Grid,
Typography,
CircularProgress,
Snackbar,
Alert
} from "@mui/material";

import InvoiceTaxDetailToolbar from "./InvoiceTaxDetailToolbar";
import InvoiceTaxDetailStatistics from "./InvoiceTaxDetailStatistics";
import InvoiceTaxDetailSearch from "./InvoiceTaxDetailSearch";
import InvoiceTaxDetailTable from "./InvoiceTaxDetailTable";

/* =========================================================
API CONFIGURATION
========================================================= */

const API_BASE_URL =
process.env.REACT_APP_API_URL || "http://localhost:5000";

const INVOICE_TAX_DETAIL_API =
`${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
INVOICE TAX DETAILS LIST
========================================================= */

const InvoiceTaxDetailsList = ({
onCreate,
onView,
onEdit,
onDelete
}) => {
const [taxDetails, setTaxDetails] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [searchTerm, setSearchTerm] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

/* =====================================================
   GET ALL INVOICE TAX DETAILS
===================================================== */

const fetchTaxDetails = async () => {
    setLoading(true);
    setError("");

    try {
        const response = await axios.get(
            INVOICE_TAX_DETAIL_API
        );

        const responseData = response.data;

        let records = [];

        if (Array.isArray(responseData)) {
            records = responseData;
        } else if (Array.isArray(responseData?.data)) {
            records = responseData.data;
        } else if (Array.isArray(responseData?.items)) {
            records = responseData.items;
        } else if (
            Array.isArray(responseData?.result)
        ) {
            records = responseData.result;
        }

        setTaxDetails(records);
    } catch (err) {
        console.error(
            "GET ALL INVOICE TAX DETAILS ERROR:",
            err
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
};

/* =====================================================
   INITIAL LOAD
===================================================== */

useEffect(() => {
    fetchTaxDetails();
}, []);

/* =====================================================
   SEARCH FILTER
===================================================== */

const filteredTaxDetails = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
        return taxDetails;
    }

    return taxDetails.filter((item) => {
        const searchableValues = [
            item.invoiceTaxDetailId,
            item.InvoiceTaxDetailId,
            item.invoiceId,
            item.InvoiceId,
            item.taxName,
            item.TaxName,
            item.taxCode,
            item.TaxCode,
            item.taxRate,
            item.TaxRate,
            item.taxableAmount,
            item.TaxableAmount,
            item.taxAmount,
            item.TaxAmount,
            item.status,
            item.Status
        ];

        return searchableValues.some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(term)
        );
    });
}, [taxDetails, searchTerm]);

/* =====================================================
   RESET PAGE WHEN SEARCH CHANGES
===================================================== */

useEffect(() => {
    setPage(0);
}, [searchTerm]);

/* =====================================================
   PAGINATION
===================================================== */

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

/* =====================================================
   REFRESH
===================================================== */

const handleRefresh = async () => {
    await fetchTaxDetails();
    setSuccess("Invoice tax details refreshed.");
};

/* =====================================================
   DELETE
===================================================== */

const handleDelete = async (item) => {
    if (!onDelete) {
        setError(
            "Delete handler is not configured."
        );
        return;
    }

    try {
        await onDelete(item);
        await fetchTaxDetails();
        setSuccess(
            "Invoice tax details updated successfully."
        );
    } catch (err) {
        console.error(
            "DELETE INVOICE TAX DETAIL ERROR:",
            err
        );

        setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to delete invoice tax detail."
        );
    }
};

/* =====================================================
   RENDER
===================================================== */

return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        <Grid container spacing={3}>
            {/* TOOLBAR */}

            <Grid item xs={12}>
                <InvoiceTaxDetailToolbar
                    onCreate={onCreate}
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

            {/* TABLE */}

            <Grid item xs={12}>
                {loading && taxDetails.length === 0 ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                        sx={{ py: 6 }}
                    >
                        <CircularProgress />

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Loading invoice tax details...
                        </Typography>
                    </Box>
                ) : error && taxDetails.length === 0 ? (
                    <Alert
                        severity="error"
                        action={
                            <Typography
                                component="span"
                                onClick={fetchTaxDetails}
                                sx={{
                                    cursor: "pointer",
                                    fontWeight: 600
                                }}
                            >
                                Retry
                            </Typography>
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
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Grid>
        </Grid>

        {/* ERROR MESSAGE */}

        <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
        >
            <Alert
                severity="error"
                variant="filled"
                onClose={() => setError("")}
            >
                {error}
            </Alert>
        </Snackbar>

        {/* SUCCESS MESSAGE */}

        <Snackbar
            open={Boolean(success)}
            autoHideDuration={3000}
            onClose={() => setSuccess("")}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
        >
            <Alert
                severity="success"
                variant="filled"
                onClose={() => setSuccess("")}
            >
                {success}
            </Alert>
        </Snackbar>
    </Box>
);
};

export default InvoiceTaxDetailsList;
