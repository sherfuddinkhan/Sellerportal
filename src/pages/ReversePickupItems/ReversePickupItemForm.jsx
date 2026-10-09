import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    RestartAlt,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "";

const DEFAULT_API_URL =
    `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const INITIAL_FORM_DATA = {
    reversePickupId: "",
    reversePickupNumber: "",
    orderId: "",
    orderNumber: "",
    itemId: "",
    itemName: "",
    sku: "",
    quantity: 1,
    status: "Pending",
    reason: "",
    pickupCost: "",
    trackingNumber: "",
    notes: ""
};

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...fieldNames) => {
    if (!record || typeof record !== "object") {
        return undefined;
    }

    for (const fieldName of fieldNames) {
        if (
            record[fieldName] !== undefined &&
            record[fieldName] !== null
        ) {
            return record[fieldName];
        }

        const pascalCase =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1);

        if (
            record[pascalCase] !== undefined &&
            record[pascalCase] !== null
        ) {
            return record[pascalCase];
        }
    }

    return undefined;
};

/* =========================================================
   NORMALIZE FORM DATA
========================================================= */

const normalizeFormData = (item) => ({
    ...INITIAL_FORM_DATA,

    reversePickupId:
        getField(item, "reversePickupId") ?? "",

    reversePickupNumber:
        getField(item, "reversePickupNumber") ?? "",

    orderId:
        getField(item, "orderId") ?? "",

    orderNumber:
        getField(item, "orderNumber") ?? "",

    itemId:
        getField(item, "itemId", "productId") ?? "",

    itemName:
        getField(item, "itemName", "productName") ?? "",

    sku:
        getField(item, "sku", "SKU") ?? "",

    quantity:
        getField(item, "quantity", "itemQuantity") ?? 1,

    status:
        getField(item, "status", "pickupStatus") ?? "Pending",

    reason:
        getField(item, "reason", "returnReason") ?? "",

    pickupCost:
        getField(item, "pickupCost", "returnCost") ?? "",

    trackingNumber:
        getField(item, "trackingNumber") ?? "",

    notes:
        getField(item, "notes", "remarks") ?? ""
});

/* =========================================================
   COMPONENT
========================================================= */

const ReversePickupItemForm = ({
    item = null,
    reversePickupItem = null,
    reversePickup = null,

    mode = "create",

    apiUrl = DEFAULT_API_URL,

    reversePickupId,
    reversePickupNumber,
    orderId,
    orderNumber,

    loading: externalLoading = false,

    onSubmit,
    onSuccess,
    onCancel,
    onReset,

    submitLabel,
    showHeader = true,
    showCancel = true,
    showReset = true,
    disabled = false
}) => {
    /* =====================================================
       DERIVED VALUES
    ===================================================== */

    const selectedItem =
        reversePickupItem || item;

    const isEdit =
        mode === "edit" ||
        (
            mode !== "create" &&
            Boolean(
                getField(
                    selectedItem,
                    "id",
                    "reversePickupItemId"
                )
            )
        );

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =
        useState(INITIAL_FORM_DATA);

    const [errors, setErrors] = useState({});

    const [submitting, setSubmitting] = useState(false);

    const [formError, setFormError] = useState("");

    const busy = submitting || externalLoading || disabled;

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        const initialData = selectedItem
            ? normalizeFormData(selectedItem)
            : {
                ...INITIAL_FORM_DATA,

                reversePickupId:
                    reversePickupId ??
                    getField(
                        reversePickup,
                        "id",
                        "reversePickupId"
                    ) ??
                    "",

                reversePickupNumber:
                    reversePickupNumber ??
                    getField(
                        reversePickup,
                        "reversePickupNumber"
                    ) ??
                    "",

                orderId:
                    orderId ??
                    getField(reversePickup, "orderId") ??
                    "",

                orderNumber:
                    orderNumber ??
                    getField(reversePickup, "orderNumber") ??
                    ""
            };

        setFormData(initialData);
        setErrors({});
        setFormError("");
    }, [
        selectedItem,
        reversePickup,
        reversePickupId,
        reversePickupNumber,
        orderId,
        orderNumber
    ]);

    /* =====================================================
       FIELD CHANGE
    ===================================================== */

    const handleChange = useCallback((event) => {
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
    }, []);

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = useCallback(() => {
        const nextErrors = {};

        if (!String(formData.itemName).trim()) {
            nextErrors.itemName =
                "Item name is required.";
        }

        if (!String(formData.sku).trim()) {
            nextErrors.sku =
                "SKU is required.";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            nextErrors.quantity =
                "Quantity must be greater than zero.";
        }

        const pickupCost =
            formData.pickupCost === ""
                ? 0
                : Number(formData.pickupCost);

        if (
            !Number.isFinite(pickupCost) ||
            pickupCost < 0
        ) {
            nextErrors.pickupCost =
                "Pickup cost cannot be negative.";
        }

        if (!String(formData.status).trim()) {
            nextErrors.status =
                "Please select a status.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }, [formData]);

    /* =====================================================
       BUILD API PAYLOAD
    ===================================================== */

    const buildPayload = useCallback(() => ({
        reversePickupId:
            formData.reversePickupId === ""
                ? null
                : formData.reversePickupId,

        reversePickupNumber:
            formData.reversePickupNumber.trim() || null,

        orderId:
            formData.orderId === ""
                ? null
                : formData.orderId,

        orderNumber:
            formData.orderNumber.trim() || null,

        itemId:
            formData.itemId === ""
                ? null
                : formData.itemId,

        itemName: formData.itemName.trim(),

        sku: formData.sku.trim(),

        quantity: Number(formData.quantity),

        status: formData.status,

        reason:
            formData.reason.trim() || null,

        pickupCost:
            formData.pickupCost === ""
                ? 0
                : Number(formData.pickupCost),

        trackingNumber:
            formData.trackingNumber.trim() || null,

        notes:
            formData.notes.trim() || null
    }), [formData]);

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = useCallback(() => {
        const resetData = selectedItem
            ? normalizeFormData(selectedItem)
            : {
                ...INITIAL_FORM_DATA,

                reversePickupId:
                    reversePickupId ??
                    getField(
                        reversePickup,
                        "id",
                        "reversePickupId"
                    ) ??
                    "",

                reversePickupNumber:
                    reversePickupNumber ??
                    getField(
                        reversePickup,
                        "reversePickupNumber"
                    ) ??
                    "",

                orderId:
                    orderId ??
                    getField(reversePickup, "orderId") ??
                    "",

                orderNumber:
                    orderNumber ??
                    getField(reversePickup, "orderNumber") ??
                    ""
            };

        setFormData(resetData);
        setErrors({});
        setFormError("");

        if (typeof onReset === "function") {
            onReset();
        }
    }, [
        selectedItem,
        reversePickup,
        reversePickupId,
        reversePickupNumber,
        orderId,
        orderNumber,
        onReset
    ]);

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            if (busy || !validateForm()) {
                return;
            }

            setSubmitting(true);
            setFormError("");

            try {
                const payload = buildPayload();

                let savedItem;

                if (typeof onSubmit === "function") {
                    savedItem = await onSubmit(
                        payload,
                        selectedItem
                    );
                } else {
                    if (!apiUrl) {
                        throw new Error(
                            "API URL is missing. Configure REACT_APP_API_URL."
                        );
                    }

                    if (isEdit) {
                        const id = getField(
                            selectedItem,
                            "id",
                            "reversePickupItemId"
                        );

                        if (
                            id === undefined ||
                            id === null ||
                            id === ""
                        ) {
                            throw new Error(
                                "Cannot update item because its ID is missing."
                            );
                        }

                        const response = await axios.put(
                            `${apiUrl}/${encodeURIComponent(id)}`,
                            payload,
                            { timeout: 30000 }
                        );

                        savedItem = response.data ?? payload;
                    } else {
                        const response = await axios.post(
                            apiUrl,
                            payload,
                            { timeout: 30000 }
                        );

                        savedItem = response.data ?? payload;
                    }
                }

                if (typeof onSuccess === "function") {
                    await onSuccess(savedItem ?? payload);
                }
            } catch (error) {
                console.error(
                    "SAVE REVERSE PICKUP ITEM ERROR:",
                    error
                );

                const serverErrors =
                    error.response?.data?.errors;

                if (
                    serverErrors &&
                    typeof serverErrors === "object"
                ) {
                    const nextErrors = {};

                    Object.entries(serverErrors).forEach(
                        ([field, messages]) => {
                            const normalizedField =
                                field.charAt(0).toLowerCase() +
                                field.slice(1);

                            nextErrors[normalizedField] =
                                Array.isArray(messages)
                                    ? messages.join(" ")
                                    : String(messages);
                        }
                    );

                    setErrors((previous) => ({
                        ...previous,
                        ...nextErrors
                    }));
                }

                setFormError(
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    error.message ||
                    "Failed to save reverse pickup item."
                );
            } finally {
                setSubmitting(false);
            }
        },
        [
            busy,
            validateForm,
            buildPayload,
            onSubmit,
            selectedItem,
            apiUrl,
            isEdit,
            onSuccess
        ]
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            noValidate
            elevation={2}
            sx={{
                width: "100%",
                p: { xs: 2, sm: 3 },
                borderRadius: 2
            }}
        >
            {/* HEADER */}

            {showHeader && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2
                    }}
                >
                    <Inventory2 color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {isEdit
                                ? "Edit Reverse Pickup Item"
                                : "Create Reverse Pickup Item"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the item and pickup details.
                        </Typography>
                    </Box>
                </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* ERROR MESSAGE */}

            {formError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setFormError("")}
                >
                    {formError}
                </Alert>
            )}

            <Grid container spacing={2.5}>
                {/* REVERSE PICKUP DETAILS */}

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Reverse Pickup Details
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Reverse Pickup ID"
                        name="reversePickupId"
                        value={formData.reversePickupId}
                        onChange={handleChange}
                        disabled={
                            busy ||
                            Boolean(reversePickupId) ||
                            Boolean(
                                getField(
                                    reversePickup,
                                    "id",
                                    "reversePickupId"
                                )
                            )
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Reverse Pickup Number"
                        name="reversePickupNumber"
                        value={formData.reversePickupNumber}
                        onChange={handleChange}
                        disabled={
                            busy ||
                            Boolean(reversePickupNumber) ||
                            Boolean(
                                getField(
                                    reversePickup,
                                    "reversePickupNumber"
                                )
                            )
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Order ID"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
                        disabled={busy || Boolean(orderId)}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Order Number"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        disabled={busy || Boolean(orderNumber)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* ITEM DETAILS */}

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Item Details
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Item ID"
                        name="itemId"
                        value={formData.itemId}
                        onChange={handleChange}
                        disabled={busy}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        size="small"
                        label="Item Name"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        disabled={busy}
                        error={Boolean(errors.itemName)}
                        helperText={errors.itemName}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        size="small"
                        label="SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        disabled={busy}
                        error={Boolean(errors.sku)}
                        helperText={errors.sku}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        size="small"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        disabled={busy}
                        error={Boolean(errors.quantity)}
                        helperText={errors.quantity}
                        inputProps={{
                            min: 1,
                            step: 1
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* STATUS AND COST */}

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Status and Cost
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        required
                        size="small"
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={busy}
                        error={Boolean(errors.status)}
                        helperText={errors.status}
                    >
                        <MenuItem value="Pending">
                            Pending
                        </MenuItem>

                        <MenuItem value="Requested">
                            Requested
                        </MenuItem>

                        <MenuItem value="Scheduled">
                            Scheduled
                        </MenuItem>

                        <MenuItem value="In Progress">
                            In Progress
                        </MenuItem>

                        <MenuItem value="Processing">
                            Processing
                        </MenuItem>

                        <MenuItem value="Completed">
                            Completed
                        </MenuItem>

                        <MenuItem value="Picked Up">
                            Picked Up
                        </MenuItem>

                        <MenuItem value="Delivered">
                            Delivered
                        </MenuItem>

                        <MenuItem value="Cancelled">
                            Cancelled
                        </MenuItem>

                        <MenuItem value="Failed">
                            Failed
                        </MenuItem>

                        <MenuItem value="Rejected">
                            Rejected
                        </MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="number"
                        size="small"
                        label="Pickup Cost"
                        name="pickupCost"
                        value={formData.pickupCost}
                        onChange={handleChange}
                        disabled={busy}
                        error={Boolean(errors.pickupCost)}
                        helperText={errors.pickupCost}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    ₹
                                </InputAdornment>
                            )
                        }}
                        inputProps={{
                            min: 0,
                            step: "0.01"
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tracking Number"
                        name="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={handleChange}
                        disabled={busy}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* REASON AND NOTES */}

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Reason and Notes
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Pickup / Return Reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        disabled={busy}
                        multiline
                        minRows={2}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Additional Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={busy}
                        multiline
                        minRows={2}
                    />
                </Grid>
            </Grid>

            {/* FORM ACTIONS */}

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    gap: 1.5
                }}
            >
                {showReset && (
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={busy}
                    >
                        Reset
                    </Button>
                )}

                {showCancel && (
                    <Button
                        type="button"
                        variant="outlined"
                        color="inherit"
                        onClick={onCancel}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        submitting
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : <Save />
                    }
                    disabled={busy}
                >
                    {submitting
                        ? "Saving..."
                        : submitLabel ||
                            (isEdit
                                ? "Update Item"
                                : "Create Item")}
                </Button>
            </Box>
        </Paper>
    );
};

export default ReversePickupItemForm;

