
 // =========================================================
 // GatepassesList.jsx
 // =========================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Add,
    Delete,
    Edit,
    Refresh,
    Search,
    Visibility
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/Gatepass`;

// =========================================================
// NORMALIZE RESPONSE
// =========================================================

const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.gatepasses)) return data.gatepasses;
    if (Array.isArray(data?.Gatepasses)) return data.Gatepasses;

    return [];
};

// =========================================================
// GET FIELD VALUE (CAMELCASE / PASCALCASE)
// =========================================================

const getValue = (item, camelCase, pascalCase) =>
    item?.[camelCase] ?? item?.[pascalCase] ?? "";

// =========================================================
// GET RECORD ID
// =========================================================

const getRecordId = (item) =>
    item?.gatepassId ??
    item?.GatepassId ??
    item?.gatePassId ??
    item?.GatePassId ??
    item?.id ??
    item?.Id;

// =========================================================
// GET SELLER / CUSTOMER ID
// =========================================================

const getStoredId = (propValue, keys) => {
    if (
        propValue !== undefined &&
        propValue !== null &&
        String(propValue).trim() !== ""
    ) {
        return propValue;
    }

    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (
            value &&
            value !== "null" &&
            value !== "undefined" &&
            value.trim() !== ""
        ) {
            return value;
        }
    }

    return "";
};

// =========================================================
// COMPONENT
// =========================================================

const GatepassesList = ({
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    onCreate,
    onView,
    onEdit,
    onDelete
}) => {
    const navigate = useNavigate();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [gatepasses, setGatepasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // -----------------------------------------------------
    // SELLER / CUSTOMER CONTEXT
    // Required for scoped mutations, NOT for fetching all.
    // -----------------------------------------------------

    const sellerId = getStoredId(sellerIdProp, [
        "sellerId",
        "SellerId",
        "selectedSellerId",
        "SelectedSellerId"
    ]);

    const customerId = getStoredId(customerIdProp, [
        "customerId",
        "CustomerId",
        "selectedCustomerId",
        "SelectedCustomerId"
    ]);

    const hasValidScope =
        String(sellerId).trim() !== "" &&
        String(customerId).trim() !== "";

    // -----------------------------------------------------
    // FETCH ALL GATEPASSES
    // GET: /api/Gatepass/all
    // -----------------------------------------------------

    const fetchGatepasses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API_URL}/all`);

            const records = normalizeResponse(response.data);

            setGatepasses(records);

            setPage((currentPage) => {
                const filteredCount = records.length;
                const lastPage = Math.max(
                    0,
                    Math.ceil(filteredCount / rowsPerPage) - 1
                );

                return Math.min(currentPage, lastPage);
            });
        } catch (err) {
            console.error(
                "FETCH GATEPASSES ERROR:",
                err.response?.status,
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load Gatepasses."
            );
        } finally {
            setLoading(false);
        }
    }, [rowsPerPage]);

    useEffect(() => {
        fetchGatepasses();
    }, [fetchGatepasses]);

    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

    const filteredGatepasses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return gatepasses;

        return gatepasses.filter((item) => {
            const searchableValues = [
                getRecordId(item),
                getValue(item, "gatepassCode", "GatepassCode"),
                getValue(item, "facilityCode", "FacilityCode"),
                getValue(item, "itemSkuCode", "ItemSkuCode"),
                getValue(item, "quantity", "Quantity"),
                getValue(item, "reason", "Reason"),
                getValue(item, "status", "Status"),
                getValue(item, "createdBy", "CreatedBy"),
                getValue(item, "sellerId", "SellerId"),
                getValue(item, "customerId", "CustomerId"),
                getValue(item, "createdDate", "CreatedDate")
            ];

            return searchableValues.some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            );
        });
    }, [gatepasses, searchTerm]);

    // -----------------------------------------------------
    // PAGINATION
    // -----------------------------------------------------

    const visibleGatepasses = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredGatepasses.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredGatepasses, page, rowsPerPage]);

    // -----------------------------------------------------
    // CREATE
    // -----------------------------------------------------

    const handleCreate = () => {
        if (typeof onCreate === "function") {
            onCreate();
        } else {
            navigate("/gatepasses/create");
        }
    };

    // -----------------------------------------------------
    // VIEW
    // -----------------------------------------------------

    const handleView = (item) => {
        const id = getRecordId(item);

        if (id == null || id === "") {
            setError("Cannot view Gatepass: record ID is missing.");
            return;
        }

        if (typeof onView === "function") {
            onView(item);
        } else {
            navigate(`/gatepasses/details/${encodeURIComponent(id)}`);
        }
    };

    // -----------------------------------------------------
    // EDIT
    // -----------------------------------------------------

    const handleEdit = (item) => {
        const id = getRecordId(item);

        if (id == null || id === "") {
            setError("Cannot edit Gatepass: record ID is missing.");
            return;
        }

        if (typeof onEdit === "function") {
            onEdit(item);
        } else {
            navigate(`/gatepasses/${encodeURIComponent(id)}/edit`);
        }
    };

    // -----------------------------------------------------
    // DELETE
    // Requires sellerId and customerId for scoped endpoint.
    // -----------------------------------------------------



