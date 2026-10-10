import React, { useEffect, useState } from "react";

import axios from "axios";

import {
Box,
Paper,
Grid,
Typography,
Divider,
Chip,
Button,
CircularProgress,
Alert,
Stack
} from "@mui/material";

import {
ArrowBack,
Refresh,
Edit,
ReceiptLong,
AccountBalance,
Payments,
Percent,
ConfirmationNumber
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

/* =========================================================
API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const INVOICE_TAX_DETAIL_API =
`${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
FIELD VALUE HELPER
========================================================= */

const getFieldValue = (
data,
fields,
fallback = "N/A"
) => {
for (const field of fields) {
if (
data?.[field] !== undefined &&
data?.[field] !== null &&
data?.[field] !== ""
) {
return data[field];
}
}


return fallback;


};

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);
if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isFinite(amount)
) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
};

/* =========================================================
FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
const number = Number(value);
if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isFinite(number)
) {
    return "0";
}

return number.toLocaleString("en-IN", {
    maximumFractionDigits: 2
});
};

/* =========================================================
FORMAT DATE
========================================================= */

const formatDate = (value) => {
if (!value || value === "N/A") {
return "N/A";
}
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return String(value);
}

return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});
};

/* =========================================================
DETAIL ITEM
========================================================= */

const DetailItem = ({
label,
value,
icon
}) => (
<Box sx={{ minWidth: 0 }}>
<Typography
variant="caption"
color="text.secondary"
display="block"
sx={{ mb: 0.5 }}
>
{label} </Typography>

```
    <Stack
        direction="row"
        alignItems="center"
        spacing={1}
    >
        {icon}

        <Typography
            variant="body1"
            fontWeight={600}
            sx={{ overflowWrap: "anywhere" }}
        >
            {value}
        </Typography>
    </Stack>
</Box>
);

/* =========================================================
STATUS CHIP
========================================================= */

const StatusChip = ({ status }) => {
const normalizedStatus = String(
status ?? "Unknown"
).toLowerCase();
let color = "default";

if (
    normalizedStatus === "active" ||
    normalizedStatus === "completed"
) {
    color = "success";
} else if (
    normalizedStatus === "pending"
) {
    color = "warning";
} else if (
    normalizedStatus === "inactive" ||
    normalizedStatus === "cancelled"
) {
    color = "error";
}

return (
    <Chip
        label={status || "Unknown"}
        color={color}
        size="small"
        variant="outlined"
    />
);
};

/* =========================================================
INVOICE TAX DETAIL DETAILS
========================================================= */

const InvoiceTaxDetailDetails = ({
invoiceTaxDetailId: propId,
onBack,
onEdit
}) => {
const params = useParams();
const navigate = useNavigate();
const invoiceTaxDetailId =
    propId ??
    params.invoiceTaxDetailId ??
    params.id;

const [taxDetail, setTaxDetail] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

/* =====================================================
   GET INVOICE TAX DETAIL
===================================================== */

const fetchTaxDetail = async () => {
    if (
        invoiceTaxDetailId === undefined ||
        invoiceTaxDetailId === null ||
        invoiceTaxDetailId === ""
    ) {
        setError("Invoice tax detail ID is missing.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError("");

    try {
        const response = await axios.get(
            `${INVOICE_TAX_DETAIL_API}/${encodeURIComponent(
                invoiceTaxDetailId
            )}`
        );

        const responseData = response.data;

        const record =
            responseData?.data ??
            responseData?.result ??
            responseData;

        if (
            !record ||
            typeof record !== "object" ||
            Array.isArray(record)
        ) {
            throw new Error(
                "Invoice tax detail was not found."
            );
        }

        setTaxDetail(record);
    } catch (err) {
        console.error(
            "GET INVOICE TAX DETAIL ERROR:",
            err
        );

        setError(
            err.response?.data?.message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to load invoice tax detail."
        );

        setTaxDetail(null);
    } finally {
        setLoading(false);
    }
};

/* =====================================================
   INITIAL LOAD
===================================================== */

useEffect(() => {
    fetchTaxDetail();
}, [invoiceTaxDetailId]);

/* =====================================================
   BACK NAVIGATION
===================================================== */

const handleBack = () => {
    if (onBack) {
        onBack();
    } else {
        navigate(-1);
    }
};

/* =====================================================
   EDIT NAVIGATION
===================================================== */

const handleEdit = () => {
    if (onEdit) {
        onEdit(taxDetail);
    } else {
        navigate(
            `/invoice-tax-details/${encodeURIComponent(
                invoiceTaxDetailId
            )}/edit`
        );
    }
};

/* =====================================================
   LOADING STATE
===================================================== */

if (loading) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{ py: 8 }}
        >
            <CircularProgress />

            <Typography color="text.secondary">
                Loading invoice tax detail...
            </Typography>
        </Box>
    );
}

/* =====================================================
   ERROR STATE
===================================================== */

if (error && !taxDetail) {
    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <Alert
                severity="error"
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
        </Box>
    );
}

if (!taxDetail) {
    return null;
}

/* =====================================================
   EXTRACT FIELDS
===================================================== */

const detailId = getFieldValue(
    taxDetail,
    [
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId"
    ]
);

const invoiceId = getFieldValue(
    taxDetail,
    ["invoiceId", "InvoiceId"]
);

const taxName = getFieldValue(
    taxDetail,
    ["taxName", "TaxName"]
);

const taxCode = getFieldValue(
    taxDetail,
    ["taxCode", "TaxCode"]
);

const taxRate = getFieldValue(
    taxDetail,
    ["taxRate", "TaxRate"],
    0
);

const taxableAmount = getFieldValue(
    taxDetail,
    ["taxableAmount", "TaxableAmount"],
    0
);

const taxAmount = getFieldValue(
    taxDetail,
    ["taxAmount", "TaxAmount"],
    0
);

const status = getFieldValue(
    taxDetail,
    ["status", "Status"],
    "Unknown"
);

const createdAt = getFieldValue(
    taxDetail,
    [
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    ]
);

const updatedAt = getFieldValue(
    taxDetail,
    [
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt"
    ]
);

/* =====================================================
   RENDER DETAILS
===================================================== */

return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        {/* HEADER */}

        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 2
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <ReceiptLong
                        color="primary"
                        sx={{ fontSize: 38 }}
                    />

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Invoice Tax Detail
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Record ID: {detailId}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchTaxDetail}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </Stack>
            </Stack>
        </Paper>

        {/* GENERAL INFORMATION */}

        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 2
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                mb={2.5}
            >
                General Information
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Invoice Tax Detail ID"
                        value={detailId}
                        icon={
                            <ConfirmationNumber
                                color="action"
                                fontSize="small"
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Invoice ID"
                        value={invoiceId}
                        icon={
                            <ReceiptLong
                                color="action"
                                fontSize="small"
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Tax Name"
                        value={taxName}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Tax Code"
                        value={taxCode}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Status"
                        value={<StatusChip status={status} />}
                    />
                </Grid>
            </Grid>
        </Paper>

        {/* TAX INFORMATION */}

        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 2
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                mb={2.5}
            >
                Tax Information
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Tax Rate"
                        value={`${formatNumber(taxRate)}%`}
                        icon={
                            <Percent
                                color="action"
                                fontSize="small"
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Taxable Amount"
                        value={formatCurrency(taxableAmount)}
                        icon={
                            <AccountBalance
                                color="action"
                                fontSize="small"
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DetailItem
                        label="Tax Amount"
                        value={formatCurrency(taxAmount)}
                        icon={
                            <Payments
                                color="action"
                                fontSize="small"
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Paper>

        {/* AUDIT INFORMATION */}

        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                mb={2.5}
            >
                Record Information
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <DetailItem
                        label="Created At"
                        value={formatDate(createdAt)}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <DetailItem
                        label="Last Updated"
                        value={formatDate(updatedAt)}
                    />
                </Grid>
            </Grid>
        </Paper>
    </Box>
);
};

export default InvoiceTaxDetailDetails;
