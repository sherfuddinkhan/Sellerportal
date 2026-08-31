// =========================================================
// SellerCustomerDetails.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
    Chip,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// Use your current seller ID.
// Change this if you store seller ID somewhere else.
const SELLER_ID = 6;

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    useEffect(() => {

        const loadCustomer = async () => {

            if (!id) {

                setError("Customer ID is missing from URL.");

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                console.log(
                    "Loading customer:",
                    {
                        sellerId: SELLER_ID,
                        customerId: id,
                    }
                );

                const response = await axios.get(

                    `${SERVER_URL}/api/seller-customers/${SELLER_ID}/customers/${id}`

                );

                console.log(
                    "Customer response:",
                    response.data
                );

                setCustomer(response.data);

            }
            catch (err) {

                console.error(
                    "Load Seller Customer Error:",
                    err
                );

                const message =
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Unable to load customer.";

                setError(
                    typeof message === "string"
                        ? message
                        : "Unable to load customer."
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadCustomer();

    }, [id]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/seller-customers")
                    }
                >
                    Back to Seller Customers
                </Button>

            </Box>

        );

    }

    // =====================================================
    // CUSTOMER NOT FOUND
    // =====================================================

    if (!customer) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Customer not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/seller-customers")
                    }
                >
                    Back to Seller Customers
                </Button>

            </Box>

        );

    }

    // =====================================================
    // FIELD
    // =====================================================

    const Field = ({
        label,
        value,
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

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

        </Grid>

    );

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Seller Customer Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Customer information and account details
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/seller-customers")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/seller-customers/edit/${customer.CustomerId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Customer Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Customer ID"
                            value={customer.CustomerId}
                        />

                        <Field
                            label="Seller ID"
                            value={customer.SellerId}
                        />

                        <Field
                            label="Customer Code"
                            value={customer.CustomerCode}
                        />

                        <Field
                            label="Customer Name"
                            value={customer.CustomerName}
                        />

                        <Field
                            label="Contact Person"
                            value={customer.ContactPerson}
                        />

                        <Field
                            label="Email"
                            value={customer.Email}
                        />

                        <Field
                            label="Phone"
                            value={customer.Phone}
                        />

                        <Field
                            label="GSTIN"
                            value={customer.GSTIN}
                        />

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Box sx={{ mt: 1 }}>

                                <Chip
                                    label={
                                        customer.IsActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    color={
                                        customer.IsActive
                                            ? "success"
                                            : "error"
                                    }
                                    size="small"
                                />

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Address Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Address Line 1"
                            value={customer.AddressLine1}
                        />

                        <Field
                            label="Address Line 2"
                            value={customer.AddressLine2}
                        />

                        <Field
                            label="City"
                            value={customer.City}
                        />

                        <Field
                            label="State"
                            value={customer.State}
                        />

                        <Field
                            label="Country"
                            value={customer.Country}
                        />

                        <Field
                            label="Postal Code"
                            value={customer.PostalCode}
                        />

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                FINANCIAL INFORMATION
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Financial Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Credit Limit"
                            value={
                                `₹ ${Number(
                                    customer.CreditLimit || 0
                                ).toLocaleString("en-IN")}`
                            }
                        />

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                DATES
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Record Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Created Date"
                            value={
                                customer.CreatedDate
                                    ? new Date(
                                        customer.CreatedDate
                                    ).toLocaleString()
                                    : "-"
                            }
                        />

                        <Field
                            label="Updated Date"
                            value={
                                customer.UpdatedDate
                                    ? new Date(
                                        customer.UpdatedDate
                                    ).toLocaleString()
                                    : "-"
                            }
                        />

                    </Grid>

                </CardContent>

            </Card>

        </Box>

    );

};

export default SellerCustomerDetails;