const handleDelete = async (item) => {
    console.log("DELETE CLICKED:", item);

    const id = getRecordId(item);

    const sellerId =
        item?.sellerId ?? item?.SellerId;

    const customerId =
        item?.customerId ?? item?.CustomerId;

    if (id === undefined || id === null || id === "") {
        setError("Cannot delete: Gatepass ID is missing.");
        return;
    }

    if (
        sellerId === undefined ||
        sellerId === null ||
        customerId === undefined ||
        customerId === null
    ) {
        setError("Cannot delete: Seller ID or Customer ID is missing.");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete Gatepass ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");
        setSuccess("");

        const deleteUrl =
            `${API_URL}/${encodeURIComponent(id)}` +
            `/seller/${encodeURIComponent(sellerId)}` +
            `/customer/${encodeURIComponent(customerId)}`;

        console.log("DELETE REQUEST URL:", deleteUrl);

        const response = await axios.delete(deleteUrl);

        console.log("DELETE RESPONSE:", response.data);

        setSuccess("Gatepass deleted successfully.");

        await fetchGatepasses();
    } catch (err) {
        console.error(
            "DELETE GATEPASS ERROR:",
            err.response?.status,
            err.response?.data || err.message
        );

        setError(
            err.response?.data?.message ||
            err.response?.data?.Message ||
            `Gatepass deletion failed. HTTP ${err.response?.status || "network error"}.`
        );
    }
};
    // -----------------------------------------------------
    // STATUS CHIP
    // -----------------------------------------------------

    const renderStatus = (status) => {
        const value = String(status || "Unknown");
        const normalized = value.toLowerCase();

        let color = "default";

        if (
            ["approved", "completed", "closed"].includes(normalized)
        ) {
            color = "success";
        } else if (
            ["pending", "draft"].includes(normalized)
        ) {
            color = "warning";
        } else if (
            ["rejected", "cancelled"].includes(normalized)
        ) {
            color = "error";
        }

        return <Chip label={value} color={color} size="small" />;
    };

    // -----------------------------------------------------
    // FORMAT DATE
    // -----------------------------------------------------

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return String(value);

        return date.toLocaleString("en-IN");
    };

    // -----------------------------------------------------
    // RENDER
    // -----------------------------------------------------

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Gatepasses
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Manage gatepass records across sellers and customers.
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Total records: {filteredGatepasses.length}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchGatepasses}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Create Gatepass
                    </Button>
                </Box>
            </Box>

            {/* MESSAGES */}
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2, whiteSpace: "pre-wrap" }}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* SEARCH */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by ID, code, facility, SKU, status, seller, or customer..."
                    value={searchTerm}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                />
            </Paper>

            {/* TABLE */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Gatepass Code</strong></TableCell>
                            <TableCell><strong>Facility Code</strong></TableCell>
                            <TableCell><strong>Item SKU</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Reason</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Seller ID</strong></TableCell>
                            <TableCell><strong>Customer ID</strong></TableCell>
                            <TableCell><strong>Created Date</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    <CircularProgress size={28} sx={{ my: 2 }} />
                                    <Typography variant="body2">
                                        Loading Gatepasses...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && visibleGatepasses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    <Typography
                                        color="text.secondary"
                                        sx={{ py: 4 }}
                                    >
                                        {gatepasses.length === 0
                                            ? "No Gatepasses found."
                                            : "No matching Gatepasses found."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            visibleGatepasses.map((item, index) => {
                                const id = getRecordId(item);

                                return (
                                    <TableRow hover key={id ?? index}>
                                        <TableCell>{id ?? "—"}</TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "gatepassCode",
                                                "GatepassCode"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "facilityCode",
                                                "FacilityCode"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "itemSkuCode",
                                                "ItemSkuCode"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "quantity",
                                                "Quantity"
                                            ) ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "reason",
                                                "Reason"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {renderStatus(
                                                getValue(
                                                    item,
                                                    "status",
                                                    "Status"
                                                )
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "sellerId",
                                                "SellerId"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getValue(
                                                item,
                                                "customerId",
                                                "CustomerId"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(
                                                getValue(
                                                    item,
                                                    "createdDate",
                                                    "CreatedDate"
                                                )
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Tooltip title="View">
                                                <IconButton
                                                    color="info"
                                                    onClick={() => handleView(item)}
                                                    size="small"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(item)}
                                                    size="small"
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(item)}
                                                    size="small"
                                                    disabled={loading}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredGatepasses.length}
                    page={Math.min(
                        page,
                        Math.max(
                            0,
                            Math.ceil(filteredGatepasses.length / rowsPerPage) - 1
                        )
                    )}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>
        </Box>
    );
};

export default GatepassesList;
