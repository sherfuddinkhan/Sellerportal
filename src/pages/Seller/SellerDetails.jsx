// =========================================================
// SellerDetails.jsx
// View Seller Details
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
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

import axios from "axios";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const SellerDetails = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [seller, setSeller] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD SELLER
    // =====================================================

    useEffect(() => {

        const loadSeller = async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "GET SELLER:",
                    id
                );

                const response =
                    await axios.get(

                        `${SERVER_URL}/api/sellers/${id}`,

                        {
                            headers: {
                                Accept:
                                    "application/json"
                            },

                            timeout: 30000
                        }
                    );

                console.log(
                    "SELLER RESPONSE:",
                    response.data
                );

                setSeller(
                    response.data
                );

            }
            catch (error) {

                console.error(
                    "GET SELLER ERROR:",
                    error
                );

                console.error(
                    "RESPONSE:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load seller details."
                );

            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            loadSeller();
        }

    }, [id]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "300px",
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

            <Box>

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate("/sellers")
                    }
                >
                    Back to Sellers
                </Button>

            </Box>

        );

    }

    // =====================================================
    // SELLER NOT FOUND
    // =====================================================

    if (!seller) {

        return (

            <Box>

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2
                    }}
                >
                    Seller not found.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate("/sellers")
                    }
                >
                    Back to Sellers
                </Button>

            </Box>

        );

    }

    // =====================================================
    // HELPER
    // =====================================================

    const displayValue = (
        value
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return value;

    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (
        value
    ) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString();

    };

    // =====================================================
    // STATUS
    // =====================================================

    const statusText =
        seller.isActive
            ? "Active"
            : "Inactive";

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="600"
                    >
                        Seller Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View complete seller information.
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate("/sellers")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={() =>
                            navigate(
                                `/sellers/edit/${seller.sellerId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>

            {/* =================================================
                SELLER INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                }}
            >

                {/* =============================================
                    BASIC DETAILS
                ============================================== */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mb: 2,
                    }}
                >
                    Seller Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {displayValue(
                                seller.sellerId
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller Name
                        </Typography>

                        <Typography
                            variant="body1"
                        >
                            {displayValue(
                                seller.sellerName
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Trade Name
                        </Typography>

                        <Typography
                            variant="body1"
                        >
                            {displayValue(
                                seller.tradeName
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Legal Name
                        </Typography>

                        <Typography
                            variant="body1"
                        >
                            {displayValue(
                                seller.legalName
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                                color:
                                    seller.isActive
                                        ? "success.main"
                                        : "error.main",
                            }}
                        >
                            {statusText}
                        </Typography>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* =============================================
                    CONTACT DETAILS
                ============================================== */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mb: 2,
                    }}
                >
                    Contact Details
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Contact Person
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.contactPerson
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Email
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.email
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Phone
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.phone
                            )}
                        </Typography>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* =============================================
                    TAX DETAILS
                ============================================== */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mb: 2,
                    }}
                >
                    Tax Details
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            GSTIN
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.gstin
                            )}
                        </Typography>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* =============================================
                    ADDRESS DETAILS
                ============================================== */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mb: 2,
                    }}
                >
                    Address Details
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Address
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.address
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Building Name
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.buildingName
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Location
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.location
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            City
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.city
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            State
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.state
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            State Code
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.stateCode
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Floor No
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.floorNo
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Postal Code
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.postalCode
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Country
                        </Typography>

                        <Typography variant="body1">
                            {displayValue(
                                seller.country
                            )}
                        </Typography>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* =============================================
                    AUDIT DETAILS
                ============================================== */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mb: 2,
                    }}
                >
                    Audit Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created At
                        </Typography>

                        <Typography variant="body1">
                            {formatDate(
                                seller.createdAt
                            )}
                        </Typography>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated At
                        </Typography>

                        <Typography variant="body1">
                            {formatDate(
                                seller.updatedAt
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate("/sellers")
                    }
                >
                    Back to Sellers
                </Button>

            </Box>

        </Box>
    );
};

export default SellerDetails;

