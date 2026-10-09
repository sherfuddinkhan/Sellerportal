import React, {
useEffect,
useState
} from "react";

import axios from "axios";

import {
Box,
Paper,
Typography,
Grid,
Divider,
Chip,
Button,
CircularProgress,
Alert,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow
} from "@mui/material";

import {
ArrowBack,
ReceiptLong,
Refresh
} from "@mui/icons-material";

import {
useNavigate,
useParams
} from "react-router-dom";

/* =========================================================
API CONFIGURATION
========================================================= */

const API_BASE_URL =
process.env.REACT_APP_API_URL || "";

const INVOICE_TAX_DETAIL_API =
`${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
FIELD HELPERS
========================================================= */

const getValue = (obj, ...keys) => {
for (const key of keys) {
if (
obj &&
obj[key] !== undefined &&
obj[key] !== null
) {
return obj[key];
}
}
return "";
};

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);


if (!Number.isFinite(amount)) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
};

/* =========================================================
FORMAT DATE
========================================================= */

const formatDate = (value) => {
if (!value) {
return "—";
}
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return String(value);
}

return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});
};

/* =========================================================
DETAIL FIELD
========================================================= */

const DetailField = ({ label, value }) => ( <Grid item xs={12} sm={6} md={4}> <Typography
         variant="caption"
         color="text.secondary"
         display="block"
     >
{label} </Typography>
    <Typography
        variant="body1"
        fontWeight={500}
        sx={{
            overflowWrap: "anywhere",
            mt: 0.5
        }}
    >
        {value === "" ||
        value === null ||
        value === undefined
            ? "—"
            : String(value)}
    </Typography>
</Grid>
);

/* =========================================================
INVOICE TAX DETAIL VIEW
========================================================= */

const InvoiceTaxDetailView = ({
invoiceTaxDetailId: propId,
apiUrl,
onBack,
onLoaded
}) => {
const { id: routeId } = useParams();
const navigate = useNavigate();

const invoiceTaxDetailId = propId || routeId;

const [taxDetail, setTaxDetail] =
    useState(null);

const [loading, setLoading] =
    useState(false);

const [error, setError] =
    useState("");

/* =====================================================
   FETCH INVOICE TAX DETAIL
===================================================== */

const fetchTaxDetail = async () => {
    if (!invoiceTaxDetailId) {
        setTaxDetail(null);
        setError(
            "Invoice tax detail ID is required."
        );
        return;
    }

    try {
        setLoading(true);
        setError("");

        const endpoint =
            apiUrl || INVOICE_TAX_DETAIL_API;

        const response = await axios.get(
            `${endpoint}/${encodeURIComponent(
                invoiceTaxDetailId
            )}`,
            {
                headers: {
                    Accept: "application/json"
                },
                timeout: 15000
            }
        );

        const data = response.data;

        const record = Array.isArray(data)
            ? data[0]
            : data?.data ??
              data?.result ??
              data;

        if (
            !record ||
            typeof record !== "object"
        ) {
            setTaxDetail(null);
            setError(
                "Invoice tax detail was not found."
            );
            return;
        }

        setTaxDetail(record);

        if (typeof onLoaded === "function") {
            onLoaded(record);
        }
    } catch (err) {
        console.error(
            "GET INVOICE TAX DETAIL ERROR:",
            err
        );

        setTaxDetail(null);

        setError(
            err.response?.data?.message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to load invoice tax details."
        );
    } finally {
        setLoading(false);
    }
};

/* =====================================================
   LOAD DATA
===================================================== */

useEffect(() => {
    fetchTaxDetail();
}, [invoiceTaxDetailId]);

/* =====================================================
   EXTRACT FIELDS
===================================================== */

const detailId = getValue(
    taxDetail,
    "invoiceTaxDetailId",
    "InvoiceTaxDetailId",
    "invoiceTaxDetailsId",
    "InvoiceTaxDetailsId",
    "id",
    "Id"
);

const invoiceId = getValue(
    taxDetail,
    "invoiceId",
    "InvoiceId",
    "salesInvoiceId",
    "SalesInvoiceId"
);

const taxName = getValue(
    taxDetail,
    "taxName",
    "TaxName",
    "taxType",
    "TaxType",
    "taxCode",
    "TaxCode"
);

const taxRate = getValue(
    taxDetail,
    "taxRate",
    "TaxRate",
    "rate",
    "Rate"
);

const taxableAmount = getValue(
    taxDetail,
    "taxableAmount",
    "TaxableAmount",
    "taxableValue",
    "TaxableValue"
);

const taxAmount = getValue(
    taxDetail,
    "taxAmount",
    "TaxAmount",
    "amount",
    "Amount"
);

const createdDate = getValue(
    taxDetail,
    "createdDate",
    "CreatedDate",
    "createdAt",
    "CreatedAt"
);

const updatedDate = getValue(
    taxDetail,
    "updatedDate",
    "UpdatedDate",
    "updatedAt",
    "UpdatedAt"
);

const status = getValue(
    taxDetail,
    "status",
    "Status"
);

/* =====================================================
   LOADING STATE
===================================================== */

if (loading && !taxDetail) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
        >
            <CircularProgress />
        </Box>
    );
}

/* =====================================================
   RENDER
===================================================== */

return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

        {/* HEADER */}

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            mb={3}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
            >
                <ReceiptLong
                    color="primary"
                    fontSize="large"
                />

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
                        View invoice tax information
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" gap={1}>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchTaxDetail}
                    disabled={loading}
                >
                    Refresh
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => {
                        if (onBack) {
                            onBack();
                        } else {
                            navigate(-1);
                        }
                    }}
                >
                    Back
                </Button>
            </Box>
        </Box>

        {/* ERROR */}

        {error && (
            <Alert
                severity="error"
                sx={{ mb: 3 }}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={fetchTaxDetail}
                    >
                        Retry
                    </Button>
                }
            >
                {error}
            </Alert>
        )}

        {/* DETAILS */}

        {taxDetail && (
            <>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        mb: 3
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={2}
                        mb={2}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Tax Detail Information
                        </Typography>

                        {status !== "" && (
                            <Chip
                                label={String(status)}
                                color={
                                    String(status).toLowerCase() ===
                                    "active"
                                        ? "success"
                                        : "default"
                                }
                                size="small"
                            />
                        )}
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <DetailField
                            label="Invoice Tax Detail ID"
                            value={detailId}
                        />

                        <DetailField
                            label="Invoice ID"
                            value={invoiceId}
                        />

                        <DetailField
                            label="Tax Name / Code"
                            value={taxName}
                        />

                        <DetailField
                            label="Tax Rate"
                            value={
                                taxRate !== ""
                                    ? `${taxRate}%`
                                    : "—"
                            }
                        />

                        <DetailField
                            label="Taxable Amount"
                            value={formatCurrency(
                                taxableAmount
                            )}
                        />

                        <DetailField
                            label="Tax Amount"
                            value={formatCurrency(
                                taxAmount
                            )}
                        />

                        <DetailField
                            label="Created Date"
                            value={formatDate(
                                createdDate
                            )}
                        />

                        <DetailField
                            label="Updated Date"
                            value={formatDate(
                                updatedDate
                            )}
                        />
                    </Grid>
                </Paper>

                {/* TAX SUMMARY */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={2}
                    >
                        Tax Summary
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Tax Name / Code
                                    </TableCell>

                                    <TableCell align="right">
                                        Tax Rate
                                    </TableCell>

                                    <TableCell align="right">
                                        Taxable Amount
                                    </TableCell>

                                    <TableCell align="right">
                                        Tax Amount
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {taxName || "—"}
                                    </TableCell>

                                    <TableCell align="right">
                                        {taxRate !== ""
                                            ? `${taxRate}%`
                                            : "—"}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatCurrency(
                                            taxableAmount
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Typography fontWeight={700}>
                                            {formatCurrency(
                                                taxAmount
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </>
        )}
    </Box>
);


};

export default InvoiceTaxDetailView;
