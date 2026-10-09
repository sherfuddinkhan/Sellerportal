import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Save,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
};

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const createInitialFormData = (inventory = null) => ({
    shelfwiseInventoryId: getFieldValue(
        inventory,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "id",
        "Id"
    ),

    itemId: getFieldValue(
        inventory,
        "itemId",
        "ItemId"
    ),

    itemName: getFieldValue(
        inventory,
        "itemName",
        "ItemName"
    ),

    itemCode: getFieldValue(
        inventory,
        "itemCode",
        "ItemCode"
    ),

    warehouseId: getFieldValue(
        inventory,
        "warehouseId",
        "WarehouseId"
    ),

    warehouseName: getFieldValue(
        inventory,
        "warehouseName",
        "WarehouseName"
    ),

    shelfId: getFieldValue(
        inventory,
        "shelfId",
        "ShelfId"
    ),

    shelfName: getFieldValue(
        inventory,
        "shelfName",
        "ShelfName"
    ),

    shelfCode: getFieldValue(
        inventory,
        "shelfCode",
        "ShelfCode"
    ),

    categoryName: getFieldValue(
        inventory,
        "categoryName",
        "CategoryName"
    ),

    quantity: getFieldValue(
        inventory,
        "quantity",
        "Quantity"
    ),

    availableQuantity: getFieldValue(
        inventory,
        "availableQuantity",
        "AvailableQuantity"
    ),

    reservedQuantity: getFieldValue(
        inventory,
        "reservedQuantity",
        "ReservedQuantity"
    ),

    minimumStock: getFieldValue(
        inventory,
        "minimumStock",
        "MinimumStock"
    ),

    maximumStock: getFieldValue(
        inventory,
        "maximumStock",
        "MaximumStock"
    ),

    unit: getFieldValue(
        inventory,
        "unit",
        "Unit"
    ),

    status: getFieldValue(
        inventory,
        "status",
        "Status"
    ) || "Available",

    description: getFieldValue(
        inventory,
        "description",
        "Description"
    )
});

/* =========================================================
   SHELFWISE INVENTORY FORM
========================================================= */

