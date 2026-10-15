import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
    Box,
    Paper,
    Grid,
    Typography,
    Divider,
    Chip,
    Button,
    Stack,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    Business,
    Hub,
    Tag,
    InfoOutlined,
    Inventory2,
    Person,
    ShoppingBag
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/FacilityChannel";

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;

    if (data?.errors) {
        return Object.values(data.errors).flat().join(" ");
    }

    if (error?.code === "ECONNABORTED") {
        return "The API request timed out after 10 seconds. Check the Node.js proxy and .NET API.";
    }

    if (error?.code === "ERR_NETWORK") {
        return "Cannot connect to the API. Make sure the Node.js server is running on port 5000.";
    }

    return error?.message || "Unable to load facility channel details.";
};

const normalizeFacilityChannel = (responseData) => {
    let record = responseData;

    for (let i = 0; i < 5 && record && typeof record === "object"; i++) {
        if (Array.isArray(record)) {
            record = record[0];
            continue;
        }

        const nested =
            record.facilityChannel ??
            record.FacilityChannel ??
            record.data ??
            record.result ??
            record.item ??
            record.record;

        if (!nested || nested === record) break;
        record = nested;
    }

    if (!record || typeof record !== "object" || Array.isArray(record)) {
        return null;
    }

    const id =
        record.id ??
        record.Id ??
        record.facilityChannelId ??
        record.FacilityChannelId;

    if (id === null || id === undefined || id === "") {
        return null;
    }

    return {
        id,
        sellerId: record.sellerId ?? record.SellerId ?? "",
        customerId: record.customerId ?? record.CustomerId ?? "",
        productId: record.productId ?? record.ProductId ?? "",
        skuCode: record.skuCode ?? record.SkuCode ?? "",
        facilityCode: record.facilityCode ?? record.FacilityCode ?? "",
        channelCode: record.channelCode ?? record.ChannelCode ?? "",
        sellableQuantity:
            record.sellableQuantity ?? record.SellableQuantity ?? 0
    };
};

const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: "action.hover",
                color: "text.secondary"
            }}
        >
            {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>

            <Typography variant="body1" fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
                {value === null || value === undefined || value === ""
                    ? "—"
                    : String(value)}
            </Typography>
        </Box>
    </Box>
);

const FacilityChannelDetails = ({
    facilityChannelId: suppliedId,
    facilityChannel: suppliedRecord = null,
    apiBaseUrl = API_URL,
    onClose,
    onEdit,
    onError
}) => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const routeRecord =
        location.state?.facilityChannel ??
        location.state?.record ??
        suppliedRecord ??
        null;

    const facilityChannelId =
        suppliedId ??
        routeId ??
        routeRecord?.id ??
        routeRecord?.Id ??
        routeRecord?.facilityChannelId ??
        routeRecord?.FacilityChannelId;

    const [facilityChannel, setFacilityChannel] = useState(
        () => normalizeFacilityChannel(routeRecord)
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const goBack = () => {
        if (typeof onClose === "function") {
            onClose();
        } else {
            navigate("/facility-channels");
        }
    };

    const handleEdit = (record) => {
        if (typeof onEdit === "function") {
            onEdit(record);
            return;
        }

        navigate(`/facility-channels/${record.id}/edit`, {
            state: { facilityChannel: record }
        });
    };

    // IMPORTANT: Hooks and this function must remain inside the component.
    const loadFacilityChannel = useCallback(async () => {
        if (
            facilityChannelId === null ||
            facilityChannelId === undefined ||
            String(facilityChannelId).trim() === ""
        ) {
            setError("Facility channel ID is missing from the URL.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            let sellerId =
                routeRecord?.sellerId ??
                routeRecord?.SellerId ??
                "";

            let customerId =
                routeRecord?.customerId ??
                routeRecord?.CustomerId ??
                "";

            // Use the known example IDs only when opening record 1
            // without navigation state. Remove this fallback if IDs
            // must always come from the logged-in user's selection.
            if (
                (sellerId === "" || customerId === "") &&
                String(facilityChannelId) === "1"
            ) {
                sellerId = 6;
                customerId = 3;
            }

            if (
                sellerId === "" ||
                sellerId === null ||
                sellerId === undefined ||
                customerId === "" ||
                customerId === null ||
                customerId === undefined
            ) {
                throw new Error(
                    "Seller ID and Customer ID are required. Open this record from the Facility Channels list or supply the correct IDs."
                );
            }

            console.log("Facility Channel ID:", facilityChannelId);
            console.log("Seller ID:", sellerId);
            console.log("Customer ID:", customerId);

            const response = await axios.get(
                `${apiBaseUrl}/details/${encodeURIComponent(facilityChannelId)}`,
                {
                    params: { sellerId, customerId },
                    timeout: 10000
                }
            );

            console.log("Facility Channel API response:", response.data);

            const record = normalizeFacilityChannel(response.data);

            if (!record) {
                throw new Error(
                    "The API response did not contain a valid facility channel record."
                );
            }

            setFacilityChannel(record);
        } catch (requestError) {
            console.error(
                "Facility Channel Details Error:",
                requestError.response?.data || requestError.message
            );

            setError(getErrorMessage(requestError));

            if (typeof onError === "function") {
                onError(requestError);
            }
        } finally {
            setLoading(false);
        }
    }, [
        facilityChannelId,
        apiBaseUrl,
        routeRecord,
        onError
    ]);

    useEffect(() => {
        loadFacilityChannel();
    }, [loadFacilityChannel]);

    if (loading) {
        return (
            <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }} color="text.secondary">
                    Loading facility channel details...
                </Typography>
            </Paper>
        );
    }

    if (error && !facilityChannel) {
        return (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadFacilityChannel}
                    >
                        Retry
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={goBack}
                    >
                        Back to List
                    </Button>
                </Stack>
            </Paper>
        );
    }

    if (!facilityChannel) {
        return (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                <InfoOutlined sx={{ fontSize: 42, mb: 1 }} />
                <Typography variant="h6">Facility channel not found</Typography>
                <Button sx={{ mt: 2 }} onClick={goBack}>
                    Back to List
                </Button>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            bgcolor: "action.hover"
                        }}
                    >
                        <Hub color="primary" fontSize="large" />
                    </Box>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Facility Channel Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Facility, channel and inventory information
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Refresh details">
                        <span>
                            <IconButton onClick={loadFacilityChannel}>
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(facilityChannel)}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={goBack}
                    >
                        Back
                    </Button>
                </Stack>
            </Box>

            <Divider />

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    bgcolor: "action.hover"
                }}
            >
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Facility Channel ID
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                        {facilityChannel.id}
                    </Typography>
                </Box>

                <Chip label="Inventory Record" color="primary" variant="outlined" />
            </Box>

            <Divider />

            <Box sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    General Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<Person />} label="Seller ID" value={facilityChannel.sellerId} />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<Person />} label="Customer ID" value={facilityChannel.customerId} />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<ShoppingBag />} label="Product ID" value={facilityChannel.productId} />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<Tag />} label="SKU Code" value={facilityChannel.skuCode} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Facility and Channel
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<Business />} label="Facility Code" value={facilityChannel.facilityCode} />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <DetailItem icon={<Hub />} label="Channel Code" value={facilityChannel.channelCode} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Inventory Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <DetailItem
                            icon={<Inventory2 />}
                            label="Sellable Quantity"
                            value={facilityChannel.sellableQuantity}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default FacilityChannelDetails;
