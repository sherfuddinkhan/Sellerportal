import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";


const SERVER_URL = "http://localhost:5000";


const formatCurrency = (value) => {

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


const getStatusColor = (value) => {

    const status =
        String(value || "").toLowerCase();

    if (
        status === "paid" ||
        status === "completed"
    ) {
        return "success";
    }

    if (
        status === "pending" ||
        status === "draft" ||
        status === "open"
    ) {
        return "warning";
    }

    if (
        status === "partial" ||
        status === "partially paid"
    ) {
        return "info";
    }

    if (status === "processing") {
        return "primary";
    }

    if (
        status === "cancelled" ||
        status === "rejected"
    ) {
        return "error";
    }

    return "default";
};


const DetailItem = ({
    label,
    value
}) => {

    return (
        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value ?? "-"}
            </Typography>

        </Box>
    );
};


const SalesInvoiceDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [invoice, setInvoice] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        loadInvoice();

    }, [id]);


    const loadInvoice = async () => {

        if (!id || id === ":id") {

            setError("Invalid Sales Invoice ID.");

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await axios.get(
                `${SERVER_URL}/api/sales-invoices/${id}`
            );


            setInvoice(response.data);

        } catch (err) {

            console.error(
                "LOAD SALES INVOICE DETAILS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to load Sales Invoice."
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {String(error)}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/sales-invoices")
                    }
                >
                    Back to Sales Invoices
                </Button>

            </Box>
        );
    }


    if (!invoice) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Sales Invoice not found.
                </Alert>

            </Box>
        );
    }


    const invoiceId =
        invoice.SalesInvoiceId ??
        invoice.salesInvoiceId;

    const salesOrderId =
        invoice.SalesOrderId ??
        invoice.salesOrderId;

    const sellerId =
        invoice.SellerId ??
        invoice.sellerId;

    const customerId =
        invoice.CustomerId ??
        invoice.customerId;

    const invoiceNumber =
        invoice.InvoiceNumber ??
        invoice.invoiceNumber;

    const invoiceDate =
        invoice.InvoiceDate ??
        invoice.invoiceDate;

    const invoiceScenario =
        invoice.InvoiceScenario ??
        invoice.invoiceScenario;

    const category =
        invoice.Category ??
        invoice.category;

    const transactionType =
        invoice.TransactionType ??
        invoice.transactionType;

    const userGSTIN =
        invoice.UserGSTIN ??
        invoice.userGSTIN;

    const documentType =
        invoice.DocumentType ??
        invoice.documentType;

    const supplyType =
        invoice.SupplyType ??
        invoice.supplyType;

    const placeOfSupply =
        invoice.PlaceOfSupply ??
        invoice.placeOfSupply;

    const financialYear =
        invoice.FinancialYear ??
        invoice.financialYear;

    const reverseCharge =
        invoice.ReverseCharge ??
        invoice.reverseCharge;

    const referenceId =
        invoice.Id ??
        invoice.id;

    const refId =
        invoice.RefId ??
        invoice.refId;

    const subTotal =
        invoice.SubTotal ??
        invoice.subTotal;

    const discountAmount =
        invoice.DiscountAmount ??
        invoice.discountAmount;

    const taxAmount =
        invoice.TaxAmount ??
        invoice.taxAmount;

    const totalAmount =
        invoice.TotalAmount ??
        invoice.totalAmount;

    const paidAmount =
        invoice.PaidAmount ??
        invoice.paidAmount;

    const balanceAmount =
        invoice.BalanceAmount ??
        invoice.balanceAmount;

    const paymentStatus =
        invoice.PaymentStatus ??
        invoice.paymentStatus;

    const status =
        invoice.Status ??
        invoice.status;

    const remarks =
        invoice.Remarks ??
        invoice.remarks;

    const createdDate =
        invoice.CreatedDate ??
        invoice.createdDate;

    const updatedDate =
        invoice.UpdatedDate ??
        invoice.updatedDate;


    return (

        <Box sx={{ p: 3 }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Sales Invoice Details
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/sales-invoices")
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/sales-invoices/edit/${invoiceId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Basic Information
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Sales Invoice ID"
                                value={invoiceId}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Sales Order ID"
                                value={salesOrderId}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Invoice Number"
                                value={invoiceNumber}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Invoice Date"
                                value={formatDate(invoiceDate)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Seller ID"
                                value={sellerId}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Customer ID"
                                value={customerId}
                            />
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 4 }} />


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Invoice Classification
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Invoice Scenario"
                                value={invoiceScenario}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Category"
                                value={category}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Transaction Type"
                                value={transactionType}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Document Type"
                                value={documentType}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Supply Type"
                                value={supplyType}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Place of Supply"
                                value={placeOfSupply}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Financial Year"
                                value={financialYear}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="User GSTIN"
                                value={userGSTIN}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>

                            <DetailItem
                                label="Reverse Charge"
                                value={
                                    typeof reverseCharge === "boolean"
                                        ? reverseCharge
                                            ? "Yes"
                                            : "No"
                                        : reverseCharge || "-"
                                }
                            />

                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 4 }} />


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Reference Information
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={6}>
                            <DetailItem
                                label="Reference ID"
                                value={referenceId}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailItem
                                label="Ref ID"
                                value={refId}
                            />
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 4 }} />


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Amount Details
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Sub Total"
                                value={formatCurrency(subTotal)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Discount Amount"
                                value={formatCurrency(discountAmount)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Tax Amount"
                                value={formatCurrency(taxAmount)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Total Amount"
                                value={formatCurrency(totalAmount)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Paid Amount"
                                value={formatCurrency(paidAmount)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <DetailItem
                                label="Balance Amount"
                                value={formatCurrency(balanceAmount)}
                            />
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 4 }} />


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Status
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Payment Status
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    label={paymentStatus || "-"}
                                    color={getStatusColor(
                                        paymentStatus
                                    )}
                                />
                            </Box>

                        </Grid>


                        <Grid item xs={12} md={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Invoice Status
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    label={status || "-"}
                                    color={getStatusColor(status)}
                                />
                            </Box>

                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 4 }} />


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Remarks
                    </Typography>


                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        {remarks || "-"}
                    </Typography>


                    {(createdDate || updatedDate) && (
                        <>
                            <Divider sx={{ my: 4 }} />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ mb: 2 }}
                            >
                                Audit Information
                            </Typography>


                            <Grid
                                container
                                spacing={3}
                            >

                                <Grid item xs={12} md={6}>
                                    <DetailItem
                                        label="Created Date"
                                        value={formatDate(createdDate)}
                                    />
                                </Grid>


                                <Grid item xs={12} md={6}>
                                    <DetailItem
                                        label="Updated Date"
                                        value={formatDate(updatedDate)}
                                    />
                                </Grid>

                            </Grid>
                        </>
                    )}

                </CardContent>

            </Card>

        </Box>
    );
};


export default SalesInvoiceDetails;