const ShelfwiseInventoryForm = ({
    inventory = null,
    record = null,
    mode = "create",

    onSubmit,
    onCancel,

    loading = false,
    submitting = false,

    readOnly = false,
    showActions = true
}) => {
    const currentInventory = inventory || record || null;

    const normalizedMode = String(mode).toLowerCase();

    const isEditMode = normalizedMode === "edit";
    const isViewMode =
        normalizedMode === "view" || readOnly;

    const isBusy = loading || submitting;

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState(
        () => createInitialFormData(currentInventory)
    );

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");

    /* =====================================================
       UPDATE FORM WHEN RECORD CHANGES
    ===================================================== */

    useEffect(() => {
        setFormData(createInitialFormData(currentInventory));
        setErrors({});
        setFormError("");
    }, [currentInventory]);

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
        const newErrors = {};

        if (!String(formData.itemName).trim()) {
            newErrors.itemName = "Item name is required.";
        }

        if (!String(formData.itemCode).trim()) {
            newErrors.itemCode = "Item code is required.";
        }

        if (!String(formData.warehouseName).trim()) {
            newErrors.warehouseName =
                "Warehouse name is required.";
        }

        if (!String(formData.shelfName).trim()) {
            newErrors.shelfName = "Shelf name is required.";
        }

        const quantity = Number(formData.quantity);
        const available = Number(formData.availableQuantity);
        const reserved = Number(formData.reservedQuantity);
        const minimum = Number(formData.minimumStock);
        const maximum = Number(formData.maximumStock);

        if (
            formData.quantity === "" ||
            !Number.isFinite(quantity) ||
            quantity < 0
        ) {
            newErrors.quantity =
                "Enter a valid quantity of 0 or greater.";
        }

        if (
            formData.availableQuantity === "" ||
            !Number.isFinite(available) ||
            available < 0
        ) {
            newErrors.availableQuantity =
                "Enter a valid available quantity.";
        }

        if (
            formData.reservedQuantity === "" ||
            !Number.isFinite(reserved) ||
            reserved < 0
        ) {
            newErrors.reservedQuantity =
                "Enter a valid reserved quantity.";
        }

        if (
            Number.isFinite(quantity) &&
            Number.isFinite(available) &&
            Number.isFinite(reserved) &&
            available + reserved > quantity
        ) {
            newErrors.availableQuantity =
                "Available and reserved quantities cannot exceed total quantity.";

            newErrors.reservedQuantity =
                "Available and reserved quantities cannot exceed total quantity.";
        }

        if (
            formData.minimumStock !== "" &&
            (!Number.isFinite(minimum) || minimum < 0)
        ) {
            newErrors.minimumStock =
                "Minimum stock must be 0 or greater.";
        }

        if (
            formData.maximumStock !== "" &&
            (!Number.isFinite(maximum) || maximum < 0)
        ) {
            newErrors.maximumStock =
                "Maximum stock must be 0 or greater.";
        }

        if (
            formData.minimumStock !== "" &&
            formData.maximumStock !== "" &&
            Number.isFinite(minimum) &&
            Number.isFinite(maximum) &&
            maximum < minimum
        ) {
            newErrors.maximumStock =
                "Maximum stock cannot be less than minimum stock.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       HANDLE FORM SUBMISSION
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isViewMode || isBusy) {
            return;
        }

        setFormError("");

        if (!validateForm()) {
            setFormError(
                "Please correct the highlighted fields before submitting."
            );
            return;
        }

        if (typeof onSubmit !== "function") {
            setFormError(
                "Form submission handler is not configured."
            );
            return;
        }

        const payload = {
            ...formData,

            itemId:
                formData.itemId === ""
                    ? null
                    : Number(formData.itemId),

            warehouseId:
                formData.warehouseId === ""
                    ? null
                    : Number(formData.warehouseId),

            shelfId:
                formData.shelfId === ""
                    ? null
                    : Number(formData.shelfId),

            quantity: Number(formData.quantity),

            availableQuantity: Number(
                formData.availableQuantity
            ),

            reservedQuantity: Number(
                formData.reservedQuantity
            ),

            minimumStock:
                formData.minimumStock === ""
                    ? null
                    : Number(formData.minimumStock),

            maximumStock:
                formData.maximumStock === ""
                    ? null
                    : Number(formData.maximumStock)
        };

        onSubmit(payload);
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData(createInitialFormData(currentInventory));
        setErrors({});
        setFormError("");
    };

    /* =====================================================
       REUSABLE TEXT FIELD
    ===================================================== */

    const renderTextField = ({
        name,
        label,
        required = false,
        type = "text",
        multiline = false,
        rows = 1,
        select = false,
        options = [],
        disabled = false,
        helperText
    }) => (
        <TextField
            fullWidth
            size="small"
            name={name}
            label={label}
            value={formData[name] ?? ""}
            onChange={handleChange}
            required={required && !isViewMode}
            type={type}
            multiline={multiline}
            rows={rows}
            select={select}
            disabled={isBusy || isViewMode || disabled}
            error={Boolean(errors[name])}
            helperText={errors[name] || helperText || " "}
            InputLabelProps={
                type === "date"
                    ? { shrink: true }
                    : undefined
            }
            inputProps={
                type === "number"
                    ? { min: 0, step: "any" }
                    : undefined
            }
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
       RENDER
    ===================================================== */

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
            {/* FORM ERROR */}

            {formError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setFormError("")}
                >
                    {formError}
                </Alert>
            )}

            {/* ITEM DETAILS */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Item Details
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
                        name: "itemCode",
                        label: "Item Code",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "itemId",
                        label: "Item ID",
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "categoryName",
                        label: "Category"
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* WAREHOUSE AND SHELF DETAILS */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Warehouse and Shelf Details
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "warehouseName",
                        label: "Warehouse Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "warehouseId",
                        label: "Warehouse ID",
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "shelfName",
                        label: "Shelf Name",
                        required: true
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "shelfCode",
                        label: "Shelf Code"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "shelfId",
                        label: "Shelf ID",
                        type: "number"
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* QUANTITY DETAILS */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Quantity and Stock Levels
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "quantity",
                        label: "Total Quantity",
                        required: true,
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "availableQuantity",
                        label: "Available Quantity",
                        required: true,
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "reservedQuantity",
                        label: "Reserved Quantity",
                        required: true,
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "unit",
                        label: "Unit",
                        helperText: "Example: pcs, kg, box"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "minimumStock",
                        label: "Minimum Stock",
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "maximumStock",
                        label: "Maximum Stock",
                        type: "number"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "status",
                        label: "Status",
                        select: true,
                        options: [
                            {
                                value: "Available",
                                label: "Available"
                            },
                            {
                                value: "Reserved",
                                label: "Reserved"
                            },
                            {
                                value: "Low Stock",
                                label: "Low Stock"
                            },
                            {
                                value: "Out of Stock",
                                label: "Out of Stock"
                            },
                            {
                                value: "Inactive",
                                label: "Inactive"
                            }
                        ]
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* DESCRIPTION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Additional Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {renderTextField({
                        name: "description",
                        label: "Description",
                        multiline: true,
                        rows: 3
                    })}
                </Grid>
            </Grid>

            {/* FORM ACTIONS */}

            {showActions && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1.5,
                            flexWrap: "wrap"
                        }}
                    >
                        {onCancel && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onCancel}
                                disabled={isBusy}
                            >
                                Cancel
                            </Button>
                        )}

                        {!isViewMode && (
                            <>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    startIcon={<RestartAlt />}
                                    onClick={handleReset}
                                    disabled={isBusy}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        isBusy ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : (
                                            <Save />
                                        )
                                    }
                                    disabled={isBusy}
                                >
                                    {isBusy
                                        ? "Saving..."
                                        : isEditMode
                                            ? "Update Inventory"
                                            : "Create Inventory"}
                                </Button>
                            </>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ShelfwiseInventoryForm;

