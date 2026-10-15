import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    Inventory2
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/FacilityChannel";

/* =========================================
   NORMALIZE API RESPONSE
========================================= */

function normalizeFacilityChannel(responseData) {
    let data = responseData;

    // Unwrap common API response envelopes.
    for (let i = 0; i < 5; i++) {
        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return null;
        }

        const id = data.id ?? data.Id;

        if (id !== undefined && id !== null) {
            return {
                id,
                sellerId: data.sellerId ?? data.SellerId ?? "",
                customerId: data.customerId ?? data.CustomerId ?? "",
                productId: data.productId ?? data.ProductId ?? "",
                skuCode: data.skuCode ?? data.SkuCode ?? "",
                facilityCode: data.facilityCode ?? data.FacilityCode ?? "",
                channelCode: data.channelCode ?? data.ChannelCode ?? "",
                sellableQuantity:
                    data.sellableQuantity ??
                    data.SellableQuantity ??
                    0
            };
        }

        data =
            data.data ??
            data.result ??
            data.item ??
            data.record ??
            data.facilityChannel ??
            data.FacilityChannel;
    }

    return null;
}

/* =========================================
   ERROR MESSAGE
========================================= */

function getErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(", ");
    }

    return (
        data?.message ||
        data?.title ||
        error?.message ||
        "Unable to load Facility Channel details."
    );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function FacilityChannelView({ id: suppliedId }) {
    const { id: routeId } = useParams();
    const navigate = useNavigate();

    const facilityChannelId = suppliedId ?? routeId;

    const [facilityChannel, setFacilityChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================================
       FETCH DETAILS
    ========================================= */

    const fetchFacilityChannel = useCallback(async () => {
        if (
            !facilityChannelId ||
            !Number.isInteger(Number(facilityChannelId)) ||
            Number(facilityChannelId) <= 0
        ) {
            setFacilityChannel(null);
            setError("A valid Facility Channel ID is required.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${API_URL}/details/${encodeURIComponent(facilityChannelId)}`
            );

            const normalized = normalizeFacilityChannel(response.data);

            if (!normalized) {
                throw new Error(
                    "The API did not return a valid Facility Channel record."
                );
            }

            setFacilityChannel(normalized);
        } catch (err) {
            setFacilityChannel(null);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [facilityChannelId]);

    useEffect(() => {
        fetchFacilityChannel();
    }, [fetchFacilityChannel]);

    /* =========================================
       NAVIGATION
    ========================================= */

    const handleBack = () => {
        navigate("/facility-channels");
    };

    const handleEdit = () => {
        if (!facilityChannel?.id) {
            setError("Facility Channel ID was not found.");
            return;
        }

        // Do not block navigation just because the API returned
        // missing seller/customer fields. The edit page can load
        // the complete record directly from the API.
        navigate(`/facility-channels/${facilityChannel.id}/edit`, {
            state: {
                facilityChannel: {
                    ...facilityChannel,
                    sellerId: facilityChannel.sellerId,
                    customerId: facilityChannel.customerId
                }
            }
        });
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading Facility Channel details...
                    </Typography>
                </Box>
            </Container>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error && !facilityChannel) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Facility Channels
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={fetchFacilityChannel}
                        >
                            Retry
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    if (!facilityChannel) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Facility Channel record not found.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to List
                </Button>
            </Container>
        );
    }

    /* =========================================
       DETAIL FIELDS
    ========================================= */

    const detailFields = [
        {
            label: "Facility Channel ID",
            value: facilityChannel.id
        },
        {
            label: "Seller ID",
            value: facilityChannel.sellerId
        },
        {
            label: "Customer ID",
            value: facilityChannel.customerId
        },
        {
            label: "Product ID",
            value: facilityChannel.productId
        },
        {
            label: "SKU Code",
            value: facilityChannel.skuCode
        },
        {
            label: "Facility Code",
            value: facilityChannel.facilityCode
        },
        {
            label: "Channel Code",
            value: facilityChannel.channelCode
        },
        {
            label: "Sellable Quantity",
            value: facilityChannel.sellableQuantity
        }
    ];

    /* =========================================
       FULL PAGE VIEW
    ========================================= */

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Facility Channel Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View inventory availability for this facility and
                        sales channel.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to List
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Inventory2 color="primary" sx={{ fontSize: 36 }} />

                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                {facilityChannel.skuCode || "Facility Channel"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Record ID: {facilityChannel.id}
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Seller ID
                            </Typography>
                            <Typography variant="h6">
                                {facilityChannel.sellerId || "-"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Customer ID
                            </Typography>
                            <Typography variant="h6">
                                {facilityChannel.customerId || "-"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Product ID
                            </Typography>
                            <Typography variant="h6">
                                {facilityChannel.productId || "-"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Sellable Quantity
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                                {facilityChannel.sellableQuantity}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
            >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    General Information
                </Typography>

                <Divider sx={{ mb: 1 }} />

                <Grid container>
                    {detailFields.map((field) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            key={field.label}
                            sx={{
                                p: 2,
                                borderBottom: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.75 }}
                            >
                                {field.label}
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {field.value === "" || field.value == null
                                    ? "-"
                                    : field.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mt: 4 }}
                >
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Facility Channel
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchFacilityChannel}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="text"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to List
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default FacilityChannelView;
