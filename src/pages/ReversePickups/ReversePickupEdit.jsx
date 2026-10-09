// ReversePickupEdit.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Snackbar
} from "@mui/material";

import {
    AssignmentReturn,
    Save,
    ArrowBack,
    Refresh
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "/api/ReversePickup";

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
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeReversePickup = (record) => ({
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
    ) ?? 1,

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
});

/* =========================================================
   EXTRACT RECORD FROM API RESPONSE
========================================================= */

const extractRecord = (responseData) => {
    if (!responseData) return null;

    if (Array.isArray(responseData)) {
        return responseData[0] || null;
    }

    if (responseData.data !== undefined) {
        return extractRecord(responseData.data);
    }

    if (responseData.result !== undefined) {
        return extractRecord(responseData.result);
    }

    if (responseData.record !== undefined) {
        return extractRecord(responseData.record);
    }

    return responseData;
};

/* =========================================================
   REVERSE PICKUP EDIT
========================================================= */

const ReversePickupEdit = ({
    pickupId: pickupIdProp,
    reversePickup: reversePickupProp,
    apiUrl = API_BASE_URL,
    onUpdated,
    onCancel,
    embedded = false
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const pickupId =
        pickupIdProp ??
        params.id ??
        params.pickupId;

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    const showMessage = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    /* =====================================================
       LOAD REVERSE PICKUP
    ===================================================== */

    const loadReversePickup = async () => {
        if (reversePickupProp) {
            setFormData(
                normalizeReversePickup(reversePickupProp)
            );
            setError("");
            return;
        }

        if (
            pickupId === undefined ||
            pickupId === null ||
            String(pickupId).trim() === ""
        ) {
            setError("Reverse pickup ID was not provided.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(pickupId)}`
            );

            const record = extractRecord(response.data);

            if (!record || typeof record !== "object") {
                setError("Reverse pickup record was not found.");
                return;
            }

            setFormData(normalizeReversePickup(record));
        } catch (apiError) {
            console.error(
                "GET REVERSE PICKUP ERROR:",
                apiError
            );

            setError(
                apiError?.response?.data?.message ||
                apiError?.response?.data?.title ||
                apiError?.message ||
                "Failed to load reverse pickup."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD ON MOUNT
    ===================================================== */

    useEffect(() => {
        loadReversePickup();

        // Reload when the record ID or supplied record changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickupId, reversePickupProp]);

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!String(formData.reversePickupNumber).trim()) {
            errors.reversePickupNumber =
                "Reverse pickup number is required";
        }

        if (!String(formData.orderNumber).trim()) {
            errors.orderNumber = "Order number is required";
        }

        if (!String(formData.customerName).trim()) {
            errors.customerName = "Customer name is required";
        }

        if (
            formData.customerEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(formData.customerEmail).trim()
            )
        ) {
            errors.customerEmail =
                "Enter a valid email address";
        }

        if (!formData.pickupDate) {
            errors.pickupDate = "Pickup date is required";
        }

        if (!String(formData.pickupAddress).trim()) {
            errors.pickupAddress = "Pickup address is required";
        }

        if (!String(formData.itemName).trim()) {
            errors.itemName = "Item name is required";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            errors.quantity =
                "Quantity must be a positive whole number";
        }

        const pickupCost = Number(formData.pickupCost);

        if (
            formData.pickupCost === "" ||
            !Number.isFinite(pickupCost) ||
            pickupCost < 0
        ) {
            errors.pickupCost =
                "Pickup cost must be zero or greater";
        }

        if (!String(formData.status).trim()) {
            errors.status = "Status is required";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       UPDATE REVERSE PICKUP
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) return;

        setError("");

        if (!validateForm()) {
            setError(
                "Please correct the highlighted fields."
            );
            return;
        }

        if (
            pickupId === undefined ||
            pickupId === null ||
            String(pickupId).trim() === ""
        ) {
            setError(
                "Cannot update reverse pickup without an ID."
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

        setSaving(true);

        try {
            const response = await axios.put(
                `${apiUrl}/${encodeURIComponent(pickupId)}`,
                payload
            );

            showMessage(
                response?.data?.message ||
                "Reverse pickup updated successfully."
            );

            if (typeof onUpdated === "function") {
                await onUpdated(response.data);
            } else if (!embedded) {
                navigate(-1);
            }
        } catch (apiError) {
            console.error(
                "UPDATE REVERSE PICKUP ERROR:",
                apiError
            );

            const responseData = apiError?.response?.data;

            let errorMessage =
                responseData?.message ||
                responseData?.title ||
                apiError?.message ||
                "Failed to update reverse pickup.";

            if (
                responseData?.errors &&
                typeof responseData.errors === "object"
            ) {
                const validationMessages = Object.values(
                    responseData.errors
                )
                    .flat()
                    .filter(Boolean);

                if (validationMessages.length > 0) {
                    errorMessage = validationMessages.join(" ");
                }
            }

            setError(errorMessage);

            showMessage(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    /* =====================================================
       FIELD HELPER
    ===================================================== */

    const renderField = ({
        name,
        label,
        required = false,
        type = "text",
        multiline = false,
        minRows,
        select = false,
        options = [],
        inputProps
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
            disabled={loading || saving}
            error={Boolean(fieldErrors[name])}
            helperText={fieldErrors[name] || ""}
            InputLabelProps={
                type === "date"
                    ? { shrink: true }
                    : undefined
            }
            inputProps={inputProps}
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
       LOADING VIEW
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading reverse pickup details...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       FORM CONTENT
    ===================================================== */

    const content = (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
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
                        Edit Reverse Pickup
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update pickup, customer, item, and carrier information.
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
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
                <Grid item xs={12} sm={6}>
                    {renderField({
                        name: "reversePickupNumber",
                        label: "Reverse Pickup Number",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
                        name: "orderNumber",
                        label: "Order Number",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
                        name: "pickupDate",
                        label: "Pickup Date",
                        type: "date",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
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
                    {renderField({
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
                    {renderField({
                        name: "customerName",
                        label: "Customer Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
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
                    {renderField({
                        name: "itemName",
                        label: "Item Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
                        name: "sku",
                        label: "SKU"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
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
                    {renderField({
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
                    {renderField({
                        name: "carrierName",
                        label: "Carrier Name"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderField({
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

            {renderField({
                name: "notes",
                label: "Notes",
                multiline: true,
                minRows: 3
            })}

            {/* ACTIONS */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    mt: 4,
                    flexWrap: "wrap"
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadReversePickup}
                    disabled={saving}
                >
                    Reload
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        saving
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                            />
                            : <Save />
                    }
                    disabled={saving}
                >
                    {saving ? "Updating..." : "Update Pickup"}
                </Button>
            </Box>
        </Box>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            {embedded ? (
                <Paper
                    elevation={1}
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
                        borderRadius: 2
                    }}
                >
                    {content}
                </Paper>
            ) : (
                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: "auto",
                        p: {
                            xs: 2,
                            sm: 3
                        }
                    }}
                >
                    {content}
                </Box>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => {
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => {
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ReversePickupEdit;

