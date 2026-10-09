import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Typography,
    Box,
    Divider,
    Chip,
    IconButton,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Close,
    Save,
    Edit,
    Visibility,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   HELPERS
========================================================= */

const getField = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        if (
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return fallback;
};

const getPicklistId = (picklist) =>
    getField(picklist, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ], "");

const getPicklistNumber = (picklist) =>
    getField(picklist, [
        "picklistNumber",
        "PicklistNumber",
        "pickListNumber",
        "PickListNumber",
        "picklistNo",
        "PicklistNo",
        "number",
        "Number"
    ], "");

const getOrderNumber = (picklist) =>
    getField(picklist, [
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "orderNo",
        "OrderNo"
    ], "");

const getWarehouse = (picklist) =>
    getField(picklist, [
        "warehouseName",
        "WarehouseName",
        "warehouse",
        "Warehouse",
        "locationName",
        "LocationName"
    ], "");

const getStatus = (picklist) =>
    getField(picklist, [
        "status",
        "Status",
        "picklistStatus",
        "PicklistStatus"
    ], "Pending");

const getDate = (picklist) =>
    getField(picklist, [
        "picklistDate",
        "PicklistDate",
        "createdDate",
        "CreatedDate",
        "createdAt",
        "CreatedAt",
        "date",
        "Date"
    ], "");

const getItems = (picklist) =>
    getField(picklist, [
        "items",
        "Items",
        "picklistItems",
        "PicklistItems",
        "details",
        "Details"
    ], []);

const getItemCount = (picklist) => {
    const count = getField(picklist, [
        "totalItems",
        "TotalItems",
        "itemCount",
        "ItemCount",
        "totalQuantity",
        "TotalQuantity"
    ], null);

    if (count !== null && count !== "") {
        return count;
    }

    const items = getItems(picklist);

    return Array.isArray(items) ? items.length : 0;
};

const formatDateForInput = (value) => {
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

const formatDisplayDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const normalizeStatus = (status) =>
    String(status || "")
        .toLowerCase()
        .replace(/[\s_-]/g, "");

const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);

    if (["completed", "complete", "picked", "closed"].includes(normalized)) {
        return "success";
    }

    if (
        ["inprogress", "processing", "assigned", "started"].includes(normalized)
    ) {
        return "info";
    }

    if (["cancelled", "canceled"].includes(normalized)) {
        return "error";
    }

    return "warning";
};

/* =========================================================
   INITIAL FORM STATE
========================================================= */

const EMPTY_FORM = {
    picklistNumber: "",
    orderNumber: "",
    warehouseName: "",
    picklistDate: "",
    status: "Pending",
    totalItems: 0,
    notes: ""
};

/* =========================================================
   PICKLIST MODAL
========================================================= */

