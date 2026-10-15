import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/FacilityChannel";

const INITIAL_FORM = {
    sellerId: "",
    customerId: "",
    productId: "",
    skuCode: "",
    facilityCode: "",
    channelCode: "",
    sellableQuantity: 0
};

/* Extract a record from common API response formats */
const extractRecord = (response) => {
    let data = response?.data ?? response;

    for (let i = 0; i < 4; i++) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return null;
        }

        const hasId = data.id != null || data.Id != null;

        if (hasId) {
            return data;
        }

        const nested =
            data.data ??
            data.item ??
            data.result ??
            data.record;

        if (nested == null) {
            return data;
        }

        data = nested;
    }

    return data;
};

const read = (item, camel, pascal) =>
    item?.[camel] ?? item?.[pascal];

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(", ");
    }

    return data?.message || data?.title || error?.message || fallback;
};

const FacilityChannelEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =========================================
       LOAD RECORD
    ========================================= */

    useEffect(() => {
        let cancelled = false;

        const loadRecord = async () => {
            if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
                setError("A valid facility channel ID is required.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    `${API_URL}/details/${encodeURIComponent(id)}`
                );

                const record = extractRecord(response);

                if (!record || read(record, "id", "Id") == null) {
                    throw new Error(
                        "The API response did not contain the requested inventory record."
                    );
                }

                const sellerId = read(record, "sellerId", "SellerId");
                const customerId = read(record, "customerId", "CustomerId");

                if (!cancelled) {
                    setFormData({
                        sellerId: sellerId ?? "",
                        customerId: customerId ?? "",
                        productId: read(record, "productId", "ProductId") ?? "",
                        skuCode: read(record, "skuCode", "SkuCode") ?? "",
                        facilityCode: read(record, "facilityCode", "FacilityCode") ?? "",
                        channelCode: read(record, "channelCode", "ChannelCode") ?? "",
                        sellableQuantity:
                            read(record, "sellableQuantity", "SellableQuantity") ?? 0
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    /*
                     * Use navigation state only as a fallback if the API
                     * request fails and the list supplied the record.
                     */
                    const fallbackRecord =
                        location.state?.facilityChannel;

                    if (
                        fallbackRecord &&
                        String(read(fallbackRecord, "id", "Id")) === String(id)
                    ) {
                        setFormData({
                            sellerId:
                                read(fallbackRecord, "sellerId", "SellerId") ?? "",
                            customerId:
                                read(fallbackRecord, "customerId", "CustomerId") ?? "",
                            productId:
                                read(fallbackRecord, "productId", "ProductId") ?? "",
                            skuCode:
                                read(fallbackRecord, "skuCode", "SkuCode") ?? "",
                            facilityCode:
                                read(fallbackRecord, "facilityCode", "FacilityCode") ?? "",
                            channelCode:
                                read(fallbackRecord, "channelCode", "ChannelCode") ?? "",
                            sellableQuantity:
                                read(
                                    fallbackRecord,
                                    "sellableQuantity",
                                    "SellableQuantity"
                                ) ?? 0
                        });
                    } else {
                        setError(
                            getErrorMessage(
                                err,
                                "Failed to load facility channel inventory."
                            )
                        );
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadRecord();

        return () => {
            cancelled = true;
        };
    }, [id, location.state]);

    /* =========================================
       INPUT CHANGE
    ========================================= */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    /* =========================================
       UPDATE RECORD
    ========================================= */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const sellerId = Number(formData.sellerId);
        const customerId = Number(formData.customerId);
        const productId = Number(formData.productId);
        const sellableQuantity = Number(formData.sellableQuantity);

        if (
            formData.sellerId === "" ||
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {
            setError("Enter a valid Seller ID.");
            return;
        }

        if (
            formData.customerId === "" ||
            !Number.isInteger(customerId) ||
            customerId <= 0
        ) {
            setError("Enter a valid Customer ID.");
            return;
        }

        if (
            formData.productId === "" ||
            !Number.isInteger(productId) ||
            productId <= 0
        ) {
            setError("Enter a valid Product ID.");
            return;
        }

        if (!formData.skuCode.trim()) {
            setError("SKU Code is required.");
            return;
        }

        if (!formData.facilityCode.trim()) {
            setError("Facility Code is required.");
            return;
        }

        if (!formData.channelCode.trim()) {
            setError("Channel Code is required.");
            return;
        }

        if (
            formData.sellableQuantity === "" ||
            !Number.isInteger(sellableQuantity) ||
            sellableQuantity < 0
        ) {
            setError("Sellable Quantity must be a non-negative integer.");
            return;
        }

        const payload = {
            sellerId,
            customerId,
            productId,
            skuCode: formData.skuCode.trim(),
            facilityCode: formData.facilityCode.trim(),
            channelCode: formData.channelCode.trim(),
            sellableQuantity
        };

        setSaving(true);

        try {
            await axios.put(
                `${API_URL}/${encodeURIComponent(id)}`,
                payload
            );

            setSuccess("Facility channel inventory updated successfully.");

            navigate("/facility-channels", {
                replace: true,
                state: {
                    message: "Facility channel inventory updated successfully."
                }
            });
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Failed to update facility channel inventory."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>
                    Loading facility channel inventory...
                </Typography>
            </Box>
        );
    }

    /* =========================================
       FULL-PAGE EDIT FORM
    ========================================= */

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1100,
                mx: "auto",
                p: { xs: 2, md: 4 }
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Edit Facility Channel Inventory
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Update inventory record ID: {id}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/facility-channels")}
                    disabled={saving}
                >
                    Back to List
                </Button>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={2}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: 3
                }}
            >
                <Grid container spacing={3}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="sellerId"
                            label="Seller ID"
                            value={formData.sellerId}
                            onChange={handleChange}
                            inputProps={{ min: 1, step: 1 }}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="customerId"
                            label="Customer ID"
                            value={formData.customerId}
                            onChange={handleChange}
                            inputProps={{ min: 1, step: 1 }}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="productId"
                            label="Product ID"
                            value={formData.productId}
                            onChange={handleChange}
                            inputProps={{ min: 1, step: 1 }}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="skuCode"
                            label="SKU Code"
                            value={formData.skuCode}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="facilityCode"
                            label="Facility Code"
                            value={formData.facilityCode}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="channelCode"
                            label="Channel Code"
                            value={formData.channelCode}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="sellableQuantity"
                            label="Sellable Quantity"
                            value={formData.sellableQuantity}
                            onChange={handleChange}
                            inputProps={{ min: 0, step: 1 }}
                            disabled={saving}
                        />
                    </Grid>
                </Grid>

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ mt: 4 }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/facility-channels")}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            saving
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default FacilityChannelEdit;
