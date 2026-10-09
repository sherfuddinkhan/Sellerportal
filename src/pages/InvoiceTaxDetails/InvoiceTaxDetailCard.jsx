import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Grid
} from "@mui/material";

import {
    ReceiptLong,
    Visibility,
    Edit,
    Percent,
    Payments
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0.00";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getValue = (data, ...keys) => {
    for (const key of keys) {
        if (
            data?.[key] !== undefined &&
            data?.[key] !== null
        ) {
            return data[key];
        }
    }

    return null;
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ label, value }) => (
    <Box>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body2"
            fontWeight={600}
            sx={{ overflowWrap: "anywhere" }}
        >
            {value === null || value === undefined || value === ""
                ? "—"
                : value}
        </Typography>
    </Box>
);

/* =========================================================
   INVOICE TAX DETAIL CARD
========================================================= */

const InvoiceTaxDetailCard = ({
    invoiceTaxDetail,
    data,
    onView,
    onEdit,
    onDelete
}) => {
    const detail = invoiceTaxDetail || data || {};

    const id = getValue(
        detail,
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId",
        "id",
        "Id"
    );

    const invoiceId = getValue(
        detail,
        "invoiceId",
        "InvoiceId"
    );

    const taxName = getValue(
        detail,
        "taxName",
        "TaxName"
    );

    const taxCode = getValue(
        detail,
        "taxCode",
        "TaxCode"
    );

    const taxRate = getValue(
        detail,
        "taxRate",
        "TaxRate"
    );

    const taxableAmount = getValue(
        detail,
        "taxableAmount",
        "TaxableAmount"
    );

    const taxAmount = getValue(
        detail,
        "taxAmount",
        "TaxAmount"
    );

    const status = getValue(
        detail,
        "status",
        "Status"
    );

    const normalizedStatus = String(status ?? "").toLowerCase();

    const statusColor =
        normalizedStatus === "active"
            ? "success"
            : normalizedStatus === "inactive"
            ? "default"
            : normalizedStatus === "pending"
            ? "warning"
            : "primary";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 6
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                {/* HEADER */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                    mb={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        minWidth={0}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                flexShrink: 0
                            }}
                        >
                            <ReceiptLong />
                        </Box>

                        <Box minWidth={0}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {taxName || "Invoice Tax Detail"}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                ID: {id ?? "—"}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        label={status ?? "Unknown"}
                        color={statusColor}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* TAX INFORMATION */}

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DetailItem
                            label="Invoice ID"
                            value={invoiceId}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DetailItem
                            label="Tax Code"
                            value={taxCode}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={0.75}
                        >
                            <Percent
                                fontSize="small"
                                color="action"
                            />

                            <Box>
                                <DetailItem
                                    label="Tax Rate"
                                    value={
                                        taxRate === null
                                            ? "—"
                                            : `${formatNumber(taxRate)}%`
                                    }
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={0.75}
                        >
                            <Payments
                                fontSize="small"
                                color="action"
                            />

                            <Box>
                                <DetailItem
                                    label="Tax Amount"
                                    value={
                                        taxAmount === null
                                            ? "—"
                                            : formatCurrency(taxAmount)
                                    }
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* TAXABLE AMOUNT */}

                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Taxable Amount
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary.main"
                    >
                        {taxableAmount === null
                            ? "—"
                            : formatCurrency(taxableAmount)}
                    </Typography>
                </Box>
            </CardContent>

            {/* ACTIONS */}

            <Divider />

            <CardActions
                sx={{
                    p: 2,
                    pt: 1.5,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1
                }}
            >
                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => onView?.(detail)}
                    disabled={!onView}
                >
                    View
                </Button>

                <Box display="flex" gap={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => onEdit?.(detail)}
                        disabled={!onEdit}
                    >
                        Edit
                    </Button>

                    {onDelete && (
                        <Button
                            size="small"
                            color="error"
                            onClick={() => onDelete(detail)}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
            </CardActions>
        </Card>
    );
};

export default InvoiceTaxDetailCard;

