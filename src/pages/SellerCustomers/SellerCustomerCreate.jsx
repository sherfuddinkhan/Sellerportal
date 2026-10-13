// =========================================================
// SellerCustomerCreate.jsx
// Create Seller Customer Page
// React -> Node.js Proxy -> ASP.NET Core API
// =========================================================

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography,
    FormControlLabel,
    Switch,
} from "@mui/material";

// =========================================================
// CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/SellerCustomer";

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerCreate = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        SellerId: 6,
        CustomerCode: "",
        CustomerName: "",
        ContactPerson: "",
        Email: "",
        Phone: "",
        GSTIN: "",
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        Country: "India",
        PostalCode: "",
        CreditLimit: 0,
        IsActive: true,
    });

    // =====================================================
    // HANDLE INPUT CHANGES
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // HANDLE ACTIVE SWITCH
    // =====================================================

    const handleActiveChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            IsActive: event.target.checked,
        }));
    };

    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");
        setSuccess(false);

        const sellerId = Number(formData.SellerId);
        const creditLimit = Number(formData.CreditLimit);

        if (!Number.isInteger(sellerId) || sellerId <= 0) {
            setError("Please enter a valid Seller ID.");
            return;
        }

        if (!formData.CustomerCode.trim()) {
            setError("Customer Code is required.");
            return;
        }

        if (!formData.CustomerName.trim()) {
            setError("Customer Name is required.");
            return;
        }

        if (
            !Number.isFinite(creditLimit) ||
            creditLimit < 0
        ) {
            setError("Credit Limit must be zero or greater.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                SellerId: sellerId,
                CustomerCode: formData.CustomerCode.trim(),
                CustomerName: formData.CustomerName.trim(),
                ContactPerson: formData.ContactPerson.trim(),
                Email: formData.Email.trim(),
                Phone: formData.Phone.trim(),
                GSTIN: formData.GSTIN.trim(),
                AddressLine1: formData.AddressLine1.trim(),
                AddressLine2: formData.AddressLine2.trim(),
                City: formData.City.trim(),
                State: formData.State.trim(),
                Country: formData.Country.trim(),
                PostalCode: formData.PostalCode.trim(),
                CreditLimit: creditLimit,
                IsActive: formData.IsActive,
            };

            const response = await axios.post(
                API_URL,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 15000,
                }
            );

            console.log(
                "Seller customer created successfully:",
                response.data
            );

            setSuccess(true);

            // Allow the success notification to appear
            setTimeout(() => {
                navigate("/seller-customers");
            }, 1000);
        } catch (err) {
            console.error(
                "Create Seller Customer Error:",
                err.response?.data || err.message || err
            );

            const responseData = err.response?.data;

            const message =
                responseData?.message ||
                responseData?.Message ||
                responseData?.title ||
                responseData?.Title ||
                (typeof responseData === "string"
                    ? responseData
                    : null) ||
                (err.code === "ECONNABORTED"
                    ? "The request timed out. Please check the server and try again."
                    : !err.response
                        ? "Cannot connect to the Node.js server. Check that it is running on port 5000."
                        : "Failed to create seller customer.");

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        if (!loading) {
            navigate("/seller-customers");
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 3 }}
            >
                Create Seller Customer
            </Typography>

            <Card>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="SellerId"
                                    value={formData.SellerId}
                                    onChange={handleChange}
                                    inputProps={{ min: 1, step: 1 }}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Customer Code"
                                    name="CustomerCode"
                                    value={formData.CustomerCode}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 50 }}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Customer Name"
                                    name="CustomerName"
                                    value={formData.CustomerName}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 200 }}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="ContactPerson"
                                    value={formData.ContactPerson}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="Phone"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="GSTIN"
                                    value={formData.GSTIN}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Credit Limit"
                                    name="CreditLimit"
                                    value={formData.CreditLimit}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, step: "0.01" }}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    name="AddressLine1"
                                    value={formData.AddressLine1}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    name="AddressLine2"
                                    value={formData.AddressLine2}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="State"
                                    value={formData.State}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="Country"
                                    value={formData.Country}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    name="PostalCode"
                                    value={formData.PostalCode}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.IsActive}
                                            onChange={handleActiveChange}
                                            disabled={loading}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 2,
                                        mt: 2,
                                    }}
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
                                        disabled={loading}
                                        startIcon={
                                            loading
                                                ? <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                                : null
                                        }
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create Customer"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert severity="success" variant="filled">
                    Customer created successfully.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SellerCustomerCreate;
