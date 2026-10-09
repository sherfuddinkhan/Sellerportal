import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Refresh,
    Edit,
    Inventory2,
    Assignment,
    Warehouse,
    CalendarMonth,
    Numbers,
    CheckCircle,
    PendingActions,
    LocalShipping,
    Cancel,
    ShoppingCart
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const PICKLIST_ENDPOINT = `${API_BASE_URL}/api/Picklist`;

/* =========================================================
   GET VALUE FROM MULTIPLE POSSIBLE FIELD NAMES
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
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

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

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) => {
    const value = String(status || "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    if (["completed", "complete", "picked", "closed"].includes(value)) {
        return "Completed";
    }

    if (
        [
            "in progress",
            "processing",
            "assigned",
            "started"
        ].includes(value)
    ) {
        return "In Progress";
    }

    if (["cancelled", "canceled"].includes(value)) {
        return "Cancelled";
    }

    if (["pending", "created", "new"].includes(value)) {
        return "Pending";
    }

    return status || "Pending";
};

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
        case "Completed":
            return {
                label: normalized,
                color: "success",
                icon: <CheckCircle fontSize="small" />
            };

        case "In Progress":
            return {
                label: normalized,
                color: "info",
                icon: <LocalShipping fontSize="small" />
            };

        case "Cancelled":
            return {
                label: normalized,
                color: "error",
                icon: <Cancel fontSize="small" />
            };

        case "Pending":
        default:
            return {
                label: normalized,
                color: "warning",
                icon: <PendingActions fontSize="small" />
            };
    }
};

/* =========================================================
   EXTRACT API RESPONSE DATA
========================================================= */

const extractPicklist = (responseData) => {
    let data = responseData;

    // Handle common API response wrappers.
    for (let index = 0; index < 3; index += 1) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            break;
        }

        const nestedData = getValue(
            data,
            ["data", "result", "item", "picklist", "Picklist"],
            null
        );

        if (nestedData === null || nestedData === data) {
            break;
        }

        data = nestedData;
    }

    return data && typeof data === "object" && !Array.isArray(data)
        ? data
        : null;
};

/* =========================================================
   EXTRACT PICKLIST ITEMS
========================================================= */

const extractItems = (picklist) => {
    const items = getValue(
        picklist,
        [
            "items",
            "Items",
            "picklistItems",
            "PicklistItems",
            "pickListItems",
            "PickListItems",
            "details",
            "Details"
        ],
        []
    );

    return Array.isArray(items) ? items : [];
};

/* =========================================================
   DETAIL FIELD COMPONENT
========================================================= */

