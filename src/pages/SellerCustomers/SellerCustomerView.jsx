// =========================================================
// SellerCustomerView.jsx
// Seller Customer Details Page
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


// =========================================================
// CONFIGURATION
// =========================================================
//
// React
//    ↓
// Node server.js : 5000
//    ↓
// ASP.NET Core : 7203
//
// IMPORTANT:
// React must call the Node route.
// Do NOT call /api/SellerCustomer directly from React.
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerView = () => {

    const navigate = useNavigate();

    const {
        sellerId,
        customerId,
    } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    useEffect(() => {

        const loadCustomer = async () => {

            // -------------------------------------------------
            // Validate URL parameters
            // -------------------------------------------------

            if (!sellerId || !customerId) {

                setError(
                    "Seller ID or Customer ID is missing from the URL."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");

                // =================================================
                // CORRECT NODE PROXY URL
                // =================================================
                //
                // React:
                // http://localhost:5000/api/seller-customers/6/customers/3
                //
                // Node forwards to:
                // https://localhost:7203/api/SellerCustomer/6/customers/3
                //
                // =================================================

                const url =
                    `${SERVER_URL}/api/seller-customers/${sellerId}/customers/${customerId}`;


                console.log(
                    "================================================"
                );

                console.log(
                    "GET SELLER CUSTOMER DETAILS"
                );

                console.log(
                    "Seller ID:",
                    sellerId
                );

                console.log(
                    "Customer ID:",
                    customerId
                );

                console.log(
                    "Node URL:",
                    url
                );

                console.log(
                    "================================================"
                );


                // =================================================
                // CALL NODE USING AXIOS
                // =================================================

                const response = await axios.get(
                    url,
                    {
                        headers: {
                            Accept: "*/*",
                        },
                    }
                );


                console.log(
                    "================================================"
                );

                console.log(
                    "SELLER CUSTOMER RESPONSE"
                );

                console.log(
                    response.data
                );

                console.log(
                    "================================================"
                );


                // =================================================
                // STORE CUSTOMER
                // =================================================

                setCustomer(
                    response.data
                );

            }
            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "SELLER CUSTOMER LOAD ERROR"
                );

                console.error(
                    "MESSAGE:",
                    err.message
                );

                console.error(
                    "STATUS:",
                    err.response?.status
                );

                console.error(
                    "DATA:",
                    err.response?.data
                );

                console.error(
                    "URL:",
                    err.config?.url
                );

                console.error(
                    "================================================"
                );


                setError(

                    err.response?.data?.message ||

                    err.response?.data?.title ||

                    `Failed to load seller customer. HTTP ${
                        err.response?.status || 500
                    }`

                );

            }
            finally {

                setLoading(false);

            }

        };


        loadCustomer();

    }, [
        sellerId,
        customerId,
    ]);


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/seller-customers"
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {

        navigate(
            `/seller-customers/edit/${sellerId}/${customerId}`
        );

    };


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

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>


                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Customers
                    </Button>


                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>

                </Stack>

            </Box>

        );

    }


    // =====================================================
    // CUSTOMER NOT FOUND
    // =====================================================

    if (!customer) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="warning"
                    sx={{ mb: 3 }}
                >
                    Customer not found.
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Customers
                </Button>

            </Box>

        );

    }


    // =====================================================
    // SUPPORT CAMELCASE + PASCALCASE
    // =====================================================

    const CustomerId =
        customer.CustomerId ??
        customer.customerId;

    const SellerId =
        customer.SellerId ??
        customer.sellerId;

    const CustomerCode =
        customer.CustomerCode ??
        customer.customerCode;

    const CustomerName =
        customer.CustomerName ??
        customer.customerName;

    const ContactPerson =
        customer.ContactPerson ??
        customer.contactPerson;

    const Email =
        customer.Email ??
        customer.email;

    const Phone =
        customer.Phone ??
        customer.phone;

    const GSTIN =
        customer.GSTIN ??
        customer.gstin;

    const AddressLine1 =
        customer.AddressLine1 ??
        customer.addressLine1;

    const AddressLine2 =
        customer.AddressLine2 ??
        customer.addressLine2;

    const City =
        customer.City ??
        customer.city;

    const State =
        customer.State ??
        customer.state;

    const Country =
        customer.Country ??
        customer.country;

    const PostalCode =
        customer.PostalCode ??
        customer.postalCode;

    const CreditLimit =
        customer.CreditLimit ??
        customer.creditLimit ??
        0;

    const IsActive =
        customer.IsActive ??
        customer.isActive;

    const CreatedDate =
        customer.CreatedDate ??
        customer.createdDate;

    const UpdatedDate =
        customer.UpdatedDate ??
        customer.updatedDate;


    // =====================================================
    // FIELD COMPONENT
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
                display="block"
                sx={{
                    mb: 0.5,
                }}
            >
                {label}
            </Typography>


            <Typography
                variant="body1"
                fontWeight={500}
            >
                {
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                }
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
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Customer Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View seller customer information
                    </Typography>


                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Seller ID:{" "}
                        {SellerId || sellerId}

                        {" | "}

                        Customer ID:{" "}
                        {CustomerId || customerId}
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
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


            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Customer Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3,
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Customer ID"
                            value={CustomerId}
                        />


                        <Field
                            label="Seller ID"
                            value={SellerId}
                        />


                        <Field
                            label="Customer Code"
                            value={CustomerCode}
                        />


                        <Field
                            label="Customer Name"
                            value={CustomerName}
                        />


                        <Field
                            label="Contact Person"
                            value={ContactPerson}
                        />


                        <Field
                            label="Email"
                            value={Email}
                        />


                        <Field
                            label="Phone"
                            value={Phone}
                        />


                        <Field
                            label="GSTIN"
                            value={GSTIN}
                        />

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                ADDRESS
            ================================================= */}

            <Card
                sx={{
                    mt: 3,
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Address Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3,
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Address Line 1"
                            value={AddressLine1}
                        />


                        <Field
                            label="Address Line 2"
                            value={AddressLine2}
                        />


                        <Field
                            label="City"
                            value={City}
                        />


                        <Field
                            label="State"
                            value={State}
                        />


                        <Field
                            label="Country"
                            value={Country}
                        />


                        <Field
                            label="Postal Code"
                            value={PostalCode}
                        />

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <Card
                sx={{
                    mt: 3,
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Account Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3,
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Credit Limit"
                            value={`₹ ${Number(
                                CreditLimit
                            ).toLocaleString("en-IN")}`}
                        />


                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                Status
                            </Typography>


                            <Chip
                                label={
                                    IsActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    IsActive
                                        ? "success"
                                        : "error"
                                }
                            />

                        </Grid>


                        <Field
                            label="Created Date"
                            value={
                                CreatedDate
                                    ? new Date(
                                        CreatedDate
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                    : "-"
                            }
                        />


                        <Field
                            label="Updated Date"
                            value={
                                UpdatedDate
                                    ? new Date(
                                        UpdatedDate
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                    : "-"
                            }
                        />

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{
                    mt: 3,
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Customers
                </Button>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Customer
                </Button>

            </Stack>

        </Box>

    );

};


export default SellerCustomerView;