import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

const API_URL = "http://localhost:5000/api/SaleOrderAddresses";

const INITIAL_FORM = {
    addressId: "",
    salesOrderId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    stateCode: "",
    countryCode: "",
    pincode: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: ""
};

function SaleOrderAddressesEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getValue = (item, camelCase, pascalCase, fallback = "") =>
        item?.[camelCase] ?? item?.[pascalCase] ?? fallback;

    const fetchAddress = useCallback(async () => {
        if (!id) {
            setError("Address ID was not provided in the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const addressId = decodeURIComponent(id);

            // GET through Node.js proxy:
            // http://localhost:5000/api/SaleOrderAddresses/{addressId}
            const response = await axios.get(
                `${API_URL}/${encodeURIComponent(addressId)}`,
                {
                    headers: { Accept: "*/*" },
                    timeout: 15000
                }
            );

            const address = response.data;

            if (!address || Array.isArray(address) || typeof address !== "object") {
                throw new Error("The requested sale order address was not found.");
            }

            setFormData({
                addressId: String(
                    getValue(address, "addressId", "AddressId", addressId)
                ),
                salesOrderId: String(
                    getValue(address, "salesOrderId", "SalesOrderId")
                ),
                name: String(getValue(address, "name", "Name")),
                addressLine1: String(
                    getValue(address, "addressLine1", "AddressLine1")
                ),
                addressLine2: String(
                    getValue(address, "addressLine2", "AddressLine2")
                ),
                city: String(getValue(address, "city", "City")),
                state: String(getValue(address, "state", "State")),
                stateCode: String(getValue(address, "stateCode", "StateCode")),
                countryCode: String(
                    getValue(address, "countryCode", "CountryCode")
                ),
                pincode: String(getValue(address, "pincode", "Pincode")),
                phone: String(getValue(address, "phone", "Phone")),
                email: String(getValue(address, "email", "Email")),
                latitude: String(getValue(address, "latitude", "Latitude")),
                longitude: String(getValue(address, "longitude", "Longitude"))
            });
        } catch (err) {
            console.error("FETCH SALE ORDER ADDRESS FOR EDIT ERROR:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.details ||
                err.message ||
                "Failed to load the sale order address."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.addressId.trim()) {
            setError("Address ID is required.");
            return;
        }

        if (!formData.salesOrderId.trim()) {
            setError("Sales Order ID is required.");
            return;
        }

        if (
            !Number.isInteger(Number(formData.salesOrderId)) ||
            Number(formData.salesOrderId) <= 0
        ) {
            setError("Sales Order ID must be a positive integer.");
            return;
        }

        if (!formData.name.trim()) {
            setError("Customer name is required.");
            return;
        }

        if (!formData.addressLine1.trim()) {
            setError("Address Line 1 is required.");
            return;
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            setError("Enter a valid email address.");
            return;
        }

        const payload = {
            addressId: formData.addressId.trim(),
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
            latitude: formData.latitude.trim(),
            longitude: formData.longitude.trim()
        };

        setSaving(true);

        try {
            const addressId = decodeURIComponent(id);

            // PUT through Node.js proxy:
            // http://localhost:5000/api/SaleOrderAddresses/{addressId}
            const response = await axios.put(
                `${API_URL}/${encodeURIComponent(addressId)}`,
                payload,
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    },
                    timeout: 15000
                }
            );

            setSuccess("Sale order address updated successfully.");

            navigate("/sale-order-addresses", {
                replace: true,
                state: {
                    message: "Sale order address updated successfully."
                }
            });
        } catch (err) {
            console.error("UPDATE SALE ORDER ADDRESS ERROR:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.details ||
                err.message ||
                "Failed to update the sale order address."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate("/sale-order-addresses");
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 3
                }}
            >
                <CircularProgress />
                <Typography color="text.secondary">
                    Loading sale order address...
                </Typography>
            </Box>
        );
    }

    if (error && !formData.addressId) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: "auto" }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    Edit Sale Order Address
                </Typography>

                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                    >
                        Back to List
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={fetchAddress}
                    >
                        Retry
                    </Button>
                </Stack>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Edit Sale Order Address
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Update the customer address associated with this sales order.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
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

            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Order and Customer Information
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))"
                            },
                            gap: 2
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Address ID"
                            name="addressId"
                            value={formData.addressId}
                            disabled
                            helperText="Address ID cannot be changed."
                        />

                        <TextField
                            required
                            fullWidth
                            label="Sales Order ID"
                            name="salesOrderId"
                            type="number"
                            value={formData.salesOrderId}
                            onChange={handleChange}
                            inputProps={{ min: 1, step: 1 }}
                            disabled={saving}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Customer Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Address Information
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))"
                            },
                            gap: 2
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Address Line 1"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Address Line 2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="State Code"
                            name="stateCode"
                            value={formData.stateCode}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Country Code"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Geographic Coordinates
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))"
                            },
                            gap: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Latitude"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <TextField
                            fullWidth
                            label="Longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{ xs: "column-reverse", sm: "row" }}
                        justifyContent="flex-end"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
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
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Update Address"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default SaleOrderAddressesEdit;
