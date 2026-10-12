
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
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

const API_URL = "http://localhost:5000/api/reverse-pickup-items";

 function ReversePickupItemDetails({
    itemId,
    id,
    item,
    reversePickupItem,
    apiUrl = API_URL,
    onBack,
    onEdit,
    onRefresh
}) {
    const params = useParams();
    const navigate = useNavigate();

    const currentId =
        itemId ??
        id ??
        params.id ??
        item?.id ??
        reversePickupItem?.id;

    const initialItem = item ?? reversePickupItem ?? null;

    const [itemDetails, setItemDetails] = useState(initialItem);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getValue = (obj, camelCase, pascalCase = "") => {
        if (!obj) return null;

        return (
            obj[camelCase] ??
            (pascalCase ? obj[pascalCase] : undefined) ??
            null
        );
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === "") {
            return "N/A";
        }

        return String(value);
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") {
            return "N/A";
        }

        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return String(value);
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);
    };

    const fetchItemDetails = async () => {
        if (currentId === null || currentId === undefined || currentId === "") {
            setError("Reverse pickup item ID is missing.");
            setItemDetails(null);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(currentId)}`
            );

            const data = response.data;

            const result =
                data?.data ??
                data?.item ??
                data?.reversePickupItem ??
                data;

            if (!result || typeof result !== "object") {
                throw new Error("Invalid reverse pickup item response.");
            }

            setItemDetails(result);
        } catch (err) {
            console.error("Error fetching reverse pickup item details:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Unable to fetch reverse pickup item details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialItem && String(initialItem.id) === String(currentId)) {
            setItemDetails(initialItem);
            return;
        }

        fetchItemDetails();

        // Fetch details when the item ID or API URL changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentId, apiUrl]);

    const handleBack = () => {
        if (onBack) {
            onBack();
            return;
        }

        navigate("/reverse-pickup-items");
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(itemDetails);
            return;
        }

        if (currentId !== null && currentId !== undefined) {
            navigate(`/reverse-pickup-items/${currentId}/edit`);
        }
    };

    const handleRefresh = async () => {
        await fetchItemDetails();

        if (onRefresh) {
            onRefresh();
        }
    };

    const DetailField = ({ label, value, currency = false }) => (
        <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mb: 0.5,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ overflowWrap: "anywhere" }}
                >
                    {currency ? formatCurrency(value) : formatValue(value)}
                </Typography>
            </Box>
        </Grid>
    );

    if (loading && !itemDetails) {
        return (
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="300px"
                    gap={2}
                >
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading reverse pickup item details...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Reverse Pickup Item Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        View the complete information for this reverse pickup item.
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        disabled={!itemDetails}
                    >
                        Edit
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRefresh}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {loading && itemDetails && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                        Refreshing details...
                    </Typography>
                </Box>
            )}

            {!itemDetails && !loading && !error && (
                <Alert severity="info">
                    No reverse pickup item details found.
                </Alert>
            )}

            {itemDetails && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ mb: 2 }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: "primary.light",
                                            color: "primary.contrastText"
                                        }}
                                    >
                                        <Inventory2 />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" fontWeight={700}>
                                            {formatValue(
                                                getValue(
                                                    itemDetails,
                                                    "itemSku",
                                                    "ItemSku"
                                                )
                                            )}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Reverse pickup item ID: {formatValue(
                                                getValue(itemDetails, "id", "Id")
                                            )}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label="Reverse Pickup Item"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    General Information
                                </Typography>

                                <Grid container spacing={1}>
                                    <DetailField
                                        label="Item ID"
                                        value={getValue(itemDetails, "id", "Id")}
                                    />

                                    <DetailField
                                        label="Seller ID"
                                        value={getValue(itemDetails, "sellerId", "SellerId")}
                                    />

                                    <DetailField
                                        label="Customer ID"
                                        value={getValue(itemDetails, "customerId", "CustomerId")}
                                    />

                                    <DetailField
                                        label="Reverse Pickup ID"
                                        value={getValue(
                                            itemDetails,
                                            "reversePickupId",
                                            "ReversePickupId"
                                        )}
                                    />

                                    <DetailField
                                        label="Sale Order Item Code"
                                        value={getValue(
                                            itemDetails,
                                            "saleOrderItemCode",
                                            "SaleOrderItemCode"
                                        )}
                                    />

                                    <DetailField
                                        label="Item SKU"
                                        value={getValue(
                                            itemDetails,
                                            "itemSku",
                                            "ItemSku"
                                        )}
                                    />

                                    <DetailField
                                        label="Return Reason"
                                        value={getValue(
                                            itemDetails,
                                            "reason",
                                            "Reason"
                                        )}
                                    />
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Pricing Information
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={1}>
                                    <DetailField
                                        label="Total Price"
                                        value={getValue(
                                            itemDetails,
                                            "totalPrice",
                                            "TotalPrice"
                                        )}
                                        currency
                                    />

                                    <DetailField
                                        label="Selling Price"
                                        value={getValue(
                                            itemDetails,
                                            "sellingPrice",
                                            "SellingPrice"
                                        )}
                                        currency
                                    />

                                    <DetailField
                                        label="Discount"
                                        value={getValue(
                                            itemDetails,
                                            "discount",
                                            "Discount"
                                        )}
                                        currency
                                    />
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper
                            variant="outlined"
                            sx={{ p: 2, bgcolor: "background.default" }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                The details above are loaded from the reverse pickup
                                item API. Fields not returned by the API are displayed
                                as N/A.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
export default  ReversePickupItemDetails;