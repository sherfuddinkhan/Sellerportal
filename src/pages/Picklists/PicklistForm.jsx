import React, { useEffect, useState } from "react";

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    Add,
    ArrowBack,
    DeleteOutline,
    Inventory2,
    Save
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

const getId = (object) =>
    getField(object, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ], "");

const getOrderId = (object) =>
    getField(object, [
        "orderId",
        "OrderId",
        "salesOrderId",
        "SalesOrderId"
    ], "");

const getOrderNumber = (object) =>
    getField(object, [
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "orderNo",
        "OrderNo"
    ], "");

const getWarehouseId = (object) =>
    getField(object, [
        "warehouseId",
        "WarehouseId",
        "locationId",
        "LocationId"
    ], "");

const getWarehouseName = (object) =>
    getField(object, [
        "warehouseName",
        "WarehouseName",
        "warehouse",
        "Warehouse",
        "locationName",
        "LocationName"
    ], "");

const getPicklistNumber = (object) =>
    getField(object, [
        "picklistNumber",
        "PicklistNumber",
        "pickListNumber",
        "PickListNumber",
        "picklistNo",
        "PicklistNo"
    ], "");

const getPicklistDate = (object) =>
    getField(object, [
        "picklistDate",
        "PicklistDate",
        "date",
        "Date"
    ], "");

const getPicklistStatus = (object) =>
    getField(object, [
        "status",
        "Status",
        "picklistStatus",
        "PicklistStatus"
    ], "Pending");

const getItemList = (object) => {
    const items = getField(object, [
        "items",
        "Items",
        "picklistItems",
        "PicklistItems",
        "details",
        "Details"
    ], []);

    return Array.isArray(items) ? items : [];
};

const getItemId = (item) =>
    getField(item, [
        "itemId",
        "ItemId",
        "productId",
        "ProductId",
        "inventoryItemId",
        "InventoryItemId"
    ], "");

const getItemName = (item) =>
    getField(item, [
        "itemName",
        "ItemName",
        "productName",
        "ProductName",
        "name",
        "Name"
    ], "");

const getItemCode = (item) =>
    getField(item, [
        "itemCode",
        "ItemCode",
        "productCode",
        "ProductCode",
        "sku",
        "SKU"
    ], "");

const getItemQuantity = (item) =>
    getField(item, [
        "quantity",
        "Quantity",
        "requiredQuantity",
        "RequiredQuantity",
        "pickQuantity",
        "PickQuantity"
    ], 1);

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

const getOptionId = (option) =>
    getField(option, [
        "id",
        "Id",
        "orderId",
        "OrderId",
        "salesOrderId",
        "SalesOrderId",
        "warehouseId",
        "WarehouseId",
        "productId",
        "ProductId",
        "itemId",
        "ItemId"
    ], "");

const getOptionLabel = (option) => {
    if (typeof option === "string" || typeof option === "number") {
        return String(option);
    }

    return String(
        getField(option, [
            "orderNumber",
            "OrderNumber",
            "salesOrderNumber",
            "SalesOrderNumber",
            "warehouseName",
            "WarehouseName",
            "productName",
            "ProductName",
            "itemName",
            "ItemName",
            "name",
            "Name",
            "number",
            "Number"
        ], "")
    );
};

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_STATUSES = [
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled"
];

const EMPTY_ITEM = {
    itemId: "",
    itemName: "",
    itemCode: "",
    quantity: 1
};

const EMPTY_FORM = {
    picklistNumber: "",
    orderId: "",
    orderNumber: "",
    warehouseId: "",
    warehouseName: "",
    picklistDate: formatDateForInput(new Date()),
    status: "Pending",
    notes: "",
    items: []
};

/* =========================================================
   PICKLIST FORM
========================================================= */

