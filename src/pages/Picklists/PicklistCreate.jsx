import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Add,
    Save,
    Inventory2,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const PICKLIST_API = `${API_BASE_URL}/api/Picklist`;
const ORDERS_API = `${API_BASE_URL}/api/SalesOrder`;
const WAREHOUSES_API = `${API_BASE_URL}/api/Warehouse`;
const PRODUCTS_API = `${API_BASE_URL}/api/Product`;

/* =========================================================
   FIELD HELPER
========================================================= */

const getValue = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        const value = object[field];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   EXTRACT API COLLECTION
========================================================= */

const extractCollection = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (!responseData || typeof responseData !== "object") {
        return [];
    }

    const candidates = [
        responseData.data,
        responseData.result,
        responseData.items,
        responseData.records,
        responseData.results
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }

        if (candidate && typeof candidate === "object") {
            const nested = extractCollection(candidate);

            if (nested.length > 0) {
                return nested;
            }
        }
    }

    return [];
};

/* =========================================================
   GET ENTITY ID
========================================================= */

const getEntityId = (entity, type) => {
    const fields = {
        order: [
            "orderId",
            "OrderId",
            "salesOrderId",
            "SalesOrderId",
            "id",
            "Id"
        ],
        warehouse: [
            "warehouseId",
            "WarehouseId",
            "locationId",
            "LocationId",
            "id",
            "Id"
        ],
        product: [
            "productId",
            "ProductId",
            "itemId",
            "ItemId",
            "id",
            "Id"
        ]
    };

    return getValue(entity, fields[type] || ["id", "Id"], "");
};

/* =========================================================
   GET ENTITY LABEL
========================================================= */

