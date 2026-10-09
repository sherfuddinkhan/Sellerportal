// ReversePickupForm.jsx

import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Divider,
    Alert,
    CircularProgress,
    Paper
} from "@mui/material";

import {
    AssignmentReturn,
    Save,
    RestartAlt,
    ArrowBack
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    reversePickupNumber: "",
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    pickupDate: "",
    pickupAddress: "",
    itemName: "",
    sku: "",
    quantity: 1,
    carrierName: "",
    trackingNumber: "",
    pickupCost: 0,
    status: "Pending",
    notes: ""
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        if (
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   FORMAT DATE FOR INPUT
========================================================= */

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/* =========================================================
   NORMALIZE REVERSE PICKUP
========================================================= */

const normalizeRecord = (record) => {
    if (!record) {
        return { ...initialFormData };
    }

    return {
        reversePickupNumber: getFieldValue(
            record,
            "reversePickupNumber",
            "ReversePickupNumber",
            "pickupNumber",
            "PickupNumber"
        ),

        orderNumber: getFieldValue(
            record,
            "orderNumber",
            "OrderNumber"
        ),

        customerName: getFieldValue(
            record,
            "customerName",
            "CustomerName"
        ),

        customerEmail: getFieldValue(
            record,
            "customerEmail",
            "CustomerEmail"
        ),

        pickupDate: formatDate(
            getFieldValue(
                record,
                "pickupDate",
                "PickupDate"
            )
        ),

        pickupAddress: getFieldValue(
            record,
            "pickupAddress",
            "PickupAddress"
        ),

        itemName: getFieldValue(
            record,
            "itemName",
            "ItemName",
            "returnItemName",
            "ReturnItemName"
        ),

        sku: getFieldValue(
            record,
            "sku",
            "SKU",
            "Sku"
        ),

        quantity: getFieldValue(
            record,
            "quantity",
            "Quantity"
        ) || 1,

        carrierName: getFieldValue(
            record,
            "carrierName",
            "CarrierName"
        ),

        trackingNumber: getFieldValue(
            record,
            "trackingNumber",
            "TrackingNumber"
        ),

        pickupCost: getFieldValue(
            record,
            "pickupCost",
            "PickupCost"
        ) ?? 0,

        status: getFieldValue(
            record,
            "status",
            "Status"
        ) || "Pending",

        notes: getFieldValue(
            record,
            "notes",
            "Notes"
        )
    };
};

/* =========================================================
   REVERSE PICKUP FORM
========================================================= */

const ReversePickupForm = ({
    reversePickup = null,
    pickup = null,
    record = null,

    onSubmit,
    onCancel,
    onReset,

    loading = false,
    error = "",

    mode,
    title,
    submitLabel,

    showPickupNumber = true,
    showResetButton = true,
    showCancelButton = true,
    fullWidth = true,
    variant = "paper"
}) => {

    const selectedRecord =
        reversePickup || pickup || record || null;

    const isEdit =
        mode === "edit" ||
        Boolean(selectedRecord);

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        setFormData(normalizeRecord(selectedRecord));
        setErrors({});
        setFormError("");
    }, [selectedRecord]);

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

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

        setFormError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const nextErrors = {};

        if (
            showPickupNumber &&
            !String(formData.reversePickupNumber).trim()
        ) {
            nextErrors.reversePickupNumber =
                "Reverse pickup number is required";
        }

        if (!String(formData.orderNumber).trim()) {
            nextErrors.orderNumber =
                "Order number is required";
        }

        if (!String(formData.customerName).trim()) {
            nextErrors.customerName =
                "Customer name is required";
        }

        if (
            formData.customerEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(formData.customerEmail).trim()
            )
        ) {
            nextErrors.customerEmail =
                "Enter a valid email address";
        }

        if (!formData.pickupDate) {
            nextErrors.pickupDate =
                "Pickup date is required";
        }

        if (!String(formData.pickupAddress).trim()) {
            nextErrors.pickupAddress =
                "Pickup address is required";
        }

        if (!String(formData.itemName).trim()) {
            nextErrors.itemName =
                "Item name is required";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            nextErrors.quantity =
                "Quantity must be a whole number greater than zero";
        }

        const pickupCost = Number(formData.pickupCost);

        if (
            formData.pickupCost === "" ||
            !Number.isFinite(pickupCost) ||
            pickupCost < 0
        ) {
            nextErrors.pickupCost =
                "Enter a valid non-negative pickup cost";
        }

        if (!String(formData.status).trim()) {
            nextErrors.status = "Status is required";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /* =====================================================
       HANDLE FORM SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setFormError("");

        if (!validateForm()) {
            setFormError(
                "Please correct the highlighted fields."
            );
            return;
        }

        if (typeof onSubmit !== "function") {
            setFormError(
                "The onSubmit handler has not been provided."
            );
            return;
        }

        const payload = {
            reversePickupNumber:
                String(formData.reversePickupNumber).trim(),

            orderNumber:
                String(formData.orderNumber).trim(),

            customerName:
                String(formData.customerName).trim(),

            customerEmail:
                String(formData.customerEmail).trim(),

            pickupDate: formData.pickupDate,

            pickupAddress:
                String(formData.pickupAddress).trim(),

            itemName:
                String(formData.itemName).trim(),

            sku: String(formData.sku).trim(),

            quantity: Number(formData.quantity),

            carrierName:
                String(formData.carrierName).trim(),

            trackingNumber:
                String(formData.trackingNumber).trim(),

            pickupCost: Number(formData.pickupCost),

            status: formData.status,

            notes: String(formData.notes).trim()
        };

        try {
            await onSubmit(payload);
        } catch (submitError) {
            setFormError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Failed to save reverse pickup."
            );
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData(normalizeRecord(selectedRecord));
        setErrors({});
        setFormError("");

        if (typeof onReset === "function") {
            onReset();
        }
    };

    /* =====================================================
       RENDER FIELD HELPER
    ===================================================== */

    const renderTextField = ({
        name,
        label,
        required = false,
        type = "text",
        multiline = false,
        minRows,
        select = false,
        options = [],
        inputProps,
        helperText,
        ...otherProps
    }) => (
        <TextField
            fullWidth
            name={name}
            label={label}
            value={formData[name] ?? ""}
            onChange={handleChange}
            required={required}
            type={type}
            multiline={multiline}
            minRows={minRows}
            select={select}
            error={Boolean(errors[name])}
            helperText={errors[name] || helperText}
            disabled={loading}
            InputLabelProps={
                type === "date"
                    ? { shrink: true }
                    : undefined
            }
            inputProps={inputProps}
            {...otherProps}
        >
            {select &&
                options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
    );

    /* =====================================================
       FORM CONTENT
    ===================================================== */

    const formContent = (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                width: "100%",
                maxWidth: fullWidth ? "100%" : 900,
                mx: "auto"
            }}
        >
            {/* FORM HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3
                }}
            >
                <AssignmentReturn
                    color="primary"
                    sx={{ fontSize: 36 }}
                />

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {title ||
                            (isEdit
                                ? "Edit Reverse Pickup"
                                : "Create Reverse Pickup")}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {isEdit
                            ? "Update the return pickup details below."
                            : "Complete the information below to create a reverse pickup."}
                    </Typography>
                </Box>
            </Box>

            {(error || formError) && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {formError || error}
                </Alert>
            )}

            {/* PICKUP INFORMATION */}

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Pickup Information
            </Typography>

            <Grid container spacing={2}>
                {showPickupNumber && (
                    <Grid item xs={12} sm={6}>
                        {renderTextField({
                            name: "reversePickupNumber",
                            label: "Reverse Pickup Number",
                            required: true,
                            placeholder: "Enter pickup number"
                        })}
                    </Grid>
                )}

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "orderNumber",
                        label: "Order Number",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "pickupDate",
                        label: "Pickup Date",
                        type: "date",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "status",
                        label: "Status",
                        required: true,
                        select: true,
                        options: [
                            { value: "Pending", label: "Pending" },
                            { value: "Scheduled", label: "Scheduled" },
                            { value: "In Progress", label: "In Progress" },
                            { value: "Completed", label: "Completed" },
                            { value: "Cancelled", label: "Cancelled" }
                        ]
                    })}
                </Grid>

                <Grid item xs={12}>
                    {renderTextField({
                        name: "pickupAddress",
                        label: "Pickup Address",
                        required: true,
                        multiline: true,
                        minRows: 2
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* CUSTOMER INFORMATION */}

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Customer Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "customerName",
                        label: "Customer Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "customerEmail",
                        label: "Customer Email",
                        type: "email"
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* RETURN ITEM INFORMATION */}

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Return Item Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "itemName",
                        label: "Item Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "sku",
                        label: "SKU"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "quantity",
                        label: "Quantity",
                        type: "number",
                        required: true,
                        inputProps: {
                            min: 1,
                            step: 1
                        }
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "pickupCost",
                        label: "Pickup Cost (₹)",
                        type: "number",
                        required: true,
                        inputProps: {
                            min: 0,
                            step: "0.01"
                        }
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* CARRIER INFORMATION */}

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Carrier Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "carrierName",
                        label: "Carrier Name"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "trackingNumber",
                        label: "Tracking Number"
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* NOTES */}

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Additional Notes
            </Typography>

            {renderTextField({
                name: "notes",
                label: "Notes",
                multiline: true,
                minRows: 3,
                placeholder: "Enter return reason or pickup instructions"
            })}

            {/* ACTION BUTTONS */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mt: 4
                }}
            >
                {showResetButton && (
                    <Button
                        type="button"
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                )}

                {showCancelButton && (
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                            />
                            : <Save />
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : submitLabel ||
                          (isEdit
                              ? "Update Pickup"
                              : "Create Pickup")}
                </Button>
            </Box>
        </Box>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    if (variant === "plain") {
        return formContent;
    }

    return (
        <Paper
            elevation={variant === "outlined" ? 0 : 2}
            variant={
                variant === "outlined"
                    ? "outlined"
                    : undefined
            }
            sx={{
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                },
                borderRadius: 2,
                width: "100%"
            }}
        >
            {formContent}
        </Paper>
    );
};

export default ReversePickupForm;

