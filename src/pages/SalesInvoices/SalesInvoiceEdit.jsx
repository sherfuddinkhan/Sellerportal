import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Divider,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";


const SERVER_URL = "http://localhost:5000";


const SalesInvoiceEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({

        SalesInvoiceId: 0,

        SalesOrderId: "",

        SellerId: 6,

        CustomerId: 3,

        InvoiceNumber: "",

        InvoiceDate: "",

        InvoiceScenario: "B2B",

        Category: "Goods",

        TransactionType: "Sale",

        UserGSTIN: "",

        DocumentType: "Invoice",

        SupplyType: "B2B",

        PlaceOfSupply: "",

        FinancialYear: "",

        ReverseCharge: false,

        Id: "",

        RefId: "",

        SubTotal: "",

        DiscountAmount: "",

        TaxAmount: "",

        TotalAmount: "",

        PaidAmount: "",

        BalanceAmount: "",

        PaymentStatus: "Pending",

        Status: "Draft",

        Remarks: ""

    });


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


            const item = response.data;


            const getValue = (
                pascal,
                camel,
                defaultValue = ""
            ) =>
                item[pascal] ??
                item[camel] ??
                defaultValue;


            const invoiceDate =
                getValue(
                    "InvoiceDate",
                    "invoiceDate",
                    ""
                );


            let formattedDate = "";


            if (invoiceDate) {

                const date =
                    new Date(invoiceDate);

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    formattedDate =
                        date.toISOString()
                            .split("T")[0];

                } else {

                    formattedDate = invoiceDate;

                }

            }


            const reverseCharge =
                getValue(
                    "ReverseCharge",
                    "reverseCharge",
                    false
                );


            setFormData({

                SalesInvoiceId:
                    getValue(
                        "SalesInvoiceId",
                        "salesInvoiceId",
                        0
                    ),

                SalesOrderId:
                    getValue(
                        "SalesOrderId",
                        "salesOrderId",
                        ""
                    ),

                SellerId:
                    getValue(
                        "SellerId",
                        "sellerId",
                        6
                    ),

                CustomerId:
                    getValue(
                        "CustomerId",
                        "customerId",
                        3
                    ),

                InvoiceNumber:
                    getValue(
                        "InvoiceNumber",
                        "invoiceNumber",
                        ""
                    ),

                InvoiceDate:
                    formattedDate,

                InvoiceScenario:
                    getValue(
                        "InvoiceScenario",
                        "invoiceScenario",
                        "B2B"
                    ),

                Category:
                    getValue(
                        "Category",
                        "category",
                        "Goods"
                    ),

                TransactionType:
                    getValue(
                        "TransactionType",
                        "transactionType",
                        "Sale"
                    ),

                UserGSTIN:
                    getValue(
                        "UserGSTIN",
                        "userGSTIN",
                        ""
                    ),

                DocumentType:
                    getValue(
                        "DocumentType",
                        "documentType",
                        "Invoice"
                    ),

                SupplyType:
                    getValue(
                        "SupplyType",
                        "supplyType",
                        "B2B"
                    ),

                PlaceOfSupply:
                    getValue(
                        "PlaceOfSupply",
                        "placeOfSupply",
                        ""
                    ),

                FinancialYear:
                    getValue(
                        "FinancialYear",
                        "financialYear",
                        ""
                    ),

                ReverseCharge:
                    typeof reverseCharge === "string"
                        ? reverseCharge.toLowerCase() === "yes"
                        : Boolean(reverseCharge),

                Id:
                    getValue(
                        "Id",
                        "id",
                        ""
                    ),

                RefId:
                    getValue(
                        "RefId",
                        "refId",
                        ""
                    ),

                SubTotal:
                    getValue(
                        "SubTotal",
                        "subTotal",
                        ""
                    ),

                DiscountAmount:
                    getValue(
                        "DiscountAmount",
                        "discountAmount",
                        ""
                    ),

                TaxAmount:
                    getValue(
                        "TaxAmount",
                        "taxAmount",
                        ""
                    ),

                TotalAmount:
                    getValue(
                        "TotalAmount",
                        "totalAmount",
                        ""
                    ),

                PaidAmount:
                    getValue(
                        "PaidAmount",
                        "paidAmount",
                        ""
                    ),

                BalanceAmount:
                    getValue(
                        "BalanceAmount",
                        "balanceAmount",
                        ""
                    ),

                PaymentStatus:
                    getValue(
                        "PaymentStatus",
                        "paymentStatus",
                        "Pending"
                    ),

                Status:
                    getValue(
                        "Status",
                        "status",
                        "Draft"
                    ),

                Remarks:
                    getValue(
                        "Remarks",
                        "remarks",
                        ""
                    )

            });

        } catch (err) {

            console.error(
                "LOAD SALES INVOICE FOR EDIT ERROR:",
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


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => {

            const updated = {
                ...previous,
                [name]: value
            };


            if (
                name === "TotalAmount" ||
                name === "PaidAmount"
            ) {

                const total =
                    Number(updated.TotalAmount) || 0;

                const paid =
                    Number(updated.PaidAmount) || 0;

                updated.BalanceAmount =
                    Math.max(
                        total - paid,
                        0
                    );

            }


            return updated;

        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        setSaving(true);


        try {

            const payload = {

                SalesInvoiceId:
                    Number(formData.SalesInvoiceId),

                SalesOrderId:
                    formData.SalesOrderId
                        ? Number(formData.SalesOrderId)
                        : null,

                SellerId:
                    Number(formData.SellerId),

                CustomerId:
                    Number(formData.CustomerId),

                InvoiceNumber:
                    formData.InvoiceNumber.trim(),

                InvoiceDate:
                    formData.InvoiceDate,

                InvoiceScenario:
                    formData.InvoiceScenario,

                Category:
                    formData.Category,

                TransactionType:
                    formData.TransactionType,

                UserGSTIN:
                    formData.UserGSTIN.trim(),

                DocumentType:
                    formData.DocumentType,

                SupplyType:
                    formData.SupplyType,

                PlaceOfSupply:
                    formData.PlaceOfSupply.trim(),

                FinancialYear:
                    formData.FinancialYear.trim(),

                ReverseCharge:
                    Boolean(formData.ReverseCharge),

                Id:
                    formData.Id.trim(),

                RefId:
                    formData.RefId.trim(),

                SubTotal:
                    Number(formData.SubTotal) || 0,

                DiscountAmount:
                    Number(formData.DiscountAmount) || 0,

                TaxAmount:
                    Number(formData.TaxAmount) || 0,

                TotalAmount:
                    Number(formData.TotalAmount) || 0,

                PaidAmount:
                    Number(formData.PaidAmount) || 0,

                BalanceAmount:
                    Number(formData.BalanceAmount) || 0,

                PaymentStatus:
                    formData.PaymentStatus,

                Status:
                    formData.Status,

                Remarks:
                    formData.Remarks.trim()

            };


            await axios.put(
                `${SERVER_URL}/api/sales-invoices/${id}`,
                payload
            );


            setSuccess(
                "Sales Invoice updated successfully."
            );


            setTimeout(() => {

                navigate(
                    `/sales-invoices/details/${id}`
                );

            }, 1000);

        } catch (err) {

            console.error(
                "UPDATE SALES INVOICE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to update Sales Invoice."
            );

        } finally {

            setSaving(false);

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


    return (

        <Box sx={{ p: 3 }}>

            <Card>

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3
                        }}
                    >

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Edit Sales Invoice
                        </Typography>


                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate(
                                    `/sales-invoices/details/${id}`
                                )
                            }
                            disabled={saving}
                        >
                            Back
                        </Button>

                    </Box>


                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {String(error)}
                        </Alert>
                    )}


                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mb: 3 }}
                        >
                            {success}
                        </Alert>
                    )}


                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Basic Information
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Sales Invoice ID"
                                    value={
                                        formData.SalesInvoiceId
                                    }
                                    disabled
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Sales Order ID"
                                    name="SalesOrderId"
                                    type="number"
                                    value={
                                        formData.SalesOrderId
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Invoice Number"
                                    name="InvoiceNumber"
                                    value={
                                        formData.InvoiceNumber
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Invoice Date"
                                    name="InvoiceDate"
                                    value={
                                        formData.InvoiceDate
                                    }
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    value={
                                        formData.SellerId
                                    }
                                    disabled
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Customer ID"
                                    value={
                                        formData.CustomerId
                                    }
                                    disabled
                                />
                            </Grid>

                        </Grid>


                        <Divider sx={{ my: 4 }} />


                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Invoice Classification
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Invoice Scenario"
                                    name="InvoiceScenario"
                                    value={
                                        formData.InvoiceScenario
                                    }
                                    onChange={handleChange}
                                >
                                    <MenuItem value="B2B">
                                        B2B
                                    </MenuItem>
                                    <MenuItem value="B2C">
                                        B2C
                                    </MenuItem>
                                    <MenuItem value="Export">
                                        Export
                                    </MenuItem>
                                    <MenuItem value="SEZ">
                                        SEZ
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Goods">
                                        Goods
                                    </MenuItem>
                                    <MenuItem value="Services">
                                        Services
                                    </MenuItem>
                                    <MenuItem value="Goods and Services">
                                        Goods and Services
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Transaction Type"
                                    name="TransactionType"
                                    value={
                                        formData.TransactionType
                                    }
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Sale">
                                        Sale
                                    </MenuItem>
                                    <MenuItem value="Credit Note">
                                        Credit Note
                                    </MenuItem>
                                    <MenuItem value="Debit Note">
                                        Debit Note
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Document Type"
                                    name="DocumentType"
                                    value={
                                        formData.DocumentType
                                    }
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Invoice">
                                        Invoice
                                    </MenuItem>
                                    <MenuItem value="Tax Invoice">
                                        Tax Invoice
                                    </MenuItem>
                                    <MenuItem value="Bill of Supply">
                                        Bill of Supply
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Supply Type"
                                    name="SupplyType"
                                    value={
                                        formData.SupplyType
                                    }
                                    onChange={handleChange}
                                >
                                    <MenuItem value="B2B">
                                        B2B
                                    </MenuItem>
                                    <MenuItem value="B2C">
                                        B2C
                                    </MenuItem>
                                    <MenuItem value="Export">
                                        Export
                                    </MenuItem>
                                    <MenuItem value="SEZ">
                                        SEZ
                                    </MenuItem>
                                    <MenuItem value="Deemed Export">
                                        Deemed Export
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Reverse Charge"
                                    name="ReverseCharge"
                                    value={
                                        formData.ReverseCharge
                                            ? "Yes"
                                            : "No"
                                    }
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            ReverseCharge:
                                                e.target.value === "Yes"
                                        }))
                                    }
                                >
                                    <MenuItem value="No">
                                        No
                                    </MenuItem>
                                    <MenuItem value="Yes">
                                        Yes
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="User GSTIN"
                                    name="UserGSTIN"
                                    value={
                                        formData.UserGSTIN
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Place of Supply"
                                    name="PlaceOfSupply"
                                    value={
                                        formData.PlaceOfSupply
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Financial Year"
                                    name="FinancialYear"
                                    value={
                                        formData.FinancialYear
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>

                        </Grid>


                        <Divider sx={{ my: 4 }} />


                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            References
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Reference ID"
                                    name="Id"
                                    value={formData.Id}
                                    onChange={handleChange}
                                />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ref ID"
                                    name="RefId"
                                    value={formData.RefId}
                                    onChange={handleChange}
                                />
                            </Grid>

                        </Grid>


                        <Divider sx={{ my: 4 }} />


                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Amount Details
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Sub Total"
                                    name="SubTotal"
                                    type="number"
                                    value={formData.SubTotal}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Discount Amount"
                                    name="DiscountAmount"
                                    type="number"
                                    value={
                                        formData.DiscountAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Tax Amount"
                                    name="TaxAmount"
                                    type="number"
                                    value={formData.TaxAmount}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Total Amount"
                                    name="TotalAmount"
                                    type="number"
                                    value={
                                        formData.TotalAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Paid Amount"
                                    name="PaidAmount"
                                    type="number"
                                    value={
                                        formData.PaidAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Balance Amount"
                                    name="BalanceAmount"
                                    type="number"
                                    value={
                                        formData.BalanceAmount
                                    }
                                    disabled
                                />
                            </Grid>

                        </Grid>


                        <Divider sx={{ my: 4 }} />


                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Status
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Status"
                                    name="PaymentStatus"
                                    value={
                                        formData.PaymentStatus
                                    }
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>
                                    <MenuItem value="Partially Paid">
                                        Partially Paid
                                    </MenuItem>
                                    <MenuItem value="Paid">
                                        Paid
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Invoice Status"
                                    name="Status"
                                    value={formData.Status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Draft">
                                        Draft
                                    </MenuItem>
                                    <MenuItem value="Open">
                                        Open
                                    </MenuItem>
                                    <MenuItem value="Completed">
                                        Completed
                                    </MenuItem>
                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>
                                </TextField>
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Remarks"
                                    name="Remarks"
                                    value={formData.Remarks}
                                    onChange={handleChange}
                                />
                            </Grid>

                        </Grid>


                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        `/sales-invoices/details/${id}`
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Sales Invoice"}
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default SalesInvoiceEdit;