const getEntityLabel = (entity, type) => {
    const fields = {
        order: [
            "orderNumber",
            "OrderNumber",
            "salesOrderNumber",
            "SalesOrderNumber",
            "orderNo",
            "OrderNo",
            "referenceNumber",
            "ReferenceNumber"
        ],
        warehouse: [
            "warehouseName",
            "WarehouseName",
            "locationName",
            "LocationName",
            "name",
            "Name"
        ],
        product: [
            "productName",
            "ProductName",
            "itemName",
            "ItemName",
            "name",
            "Name"
        ]
    };

    const label = getValue(entity, fields[type] || ["name", "Name"], "");

    if (label) {
        return String(label);
    }

    const id = getEntityId(entity, type);

    return id !== "" ? `${type} #${id}` : "Unnamed";
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (value) => {
    const status = String(value || "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    if (["pending", "created", "new"].includes(status)) {
        return "Pending";
    }

    if (
        ["in progress", "processing", "assigned", "started"].includes(status)
    ) {
        return "In Progress";
    }

    if (["completed", "complete", "picked", "closed"].includes(status)) {
        return "Completed";
    }

    if (["cancelled", "canceled"].includes(status)) {
        return "Cancelled";
    }

    return value || "Pending";
};

/* =========================================================
   INITIAL FORM STATE
========================================================= */

const createInitialForm = () => ({
    orderId: "",
    warehouseId: "",
    picklistDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    notes: "",
    items: [
        {
            productId: "",
            quantity: 1
        }
    ]
});

/* =========================================================
   INITIAL VALIDATION STATE
========================================================= */

const createInitialErrors = () => ({
    orderId: "",
    warehouseId: "",
    picklistDate: "",
    items: []
});

/* =========================================================
   PICKLIST CREATE
========================================================= */

const PicklistCreate = ({
    apiUrl = PICKLIST_API,
    orders: suppliedOrders,
    warehouses: suppliedWarehouses,
    products: suppliedProducts,
    statuses = ["Pending", "In Progress", "Completed", "Cancelled"],
    onCancel,
    onCreated,
    redirectAfterCreate = true
}) => {
    const navigate = useNavigate();

    const [form, setForm] = useState(createInitialForm);
    const [errors, setErrors] = useState(createInitialErrors);

    const [orders, setOrders] = useState(suppliedOrders || []);
    const [warehouses, setWarehouses] = useState(suppliedWarehouses || []);
    const [products, setProducts] = useState(suppliedProducts || []);

    const [loadingOptions, setLoadingOptions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =====================================================
       LOAD LOOKUP DATA
    ===================================================== */

    const fetchOptions = useCallback(async (signal) => {
        const requests = [];

        if (!Array.isArray(suppliedOrders)) {
            requests.push({
                key: "orders",
                url: ORDERS_API
            });
        }

        if (!Array.isArray(suppliedWarehouses)) {
            requests.push({
                key: "warehouses",
                url: WAREHOUSES_API
            });
        }

        if (!Array.isArray(suppliedProducts)) {
            requests.push({
                key: "products",
                url: PRODUCTS_API
            });
        }

        if (requests.length === 0) {
            setLoadingOptions(false);
            return;
        }

        setLoadingOptions(true);

        const results = await Promise.allSettled(
            requests.map((request) =>
                axios.get(request.url, { signal })
            )
        );

        if (signal?.aborted) {
            return;
        }

        const failures = [];

        results.forEach((result, index) => {
            const key = requests[index].key;

            if (result.status === "fulfilled") {
                const collection = extractCollection(result.value.data);

                if (key === "orders") {
                    setOrders(collection);
                } else if (key === "warehouses") {
                    setWarehouses(collection);
                } else if (key === "products") {
                    setProducts(collection);
                }
            } else if (
                result.reason?.code !== "ERR_CANCELED" &&
                result.reason?.name !== "CanceledError"
            ) {
                failures.push(key);
            }
        });

        if (failures.length > 0) {
            setError(
                `Unable to load some lookup data: ${failures.join(", ")}. ` +
                "You can retry or return to the form later."
            );
        }

        setLoadingOptions(false);
    }, [suppliedOrders, suppliedWarehouses, suppliedProducts]);

    useEffect(() => {
        const controller = new AbortController();

        fetchOptions(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchOptions]);

    /* =====================================================
       FORM CHANGE HANDLERS
    ===================================================== */

    const handleChange = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: ""
        }));

        setError("");
        setSuccess("");
    };

    const handleItemChange = (index, field, value) => {
        setForm((previous) => ({
            ...previous,
            items: previous.items.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [field]: value }
                    : item
            )
        }));

        setErrors((previous) => ({
            ...previous,
            items: previous.items.map((itemError, itemIndex) =>
                itemIndex === index
                    ? { ...itemError, [field]: "" }
                    : itemError
            )
        }));

        setError("");
    };

    /* =====================================================
       ADD ITEM
    ===================================================== */

    const handleAddItem = () => {
        setForm((previous) => ({
            ...previous,
            items: [
                ...previous.items,
                {
                    productId: "",
                    quantity: 1
                }
            ]
        }));

        setErrors((previous) => ({
            ...previous,
            items: [
                ...previous.items,
                {
                    productId: "",
                    quantity: ""
                }
            ]
        }));
    };

    /* =====================================================
       REMOVE ITEM
    ===================================================== */

    const handleRemoveItem = (index) => {
        setForm((previous) => ({
            ...previous,
            items: previous.items.filter(
                (_, itemIndex) => itemIndex !== index
            )
        }));

        setErrors((previous) => ({
            ...previous,
            items: previous.items.filter(
                (_, itemIndex) => itemIndex !== index
            )
        }));
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setForm(createInitialForm());
        setErrors(createInitialErrors());
        setError("");
        setSuccess("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const nextErrors = createInitialErrors();

        if (!form.orderId) {
            nextErrors.orderId = "Please select a sales order.";
        }

        if (!form.warehouseId) {
            nextErrors.warehouseId = "Please select a warehouse.";
        }

        if (!form.picklistDate) {
            nextErrors.picklistDate = "Picklist date is required.";
        } else if (
            Number.isNaN(new Date(form.picklistDate).getTime())
        ) {
            nextErrors.picklistDate = "Please enter a valid date.";
        }

        if (!form.items.length) {
            nextErrors.items = [
                {
                    productId: "Add at least one item.",
                    quantity: ""
                }
            ];
        } else {
            const seenProducts = new Set();

            nextErrors.items = form.items.map((item) => {
                const itemError = {
                    productId: "",
                    quantity: ""
                };

                if (!item.productId) {
                    itemError.productId = "Select a product.";
                } else if (seenProducts.has(String(item.productId))) {
                    itemError.productId = "Product is already added.";
                } else {
                    seenProducts.add(String(item.productId));
                }

                const quantity = Number(item.quantity);

                if (
                    item.quantity === "" ||
                    !Number.isFinite(quantity) ||
                    quantity <= 0
                ) {
                    itemError.quantity =
                        "Quantity must be greater than zero.";
                }

                return itemError;
            });
        }

        setErrors(nextErrors);

        return (
            !nextErrors.orderId &&
            !nextErrors.warehouseId &&
            !nextErrors.picklistDate &&
            form.items.length > 0 &&
            nextErrors.items.every(
                (item) => !item.productId && !item.quantity
            )
        );
    };

    /* =====================================================
       BUILD REQUEST PAYLOAD
    ===================================================== */

    const buildPayload = () => ({
        orderId: Number(form.orderId),
        warehouseId: Number(form.warehouseId),
        picklistDate: form.picklistDate,
        status: normalizeStatus(form.status),
        notes: form.notes.trim(),
        items: form.items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity)
        }))
    });

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        setError("");
        setSuccess("");

        if (!validateForm()) {
            setError("Please correct the validation errors.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = buildPayload();

            const response = await axios.post(apiUrl, payload);

            const responseData = response.data;

            setSuccess("Picklist created successfully.");

            if (typeof onCreated === "function") {
                onCreated(responseData, payload);
            }

            if (redirectAfterCreate) {
                const createdId = getValue(
                    responseData,
                    [
                        "picklistId",
                        "PicklistId",
                        "pickListId",
                        "PickListId",
                        "id",
                        "Id"
                    ],
                    getValue(
                        responseData?.data,
                        [
                            "picklistId",
                            "PicklistId",
                            "pickListId",
                            "PickListId",
                            "id",
                            "Id"
                        ],
                        ""
                    )
                );

                if (createdId !== "") {
                    navigate(
                        `/picklists/${encodeURIComponent(String(createdId))}`
                    );
                } else {
                    navigate("/picklists");
                }
            }
        } catch (err) {
            const responseMessage =
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.error;

            if (err.response?.status === 400) {
                setError(
                    responseMessage ||
                    "The server rejected the submitted data. Please verify the fields and try again."
                );
            } else if (err.response?.status === 401) {
                setError("You are not authorized to create a picklist.");
            } else if (err.response?.status === 403) {
                setError("You do not have permission to create a picklist.");
            } else if (err.response?.status === 409) {
                setError(
                    responseMessage ||
                    "A conflicting picklist already exists."
                );
            } else {
                setError(
                    responseMessage ||
                    err.message ||
                    "Failed to create picklist. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        navigate("/picklists");
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton
                        onClick={handleCancel}
                        disabled={submitting}
                        aria-label="Go back"
                    >
                        <ArrowBack />
                    </IconButton>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Create Picklist
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Create a picklist for a sales order
                        </Typography>
                    </Box>
                </Stack>

                <Button
                    variant="outlined"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={submitting}
                >
                    Reset Form
                </Button>
            </Stack>

            {/* ALERTS */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {loadingOptions && (
                <Alert
                    severity="info"
                    icon={<CircularProgress size={18} />}
                    sx={{ mb: 2 }}
                >
                    Loading orders, warehouses, and products...
                </Alert>
            )}

            {/* FORM */}

            <Box component="form" onSubmit={handleSubmit}>
                {/* GENERAL INFORMATION */}

                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <Inventory2 color="primary" />

                            <Typography variant="h6" fontWeight={700}>
                                Picklist Information
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={orders}
                                    loading={loadingOptions}
                                    value={
                                        orders.find(
                                            (order) =>
                                                String(getEntityId(order, "order")) ===
                                                String(form.orderId)
                                        ) || null
                                    }
                                    getOptionLabel={(option) =>
                                        getEntityLabel(option, "order")
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        String(getEntityId(option, "order")) ===
                                        String(getEntityId(value, "order"))
                                    }
                                    onChange={(_, selectedOrder) => {
                                        handleChange(
                                            "orderId",
                                            selectedOrder
                                                ? getEntityId(selectedOrder, "order")
                                                : ""
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sales Order"
                                            required
                                            error={Boolean(errors.orderId)}
                                            helperText={
                                                errors.orderId ||
                                                "Select the order to be picked."
                                            }
                                            placeholder="Search sales orders"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={warehouses}
                                    loading={loadingOptions}
                                    value={
                                        warehouses.find(
                                            (warehouse) =>
                                                String(
                                                    getEntityId(warehouse, "warehouse")
                                                ) === String(form.warehouseId)
                                        ) || null
                                    }
                                    getOptionLabel={(option) =>
                                        getEntityLabel(option, "warehouse")
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        String(
                                            getEntityId(option, "warehouse")
                                        ) ===
                                        String(getEntityId(value, "warehouse"))
                                    }
                                    onChange={(_, selectedWarehouse) => {
                                        handleChange(
                                            "warehouseId",
                                            selectedWarehouse
                                                ? getEntityId(
                                                    selectedWarehouse,
                                                    "warehouse"
                                                )
                                                : ""
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Warehouse"
                                            required
                                            error={Boolean(errors.warehouseId)}
                                            helperText={
                                                errors.warehouseId ||
                                                "Select the warehouse for picking."
                                            }
                                            placeholder="Search warehouses"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Picklist Date"
                                    value={form.picklistDate}
                                    onChange={(event) =>
                                        handleChange(
                                            "picklistDate",
                                            event.target.value
                                        )
                                    }
                                    required
                                    error={Boolean(errors.picklistDate)}
                                    helperText={errors.picklistDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    value={form.status}
                                    onChange={(event) =>
                                        handleChange(
                                            "status",
                                            event.target.value
                                        )
                                    }
                                >
                                    {statuses.map((status) => (
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
                                    multiline
                                    minRows={3}
                                    label="Notes"
                                    value={form.notes}
                                    onChange={(event) =>
                                        handleChange(
                                            "notes",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter any additional instructions..."
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ITEMS */}

                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "stretch", sm: "center" }}
                            spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Picklist Items
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Add the products and quantities to pick.
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={handleAddItem}
                                disabled={submitting}
                            >
                                Add Item
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        {form.items.map((item, index) => {
                            const itemError = errors.items[index] || {};

                            const selectedProduct =
                                products.find(
                                    (product) =>
                                        String(getEntityId(product, "product")) ===
                                        String(item.productId)
                                ) || null;

                            return (
                                <Paper
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 2,
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

                                        <IconButton
                                            color="error"
                                            aria-label={`Remove item ${index + 1}`}
                                            disabled={
                                                submitting ||
                                                form.items.length === 1
                                            }
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    </Stack>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={8}>
                                            <Autocomplete
                                                options={products}
                                                loading={loadingOptions}
                                                value={selectedProduct}
                                                getOptionLabel={(option) => {
                                                    const name = getEntityLabel(
                                                        option,
                                                        "product"
                                                    );

                                                    const code = getValue(
                                                        option,
                                                        [
                                                            "productCode",
                                                            "ProductCode",
                                                            "itemCode",
                                                            "ItemCode",
                                                            "sku",
                                                            "SKU"
                                                        ],
                                                        ""
                                                    );

                                                    return code
                                                        ? `${name} (${code})`
                                                        : name;
                                                }}
                                                isOptionEqualToValue={(
                                                    option,
                                                    value
                                                ) =>
                                                    String(
                                                        getEntityId(option, "product")
                                                    ) ===
                                                    String(
                                                        getEntityId(value, "product")
                                                    )
                                                }
                                                onChange={(
                                                    _,
                                                    selectedProductOption
                                                ) => {
                                                    handleItemChange(
                                                        index,
                                                        "productId",
                                                        selectedProductOption
                                                            ? getEntityId(
                                                                selectedProductOption,
                                                                "product"
                                                            )
                                                            : ""
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Product"
                                                        required
                                                        error={Boolean(
                                                            itemError.productId
                                                        )}
                                                        helperText={
                                                            itemError.productId
                                                        }
                                                        placeholder="Search products"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Quantity"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        "quantity",
                                                        event.target.value
                                                    )
                                                }
                                                required
                                                inputProps={{
                                                    min: 0.01,
                                                    step: 0.01
                                                }}
                                                error={Boolean(
                                                    itemError.quantity
                                                )}
                                                helperText={
                                                    itemError.quantity ||
                                                    "Must be greater than zero."
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            );
                        })}

                        {errors.items.length > 0 &&
                            errors.items.some(
                                (itemError) =>
                                    itemError.productId || itemError.quantity
                            ) && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Check the product and quantity fields above.
                                </Alert>
                            )}
                    </CardContent>
                </Card>

                {/* ACTIONS */}

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    justifyContent="flex-end"
                    spacing={2}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            submitting
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={submitting || loadingOptions}
                    >
                        {submitting ? "Creating..." : "Create Picklist"}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default PicklistCreate;

