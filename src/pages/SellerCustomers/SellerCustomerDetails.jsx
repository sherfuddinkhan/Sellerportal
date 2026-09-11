// ============================================================
// SellerCustomerDetails.jsx
// ============================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";

// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const SellerCustomerDetails = () => {

    const {
        sellerId,
        customerId
    } = useParams();

    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD CUSTOMER
    // ========================================================

    useEffect(() => {

        const loadCustomer = async () => {

            try {

                setLoading(true);
                setError("");

                // ------------------------------------------------
                // VALIDATE PARAMS
                // ------------------------------------------------

                if (!sellerId || !customerId) {

                    setError(
                        "Seller ID and Customer ID are required."
                    );

                    return;
                }

                // ------------------------------------------------
                // NODE PROXY URL
                // ------------------------------------------------

                const url =
                    `${SERVER_URL}/api/seller-customers/${sellerId}/customers/${customerId}`;

                console.log(
                    "================================================"
                );

                console.log(
                    "GET SELLER CUSTOMER DETAILS"
                );

                console.log(
                    "SELLER ID:",
                    sellerId
                );

                console.log(
                    "CUSTOMER ID:",
                    customerId
                );

                console.log(
                    "NODE URL:",
                    url
                );

                console.log(
                    "================================================"
                );

                // ------------------------------------------------
                // CALL NODE
                // ------------------------------------------------

                const response = await axios.get(
                    url,
                    {
                        headers: {
                            Accept: "*/*"
                        }
                    }
                );

                console.log(
                    "SELLER CUSTOMER RESPONSE:",
                    response.data
                );

                // ------------------------------------------------
                // STORE RESPONSE
                // ------------------------------------------------

                setCustomer(
                    response.data
                );

            }
            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "SELLER CUSTOMER DETAILS ERROR"
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
                    "RESPONSE:",
                    err.response?.data
                );

                console.error(
                    "================================================"
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    `Failed to load seller customer. HTTP ${err.response?.status || "500"}`
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadCustomer();

    }, [
        sellerId,
        customerId
    ]);

    // ========================================================
    // COUNT HELPER
    // ========================================================

    const getCount = (value) => {

        return Array.isArray(value)
            ? value.length
            : 0;

    };

    // ========================================================
    // GET PROPERTY
    // Supports camelCase + PascalCase
    // ========================================================

    const getValue = (
        camelCase,
        pascalCase,
        fallback = ""
    ) => {

        return (
            customer?.[camelCase] ??
            customer?.[pascalCase] ??
            fallback
        );

    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400
                }}
            >
                <CircularProgress />
            </Box>
        );

    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={() =>
                        navigate("/seller-customers")
                    }
                >
                    Back to Seller Customers
                </Button>

            </Box>
        );

    }

    // ========================================================
    // NO CUSTOMER
    // ========================================================

    if (!customer) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Seller customer was not found.
                </Alert>

            </Box>
        );

    }

    // ========================================================
    // CUSTOMER VALUES
    // ========================================================

    const customerCode =
        getValue(
            "customerCode",
            "CustomerCode",
            "-"
        );

    const customerName =
        getValue(
            "customerName",
            "CustomerName",
            "-"
        );

    const contactPerson =
        getValue(
            "contactPerson",
            "ContactPerson",
            "-"
        );

    const email =
        getValue(
            "email",
            "Email",
            "-"
        );

    const phone =
        getValue(
            "phone",
            "Phone",
            "-"
        );

    const gstin =
        getValue(
            "gstin",
            "GSTIN",
            "-"
        );

    const addressLine1 =
        getValue(
            "addressLine1",
            "AddressLine1",
            "-"
        );

    const addressLine2 =
        getValue(
            "addressLine2",
            "AddressLine2",
            "-"
        );

    const city =
        getValue(
            "city",
            "City",
            "-"
        );

    const state =
        getValue(
            "state",
            "State",
            "-"
        );

    const country =
        getValue(
            "country",
            "Country",
            "-"
        );

    const postalCode =
        getValue(
            "postalCode",
            "PostalCode",
            "-"
        );

    const creditLimit =
        getValue(
            "creditLimit",
            "CreditLimit",
            0
        );

    const isActive =
        getValue(
            "isActive",
            "IsActive",
            true
        );

    // ========================================================
    // AGGREGATE COLLECTIONS
    // ========================================================

    const products =
        customer?.products ??
        customer?.Products ??
        [];

    const inventories =
        customer?.inventories ??
        customer?.Inventories ??
        [];

    const prices =
        customer?.prices ??
        customer?.Prices ??
        [];

    const images =
        customer?.images ??
        customer?.Images ??
        [];

    const stockMovements =
        customer?.stockMovements ??
        customer?.StockMovements ??
        [];

    const stockLedgers =
        customer?.stockLedgers ??
        customer?.StockLedgers ??
        [];

    const warehouses =
        customer?.warehouses ??
        customer?.Warehouses ??
        [];

    const warehouseLocations =
        customer?.warehouseLocations ??
        customer?.WarehouseLocations ??
        [];

    const suppliers =
        customer?.suppliers ??
        customer?.Suppliers ??
        [];

    const brands =
        customer?.brands ??
        customer?.Brands ??
        [];

    const marketplaceOrders =
        customer?.marketplaceOrders ??
        customer?.MarketplaceOrders ??
        [];

    const marketplaceReturns =
        customer?.marketplaceReturns ??
        customer?.MarketplaceReturns ??
        [];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* ==================================================
                HEADER
            ================================================== */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Seller Customer Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Seller ID: {sellerId} | Customer ID: {customerId}
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                `/seller-customers/edit/${sellerId}/${customerId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate("/seller-customers")
                        }
                    >
                        Back
                    </Button>

                </Stack>

            </Stack>

            {/* ==================================================
                CUSTOMER INFORMATION
            ================================================== */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Customer Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Customer Code
                            </Typography>

                            <Typography fontWeight={600}>
                                {customerCode}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Customer Name
                            </Typography>

                            <Typography fontWeight={600}>
                                {customerName}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Status
                            </Typography>

                            <Typography fontWeight={600}>
                                {isActive ? "Active" : "Inactive"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Contact Person
                            </Typography>

                            <Typography>
                                {contactPerson}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Email
                            </Typography>

                            <Typography>
                                {email}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Phone
                            </Typography>

                            <Typography>
                                {phone}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                GSTIN
                            </Typography>

                            <Typography>
                                {gstin}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="caption">
                                Credit Limit
                            </Typography>

                            <Typography>
                                ₹ {Number(creditLimit || 0).toLocaleString("en-IN")}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* ==================================================
                ADDRESS
            ================================================== */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Address
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography>
                        {addressLine1}
                    </Typography>

                    <Typography>
                        {addressLine2}
                    </Typography>

                    <Typography>
                        {city}, {state}
                    </Typography>

                    <Typography>
                        {country} - {postalCode}
                    </Typography>

                </CardContent>

            </Card>

            {/* ==================================================
                AGGREGATE SUMMARY
            ================================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Aggregate Summary
            </Typography>

            <Grid
                container
                spacing={2}
            >

                <SummaryCard
                    title="Products"
                    count={getCount(products)}
                />

                <SummaryCard
                    title="Inventories"
                    count={getCount(inventories)}
                />

                <SummaryCard
                    title="Prices"
                    count={getCount(prices)}
                />

                <SummaryCard
                    title="Images"
                    count={getCount(images)}
                />

                <SummaryCard
                    title="Stock Movements"
                    count={getCount(stockMovements)}
                />

                <SummaryCard
                    title="Stock Ledgers"
                    count={getCount(stockLedgers)}
                />

                <SummaryCard
                    title="Warehouses"
                    count={getCount(warehouses)}
                />

                <SummaryCard
                    title="Warehouse Locations"
                    count={getCount(warehouseLocations)}
                />

                <SummaryCard
                    title="Suppliers"
                    count={getCount(suppliers)}
                />

                <SummaryCard
                    title="Brands"
                    count={getCount(brands)}
                />

                <SummaryCard
                    title="Marketplace Orders"
                    count={getCount(marketplaceOrders)}
                />

                <SummaryCard
                    title="Marketplace Returns"
                    count={getCount(marketplaceReturns)}
                />

            </Grid>

        </Box>
    );

};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
    title,
    count
}) => {

    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={3}
        >

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    height: "100%"
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    {count}
                </Typography>

            </Paper>

        </Grid>
    );

};

export default SellerCustomerDetails;