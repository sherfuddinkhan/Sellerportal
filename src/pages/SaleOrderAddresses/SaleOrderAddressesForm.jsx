import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

const API_URL = "http://localhost:5000/api/SaleOrderAddresses";

const initialFormData = {
    addressId: "",
    salesOrderId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    stateCode: "",
    countryCode: "IN",
    pincode: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: ""
};

const getField = (item, camel, pascal, fallback = "") =>
    item?.[camel] ?? item?.[pascal] ?? fallback;

const getRecordId = (item) =>
    item?.id ??
    item?.Id ??
    item?.saleOrderAddressId ??
    item?.SaleOrderAddressId ??
    item?.saleOrderAddressesId ??
    item?.SaleOrderAddressesId ??
    item?.addressRecordId ??
    item?.AddressRecordId ??
    null;

const getAddressId = (item) =>
    item?.addressId ??
    item?.AddressId ??
    "";

function getErrorMessage(error, fallback) {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.message) return data.message;
    if (data?.title) return data.title;

    if (data?.details) {
        return typeof data.details === "string"
            ? data.details
            : JSON.stringify(data.details);
    }

    return error?.message || fallback;
}

function SaleOrderAddressesForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(initialFormData);
    const [recordId, setRecordId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadAddress = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const addressId = decodeURIComponent(id);
            let foundAddress = null;

            // First try the individual-address endpoint.
            try {
                const response = await axios.get(
                    `${API_URL}/${encodeURIComponent(addressId)}`,
                    { timeout: 15000 }
                );

                if (
                    response.data &&
                    !Array.isArray(response.data) &&
                    typeof response.data === "object"
                ) {
                    foundAddress = response.data;
                }
            } catch (requestError) {
                // The API documents an integer path ID, so a string
                // addressId may return 404. Fall back to GET all.
                if (
                    requestError.response?.status !== 404 &&
                    requestError.response?.status !== 400
                ) {
                    throw requestError;
                }
            }

            // Find by the business string ID if individual lookup failed.
            if (!foundAddress || !getRecordId(foundAddress)) {
                const response = await axios.get(`${API_URL}/all`, {
                    headers: { Accept: "*/*" },
                    timeout: 15000
                });

                const data = response.data;
                const addresses = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.items)
                            ? data.items
                            : [];

                const match = addresses.find(
                    (item) =>
                        String(getAddressId(item)).toLowerCase() ===
                        addressId.toLowerCase()
                );

                if (match) {
                    foundAddress = match;
                }
            }

            if (!foundAddress) {
                throw new Error(
                    `Address "${addressId}" was not found in GET /all.`
                );
            }

            const numericId = getRecordId(foundAddress);

            if (
                numericId === null ||
                numericId === "" ||
                !Number.isInteger(Number(numericId)) ||
                Number(numericId) <= 0
            ) {
                throw new Error(
                    "The address response does not contain a numeric " +
                    "database ID. Check GET /api/sale-order-addresses/all " +
                    "and identify the address table's integer primary key."
                );
            }

            setRecordId(Number(numericId));

            setFormData({
                addressId: String(
                    getAddressId(foundAddress) || addressId
                ),
                salesOrderId: getField(
                    foundAddress,
                    "salesOrderId",
                    "SalesOrderId"
                ),
                name: getField(foundAddress, "name", "Name"),
                addressLine1: getField(
                    foundAddress,
                    "addressLine1",
                    "AddressLine1"
                ),
                addressLine2: getField(
                    foundAddress,
                    "addressLine2",
                    "AddressLine2"
                ),
                city: getField(foundAddress, "city", "City"),
                state: getField(foundAddress, "state", "State"),
                stateCode: getField(
                    foundAddress,
                    "stateCode",
                    "StateCode"
                ),
                countryCode: getField(
                    foundAddress,
                    "countryCode",
                    "CountryCode",
                    "IN"
                ),
                pincode:
                    getField(foundAddress, "pincode", "Pincode") ||
                    getField(foundAddress, "pinCode", "PinCode"),
                phone: getField(foundAddress, "phone", "Phone"),
                email: getField(foundAddress, "email", "Email"),
                latitude: getField(
                    foundAddress,
                    "latitude",
                    "Latitude"
                ),
                longitude: getField(
                    foundAddress,
                    "longitude",
                    "Longitude"
                )
            });
        } catch (err) {
            console.error(
                "LOAD SALE ORDER ADDRESS ERROR:",
                err.response?.data || err.message
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to retrieve sale order address."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (isEditMode) {
            loadAddress();
        } else {
            setFormData(initialFormData);
            setRecordId(null);
            setError("");
        }
    }, [isEditMode, loadAddress]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const validateForm = () => {
        if (!String(formData.addressId).trim()) {
            return "Address ID is required.";
        }

        if (
            !String(formData.salesOrderId).trim() ||
            !Number.isInteger(Number(formData.salesOrderId)) ||
            Number(formData.salesOrderId) <= 0
        ) {
            return "Enter a valid positive Sales Order ID.";
        }

        if (!String(formData.name).trim()) {
            return "Customer name is required.";
        }

        if (!String(formData.addressLine1).trim()) {
            return "Address Line 1 is required.";
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            return "Enter a valid email address.";
        }

        if (
            formData.latitude !== "" &&
            !Number.isFinite(Number(formData.latitude))
        ) {
            return "Latitude must be a valid number.";
        }

        if (
            formData.longitude !== "" &&
            !Number.isFinite(Number(formData.longitude))
        ) {
            return "Longitude must be a valid number.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (isEditMode && recordId === null) {
            setError(
                "Cannot update: the numeric database ID could not be " +
                "identified. Check the GET /all response."
            );
            return;
        }

        const payload = {
            addressId: String(formData.addressId).trim(),
            salesOrderId: Number(formData.salesOrderId),
            name: formData.name.trim(),
            addressLine1: formData.addressLine1.trim(),
            addressLine2: formData.addressLine2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            stateCode: formData.stateCode.trim(),
            countryCode: formData.countryCode.trim(),
            pincode: formData.pincode.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            latitude: String(formData.latitude).trim(),
            longitude: String(formData.longitude).trim()
        };

        setSaving(true);

        try {
            if (isEditMode) {
                // ASP.NET PUT route requires an integer ID.
                await axios.put(
                    `${API_URL}/${recordId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        timeout: 15000
                    }
                );
            } else {
                // Requires POST /api/sale-order-addresses on ASP.NET.
                await axios.post(API_URL, payload, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 15000
                });
            }

            navigate("/sale-order-addresses", {
                state: {
                    message: isEditMode
                        ? "Sale order address updated successfully."
                        : "Sale order address created successfully."
                }
            });
        } catch (err) {
            console.error(
                isEditMode
                    ? "UPDATE SALE ORDER ADDRESS ERROR:"
                    : "CREATE SALE ORDER ADDRESS ERROR:",
                {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                }
            );

            setError(
                getErrorMessage(
                    err,
                    isEditMode
                        ? "Failed to update sale order address."
                        : "Failed to create sale order address."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (isEditMode) {
            loadAddress();
        } else {
            setFormData(initialFormData);
            setError("");
            setSuccess("");
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />
                <Typography>Loading sale order address...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
            <Paper
                elevation={3}
                sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {isEditMode
                                ? "Edit Sale Order Address"
                                : "Create Sale Order Address"}
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Manage customer, sales order, and delivery
                            address information.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/sale-order-addresses")}
                    >
                        Back to List
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Address Identification
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Address ID"
                                name="addressId"
                                value={formData.addressId}
                                onChange={handleChange}
                                disabled={isEditMode || saving}
                                helperText={
                                    isEditMode
                                        ? `Database record ID: ${recordId ?? "Not identified"}`
                                        : "Enter a unique address identifier."
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Sales Order ID"
                                name="salesOrderId"
                                value={formData.salesOrderId}
                                onChange={handleChange}
                                disabled={saving}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Customer and Address
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Customer Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="State Code"
                                name="stateCode"
                                value={formData.stateCode}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country Code"
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Contact Information
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Geographic Coordinates
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="flex-end"
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleReset}
                            disabled={saving || loading}
                        >
                            Reset
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/sale-order-addresses")}
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
                                    : <SaveIcon />
                            }
                            disabled={saving || loading}
                        >
                            {saving
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Address"
                                    : "Create Address"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default SaleOrderAddressesForm;
