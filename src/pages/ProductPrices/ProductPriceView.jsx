// =========================================================
// ProductPriceView.jsx
// =========================================================

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
    Alert,
    Stack,
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
// CONFIG
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductPriceView = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [productPrice, setProductPrice] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // GET VALUE
    // =====================================================

    const getValue = (
        pascalCase,
        camelCase,
        fallback = "-"
    ) => {

        const value =
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase];

        return (
            value === null ||
            value === undefined ||
            value === ""
        )
            ? fallback
            : value;
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (
        pascalCase,
        camelCase
    ) => {

        const value =
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase];

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString();
    };

    // =====================================================
    // FETCH PRODUCT PRICE
    // =====================================================

    useEffect(() => {

        const fetchProductPrice = async () => {

            try {

                setLoading(true);

                setError("");

                console.log(
                    "Loading Product Price ID:",
                    id
                );

                // =================================================
                // API
                // =================================================

                const response = await fetch(
                    `${SERVER_URL}/api/product-prices/${id}`
                );

                console.log(
                    "Product Price response:",
                    response
                );

                if (!response.ok) {

                    throw new Error(
                        `Failed to load Product Price. Status: ${response.status}`
                    );

                }

                const data =
                    await response.json();

                console.log(
                    "Product Price data:",
                    data
                );

                // =================================================
                // HANDLE DIFFERENT API RESPONSE FORMATS
                // =================================================

                const result =
                    data?.item ??
                    data?.data ??
                    data?.result ??
                    data;

                setProductPrice(result);

            }
            catch (err) {

                console.error(
                    "Product Price loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load Product Price."
                );

            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            fetchProductPrice();
        }
        else {

            setError(
                "Product Price ID is missing."
            );

            setLoading(false);

        }

    }, [id]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading Product Price...
                </Typography>

            </Box>

        );

    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/product-prices"
                        )
                    }
                    sx={{
                        mb: 3,
                    }}
                >
                    Back to Product Prices
                </Button>

                <Alert
                    severity="error"
                >
                    {error}
                </Alert>

            </Box>

        );

    }

    // =====================================================
    // NO DATA
    // =====================================================

    if (!productPrice) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/product-prices"
                        )
                    }
                    sx={{
                        mb: 3,
                    }}
                >
                    Back to Product Prices
                </Button>

                <Alert
                    severity="warning"
                >
                    Product Price not found.
                </Alert>

            </Box>

        );

    }

    // =====================================================
    // ACTIVE STATUS
    // =====================================================

    const isActive =
        productPrice?.IsActive ??
        productPrice?.isActive ??
        false;

    // =====================================================
    // PRICE
    // =====================================================

    const price =
        productPrice?.Price ??
        productPrice?.price;

    const formattedPrice =
        price === null ||
        price === undefined ||
        price === ""
            ? "-"
            : Number.isNaN(Number(price))
                ? "-"
                : `₹ ${Number(price).toFixed(2)}`;

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
                sx={{
                    display: "block",
                    mb: 0.5,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word",
                }}
            >
                {value || "-"}
            </Typography>

        </Grid>

    );

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

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
                        fontWeight="bold"
                    >
                        Product Price Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        View product pricing information
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
                            navigate(
                                "/product-prices"
                            )
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/product-prices/edit/${getValue(
                                    "ProductPriceId",
                                    "productPriceId"
                                )}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <Card
                elevation={2}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            md: 3,
                        },
                    }}
                >

                    {/* =========================================
                        BASIC INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Basic Information
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Product Price ID"
                            value={getValue(
                                "ProductPriceId",
                                "productPriceId"
                            )}
                        />

                        <Field
                            label="Product ID"
                            value={getValue(
                                "ProductId",
                                "productId"
                            )}
                        />

                        <Field
                            label="Seller ID"
                            value={getValue(
                                "SellerId",
                                "sellerId"
                            )}
                        />

                        <Field
                            label="Price Type"
                            value={getValue(
                                "PriceType",
                                "priceType"
                            )}
                        />

                    </Grid>

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />

                    {/* =========================================
                        PRICE INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Price Information
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Price"
                            value={formattedPrice}
                        />

                        <Field
                            label="Currency"
                            value={getValue(
                                "Currency",
                                "currency"
                            )}
                        />

                        <Field
                            label="MRP"
                            value={
                                (() => {

                                    const mrp =
                                        productPrice?.MRP ??
                                        productPrice?.mrp;

                                    if (
                                        mrp === null ||
                                        mrp === undefined ||
                                        mrp === ""
                                    ) {
                                        return "-";
                                    }

                                    const number =
                                        Number(mrp);

                                    return Number.isNaN(number)
                                        ? "-"
                                        : `₹ ${number.toFixed(2)}`;

                                })()
                            }
                        />

                        <Field
                            label="Discount"
                            value={
                                (() => {

                                    const discount =
                                        productPrice?.Discount ??
                                        productPrice?.discount;

                                    if (
                                        discount === null ||
                                        discount === undefined ||
                                        discount === ""
                                    ) {
                                        return "-";
                                    }

                                    const number =
                                        Number(discount);

                                    return Number.isNaN(number)
                                        ? "-"
                                        : `${number}%`;

                                })()
                            }
                        />

                    </Grid>

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />

                    {/* =========================================
                        EFFECTIVE DATES
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Effective Period
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Effective From"
                            value={formatDate(
                                "EffectiveFrom",
                                "effectiveFrom"
                            )}
                        />

                        <Field
                            label="Effective To"
                            value={formatDate(
                                "EffectiveTo",
                                "effectiveTo"
                            )}
                        />

                    </Grid>

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />

                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Status
                    </Typography>

                    <Chip
                        label={
                            isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            isActive
                                ? "success"
                                : "error"
                        }
                        sx={{
                            fontWeight: 600,
                        }}
                    />

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />

                    {/* =========================================
                        AUDIT INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Audit Information
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Created"
                            value={formatDate(
                                "CreatedDate",
                                "createdDate"
                            )}
                        />

                        <Field
                            label="Updated"
                            value={formatDate(
                                "UpdatedDate",
                                "updatedDate"
                            )}
                        />

                    </Grid>

                </CardContent>

            </Card>

        </Box>

    );
};

export default ProductPriceView;