const PicklistModal = ({
    open = false,
    onClose,
    mode = "view",
    picklist = null,
    onSave,
    loading = false,
    error = "",
    warehouses = [],
    statuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled"
    ],
    title,
    readOnly
}) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [validationErrors, setValidationErrors] = useState({});
    const [localError, setLocalError] = useState("");

    const isViewMode =
        readOnly === true ||
        String(mode).toLowerCase() === "view" ||
        String(mode).toLowerCase() === "details";

    const isEditMode =
        String(mode).toLowerCase() === "edit";

    const isReadOnly = isViewMode;

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) return;

        if (picklist) {
            setFormData({
                ...EMPTY_FORM,
                ...picklist,
                picklistNumber: getPicklistNumber(picklist),
                orderNumber: getOrderNumber(picklist),
                warehouseName: getWarehouse(picklist),
                picklistDate: formatDateForInput(getDate(picklist)),
                status: getStatus(picklist),
                totalItems: getItemCount(picklist),
                notes: getField(picklist, [
                    "notes",
                    "Notes",
                    "remarks",
                    "Remarks",
                    "description",
                    "Description"
                ], "")
            });
        } else {
            setFormData({
                ...EMPTY_FORM,
                picklistDate: formatDateForInput(new Date())
            });
        }

        setValidationErrors({});
        setLocalError("");
    }, [open, picklist]);

    /* =====================================================
       HANDLE INPUT CHANGES
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "totalItems"
                ? value === "" ? "" : Number(value)
                : value
        }));

        setValidationErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setLocalError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!String(formData.orderNumber || "").trim()) {
            errors.orderNumber = "Order number is required.";
        }

        if (!String(formData.warehouseName || "").trim()) {
            errors.warehouseName = "Warehouse is required.";
        }

        if (!formData.picklistDate) {
            errors.picklistDate = "Picklist date is required.";
        }

        if (
            formData.totalItems !== "" &&
            (
                !Number.isFinite(Number(formData.totalItems)) ||
                Number(formData.totalItems) < 0
            )
        ) {
            errors.totalItems = "Enter a valid non-negative quantity.";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       SAVE PICKLIST
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isReadOnly || loading) return;

        setLocalError("");

        if (!validateForm()) return;

        if (typeof onSave !== "function") {
            setLocalError(
                "Save handler is not configured. Pass an onSave function."
            );
            return;
        }

        const picklistId = getPicklistId(picklist);

        const payload = {
            ...(picklist || {}),
            ...(picklistId !== "" ? { picklistId } : {}),
            picklistNumber: String(formData.picklistNumber || "").trim(),
            orderNumber: String(formData.orderNumber || "").trim(),
            warehouseName: String(formData.warehouseName || "").trim(),
            picklistDate: formData.picklistDate,
            status: formData.status,
            totalItems: Number(formData.totalItems || 0),
            notes: String(formData.notes || "").trim()
        };

        try {
            await onSave(payload, {
                mode: isEditMode ? "edit" : "add",
                id: picklistId
            });
        } catch (saveError) {
            setLocalError(
                saveError?.response?.data?.message ||
                saveError?.message ||
                "Unable to save the picklist."
            );
        }
    };

    /* =====================================================
       MODAL TITLE
    ===================================================== */

    const modalTitle =
        title ||
        (
            isViewMode
                ? "Picklist Details"
                : isEditMode
                    ? "Edit Picklist"
                    : "Create Picklist"
        );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="picklist-modal-title"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* =========================================
                    HEADER
                ========================================= */}

                <DialogTitle
                    id="picklist-modal-title"
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
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {isViewMode ? (
                                <Visibility />
                            ) : isEditMode ? (
                                <Edit />
                            ) : (
                                <Inventory2 />
                            )}
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                {modalTitle}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {isViewMode
                                    ? "Review picklist information."
                                    : isEditMode
                                        ? "Update the picklist information."
                                        : "Enter the information to create a picklist."}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        aria-label="Close picklist modal"
                        onClick={onClose}
                        disabled={loading}
                        size="small"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <Divider />

                {/* =========================================
                    CONTENT
                ========================================= */}

                <DialogContent sx={{ pt: 3, pb: 3 }}>
                    {(error || localError) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() => setLocalError("")}
                        >
                            {localError || error}
                        </Alert>
                    )}

                    {/* PICKLIST INFORMATION */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Picklist Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Picklist Number"
                                name="picklistNumber"
                                value={formData.picklistNumber ?? ""}
                                onChange={handleChange}
                                placeholder="Auto-generated by server if applicable"
                                disabled={isReadOnly || loading}
                                helperText={
                                    isReadOnly
                                        ? "Assigned picklist number"
                                        : "Leave blank if the server generates this number."
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Order Number"
                                name="orderNumber"
                                value={formData.orderNumber ?? ""}
                                onChange={handleChange}
                                error={Boolean(validationErrors.orderNumber)}
                                helperText={validationErrors.orderNumber}
                                disabled={isReadOnly || loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {Array.isArray(warehouses) &&
                            warehouses.length > 0 ? (
                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Warehouse"
                                    name="warehouseName"
                                    value={formData.warehouseName ?? ""}
                                    onChange={handleChange}
                                    error={Boolean(validationErrors.warehouseName)}
                                    helperText={validationErrors.warehouseName}
                                    disabled={isReadOnly || loading}
                                    slotProps={{
                                        select: {
                                            native: true
                                        }
                                    }}
                                >
                                    <option value="">Select warehouse</option>

                                    {warehouses.map((warehouse, index) => {
                                        const warehouseValue =
                                            typeof warehouse === "string"
                                                ? warehouse
                                                : getField(warehouse, [
                                                    "warehouseName",
                                                    "WarehouseName",
                                                    "name",
                                                    "Name",
                                                    "warehouseId",
                                                    "WarehouseId",
                                                    "id",
                                                    "Id"
                                                ], "");

                                        const warehouseLabel =
                                            typeof warehouse === "string"
                                                ? warehouse
                                                : getField(warehouse, [
                                                    "warehouseName",
                                                    "WarehouseName",
                                                    "name",
                                                    "Name"
                                                ], warehouseValue);

                                        return (
                                            <option
                                                key={String(warehouseValue || index)}
                                                value={warehouseValue}
                                            >
                                                {warehouseLabel}
                                            </option>
                                        );
                                    })}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    required
                                    label="Warehouse"
                                    name="warehouseName"
                                    value={formData.warehouseName ?? ""}
                                    onChange={handleChange}
                                    error={Boolean(validationErrors.warehouseName)}
                                    helperText={validationErrors.warehouseName}
                                    disabled={isReadOnly || loading}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Picklist Date"
                                name="picklistDate"
                                value={formData.picklistDate ?? ""}
                                onChange={handleChange}
                                error={Boolean(validationErrors.picklistDate)}
                                helperText={validationErrors.picklistDate}
                                disabled={isReadOnly || loading}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {isReadOnly ? (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Status
                                    </Typography>

                                    <Chip
                                        label={formData.status || "Pending"}
                                        color={getStatusColor(formData.status)}
                                        size="medium"
                                    />
                                </Box>
                            ) : (
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formData.status ?? "Pending"}
                                    onChange={handleChange}
                                    disabled={loading}
                                    slotProps={{
                                        select: {
                                            native: true
                                        }
                                    }}
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </TextField>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Total Items / Quantity"
                                name="totalItems"
                                value={formData.totalItems ?? 0}
                                onChange={handleChange}
                                error={Boolean(validationErrors.totalItems)}
                                helperText={validationErrors.totalItems}
                                disabled={isReadOnly || loading}
                                inputProps={{
                                    min: 0
                                }}
                            />
                        </Grid>

                        {isViewMode && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Picklist ID"
                                    value={getPicklistId(picklist) || "—"}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>

                    {/* ITEM DETAILS */}

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Item Details
                    </Typography>

                    {Array.isArray(getItems(picklist)) &&
                    getItems(picklist).length > 0 ? (
                        <Box
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                overflow: "hidden"
                            }}
                        >
                            {getItems(picklist).map((item, index) => {
                                const itemName = getField(item, [
                                    "itemName",
                                    "ItemName",
                                    "productName",
                                    "ProductName",
                                    "name",
                                    "Name",
                                    "sku",
                                    "SKU"
                                ], `Item ${index + 1}`);

                                const quantity = getField(item, [
                                    "quantity",
                                    "Quantity",
                                    "requiredQuantity",
                                    "RequiredQuantity",
                                    "pickQuantity",
                                    "PickQuantity"
                                ], "—");

                                const itemCode = getField(item, [
                                    "itemCode",
                                    "ItemCode",
                                    "productCode",
                                    "ProductCode",
                                    "sku",
                                    "SKU"
                                ], "");

                                return (
                                    <Box
                                        key={String(
                                            getField(item, [
                                                "picklistItemId",
                                                "PicklistItemId",
                                                "itemId",
                                                "ItemId",
                                                "id",
                                                "Id"
                                            ], index)
                                        )}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            px: 2,
                                            py: 1.5,
                                            borderBottom:
                                                index < getItems(picklist).length - 1
                                                    ? 1
                                                    : 0,
                                            borderColor: "divider"
                                        }}
                                    >
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {itemName}
                                            </Typography>

                                            {itemCode && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Code: {itemCode}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            Qty: {quantity}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                bgcolor: "action.hover"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                No item details are available for this picklist.
                            </Typography>
                        </Box>
                    )}

                    {/* NOTES */}

                    <Box sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Notes / Remarks"
                            name="notes"
                            value={formData.notes ?? ""}
                            onChange={handleChange}
                            disabled={isReadOnly || loading}
                            placeholder="Enter additional notes..."
                        />
                    </Box>

                    {isViewMode && getDate(picklist) && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 2 }}
                        >
                            Picklist date: {formatDisplayDate(getDate(picklist))}
                        </Typography>
                    )}
                </DialogContent>

                <Divider />

                {/* =========================================
                    FOOTER
                ========================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {isReadOnly ? "Close" : "Cancel"}
                    </Button>

                    {!isReadOnly && (
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                loading
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <Save />
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Picklist"
                                    : "Create Picklist"}
                        </Button>
                    )}
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default PicklistModal;
