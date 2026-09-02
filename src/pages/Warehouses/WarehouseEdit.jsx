// =========================================================
// WarehouseEdit.jsx
// Edit Existing Warehouse
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
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

// =========================================================
// CONSTANTS
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    WarehouseId: 0,
    SellerId: "",
    CustomerId: "",
    WarehouseCode: "",
    WarehouseName: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    ContactPerson: "",
    Phone: "",
    Email: "",
    IsActive: true
};

// =========================================================
// COMPONENT
// =========================================================

const WarehouseEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [formData, setFormData] =
        useState(initialState);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =========================================================
    // LOAD WAREHOUSE
    // =========================================================

    useEffect(() => {

        if (!id) {
            setError("Warehouse ID is missing.");
            setLoading(false);
            return;
        }

        loadWarehouse();

    }, [id]);

    // =========================================================
    // GET WAREHOUSE
    // =========================================================

    const loadWarehouse = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/warehouse/${id}`
            );

            const data =
                await response
                    .json()
                    .catch(() => null);

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.title ||
                    "Failed to load warehouse."
                );
            }

            // -------------------------------------------------
            // Support PascalCase + camelCase
            // -------------------------------------------------

            setFormData({
                WarehouseId:
                    data.WarehouseId ??
                    data.warehouseId ??
                    id,

                SellerId:
                    data.SellerId ??
                    data.sellerId ??
                    "",

                CustomerId:
                    data.CustomerId ??
                    data.customerId ??
                    "",

                WarehouseCode:
                    data.WarehouseCode ??
                    data.warehouseCode ??
                    "",

                WarehouseName:
                    data.WarehouseName ??
                    data.warehouseName ??
                    "",

                AddressLine1:
                    data.AddressLine1 ??
                    data.addressLine1 ??
                    "",

                AddressLine2:
                    data.AddressLine2 ??
                    data.addressLine2 ??
                    "",

                City:
                    data.City ??
                    data.city ??
                    "",

                State:
                    data.State ??
                    data.state ??
                    "",

                Country:
                    data.Country ??
                    data.country ??
                    "",

                PostalCode:
                    data.PostalCode ??
                    data.postalCode ??
                    "",

                ContactPerson:
                    data.ContactPerson ??
                    data.contactPerson ??
                    "",

                Phone:
                    data.Phone ??
                    data.phone ??
                    "",

                Email:
                    data.Email ??
                    data.email ??
                    "",

                IsActive:
                    data.IsActive ??
                    data.isActive ??
                    true
            });

        } catch (err) {

            console.error(
                "Load Warehouse Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load warehouse."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // =========================================================
    // UPDATE WAREHOUSE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!formData.SellerId) {
            setError("Seller ID is required.");
            return;
        }

        if (!formData.CustomerId) {
            setError("Customer ID is required.");
            return;
        }

        if (!formData.WarehouseCode.trim()) {
            setError("Warehouse Code is required.");
            return;
        }

        if (!formData.WarehouseName.trim()) {
            setError("Warehouse Name is required.");
            return;
        }

        // -----------------------------------------------------
        // PAYLOAD
        // -----------------------------------------------------

        const payload = {
            WarehouseId:
                Number(formData.WarehouseId),

            SellerId:
                Number(formData.SellerId),

            CustomerId:
                Number(formData.CustomerId),

            WarehouseCode:
                formData.WarehouseCode.trim(),

            WarehouseName:
                formData.WarehouseName.trim(),

            AddressLine1:
                formData.AddressLine1.trim(),

            AddressLine2:
                formData.AddressLine2.trim(),

            City:
                formData.City.trim(),

            State:
                formData.State.trim(),

            Country:
                formData.Country.trim(),

            PostalCode:
                formData.PostalCode.trim(),

            ContactPerson:
                formData.ContactPerson.trim(),

            Phone:
                formData.Phone.trim(),

            Email:
                formData.Email.trim(),

            IsActive:
                formData.IsActive
        };

        try {

            setSaving(true);

            const response = await fetch(
                `${SERVER_URL}/api/warehouse/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            const data =
                await response
                    .json()
                    .catch(() => ({}));

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.title ||
                    "Failed to update warehouse."
                );
            }

            setSuccess(
                "Warehouse updated successfully."
            );

            // -------------------------------------------------
            // Redirect
            // -------------------------------------------------

            setTimeout(() => {
                navigate("/warehouses");
            }, 800);

        } catch (err) {

            console.error(
                "Update Warehouse Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update warehouse."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Edit Warehouse
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/warehouses")
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
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* Warehouse ID */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Warehouse ID"
                                value={
                                    formData.WarehouseId
                                }
                                disabled
                            />
                        </Grid>

                        {/* Seller ID */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="SellerId"
                                value={formData.SellerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Customer ID */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="CustomerId"
                                value={formData.CustomerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Warehouse Code */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Warehouse Code"
                                name="WarehouseCode"
                                value={
                                    formData.WarehouseCode
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Warehouse Name */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Warehouse Name"
                                name="WarehouseName"
                                value={
                                    formData.WarehouseName
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Address Line 1 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 1"
                                name="AddressLine1"
                                value={
                                    formData.AddressLine1
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Address Line 2 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="AddressLine2"
                                value={
                                    formData.AddressLine2
                                }
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="PostalCode"
                                value={
                                    formData.PostalCode
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Contact Person */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Contact Person"
                                name="ContactPerson"
                                value={
                                    formData.ContactPerson
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Phone */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="Phone"
                                value={formData.Phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Email */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Status */}

                        <Grid item xs={12} md={6}>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="IsActive"
                                        checked={
                                            formData.IsActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                }
                                label="Active Warehouse"
                            />

                        </Grid>

                        {/* Buttons */}

                        <Grid item xs={12}>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            "/warehouses"
                                        )
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Save />}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Warehouse"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

export default WarehouseEdit;