const PicklistForm = ({
    picklist = null,
    initialData = null,
    mode = "create",

    orders = [],
    warehouses = [],
    products = [],
    statuses = DEFAULT_STATUSES,

    loading = false,
    error = "",

    onSubmit,
    onCancel,
    onBack,

    title,
    showPicklistNumber = true,
    showStatus = true,
    showItems = true,
    readOnly = false
}) => {
    const source = initialData || picklist;

    const normalizedMode = String(mode).toLowerCase();

    const isEditMode = normalizedMode === "edit";
    const isReadOnly =
        readOnly ||
        normalizedMode === "view" ||
        normalizedMode === "details";

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [validationErrors, setValidationErrors] = useState({});
    const [localError, setLocalError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!source) {
            setFormData({
                ...EMPTY_FORM,
                picklistDate: formatDateForInput(new Date())
            });

            setValidationErrors({});
            setLocalError("");
            return;
        }

        const sourceItems = getItemList(source);

        setFormData({
            ...EMPTY_FORM,
            ...source,

            picklistNumber: getPicklistNumber(source),

            orderId: getOrderId(source),
            orderNumber: getOrderNumber(source),

            warehouseId: getWarehouseId(source),
            warehouseName: getWarehouseName(source),

            picklistDate: formatDateForInput(
                getPicklistDate(source)
            ),

            status: getPicklistStatus(source),

            notes: getField(source, [
                "notes",
                "Notes",
                "remarks",
                "Remarks",
                "description",
                "Description"
            ], ""),

            items: sourceItems.map((item) => ({
                ...item,
                itemId: getItemId(item),
                itemName: getItemName(item),
                itemCode: getItemCode(item),
                quantity: getItemQuantity(item)
            }))
        });

        setValidationErrors({});
        setLocalError("");
    }, [source]);

    /* =====================================================
       INPUT HANDLERS
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setValidationErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setLocalError("");
    };

    const handleOrderChange = (_, selectedOrder) => {
        if (!selectedOrder) {
            setFormData((previous) => ({
                ...previous,
                orderId: "",
                orderNumber: ""
            }));

            return;
        }

        if (typeof selectedOrder === "string") {
            setFormData((previous) => ({
                ...previous,
                orderId: "",
                orderNumber: selectedOrder
            }));

            return;
        }

        setFormData((previous) => ({
            ...previous,
            orderId: getOptionId(selectedOrder),
            orderNumber: getOrderNumber(selectedOrder) ||
                getOptionLabel(selectedOrder)
        }));

        setValidationErrors((previous) => ({
            ...previous,
            orderId: "",
            orderNumber: ""
        }));
    };

    const handleWarehouseChange = (_, selectedWarehouse) => {
        if (!selectedWarehouse) {
            setFormData((previous) => ({
                ...previous,
                warehouseId: "",
                warehouseName: ""
            }));

            return;
        }

        if (typeof selectedWarehouse === "string") {
            setFormData((previous) => ({
                ...previous,
                warehouseId: "",
                warehouseName: selectedWarehouse
            }));

            return;
        }

        setFormData((previous) => ({
            ...previous,
            warehouseId: getOptionId(selectedWarehouse),
            warehouseName: getWarehouseName(selectedWarehouse) ||
                getOptionLabel(selectedWarehouse)
        }));

        setValidationErrors((previous) => ({
            ...previous,
            warehouseId: "",
            warehouseName: ""
        }));
    };

    /* =====================================================
       ITEM HANDLERS
    ===================================================== */

    const handleAddItem = () => {
        setFormData((previous) => ({
            ...previous,
            items: [
                ...previous.items,
                { ...EMPTY_ITEM }
            ]
        }));
    };

    const handleRemoveItem = (index) => {
        setFormData((previous) => ({
            ...previous,
            items: previous.items.filter(
                (_, itemIndex) => itemIndex !== index
            )
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData((previous) => ({
            ...previous,
            items: previous.items.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                return {
                    ...item,
                    [field]: value
                };
            })
        }));

        setLocalError("");
    };

    const handleProductChange = (index, selectedProduct) => {
        if (!selectedProduct) {
            handleItemChange(index, "itemId", "");
            handleItemChange(index, "itemName", "");
            handleItemChange(index, "itemCode", "");
            return;
        }

        if (typeof selectedProduct === "string") {
            handleItemChange(index, "itemId", "");
            handleItemChange(index, "itemName", selectedProduct);
            return;
        }

        setFormData((previous) => ({
            ...previous,
            items: previous.items.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                return {
                    ...item,
                    itemId: getOptionId(selectedProduct),
                    itemName: getItemName(selectedProduct) ||
                        getOptionLabel(selectedProduct),
                    itemCode: getItemCode(selectedProduct)
                };
            })
        }));
    };

    /* =====================================================
       VALIDATION
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
            showItems &&
            formData.items.some(
                (item) => !String(item.itemName || "").trim()
            )
        ) {
            errors.items = "Select or enter a product for every item.";
        }

        if (
            showItems &&
            formData.items.some(
                (item) =>
                    item.quantity === "" ||
                    !Number.isFinite(Number(item.quantity)) ||
                    Number(item.quantity) <= 0
            )
        ) {
            errors.quantities = "Each item quantity must be greater than zero.";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isReadOnly || loading || submitting) {
            return;
        }

        setLocalError("");

        if (!validateForm()) {
            return;
        }

        if (typeof onSubmit !== "function") {
            setLocalError(
                "Submit handler is not configured. Pass an onSubmit function."
            );
            return;
        }

        const picklistId = getId(source);

        const payload = {
            ...(source || {}),

            ...(picklistId !== "" ? {
                picklistId
            } : {}),

            picklistNumber: String(
                formData.picklistNumber || ""
            ).trim(),

            orderId: formData.orderId || null,
            orderNumber: String(
                formData.orderNumber || ""
            ).trim(),

            warehouseId: formData.warehouseId || null,
            warehouseName: String(
                formData.warehouseName || ""
            ).trim(),

            picklistDate: formData.picklistDate,
            status: formData.status,

            notes: String(formData.notes || "").trim(),

            items: showItems
                ? formData.items.map((item) => ({
                    ...item,
                    itemId: item.itemId || null,
                    itemName: String(item.itemName || "").trim(),
                    itemCode: String(item.itemCode || "").trim(),
                    quantity: Number(item.quantity)
                }))
                : getItemList(source)
        };

        setSubmitting(true);

        try {
            await onSubmit(payload, {
                mode: isEditMode ? "edit" : "create",
                id: picklistId
            });
        } catch (submitError) {
            setLocalError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Unable to save the picklist."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       DERIVED VALUES
    ===================================================== */

    const isBusy = loading || submitting;

    const formTitle = title || (
        isReadOnly
            ? "Picklist Details"
            : isEditMode
                ? "Edit Picklist"
                : "Create Picklist"
    );

    const totalQuantity = formData.items.reduce(
        (total, item) => total + (
            Number.isFinite(Number(item.quantity))
                ? Number(item.quantity)
                : 0
        ),
        0
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
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <IconButton
                        onClick={onBack || onCancel}
                        aria-label="Go back"
                        disabled={isBusy}
                    >
                        <ArrowBack />
                    </IconButton>

                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {formTitle}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isReadOnly
                                ? "Review picklist information and items."
                                : isEditMode
                                    ? "Update the picklist details below."
                                    : "Enter the details to create a new picklist."}
                        </Typography>
                    </Box>
                </Stack>

                {isEditMode && (
                    <Chip
                        label="Edit Mode"
                        color="info"
                        variant="outlined"
                    />
                )}
            </Stack>

            {/* ERRORS */}

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

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2.5 }}
                    >
                        Picklist Information
                    </Typography>

                    <Grid container spacing={2.5}>
                        {showPicklistNumber && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Picklist Number"
                                    name="picklistNumber"
                                    value={formData.picklistNumber ?? ""}
                                    onChange={handleChange}
                                    disabled={isReadOnly || isBusy}
                                    helperText={
                                        isEditMode
                                            ? "Picklist reference"
                                            : "Leave blank if generated by the server."
                                    }
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            {orders.length > 0 ? (
                                <Autocomplete
                                    options={orders}
                                    value={
                                        orders.find((order) =>
                                            String(getOptionId(order)) ===
                                                String(formData.orderId) &&
                                            formData.orderId !== ""
                                        ) ||
                                        orders.find((order) =>
                                            getOptionLabel(order) ===
                                            formData.orderNumber
                                        ) ||
                                        (formData.orderNumber
                                            ? {
                                                orderNumber: formData.orderNumber,
                                                orderId: formData.orderId
                                            }
                                            : null)
                                    }
                                    getOptionLabel={getOptionLabel}
                                    isOptionEqualToValue={(option, value) =>
                                        String(getOptionId(option)) ===
                                            String(getOptionId(value)) ||
                                        getOptionLabel(option) ===
                                            getOptionLabel(value)
                                    }
                                    onChange={handleOrderChange}
                                    disabled={isReadOnly || isBusy}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Order Number"
                                            error={Boolean(validationErrors.orderNumber)}
                                            helperText={validationErrors.orderNumber}
                                        />
                                    )}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    required
                                    label="Order Number"
                                    name="orderNumber"
                                    value={formData.orderNumber ?? ""}
                                    onChange={handleChange}
                                    disabled={isReadOnly || isBusy}
                                    error={Boolean(validationErrors.orderNumber)}
                                    helperText={validationErrors.orderNumber}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {warehouses.length > 0 ? (
                                <Autocomplete
                                    options={warehouses}
                                    value={
                                        warehouses.find((warehouse) =>
                                            String(getOptionId(warehouse)) ===
                                                String(formData.warehouseId) &&
                                            formData.warehouseId !== ""
                                        ) ||
                                        warehouses.find((warehouse) =>
                                            getOptionLabel(warehouse) ===
                                            formData.warehouseName
                                        ) ||
                                        (formData.warehouseName
                                            ? {
                                                warehouseName: formData.warehouseName,
                                                warehouseId: formData.warehouseId
                                            }
                                            : null)
                                    }
                                    getOptionLabel={getOptionLabel}
                                    isOptionEqualToValue={(option, value) =>
                                        String(getOptionId(option)) ===
                                            String(getOptionId(value)) ||
                                        getOptionLabel(option) ===
                                            getOptionLabel(value)
                                    }
                                    onChange={handleWarehouseChange}
                                    disabled={isReadOnly || isBusy}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Warehouse"
                                            error={Boolean(validationErrors.warehouseName)}
                                            helperText={validationErrors.warehouseName}
                                        />
                                    )}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    required
                                    label="Warehouse"
                                    name="warehouseName"
                                    value={formData.warehouseName ?? ""}
                                    onChange={handleChange}
                                    disabled={isReadOnly || isBusy}
                                    error={Boolean(validationErrors.warehouseName)}
                                    helperText={validationErrors.warehouseName}
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
                                disabled={isReadOnly || isBusy}
                                error={Boolean(validationErrors.picklistDate)}
                                helperText={validationErrors.picklistDate}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {showStatus && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formData.status || "Pending"}
                                    onChange={handleChange}
                                    disabled={isReadOnly || isBusy}
                                >
                                    {statuses.map((status) => {
                                        const value =
                                            typeof status === "string"
                                                ? status
                                                : status.value;

                                        const label =
                                            typeof status === "string"
                                                ? status
                                                : status.label;

                                        return (
                                            <MenuItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label="Notes / Remarks"
                                name="notes"
                                value={formData.notes ?? ""}
                                onChange={handleChange}
                                disabled={isReadOnly || isBusy}
                                placeholder="Enter additional notes..."
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ITEM DETAILS */}

            {showItems && (
                <Card
                    variant="outlined"
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                            spacing={2}
                            sx={{ mb: 2.5 }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Picklist Items
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Add products and their required quantities.
                                </Typography>
                            </Box>

                            {!isReadOnly && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddItem}
                                    disabled={isBusy}
                                >
                                    Add Item
                                </Button>
                            )}
                        </Stack>

                        {validationErrors.items && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                            >
                                {validationErrors.items}
                            </Alert>
                        )}

                        {validationErrors.quantities && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                            >
                                {validationErrors.quantities}
                            </Alert>
                        )}

                        {formData.items.length === 0 ? (
                            <Box
                                sx={{
                                    py: 4,
                                    px: 2,
                                    textAlign: "center",
                                    bgcolor: "action.hover",
                                    borderRadius: 2
                                }}
                            >
                                <Inventory2
                                    sx={{
                                        fontSize: 38,
                                        color: "text.secondary",
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    No items added
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {isReadOnly
                                        ? "No item details are available."
                                        : "Use Add Item to include products in this picklist."}
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {formData.items.map((item, index) => (
                                    <Box
                                        key={
                                            item.picklistItemId ||
                                            item.PicklistItemId ||
                                            item.itemId ||
                                            item.ItemId ||
                                            index
                                        }
                                        sx={{
                                            p: 2,
                                            border: 1,
                                            borderColor: "divider",
                                            borderRadius: 2
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography fontWeight={700}>
                                                Item {index + 1}
                                            </Typography>

                                            {!isReadOnly && (
                                                <IconButton
                                                    color="error"
                                                    aria-label={`Remove item ${index + 1}`}
                                                    onClick={() =>
                                                        handleRemoveItem(index)
                                                    }
                                                    disabled={isBusy}
                                                    size="small"
                                                >
                                                    <DeleteOutline />
                                                </IconButton>
                                            )}
                                        </Stack>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                {products.length > 0 ? (
                                                    <Autocomplete
                                                        options={products}
                                                        value={
                                                            products.find((product) =>
                                                                String(getOptionId(product)) ===
                                                                String(item.itemId)
                                                            ) ||
                                                            products.find((product) =>
                                                                getOptionLabel(product) ===
                                                                item.itemName
                                                            ) ||
                                                            (item.itemName
                                                                ? {
                                                                    itemId: item.itemId,
                                                                    itemName: item.itemName
                                                                }
                                                                : null)
                                                        }
                                                        getOptionLabel={getOptionLabel}
                                                        isOptionEqualToValue={(
                                                            option,
                                                            value
                                                        ) =>
                                                            String(getOptionId(option)) ===
                                                                String(getOptionId(value)) ||
                                                            getOptionLabel(option) ===
                                                                getOptionLabel(value)
                                                        }
                                                        onChange={(_, value) =>
                                                            handleProductChange(index, value)
                                                        }
                                                        disabled={isReadOnly || isBusy}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                required
                                                                label="Product"
                                                            />
                                                        )}
                                                    />
                                                ) : (
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Product Name"
                                                        value={item.itemName ?? ""}
                                                        onChange={(event) =>
                                                            handleItemChange(
                                                                index,
                                                                "itemName",
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={isReadOnly || isBusy}
                                                    />
                                                )}
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Item Code / SKU"
                                                    value={item.itemCode ?? ""}
                                                    onChange={(event) =>
                                                        handleItemChange(
                                                            index,
                                                            "itemCode",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isReadOnly || isBusy}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    type="number"
                                                    label="Quantity"
                                                    value={item.quantity ?? ""}
                                                    onChange={(event) =>
                                                        handleItemChange(
                                                            index,
                                                            "quantity",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isReadOnly || isBusy}
                                                    inputProps={{
                                                        min: 1,
                                                        step: 1
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        <Divider sx={{ my: 2.5 }} />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={1}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Total item lines: {formData.items.length}
                            </Typography>

                            <Typography fontWeight={700}>
                                Total Quantity: {totalQuantity}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* ACTIONS */}

            <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                justifyContent="flex-end"
                spacing={1.5}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel || onBack}
                    disabled={isBusy}
                >
                    {isReadOnly ? "Back" : "Cancel"}
                </Button>

                {!isReadOnly && (
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            isBusy
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={isBusy}
                    >
                        {isBusy
                            ? "Saving..."
                            : isEditMode
                                ? "Update Picklist"
                                : "Create Picklist"}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default PicklistForm;

