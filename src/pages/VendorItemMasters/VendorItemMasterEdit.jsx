// =========================================================
// VendorItemMasterEdit.jsx
// =========================================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000";

const VENDOR_ITEM_MASTER_API =
    `${API_BASE_URL}/api/VendorItemMaster`;

// =========================================================
// INITIAL FORM DATA
// =========================================================

const INITIAL_FORM_DATA = {
    itemCode: "",
    itemName: "",
    vendorId: "",
    description: "",
    unitOfMeasure: "",
    unitPrice: "",
    taxRate: "",
    status: "Active"
};

// =========================================================
// MAP API RESPONSE TO FORM
// Supports common PascalCase and camelCase properties.
// =========================================================

const mapItemToForm = (item) => ({
    itemCode: item?.itemCode ?? item?.ItemCode ?? "",
    itemName: item?.itemName ?? item?.ItemName ?? "",
    vendorId: String(
        item?.vendorId ?? item?.VendorId ?? ""
    ),
    description:
        item?.description ?? item?.Description ?? "",
    unitOfMeasure:
        item?.unitOfMeasure ?? item?.UnitOfMeasure ?? "",
    unitPrice: String(
        item?.unitPrice ?? item?.UnitPrice ?? ""
    ),
    taxRate: String(
        item?.taxRate ?? item?.TaxRate ?? ""
    ),
    status: item?.status ?? item?.Status ?? "Active"
});

// =========================================================
// VENDOR ITEM MASTER EDIT
// =========================================================

