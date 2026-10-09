// ReversePickupModal.jsx

import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Close,
    Save,
    RestartAlt,
    ArrowBack,
    AssignmentReturn
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM STATE
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
   FIELD ALIASES
========================================================= */

const getFieldValue = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   NORMALIZE RECORD
========================================================= */

const normalizeRecord = (record) => {
    if (!record) {
        return { ...initialFormData };
    }

    const pickupDate = getFieldValue(
        record,
        "pickupDate",
        "PickupDate"
    );

    let formattedPickupDate = "";

    if (pickupDate) {
        const date = new Date(pickupDate);

        if (!Number.isNaN(date.getTime())) {
            formattedPickupDate = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0")
            ].join("-");
        }
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

        pickupDate: formattedPickupDate,

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
   REVERSE PICKUP MODAL
========================================================= */

const ReversePickupModal = ({
    open = false,
    onClose,
    onSubmit,
    onSave,
    reversePickup = null,
    pickup = null,
    record = null,
    loading = false,
    error = "",
    mode,
    title,
    submitLabel,
    showResetButton = true,
    showPickupNumber = true
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
       RESET FORM WHEN OPENING OR CHANGING RECORD
    ===================================================== */

    useEffect(() => {
        if (open) {
            setFormData(normalizeRecord(selectedRecord));
            setErrors({});
            setFormError("");
        }
    }, [open, selectedRecord]);

    /* =====================================================
       HANDLE FIELD CHANGE
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
            nextErrors.orderNumber = "Order number is required";
        }

        if (!String(formData.customerName).trim()) {
            nextErrors.customerName = "Customer name is required";
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
            nextErrors.pickupDate = "Pickup date is required";
        }

        if (!String(formData.pickupAddress).trim()) {
            nextErrors.pickupAddress = "Pickup address is required";
        }

        if (!String(formData.itemName).trim()) {
            nextErrors.itemName = "Item name is required";
        }

        const quantity = Number(formData.quantity);

        if (!Number.isFinite(quantity) || quantity < 1) {
            nextErrors.quantity =
                "Quantity must be at least 1";
        }

        const pickupCost = Number(formData.pickupCost);

        if (
            formData.pickupCost === "" ||
            !Number.isFinite(pickupCost) ||
            pickupCost < 0
        ) {
            nextErrors.pickupCost =
                "Pickup cost cannot be negative";
        }

        if (!String(formData.status).trim()) {
            nextErrors.status = "Status is required";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setFormError("");

        if (!validateForm()) {
            setFormError(
                "Please correct the highlighted fields before continuing."
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
            const submitHandler = onSubmit || onSave;

            if (typeof submitHandler !== "function") {
                setFormError(
                    "No submit handler was provided."
                );
                return;
            }

            await submitHandler(payload);
        } catch (submitError) {
            setFormError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Unable to save reverse pickup."
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
    };

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose = () => {
        if (loading) return;

        setErrors({});
        setFormError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            disableEscapeKeyDown={loading}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* =========================================
                    DIALOG HEADER
                ========================================= */}

                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <AssignmentReturn
                            color="primary"
                            fontSize="large"
                        />

                        <Box>
                            <Typography variant="h6" fontWeight={700}>
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
                                    ? "Update reverse pickup information"
                                    : "Enter the details to schedule a return pickup"}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close reverse pickup modal"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <Divider />

                {/* =========================================
                    DIALOG CONTENT
                ========================================= */}

                <DialogContent
                    sx={{
                        py: 3,
                        px: {
                            xs: 2,
                            sm: 3
                        }
                    }}
                >
                    {(error || formError) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {formError || error}
                        </Alert>
                    )}

                    {/* BASIC INFORMATION */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Pickup Information
                    </Typography>

                    <Grid container spacing={2}>
                        {showPickupNumber && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Reverse Pickup Number"
                                    name="reversePickupNumber"
                                    value={formData.reversePickupNumber}
                                    onChange={handleChange}
                                    error={Boolean(errors.reversePickupNumber)}
                                    helperText={errors.reversePickupNumber}
                                    disabled={loading}
                                    placeholder="Enter pickup number"
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Order Number"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                error={Boolean(errors.orderNumber)}
                                helperText={errors.orderNumber}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Pickup Date"
                                name="pickupDate"
                                value={formData.pickupDate}
                                onChange={handleChange}
                                error={Boolean(errors.pickupDate)}
                                helperText={errors.pickupDate}
                                disabled={loading}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                error={Boolean(errors.status)}
                                helperText={errors.status}
                                disabled={loading}
                            >
                                {[
                                    "Pending",
                                    "Scheduled",
                                    "In Progress",
                                    "Completed",
                                    "Cancelled"
                                ].map((status) => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                minRows={2}
                                label="Pickup Address"
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                error={Boolean(errors.pickupAddress)}
                                helperText={errors.pickupAddress}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    {/* CUSTOMER INFORMATION */}

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Customer Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Customer Name"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                error={Boolean(errors.customerName)}
                                helperText={errors.customerName}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Customer Email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                error={Boolean(errors.customerEmail)}
                                helperText={errors.customerEmail}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    {/* ITEM INFORMATION */}

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Return Item Information
                    </Typography>

                    <Grid container spacing={2}>
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
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                error={Boolean(errors.quantity)}
                                helperText={errors.quantity}
                                disabled={loading}
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Pickup Cost (₹)"
                                name="pickupCost"
                                value={formData.pickupCost}
                                onChange={handleChange}
                                error={Boolean(errors.pickupCost)}
                                helperText={errors.pickupCost}
                                disabled={loading}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* CARRIER INFORMATION */}

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Carrier Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Carrier Name"
                                name="carrierName"
                                value={formData.carrierName}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tracking Number"
                                name="trackingNumber"
                                value={formData.trackingNumber}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    {/* NOTES */}

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Additional Notes
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter return reason or additional pickup instructions"
                    />
                </DialogContent>

                <Divider />

                {/* =========================================
                    DIALOG ACTIONS
                ========================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    {showResetButton && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

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
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ReversePickupModal;

