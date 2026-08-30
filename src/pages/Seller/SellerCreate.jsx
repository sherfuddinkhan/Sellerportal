// =========================================================
// SellerCreate.jsx
// Create New Seller
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const SellerCreate = () => {

    const navigate = useNavigate();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({

        sellerName: "",
        tradeName: "",
        legalName: "",

        contactPerson: "",
        email: "",
        phone: "",

        gstin: "",

        address: "",
        buildingName: "",
        location: "",
        city: "",
        state: "",
        stateCode: "",
        floorNo: "",
        postalCode: "",
        country: ""
    });

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    // =====================================================
    // CREATE SELLER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!formData.sellerName.trim()) {

            setError(
                "Seller Name is required."
            );

            return;
        }

        try {

            setSaving(true);

            console.log(
                "CREATE SELLER REQUEST:",
                formData
            );

            const response = await axios.post(

                `${SERVER_URL}/api/sellers`,

                formData,

                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    timeout: 30000
                }
            );

            console.log(
                "CREATE SELLER RESPONSE:",
                response.data
            );

            setSuccess(
                "Seller created successfully."
            );

            // =================================================
            // REDIRECT TO SELLER LIST
            // =================================================

            setTimeout(() => {

                navigate("/sellers");

            }, 1000);

        }
        catch (error) {

            console.error(
                "CREATE SELLER ERROR:",
                error
            );

            if (error.response) {

                console.error(
                    "STATUS:",
                    error.response.status
                );

                console.error(
                    "RESPONSE:",
                    error.response.data
                );

            }

            setError(
                error.response?.data?.message ||
                "Failed to create seller."
            );

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate("/sellers");

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="600"
                    >
                        Create Seller
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Add a new seller to the
                        marketplace seller portal.
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleCancel}
                >
                    Back
                </Button>

            </Box>

            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}

            {success && (

                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    {/* =========================================
                        SELLER DETAILS
                    ========================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2
                        }}
                    >
                        Seller Details
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* SELLER NAME */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller Name"
                                name="sellerName"
                                value={
                                    formData.sellerName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* TRADE NAME */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Trade Name"
                                name="tradeName"
                                value={
                                    formData.tradeName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* LEGAL NAME */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Legal Name"
                                name="legalName"
                                value={
                                    formData.legalName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                    </Grid>

                    {/* =========================================
                        CONTACT DETAILS
                    ========================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 4,
                            mb: 2
                        }}
                    >
                        Contact Details
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* CONTACT PERSON */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Contact Person"
                                name="contactPerson"
                                value={
                                    formData.contactPerson
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* EMAIL */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* PHONE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                    </Grid>

                    {/* =========================================
                        TAX DETAILS
                    ========================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 4,
                            mb: 2
                        }}
                    >
                        Tax Details
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* GSTIN */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="GSTIN"
                                name="gstin"
                                value={
                                    formData.gstin
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                    </Grid>

                    {/* =========================================
                        ADDRESS DETAILS
                    ========================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 4,
                            mb: 2
                        }}
                    >
                        Address Details
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* ADDRESS */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Address"
                                name="address"
                                value={
                                    formData.address
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* BUILDING */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Building Name"
                                name="buildingName"
                                value={
                                    formData.buildingName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* LOCATION */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* CITY */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={
                                    formData.city
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* STATE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={
                                    formData.state
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* STATE CODE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="State Code"
                                name="stateCode"
                                value={
                                    formData.stateCode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* FLOOR */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Floor No"
                                name="floorNo"
                                value={
                                    formData.floorNo
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* POSTAL CODE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="postalCode"
                                value={
                                    formData.postalCode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* COUNTRY */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={
                                    formData.country
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                    </Grid>

                    {/* =========================================
                        ACTION BUTTONS
                    ========================================== */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: 2,
                            mt: 4
                        }}
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
                                <Save />
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Seller"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default SellerCreate;

