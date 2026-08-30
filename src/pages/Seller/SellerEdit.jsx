// =========================================================
// SellerEdit.jsx
// Edit Seller
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
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
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const SellerEdit = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [formData, setFormData] =
        useState({

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

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // GET SELLER
    // =====================================================

    useEffect(() => {

        const loadSeller =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    console.log(
                        "GET SELLER:",
                        id
                    );

                    const response =
                        await axios.get(

                            `${SERVER_URL}/api/sellers/${id}`

                        );

                    console.log(
                        "SELLER RESPONSE:",
                        response.data
                    );

                    const seller =
                        response.data;

                    // =====================================
                    // POPULATE FORM
                    // =====================================

                    setFormData({

                        sellerName:
                            seller.sellerName || "",

                        tradeName:
                            seller.tradeName || "",

                        legalName:
                            seller.legalName || "",

                        contactPerson:
                            seller.contactPerson || "",

                        email:
                            seller.email || "",

                        phone:
                            seller.phone || "",

                        gstin:
                            seller.gstin || "",

                        address:
                            seller.address || "",

                        buildingName:
                            seller.buildingName || "",

                        location:
                            seller.location || "",

                        city:
                            seller.city || "",

                        state:
                            seller.state || "",

                        stateCode:
                            seller.stateCode || "",

                        floorNo:
                            seller.floorNo || "",

                        postalCode:
                            seller.postalCode || "",

                        country:
                            seller.country || ""
                    });

                }
                catch (error) {

                    console.error(
                        "GET SELLER ERROR:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Failed to load seller."
                    );

                }
                finally {

                    setLoading(false);

                }

            };

        if (id) {
            loadSeller();
        }

    }, [id]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange =
        (event) => {

            const {
                name,
                value
            } = event.target;

            setFormData(
                (previous) => ({

                    ...previous,

                    [name]: value
                })
            );

        };

    // =====================================================
    // UPDATE SELLER
    // =====================================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            try {

                setSaving(true);
                setError("");
                setSuccess("");

                console.log(
                    "UPDATE SELLER:",
                    id
                );

                console.log(
                    "UPDATE DATA:",
                    formData
                );

                const response =
                    await axios.put(

                        `${SERVER_URL}/api/sellers/${id}`,

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
                    "UPDATE RESPONSE:",
                    response.data
                );

                setSuccess(
                    "Seller updated successfully."
                );

                // =====================================
                // REDIRECT AFTER UPDATE
                // =====================================

                setTimeout(() => {

                    navigate(
                        "/sellers"
                    );

                }, 1000);

            }
            catch (error) {

                console.error(
                    "UPDATE SELLER ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to update seller."
                );

            }
            finally {

                setSaving(false);

            }

        };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
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
                        Edit Seller
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Seller ID: {id}
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/sellers"
                        )
                    }
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
                        sx={{ mb: 2 }}
                    >
                        Seller Details
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

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
                        ACTIONS
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
                            onClick={() =>
                                navigate(
                                    "/sellers"
                                )
                            }
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
                                ? "Updating..."
                                : "Update Seller"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default SellerEdit;

