import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import axios from "axios";

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
    Divider,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment
} from "@mui/material";

import {
    Close,
    Save,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */
const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const DEFAULT_API_URL =
    `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   INITIAL FORM VALUES
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
   FIELD HELPERS
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

        const pascalCaseName =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1);

        if (
            record[pascalCaseName] !== undefined &&
            record[pascalCaseName] !== null
        ) {
            return record[pascalCaseName];
        }
    }

    return undefined;
};

/* =========================================================
   NORMALIZE RECORD
========================================================= */

const normalizeItem = (item) => ({
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

const ReversePickupItemModal = ({
    open = false,
    onClose,
    onSuccess,
    onSaved,
    item = null,
    reversePickupItem = null,
    reversePickup = null,
    mode,
    apiUrl = DEFAULT_API_URL,
    reversePickupId,
    reversePickupNumber,
    orderId,
    orderNumber
}) => {
    /* =====================================================
       DERIVED VALUES
    ===================================================== */

    const selectedItem =
        reversePickupItem || item;

    const isEdit =
        mode === "edit" ||
        Boolean(
            getField(
                selectedItem,
                "id",
                "reversePickupItemId"
            )
        );

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =
        useState(INITIAL_FORM_DATA);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [submitError, setSubmitError] =
        useState("");

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        const initialData = selectedItem
            ? normalizeItem(selectedItem)
            : {
                ...INITIAL_FORM_DATA,
                reversePickupId:
                    reversePickupId ??
                    getField(reversePickup, "id", "reversePickupId") ??
                    "",
                reversePickupNumber:
                    reversePickupNumber ??
                    getField(reversePickup, "reversePickupNumber") ??
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
        setSubmitError("");
    }, [
        open,
        selectedItem,
        reversePickup,
        reversePickupId,
        reversePickupNumber,
        orderId,
        orderNumber
    ]);

    /* =====================================================
       HANDLE FIELD CHANGE
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

        setSubmitError("");
    }, []);

    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = useCallback(() => {
        const validationErrors = {};

        if (!String(formData.itemName).trim()) {
            validationErrors.itemName =
                "Item name is required.";
        }

        if (!String(formData.sku).trim()) {
            validationErrors.sku =
                "SKU is required.";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            validationErrors.quantity =
                "Quantity must be greater than zero.";
        }

        if (
            formData.pickupCost !== "" &&
            (
                !Number.isFinite(Number(formData.pickupCost)) ||
                Number(formData.pickupCost) < 0
            )
        ) {
            validationErrors.pickupCost =
                "Pickup cost must be zero or greater.";
        }

        if (!String(formData.status).trim()) {
            validationErrors.status =
                "Status is required.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }, [formData]);

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose = useCallback(() => {
        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    }, [loading, onClose]);

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            if (loading || !validateForm()) {
                return;
            }

            if (!apiUrl) {
                setSubmitError(
                    "API URL is missing. Configure REACT_APP_API_URL."
                );
                return;
            }

            setLoading(true);
            setSubmitError("");

            try {
                const payload = {
                    reversePickupId:
                        formData.reversePickupId === ""
                            ? null
                            : formData.reversePickupId,

                    reversePickupNumber:
                        formData.reversePickupNumber || null,

                    orderId:
                        formData.orderId === ""
                            ? null
                            : formData.orderId,

                    orderNumber:
                        formData.orderNumber || null,

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
                };

                let response;

                if (isEdit) {
                    const itemId = getField(
                        selectedItem,
                        "id",
                        "reversePickupItemId"
                    );

                    if (
                        itemId === undefined ||
                        itemId === null ||
                        itemId === ""
                    ) {
                        throw new Error(
                            "Cannot update item: item ID is missing."
                        );
                    }

                    console.log(
                        "UPDATE REVERSE PICKUP ITEM:",
                        itemId
                    );

                    response = await axios.put(
                        `${apiUrl}/${encodeURIComponent(itemId)}`,
                        payload,
                        { timeout: 30000 }
                    );
                } else {
                    console.log(
                        "CREATE REVERSE PICKUP ITEM"
                    );

                    response = await axios.post(
                        apiUrl,
                        payload,
                        { timeout: 30000 }
                    );
                }

                const savedItem =
                    response.data && typeof response.data === "object"
                        ? response.data
                        : payload;

                if (typeof onSuccess === "function") {
                    await onSuccess(savedItem);
                }

                if (typeof onSaved === "function") {
                    await onSaved(savedItem);
                }

                if (typeof onClose === "function") {
                    onClose();
                }
            } catch (requestError) {
                console.error(
                    "SAVE REVERSE PICKUP ITEM ERROR:",
                    requestError
                );

                const responseData =
                    requestError.response?.data;

                let message =
                    responseData?.message ||
                    responseData?.title ||
                    requestError.message ||
                    "Failed to save reverse pickup item.";

                if (
                    responseData?.errors &&
                    typeof responseData.errors === "object"
                ) {
                    const serverErrors = {};

                    Object.entries(responseData.errors).forEach(
                        ([field, messages]) => {
                            serverErrors[field] =
                                Array.isArray(messages)
                                    ? messages.join(" ")
                                    : String(messages);
                        }
                    );

                    setErrors((previous) => ({
                        ...previous,
                        ...serverErrors
                    }));

                    message = Object.values(serverErrors).join(" ");
                }

                setSubmitError(message);
            } finally {
                setLoading(false);
            }
        },
        [
            loading,
            validateForm,
            apiUrl,
            formData,
            isEdit,
            selectedItem,
            onSuccess,
            onSaved,
            onClose
        ]
    );

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
            aria-labelledby="reverse-pickup-item-modal-title"
        >
            {/* DIALOG TITLE */}

            <DialogTitle
                id="reverse-pickup-item-modal-title"
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
                    <Inventory2 color="primary" />

                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {isEdit
                                ? "Edit Reverse Pickup Item"
                                : "Create Reverse Pickup Item"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isEdit
                                ? "Update the item details below."
                                : "Enter the details for the new reverse pickup item."}
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close dialog"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* FORM */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <DialogContent>
                    {submitError && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() => setSubmitError("")}
                        >
                            {submitError}
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
                                label="Reverse Pickup ID"
                                name="reversePickupId"
                                value={formData.reversePickupId}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    Boolean(reversePickupId) ||
                                    Boolean(
                                        getField(
                                            reversePickup,
                                            "id",
                                            "reversePickupId"
                                        )
                                    )
                                }
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup Number"
                                name="reversePickupNumber"
                                value={formData.reversePickupNumber}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    Boolean(reversePickupNumber) ||
                                    Boolean(
                                        getField(
                                            reversePickup,
                                            "reversePickupNumber"
                                        )
                                    )
                                }
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order ID"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    Boolean(orderId)
                                }
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order Number"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    Boolean(orderNumber)
                                }
                                size="small"
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
                                label="Item ID"
                                name="itemId"
                                value={formData.itemId}
                                onChange={handleChange}
                                disabled={loading}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                disabled={loading}
                                error={Boolean(errors.itemName)}
                                helperText={errors.itemName}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                disabled={loading}
                                error={Boolean(errors.sku)}
                                helperText={errors.sku}
                                size="small"
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
                                disabled={loading}
                                error={Boolean(errors.quantity)}
                                helperText={errors.quantity}
                                size="small"
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* PICKUP STATUS AND COST */}

                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Pickup Status and Cost
                            </Typography>
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
                                disabled={loading}
                                error={Boolean(errors.status)}
                                helperText={errors.status}
                                size="small"
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
                                label="Pickup Cost"
                                name="pickupCost"
                                value={formData.pickupCost}
                                onChange={handleChange}
                                disabled={loading}
                                error={Boolean(errors.pickupCost)}
                                helperText={errors.pickupCost}
                                size="small"
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
                                label="Tracking Number"
                                name="trackingNumber"
                                value={formData.trackingNumber}
                                onChange={handleChange}
                                disabled={loading}
                                size="small"
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
                                Reason and Additional Notes
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Return / Pickup Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                disabled={loading}
                                multiline
                                minRows={2}
                                maxRows={4}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                disabled={loading}
                                multiline
                                minRows={2}
                                maxRows={4}
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />

                {/* ACTIONS */}

                <DialogActions
                    sx={{
                        p: 2.5,
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
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
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Item"
                                : "Create Item"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ReversePickupItemModal;

