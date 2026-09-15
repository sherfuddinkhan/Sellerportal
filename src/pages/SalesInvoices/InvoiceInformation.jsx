import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";

const formatDate = value => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN");
};

const InvoiceInformation = ({
    invoice
}) => {

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222",
                backgroundColor: "#fff"
            }}
        >
            <Grid container>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        p: 1.5,
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{ mb: 1 }}
                    >
                        INVOICE INFORMATION
                    </Typography>

                    <Typography variant="body2">
                        Invoice No:{" "}
                        <strong>
                            {invoice?.InvoiceNumber ||
                                invoice?.invoiceNumber ||
                                "N/A"}
                        </strong>
                    </Typography>

                    <Typography variant="body2">
                        Invoice Date:{" "}
                        {formatDate(
                            invoice?.InvoiceDate ??
                            invoice?.invoiceDate
                        )}
                    </Typography>

                    <Typography variant="body2">
                        Document Type:{" "}
                        {invoice?.DocumentType || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Invoice Scenario:{" "}
                        {invoice?.InvoiceScenario || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Category:{" "}
                        {invoice?.Category || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Transaction Type:{" "}
                        {invoice?.TransactionType || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Financial Year:{" "}
                        {invoice?.FinancialYear || "N/A"}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ p: 1.5 }}
                >
                    <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{ mb: 1 }}
                    >
                        REFERENCE INFORMATION
                    </Typography>

                    <Typography variant="body2">
                        Sales Order ID:{" "}
                        {invoice?.SalesOrderId ??
                            invoice?.salesOrderId ??
                            "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Purchase Order No:{" "}
                        {invoice?.PurchaseOrderNo || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Purchase Order Date:{" "}
                        {formatDate(
                            invoice?.PurchaseOrderDate
                        )}
                    </Typography>

                    <Typography variant="body2">
                        Other References:{" "}
                        {invoice?.OtherReferences || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Despatched Document No:{" "}
                        {invoice?.DespatchedDocumentNumber ||
                            "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        IRN / ID:{" "}
                        {invoice?.Id || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Reference ID:{" "}
                        {invoice?.RefId || "N/A"}
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    );
};

export default InvoiceInformation;