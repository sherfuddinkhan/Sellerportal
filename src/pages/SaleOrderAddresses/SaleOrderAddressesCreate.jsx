import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

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
    countryCode: "IN",
    pincode: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: ""
};

function SaleOrderAddressesCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

        setLoading(true);

        try {
            // Node proxy forwards this to:
            // POST https://localhost:7203/api/sale-order-addresses
            const response = await axios.post(API_URL, payload, {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json"
                },
                timeout: 15000
            });

            setSuccess("Sale order address created successfully.");

            // Return to the list after successful creation.
            navigate("/sale-order-addresses", {
                replace: true,
                state: {
                    message: "Sale order address created successfully."
                }
            });
        } catch (err) {
            console.error("CREATE SALE ORDER ADDRESS ERROR:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.details ||
                err.message ||
                "Failed to create sale order address."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/sale-order-addresses");
    };

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
                        Create Sale Order Address
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Enter the sales order and customer address details.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                    disabled={loading}
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
                            onChange={handleChange}
                            placeholder="e.g. ADDR-SO-19"
                            disabled={loading}
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
                            disabled={loading}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Customer Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
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
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Address Line 2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="State Code"
                            name="stateCode"
                            value={formData.stateCode}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Country Code"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Location Coordinates
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
                            placeholder="e.g. 12.9716"
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="e.g. 77.5946"
                            disabled={loading}
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
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                loading
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <SaveIcon />
                            }
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default SaleOrderAddressesCreate;