const DetailField = ({ label, value, icon }) => (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        {icon && (
            <Box
                sx={{
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    mt: 0.25
                }}
            >
                {icon}
            </Box>
        )}

        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {value === undefined || value === null || value === ""
                    ? "—"
                    : String(value)}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   PICKLIST DETAILS
========================================================= */

const PicklistDetails = ({
    picklistId: suppliedPicklistId,
    apiUrl = PICKLIST_ENDPOINT,
    onEdit,
    onBack,
    onLoaded
}) => {
    const params = useParams();
    const navigate = useNavigate();

    const picklistId =
        suppliedPicklistId ??
        params.picklistId ??
        params.id;

    const [picklist, setPicklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD PICKLIST DETAILS
    ===================================================== */

    const fetchPicklist = useCallback(
        async (isRetry = false, signal) => {
            if (
                picklistId === undefined ||
                picklistId === null ||
                String(picklistId).trim() === ""
            ) {
                setPicklist(null);
                setError("Picklist ID is missing.");
                setLoading(false);
                setRefreshing(false);
                return;
            }

            if (isRetry) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response = await axios.get(
                    `${apiUrl}/${encodeURIComponent(String(picklistId))}`,
                    { signal }
                );

                const result = extractPicklist(response.data);

                if (!result) {
                    throw new Error(
                        "The server returned an invalid picklist response."
                    );
                }

                setPicklist(result);

                if (typeof onLoaded === "function") {
                    onLoaded(result);
                }
            } catch (err) {
                if (
                    err.code === "ERR_CANCELED" ||
                    err.name === "CanceledError"
                ) {
                    return;
                }

                const responseMessage =
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.response?.data?.error;

                if (err.response?.status === 404) {
                    setError("Picklist not found.");
                } else if (err.response?.status === 401) {
                    setError(
                        "You are not authorized to view this picklist."
                    );
                } else if (err.response?.status === 403) {
                    setError(
                        "You do not have permission to view this picklist."
                    );
                } else {
                    setError(
                        responseMessage ||
                        err.message ||
                        "Unable to load picklist details."
                    );
                }

                setPicklist(null);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [apiUrl, picklistId, onLoaded]
    );

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        const controller = new AbortController();

        fetchPicklist(false, controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchPicklist]);

    /* =====================================================
       BACK NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
            return;
        }

        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/picklists");
        }
    };

    /* =====================================================
       EDIT NAVIGATION
    ===================================================== */

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(picklist);
            return;
        }

        const id = getValue(
            picklist,
            [
                "picklistId",
                "PicklistId",
                "pickListId",
                "PickListId",
                "id",
                "Id"
            ],
            picklistId
        );

        navigate(`/picklists/${encodeURIComponent(String(id))}/edit`);
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 3
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading picklist details...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && !picklist) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 3 }}
                >
                    <IconButton
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700}>
                        Picklist Details
                    </Typography>
                </Stack>

                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={() => fetchPicklist(true)}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!picklist) {
        return null;
    }

    /* =====================================================
       PICKLIST FIELD MAPPING
    ===================================================== */

    const id = getValue(
        picklist,
        [
            "picklistId",
            "PicklistId",
            "pickListId",
            "PickListId",
            "id",
            "Id"
        ],
        picklistId
    );

    const picklistNumber = getValue(
        picklist,
        [
            "picklistNumber",
            "PicklistNumber",
            "pickListNumber",
            "PickListNumber",
            "picklistNo",
            "PicklistNo",
            "number",
            "Number"
        ],
        `Picklist #${id}`
    );

    const orderNumber = getValue(
        picklist,
        [
            "orderNumber",
            "OrderNumber",
            "salesOrderNumber",
            "SalesOrderNumber",
            "orderNo",
            "OrderNo"
        ],
        ""
    );

    const orderId = getValue(
        picklist,
        [
            "orderId",
            "OrderId",
            "salesOrderId",
            "SalesOrderId"
        ],
        ""
    );

    const warehouseName = getValue(
        picklist,
        [
            "warehouseName",
            "WarehouseName",
            "warehouse",
            "Warehouse",
            "locationName",
            "LocationName"
        ],
        ""
    );

    const warehouseId = getValue(
        picklist,
        [
            "warehouseId",
            "WarehouseId",
            "locationId",
            "LocationId"
        ],
        ""
    );

    const status = getStatusConfig(
        getValue(
            picklist,
            ["status", "Status", "picklistStatus", "PicklistStatus"],
            "Pending"
        )
    );

    const picklistDate = getValue(
        picklist,
        [
            "picklistDate",
            "PicklistDate",
            "createdDate",
            "CreatedDate",
            "createdAt",
            "CreatedAt",
            "date",
            "Date"
        ],
        ""
    );

    const items = extractItems(picklist);

    const totalQuantity = items.reduce((total, item) => {
        const quantity = Number(
            getValue(
                item,
                [
                    "quantity",
                    "Quantity",
                    "requestedQuantity",
                    "RequestedQuantity",
                    "pickQuantity",
                    "PickQuantity"
                ],
                0
            )
        );

        return total + (Number.isFinite(quantity) ? quantity : 0);
    }, 0);

    const itemCount = getValue(
        picklist,
        ["totalItems", "TotalItems", "itemCount", "ItemCount"],
        items.length
    );

    /* =====================================================
       RENDER DETAILS
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
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Tooltip title="Go back">
                        <IconButton
                            onClick={handleBack}
                            aria-label="Go back"
                        >
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Picklist Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View picklist information and items
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={
                            refreshing
                                ? <CircularProgress size={16} />
                                : <Refresh />
                        }
                        disabled={refreshing}
                        onClick={() => fetchPicklist(true)}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Picklist
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* PICKLIST SUMMARY */}

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Box>
                            <Typography
                                variant="overline"
                                color="text.secondary"
                            >
                                Picklist Number
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {String(picklistNumber)}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                ID: {String(id)}
                            </Typography>
                        </Box>

                        <Chip
                            icon={status.icon}
                            label={status.label}
                            color={status.color}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <DetailField
                                label="Picklist Date"
                                value={formatDate(picklistDate)}
                                icon={<CalendarMonth />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailField
                                label="Order Number"
                                value={orderNumber || orderId || "—"}
                                icon={<Assignment />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailField
                                label="Warehouse"
                                value={warehouseName || warehouseId || "—"}
                                icon={<Warehouse />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailField
                                label="Total Items"
                                value={formatNumber(itemCount)}
                                icon={<Inventory2 />}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ITEM STATISTICS */}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: "primary.50",
                                        color: "primary.main",
                                        display: "flex"
                                    }}
                                >
                                    <ShoppingCart />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Number of Lines
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {formatNumber(items.length)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: "success.50",
                                        color: "success.main",
                                        display: "flex"
                                    }}
                                >
                                    <Numbers />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Total Quantity
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {formatNumber(totalQuantity)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: "warning.50",
                                        color: "warning.main",
                                        display: "flex"
                                    }}
                                >
                                    <PendingActions />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Current Status
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {status.label}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ITEMS TABLE */}

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
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
                                Products and quantities included in this picklist
                            </Typography>
                        </Box>

                        <Chip
                            label={`${items.length} line${items.length === 1 ? "" : "s"}`}
                            variant="outlined"
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {items.length === 0 ? (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                textAlign: "center",
                                borderStyle: "dashed"
                            }}
                        >
                            <Inventory2
                                sx={{
                                    fontSize: 42,
                                    color: "text.secondary",
                                    mb: 1
                                }}
                            />

                            <Typography fontWeight={600}>
                                No items found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                This picklist does not contain any item details.
                            </Typography>
                        </Paper>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <strong>#</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Product</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Product Code</strong>
                                        </TableCell>

                                        <TableCell align="right">
                                            <strong>Quantity</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Item Status</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {items.map((item, index) => {
                                        const itemId = getValue(
                                            item,
                                            [
                                                "picklistItemId",
                                                "PicklistItemId",
                                                "pickListItemId",
                                                "PickListItemId",
                                                "itemId",
                                                "ItemId",
                                                "id",
                                                "Id"
                                            ],
                                            index
                                        );

                                        const productName = getValue(
                                            item,
                                            [
                                                "productName",
                                                "ProductName",
                                                "itemName",
                                                "ItemName",
                                                "name",
                                                "Name",
                                                "description",
                                                "Description"
                                            ],
                                            "Unnamed Product"
                                        );

                                        const productCode = getValue(
                                            item,
                                            [
                                                "productCode",
                                                "ProductCode",
                                                "itemCode",
                                                "ItemCode",
                                                "sku",
                                                "SKU",
                                                "code",
                                                "Code"
                                            ],
                                            "—"
                                        );

                                        const quantity = getValue(
                                            item,
                                            [
                                                "quantity",
                                                "Quantity",
                                                "requestedQuantity",
                                                "RequestedQuantity",
                                                "pickQuantity",
                                                "PickQuantity"
                                            ],
                                            0
                                        );

                                        const itemStatus = getValue(
                                            item,
                                            [
                                                "status",
                                                "Status",
                                                "itemStatus",
                                                "ItemStatus"
                                            ],
                                            ""
                                        );

                                        return (
                                            <TableRow
                                                key={itemId}
                                                hover
                                            >
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                    >
                                                        {String(productName)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {String(productCode)}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {formatNumber(quantity)}
                                                </TableCell>

                                                <TableCell>
                                                    {itemStatus ? (
                                                        <Chip
                                                            size="small"
                                                            label={String(
                                                                normalizeStatus(itemStatus)
                                                            )}
                                                            color={
                                                                getStatusConfig(
                                                                    itemStatus
                                                                ).color
                                                            }
                                                            variant="outlined"
                                                        />
                                                    ) : (
                                                        "—"
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            align="right"
                                        >
                                            <Typography fontWeight={700}>
                                                Total Quantity
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography fontWeight={700}>
                                                {formatNumber(totalQuantity)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell />
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* ADDITIONAL INFORMATION */}

            <Card
                variant="outlined"
                sx={{ mt: 3, borderRadius: 2 }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Additional Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Picklist ID"
                                value={id}
                                icon={<Numbers />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Order ID"
                                value={orderId || "—"}
                                icon={<Assignment />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Warehouse ID"
                                value={warehouseId || "—"}
                                icon={<Warehouse />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Created Date"
                                value={formatDate(
                                    getValue(
                                        picklist,
                                        [
                                            "createdDate",
                                            "CreatedDate",
                                            "createdAt",
                                            "CreatedAt"
                                        ],
                                        ""
                                    )
                                )}
                                icon={<CalendarMonth />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailField
                                label="Notes"
                                value={getValue(
                                    picklist,
                                    [
                                        "notes",
                                        "Notes",
                                        "remarks",
                                        "Remarks",
                                        "comments",
                                        "Comments"
                                    ],
                                    "No additional notes."
                                )}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* FOOTER ACTIONS */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ mt: 3 }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Picklist
                </Button>
            </Stack>
        </Box>
    );
};

export default PicklistDetails;

