// =========================================================
// SellerCustomerCreate.jsx
// Create Seller Customer Page
// =========================================================

import React, { useState } from "react";
import axios from "axios";

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

import {
    useNavigate
} from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const SellerCustomerCreate = () => {

    const navigate = useNavigate();

    // =====================================================
    // State
    // =====================================================

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
    // Handle Input
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // =====================================================
    // Handle Active
    // =====================================================

    const handleActiveChange = (event) => {

        setFormData(prev => ({
            ...prev,
            IsActive: event.target.checked
        }));

    };

    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        // Basic validation

        if (!formData.CustomerName.trim()) {

            setError("Customer Name is required.");

            return;

        }

        if (!formData.CustomerCode.trim()) {

            setError("Customer Code is required.");

            return;

        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${SERVER_URL}/api/SellerCustomer`,
                {
                    SellerId: Number(formData.SellerId),

                    CustomerCode:
                        formData.CustomerCode,

                    CustomerName:
                        formData.CustomerName,

                    ContactPerson:
                        formData.ContactPerson,

                    Email:
                        formData.Email,

                    Phone:
                        formData.Phone,

                    GSTIN:
                        formData.GSTIN,

                    AddressLine1:
                        formData.AddressLine1,

                    AddressLine2:
                        formData.AddressLine2,

                    City:
                        formData.City,

                    State:
                        formData.State,

                    Country:
                        formData.Country,

                    PostalCode:
                        formData.PostalCode,

                    CreditLimit:
                        Number(formData.CreditLimit || 0),

                    IsActive:
                        formData.IsActive
                }
            );

            console.log(
                "Customer created:",
                response.data
            );

            setSuccess(true);

            setTimeout(() => {

                navigate("/seller-customers");

            }, 800);

        }
        catch (err) {

            console.error(
                "Create Seller Customer Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create seller customer."
            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // Cancel
    // =====================================================

    const handleCancel = () => {

        navigate("/seller-customers");

    };

    // =====================================================
    // Render
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 3 }}
            >
                Create Seller Customer
            </Typography>

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Seller ID */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    name="SellerId"
                                    value={formData.SellerId}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                            </Grid>

                            {/* Customer Code */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Customer Code"
                                    name="CustomerCode"
                                    value={formData.CustomerCode}
                                    onChange={handleChange}
                                    required
                                />

                            </Grid>

                            {/* Customer Name */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Customer Name"
                                    name="CustomerName"
                                    value={formData.CustomerName}
                                    onChange={handleChange}
                                    required
                                />

                            </Grid>

                            {/* Contact Person */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="ContactPerson"
                                    value={formData.ContactPerson}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Email */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="Email"
                                    type="email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Phone */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="Phone"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* GSTIN */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="GSTIN"
                                    value={formData.GSTIN}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Credit Limit */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Credit Limit"
                                    name="CreditLimit"
                                    type="number"
                                    value={formData.CreditLimit}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Address Line 1 */}

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    name="AddressLine1"
                                    value={formData.AddressLine1}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Address Line 2 */}

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    name="AddressLine2"
                                    value={formData.AddressLine2}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* City */}

                            <Grid item xs={12} md={4}>

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* State */}

                            <Grid item xs={12} md={4}>

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="State"
                                    value={formData.State}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Country */}

                            <Grid item xs={12} md={4}>

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="Country"
                                    value={formData.Country}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Postal Code */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    name="PostalCode"
                                    value={formData.PostalCode}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Active */}

                            <Grid item xs={12} md={6}>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={
                                                formData.IsActive
                                            }
                                            onChange={
                                                handleActiveChange
                                            }
                                        />
                                    }
                                    label="Active"
                                />

                            </Grid>

                            {/* Buttons */}

                            <Grid item xs={12}>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        justifyContent: "flex-end",
                                        mt: 2
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
                                    >

                                        {loading ? (
                                            <CircularProgress
                                                size={24}
                                                color="inherit"
                                            />
                                        ) : (
                                            "Create Customer"
                                        )}

                                    </Button>

                                </Box>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

            {/* Error */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() => setError("")}
            >

                <Alert
                    severity="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            </Snackbar>

            {/* Success */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
            >

                <Alert severity="success">
                    Customer created successfully.
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default SellerCustomerCreate;

