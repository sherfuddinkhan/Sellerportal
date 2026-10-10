// =========================================================
// VendorItemMasterView.jsx
// =========================================================

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
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/VendorItemMaster";

// =========================================================
// GET FIELD VALUE
// =========================================================

const getField = (item, camelCase, pascalCase, fallback = "—") => {
    return item?.[camelCase] ??
        item?.[pascalCase] ??
        fallback;
};

// =========================================================
// FORMAT CURRENCY
// =========================================================

const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// =========================================================
// VENDOR ITEM MASTER VIEW
// =========================================================

const VendorItemMasterView = ({
    itemId: propItemId,
    item: propItem,
    onEdit,
    onClose
}) => {
    const { id, itemId } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // RESOLVE ITEM ID
    // =====================================================

    const resolvedItemId =
        propItemId ??
        itemId ??
        id;

    // =====================================================
    // STATE
    // =====================================================

    const [item, setItem] = useState(propItem || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH ITEM DETAILS
    // =====================================================

    const fetchItem = useCallback(async () => {
        if (resolvedItemId == null || resolvedItemId === "") {
            if (propItem) {
                setItem(propItem);
                setError("");
            } else {
                setError("Vendor item ID was not provided.");
            }

            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/${resolvedItemId}`
            );

            const responseData = response.data;

            const record =
                responseData?.data ??
                responseData?.item ??
                responseData;

            setItem(record);
        } catch (err) {
            console.error(
                "GET VENDOR ITEM DETAILS ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Failed to load vendor item details."
            );
        } finally {
            setLoading(false);
        }
    }, [resolvedItemId, propItem]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        if (propItem) {
            setItem(propItem);
        } else {
            fetchItem();
        }
    }, [propItem, fetchItem]);

    // =====================================================
    // HANDLE EDIT
    // =====================================================

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(item);
            return;
        }

        const currentId =
            getField(item, "vendorItemMasterId", "VendorItemMasterId",
                getField(item, "vendorItemId", "VendorItemId",
                    getField(item, "id", "Id", resolvedItemId)
                )
            );

        if (currentId !== "—" && currentId != null) {
            navigate(`/vendor-item-masters/edit/${currentId}`);
        }
    };

    // =====================================================
    // HANDLE CLOSE
    // =====================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        } else {
            navigate("/vendor-item-masters");
        }
    };

    // =====================================================
    // STATUS
    // =====================================================

    const rawStatus = String(
        getField(item, "status", "Status", "Unknown")
    ).trim();

    const isActive = [
        "active",
        "true",
        "1"
    ].includes(rawStatus.toLowerCase());

    const statusColor = isActive
        ? "success"
        : rawStatus.toLowerCase() === "inactive" ||
          rawStatus.toLowerCase() === "false" ||
          rawStatus === "0"
            ? "default"
            : "warning";

    // =====================================================
    // DETAIL FIELD
    // =====================================================

    const DetailField = ({ label, value }) => (
        <Box sx={{ py: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: 0.4
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{ overflowWrap: "anywhere" }}
            >
                {value == null || value === "" ? "—" : value}
            </Typography>
        </Box>
    );

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading && !item) {
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
                    Loading vendor item details...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR STATE
    // =====================================================

    if (error && !item) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchItem}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back to Vendor Items
                </Button>
            </Box>
        );
    }

    // =====================================================
    // NO DATA STATE
    // =====================================================

    if (!item) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No vendor item details are available.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back to Vendor Items
                </Button>
            </Box>
        );
    }

    // =====================================================
    // FIELD VALUES
    // =====================================================

    const itemCode = getField(
        item, "itemCode", "ItemCode"
    );

    const itemName = getField(
        item, "itemName", "ItemName"
    );

    const vendorName = getField(
        item,
        "vendorName",
        "VendorName",
        getField(item, "vendorId", "VendorId")
    );

    const description = getField(
        item, "description", "Description"
    );

    const unitOfMeasure = getField(
        item, "unitOfMeasure", "UnitOfMeasure"
    );

    const unitPrice = getField(
        item,
        "unitPrice",
        "UnitPrice",
        getField(item, "unitCost", "UnitCost", 0)
    );

    const taxRate = getField(
        item, "taxRate", "TaxRate", 0
    );

    const itemIdValue = getField(
        item,
        "vendorItemMasterId",
        "VendorItemMasterId",
        getField(
            item,
            "vendorItemId",
            "VendorItemId",
            getField(item, "id", "Id", resolvedItemId)
        )
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* ============================================= */}
            {/* HEADER */}
            {/* ============================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Vendor Item Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View vendor item master information.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleClose}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchItem}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Item
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* ============================================= */}
            {/* ITEM SUMMARY */}
            {/* ============================================= */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {itemName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                Item Code: {itemCode}
                            </Typography>
                        </Box>

                        <Chip
                            label={rawStatus || "Unknown"}
                            color={statusColor}
                            variant="outlined"
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* ============================================= */}
            {/* ITEM INFORMATION */}
            {/* ============================================= */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        General Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Vendor Item ID"
                                value={itemIdValue}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Item Code"
                                value={itemCode}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Item Name"
                                value={itemName}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Vendor"
                                value={vendorName}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Unit of Measure"
                                value={unitOfMeasure}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailField
                                label="Status"
                                value={rawStatus}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailField
                                label="Description"
                                value={description}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ============================================= */}
            {/* PRICING INFORMATION */}
            {/* ============================================= */}

            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Pricing Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Unit Price"
                                value={formatCurrency(unitPrice)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Tax Rate"
                                value={`${taxRate}%`}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VendorItemMasterView;