const VendorItemMasterEdit = ({
    itemId: itemIdProp,
    item: itemProp,
    onUpdated,
    onClose
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const itemId =
        itemIdProp ??
        params.itemId ??
        params.id;

    const [formData, setFormData] = useState(
        INITIAL_FORM_DATA
    );

    const [originalData, setOriginalData] = useState(
        INITIAL_FORM_DATA
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadError, setLoadError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    // =====================================================
    // SHOW NOTIFICATION
    // =====================================================

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            severity,
            message
        });
    };

    // =====================================================
    // LOAD ITEM DETAILS
    // =====================================================

    const fetchItemDetails = async () => {
        if (
            itemId === null ||
            itemId === undefined ||
            itemId === ""
        ) {
            setLoadError("Vendor item ID was not provided.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setLoadError("");

            let itemData = itemProp;

            if (!itemData) {
                const response = await axios.get(
                    `${VENDOR_ITEM_MASTER_API}/${encodeURIComponent(itemId)}`
                );

                const responseData = response.data;

                itemData =
                    responseData?.data ??
                    responseData?.item ??
                    responseData;
            }

            if (
                !itemData ||
                typeof itemData !== "object" ||
                Array.isArray(itemData)
            ) {
                throw new Error(
                    "The API did not return valid item details."
                );
            }

            const mappedData = mapItemToForm(itemData);

            setFormData(mappedData);
            setOriginalData(mappedData);
        } catch (error) {
            console.error(
                "GET VENDOR ITEM MASTER ERROR:",
                error
            );

            setLoadError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail ||
                error.message ||
                "Unable to load vendor item details."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchItemDetails();

        // Reload when the selected item ID changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, itemProp]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.itemCode.trim()) {
            newErrors.itemCode = "Item code is required.";
        }

        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item name is required.";
        }

        if (
            formData.vendorId === "" ||
            !Number.isInteger(Number(formData.vendorId)) ||
            Number(formData.vendorId) <= 0
        ) {
            newErrors.vendorId = "Enter a valid vendor ID.";
        }

        if (!formData.unitOfMeasure.trim()) {
            newErrors.unitOfMeasure =
                "Unit of measure is required.";
        }

        if (
            formData.unitPrice === "" ||
            !Number.isFinite(Number(formData.unitPrice)) ||
            Number(formData.unitPrice) < 0
        ) {
            newErrors.unitPrice =
                "Enter a valid unit price.";
        }

        if (
            formData.taxRate !== "" &&
            (
                !Number.isFinite(Number(formData.taxRate)) ||
                Number(formData.taxRate) < 0 ||
                Number(formData.taxRate) > 100
            )
        ) {
            newErrors.taxRate =
                "Tax rate must be between 0 and 100.";
        }

        if (!formData.status) {
            newErrors.status = "Select a status.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const handleReset = () => {
        setFormData(originalData);
        setErrors({});
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        } else {
            navigate("/vendor-item-masters");
        }
    };

    // =====================================================
    // UPDATE VENDOR ITEM MASTER
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        if (
            itemId === null ||
            itemId === undefined ||
            itemId === ""
        ) {
            showNotification(
                "Cannot update: vendor item ID is missing.",
                "error"
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                itemCode: formData.itemCode.trim(),
                itemName: formData.itemName.trim(),
                vendorId: Number(formData.vendorId),
                description: formData.description.trim(),
                unitOfMeasure:
                    formData.unitOfMeasure.trim(),
                unitPrice: Number(formData.unitPrice),
                taxRate:
                    formData.taxRate === ""
                        ? 0
                        : Number(formData.taxRate),
                status: formData.status
            };

            const response = await axios.put(
                `${VENDOR_ITEM_MASTER_API}/${encodeURIComponent(itemId)}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const updatedItem =
                response.data?.data ??
                response.data?.item ??
                response.data ??
                {
                    ...payload,
                    id: itemId
                };

            showNotification(
                "Vendor item master updated successfully.",
                "success"
            );

            setOriginalData(formData);

            if (typeof onUpdated === "function") {
                onUpdated(updatedItem);
            } else {
                navigate("/vendor-item-masters");
            }
        } catch (error) {
            console.error(
                "UPDATE VENDOR ITEM MASTER ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail ||
                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : null
                ) ||
                error.message ||
                "Unable to update vendor item master.";

            showNotification(message, "error");
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                minHeight={300}
            >
                <CircularProgress />

                <Typography>
                    Loading vendor item details...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // LOAD ERROR
    // =====================================================

    if (loadError) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {loadError}
                    </Alert>

                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={fetchItemDetails}
                        >
                            Retry
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleClose}
                        >
                            Back
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Edit Vendor Item Master
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Update the existing vendor item details.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Back
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* ========================================= */}
                {/* EDIT FORM */}
                {/* ========================================= */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* ITEM CODE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Code"
                                name="itemCode"
                                value={formData.itemCode}
                                onChange={handleChange}
                                error={Boolean(errors.itemCode)}
                                helperText={errors.itemCode}
                                disabled={saving}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        {/* ITEM NAME */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                error={Boolean(errors.itemName)}
                                helperText={errors.itemName}
                                disabled={saving}
                                inputProps={{ maxLength: 200 }}
                            />
                        </Grid>

                        {/* VENDOR ID */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Vendor ID"
                                name="vendorId"
                                value={formData.vendorId}
                                onChange={handleChange}
                                error={Boolean(errors.vendorId)}
                                helperText={errors.vendorId}
                                disabled={saving}
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                            />
                        </Grid>

                        {/* UNIT OF MEASURE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Unit of Measure"
                                name="unitOfMeasure"
                                value={formData.unitOfMeasure}
                                onChange={handleChange}
                                error={Boolean(
                                    errors.unitOfMeasure
                                )}
                                helperText={errors.unitOfMeasure}
                                disabled={saving}
                            />
                        </Grid>

                        {/* UNIT PRICE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Unit Price"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                error={Boolean(errors.unitPrice)}
                                helperText={errors.unitPrice}
                                disabled={saving}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* TAX RATE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Tax Rate (%)"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleChange}
                                error={Boolean(errors.taxRate)}
                                helperText={errors.taxRate}
                                disabled={saving}
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* STATUS */}

                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                required
                                error={Boolean(errors.status)}
                                disabled={saving}
                            >
                                <InputLabel id="vendor-item-status-label">
                                    Status
                                </InputLabel>

                                <Select
                                    labelId="vendor-item-status-label"
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Active">
                                        Active
                                    </MenuItem>

                                    <MenuItem value="Inactive">
                                        Inactive
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* DESCRIPTION */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={saving}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>

                        {/* ACTION BUTTONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                flexWrap="wrap"
                                mt={2}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<RestartAlt />}
                                    onClick={handleReset}
                                    disabled={saving}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving
                                            ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            )
                                            : <Save />
                                    }
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Item"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* ============================================= */}
            {/* NOTIFICATION */}
            {/* ============================================= */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={(event, reason) => {
                    if (reason === "clickaway") return;

                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() => {
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterEdit;

