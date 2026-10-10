// =========================================================
// VendorItemMasterForm.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack
} from "@mui/icons-material";

// =========================================================
// INITIAL FORM DATA
// =========================================================

export const INITIAL_VENDOR_ITEM_FORM = {
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
// MAP ITEM DATA TO FORM
// =========================================================

const mapItemToForm = (item = {}) => ({
    itemCode: item.itemCode ?? item.ItemCode ?? "",
    itemName: item.itemName ?? item.ItemName ?? "",
    vendorId: String(
        item.vendorId ?? item.VendorId ?? ""
    ),
    description:
        item.description ?? item.Description ?? "",
    unitOfMeasure:
        item.unitOfMeasure ?? item.UnitOfMeasure ?? "",
    unitPrice: String(
        item.unitPrice ?? item.UnitPrice ?? ""
    ),
    taxRate: String(
        item.taxRate ?? item.TaxRate ?? ""
    ),
    status: item.status ?? item.Status ?? "Active"
});

// =========================================================
// VENDOR ITEM MASTER FORM
// =========================================================

const VendorItemMasterForm = ({
    initialData = null,
    mode = "create",
    loading = false,
    error = "",
    onSubmit,
    onCancel
}) => {
    const isEditMode = mode === "edit";

    const [formData, setFormData] = useState(
        () => mapItemToForm(
            initialData || INITIAL_VENDOR_ITEM_FORM
        )
    );

    const [errors, setErrors] = useState({});

    // =====================================================
    // UPDATE FORM WHEN INITIAL DATA CHANGES
    // =====================================================

    useEffect(() => {
        setFormData(
            mapItemToForm(
                initialData || INITIAL_VENDOR_ITEM_FORM
            )
        );

        setErrors({});
    }, [initialData]);

    // =====================================================
    // HANDLE FIELD CHANGE
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
        const nextErrors = {};

        if (!formData.itemCode.trim()) {
            nextErrors.itemCode =
                "Item code is required.";
        }

        if (!formData.itemName.trim()) {
            nextErrors.itemName =
                "Item name is required.";
        }

        if (
            formData.vendorId === "" ||
            !Number.isInteger(Number(formData.vendorId)) ||
            Number(formData.vendorId) <= 0
        ) {
            nextErrors.vendorId =
                "Enter a valid vendor ID.";
        }

        if (!formData.unitOfMeasure.trim()) {
            nextErrors.unitOfMeasure =
                "Unit of measure is required.";
        }

        if (
            formData.unitPrice === "" ||
            !Number.isFinite(Number(formData.unitPrice)) ||
            Number(formData.unitPrice) < 0
        ) {
            nextErrors.unitPrice =
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
            nextErrors.taxRate =
                "Tax rate must be between 0 and 100.";
        }

        if (!formData.status) {
            nextErrors.status =
                "Please select a status.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

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

        if (typeof onSubmit === "function") {
            onSubmit(payload);
        }
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const handleReset = () => {
        setFormData(
            mapItemToForm(
                initialData || INITIAL_VENDOR_ITEM_FORM
            )
        );

        setErrors({});
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 1100,
                mx: "auto",
                p: { xs: 2, md: 3 },
                borderRadius: 2
            }}
        >
            {/* ============================================= */}
            {/* HEADER */}
            {/* ============================================= */}

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
                        {isEditMode
                            ? "Edit Vendor Item Master"
                            : "Create Vendor Item Master"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {isEditMode
                            ? "Update the existing vendor item details."
                            : "Enter the details to create a vendor item."}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={onCancel}
                    disabled={loading}
                >
                    Back
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ============================================= */}
            {/* ERROR ALERT */}
            {/* ============================================= */}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* ============================================= */}
            {/* FORM */}
            {/* ============================================= */}

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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
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
                            placeholder="e.g. PCS, KG, LTR"
                            value={formData.unitOfMeasure}
                            onChange={handleChange}
                            error={Boolean(
                                errors.unitOfMeasure
                            )}
                            helperText={errors.unitOfMeasure}
                            disabled={loading}
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
                            disabled={loading}
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
                            helperText={
                                errors.taxRate ||
                                "Enter a percentage from 0 to 100."
                            }
                            disabled={loading}
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
                            disabled={loading}
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

                            {errors.status && (
                                <FormHelperText>
                                    {errors.status}
                                </FormHelperText>
                            )}
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
                            disabled={loading}
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
                                disabled={loading}
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : isEditMode
                                        ? "Update Item"
                                        : "Create Item"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterForm;

