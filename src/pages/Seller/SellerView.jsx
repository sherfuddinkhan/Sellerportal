// =========================================================
// SellerView.jsx
// Marketplace Seller Portal
// Seller Management
// =========================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Person,
    Business,
    LocationOn,
    Email,
    Phone,
    ReceiptLong,
} from "@mui/icons-material";

// =========================================================
// NODE SERVER
// =========================================================

const API_URL = "http://localhost:5000/api";

// =========================================================
// COMPONENT
// =========================================================

const SellerView = () => {

    const navigate = useNavigate();

    const { id } = useParams();

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

        // Prevent request when URL is:
        // /sellers/view/:id
        //
        // Instead it must be:
        // /sellers/view/1

        if (!id || id === ":id") {

            setError(
                "Invalid Seller ID. Please select a seller from the seller list."
            );

            setLoading(false);

            return;
        }

        loadSeller();

    }, [id]);

    // =====================================================
    // GET SELLER BY ID
    //
    // Node:
    // GET /api/sellers/1
    //
    // ASP.NET:
    // GET /api/sellers/1
    // =====================================================

    const loadSeller = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading seller:",
                id
            );

            const response = await axios.get(
                `${API_URL}/sellers/${encodeURIComponent(id)}`,
                {
                    headers: {
                        Accept: "application/json",
                    },

                    timeout: 30000,
                }
            );

            console.log(
                "SELLER RESPONSE:",
                response.data
            );

            setSeller(response.data);

        }
        catch (err) {

            console.error(
                "Seller loading error:",
                err
            );

            if (err.response?.status === 404) {

                setError(
                    `Seller with ID ${id} was not found.`
                );

            }
            else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load seller."
                );
            }

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // EDIT SELLER
    // =====================================================

    const handleEdit = () => {

        if (!seller?.sellerId) {
            return;
        }

        navigate(
            `/sellers/edit/${seller.sellerId}`
        );
    };

    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate("/sellers");
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading seller...
                    </Typography>

                </Stack>

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
                    width: "100%",
                    maxWidth: 1000,
                    mx: "auto",
                    p: 3,
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Sellers
                </Button>

            </Box>
        );
    }

    // =====================================================
    // SAFETY
    // =====================================================

    if (!seller) {

        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: "center",
                }}
            >

                <Typography>
                    Seller information is not available.
                </Typography>

            </Box>
        );
    }

    // =====================================================
    // SUPPORT BOTH:
    //
    // camelCase:
    // sellerId
    //
    // PascalCase:
    // SellerId
    // =====================================================

    const sellerId =
        seller.sellerId ??
        seller.SellerId;

    const sellerName =
        seller.sellerName ??
        seller.SellerName ??
        "-";

    const tradeName =
        seller.tradeName ??
        seller.TradeName ??
        "-";

    const legalName =
        seller.legalName ??
        seller.LegalName ??
        "-";

    const contactPerson =
        seller.contactPerson ??
        seller.ContactPerson ??
        "-";

    const email =
        seller.email ??
        seller.Email ??
        "-";

    const phone =
        seller.phone ??
        seller.Phone ??
        "-";

    const gstin =
        seller.gstin ??
        seller.GSTIN ??
        "-";

    const address =
        seller.address ??
        seller.Address ??
        "-";

    const buildingName =
        seller.buildingName ??
        seller.BuildingName ??
        "-";

    const location =
        seller.location ??
        seller.Location ??
        "-";

    const city =
        seller.city ??
        seller.City ??
        "-";

    const state =
        seller.state ??
        seller.State ??
        "-";

    const stateCode =
        seller.stateCode ??
        seller.StateCode ??
        "-";

    const floorNo =
        seller.floorNo ??
        seller.FloorNo ??
        "-";

    const postalCode =
        seller.postalCode ??
        seller.PostalCode ??
        "-";

    const country =
        seller.country ??
        seller.Country ??
        "-";

    const isActive =
        seller.isActive ??
        seller.IsActive ??
        false;

    // =====================================================
    // INFO ITEM
    // =====================================================

    const InfoItem = ({
        label,
        value,
    }) => (

        <Box
            sx={{
                mb: 2,
            }}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5,
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontWeight: 500,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>

        </Box>
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                py: {
                    xs: 2,
                    md: 4,
                },
                px: {
                    xs: 2,
                    md: 4,
                },
                boxSizing: "border-box",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1250,
                    mx: "auto",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Paper
                    elevation={2}
                    sx={{
                        p: {
                            xs: 2,
                            md: 3,
                        },
                        borderRadius: 3,
                        mb: 3,
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "stretch",
                            sm: "center",
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >

                            <Person
                                sx={{
                                    fontSize: 42,
                                }}
                            />

                            <Box>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {sellerName}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Seller ID: {sellerId}
                                </Typography>

                            </Box>

                        </Stack>


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
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
                                Edit Seller
                            </Button>

                        </Stack>

                    </Stack>

                </Paper>


                {/* =================================================
                    STATUS
                ================================================= */}

                <Card
                    elevation={2}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                    }}
                >

                    <CardContent>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Seller Status
                            </Typography>

                            <Box
                                sx={{
                                    px: 2,
                                    py: 0.7,
                                    borderRadius: 5,
                                    fontWeight: 700,
                                    backgroundColor:
                                        isActive
                                            ? "success.light"
                                            : "error.light",
                                    color:
                                        isActive
                                            ? "success.dark"
                                            : "error.dark",
                                }}
                            >
                                {isActive
                                    ? "Active"
                                    : "Inactive"}
                            </Box>

                        </Stack>

                    </CardContent>

                </Card>


                {/* =================================================
                    SELLER INFORMATION
                ================================================= */}

                <Grid
                    container
                    spacing={3}
                >

                    {/* =================================================
                        BUSINESS DETAILS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                height: "100%",
                                borderRadius: 3,
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >

                                    <Business />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Business Details
                                    </Typography>

                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 3,
                                    }}
                                />

                                <InfoItem
                                    label="Seller ID"
                                    value={sellerId}
                                />

                                <InfoItem
                                    label="Seller Name"
                                    value={sellerName}
                                />

                                <InfoItem
                                    label="Trade Name"
                                    value={tradeName}
                                />

                                <InfoItem
                                    label="Legal Name"
                                    value={legalName}
                                />

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* =================================================
                        CONTACT DETAILS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                height: "100%",
                                borderRadius: 3,
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >

                                    <Person />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Contact Details
                                    </Typography>

                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 3,
                                    }}
                                />

                                <InfoItem
                                    label="Contact Person"
                                    value={contactPerson}
                                />

                                <InfoItem
                                    label="Email"
                                    value={email}
                                />

                                <InfoItem
                                    label="Phone"
                                    value={phone}
                                />

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* =================================================
                        TAX DETAILS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >

                                    <ReceiptLong />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Tax Details
                                    </Typography>

                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 3,
                                    }}
                                />

                                <Grid
                                    container
                                    spacing={3}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                    >
                                        <InfoItem
                                            label="GSTIN"
                                            value={gstin}
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                    >
                                        <InfoItem
                                            label="State Code"
                                            value={stateCode}
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                    >
                                        <InfoItem
                                            label="Country"
                                            value={country}
                                        />
                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* =================================================
                        ADDRESS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >

                                    <LocationOn />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Address Details
                                    </Typography>

                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 3,
                                    }}
                                />

                                <Grid
                                    container
                                    spacing={3}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                    >

                                        <InfoItem
                                            label="Address"
                                            value={address}
                                        />

                                        <InfoItem
                                            label="Building Name"
                                            value={buildingName}
                                        />

                                        <InfoItem
                                            label="Location"
                                            value={location}
                                        />

                                        <InfoItem
                                            label="Floor No"
                                            value={floorNo}
                                        />

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                    >

                                        <InfoItem
                                            label="City"
                                            value={city}
                                        />

                                        <InfoItem
                                            label="State"
                                            value={state}
                                        />

                                        <InfoItem
                                            label="Postal Code"
                                            value={postalCode}
                                        />

                                        <InfoItem
                                            label="Country"
                                            value={country}
                                        />

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

            </Box>

        </Box>
    );
};

export default SellerView;

