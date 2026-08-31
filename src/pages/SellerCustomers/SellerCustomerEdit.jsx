// =========================================================
// SellerCustomerEdit.jsx
// Seller Customer Edit Page
// =========================================================

import React, { useEffect, useState } from "react";
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
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

// React -> server.js
const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerEdit = () => {

    const navigate = useNavigate();

    // IMPORTANT:
    // Route:
    // /seller-customers/edit/:sellerId/:customerId
    const {
        sellerId,
        customerId,
    } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({

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
        Country: "",
        PostalCode: "",
        CreditLimit: "",
        IsActive: true,

    });

    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    const loadCustomer = async () => {

        if (!sellerId || !customerId) {

            setError(
                "Seller ID or Customer ID is missing from URL."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading customer:",
                {
                    sellerId,
                    customerId,
                }
            );

            // =================================================
            // React
            //    ↓
            // server.js
            //    ↓
            // ASP.NET
            //
            // GET:
            // /api/SellerCustomer/6/customers/3
            // =================================================

            const response = await axios.get(

                `${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`

            );

            const data = response.data;

            console.log(
                "Customer response:",
                data
            );

            setForm({

                CustomerCode:
                    data.CustomerCode ?? "",

                CustomerName:
                    data.CustomerName ?? "",

                ContactPerson:
                    data.ContactPerson ?? "",

                Email:
                    data.Email ?? "",

                Phone:
                    data.Phone ?? "",

                GSTIN:
                    data.GSTIN ?? "",

                AddressLine1:
                    data.AddressLine1 ?? "",

                AddressLine2:
                    data.AddressLine2 ?? "",

                City:
                    data.City ?? "",

                State:
                    data.State ?? "",

                Country:
                    data.Country ?? "",

                PostalCode:
                    data.PostalCode ?? "",

                CreditLimit:
                    data.CreditLimit ?? "",

                IsActive:
                    data.IsActive ?? true,

            });

        }
        catch (err) {

            console.error(
                "Load Customer Error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                `Unable to load customer. HTTP ${
                    err.response?.status || ""
                }`

            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // EFFECT
    // =====================================================

    useEffect(() => {

        loadCustomer();

    }, [
        sellerId,
        customerId
    ]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );

    };

    // =====================================================
    // SAVE CUSTOMER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!sellerId || !customerId) {

            setError(
                "Seller ID or Customer ID is missing."
            );

            return;
        }

        try {

            setSaving(true);

            setError("");

            const payload = {

                CustomerCode:
                    form.CustomerCode,

                CustomerName:
                    form.CustomerName,

                ContactPerson:
                    form.ContactPerson,

                Email:
                    form.Email,

                Phone:
                    form.Phone,

                GSTIN:
                    form.GSTIN,

                AddressLine1:
                    form.AddressLine1,

                AddressLine2:
                    form.AddressLine2,

                City:
                    form.City,

                State:
                    form.State,

                Country:
                    form.Country,

                PostalCode:
                    form.PostalCode,

                CreditLimit:
                    Number(
                        form.CreditLimit || 0
                    ),

                IsActive:
                    form.IsActive === true ||
                    form.IsActive === "true",

            };

            console.log(
                "Updating customer:",
                {
                    sellerId,
                    customerId,
                    payload,
                }
            );

            // =================================================
            // PUT
            //
            // React
            //    ↓
            // server.js
            //    ↓
            // ASP.NET
            //
            // PUT:
            // /api/SellerCustomer/6/customers/3
            // =================================================

            await axios.put(

                `${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`,

                payload,

                {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }

            );

            setSuccess(true);

            // =================================================
            // Go to DETAILS page
            // =================================================

            setTimeout(() => {

                navigate(
                    `/seller-customers/details/${sellerId}/${customerId}`
                );

            }, 700);

        }
        catch (err) {

            console.error(
                "Update Customer Error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                `Unable to update customer. HTTP ${
                    err.response?.status || ""
                }`

            );

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================================
    // BACK TO DETAILS
    // =====================================================

    const goToDetails = () => {

        navigate(
            `/seller-customers/details/${sellerId}/${customerId}`
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Edit Customer
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update seller customer information
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Seller ID: {sellerId} | Customer ID: {customerId}
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={goToDetails}
                >
                    Back
                </Button>

            </Stack>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                        >
                            Customer Information
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Customer Code */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Customer Code"
                                    name="CustomerCode"
                                    value={
                                        form.CustomerCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </Grid>

                            {/* Customer Name */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Customer Name"
                                    name="CustomerName"
                                    value={
                                        form.CustomerName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </Grid>

                            {/* Contact Person */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="ContactPerson"
                                    value={
                                        form.ContactPerson
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Email */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="Email"
                                    type="email"
                                    value={
                                        form.Email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Phone */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="Phone"
                                    value={
                                        form.Phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* GSTIN */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="GSTIN"
                                    value={
                                        form.GSTIN
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Address 1 */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    name="AddressLine1"
                                    value={
                                        form.AddressLine1
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Address 2 */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    name="AddressLine2"
                                    value={
                                        form.AddressLine2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* City */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="City"
                                    value={
                                        form.City
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* State */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="State"
                                    value={
                                        form.State
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Country */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="Country"
                                    value={
                                        form.Country
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Postal Code */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    name="PostalCode"
                                    value={
                                        form.PostalCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* Credit Limit */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Credit Limit"
                                    name="CreditLimit"
                                    type="number"
                                    value={
                                        form.CreditLimit
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                />

                            </Grid>

                            {/* Status */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="IsActive"
                                    value={
                                        form.IsActive
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value={true}>
                                        Active
                                    </MenuItem>

                                    <MenuItem value={false}>
                                        Inactive
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{ mt: 4 }}
                        >

                            <Button
                                variant="outlined"
                                onClick={goToDetails}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving
                                        ?
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                        :
                                        <Save />
                                }
                                disabled={saving}
                            >

                                {
                                    saving
                                        ? "Saving..."
                                        : "Save Changes"
                                }

                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={700}
                onClose={() =>
                    setSuccess(false)
                }
                message="Customer updated successfully"
            />

        </Box>

    );

};

export default SellerCustomerEdit;
