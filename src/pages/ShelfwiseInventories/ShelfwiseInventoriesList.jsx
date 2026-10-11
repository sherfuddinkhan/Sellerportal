
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
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
    Download,
    Edit,
    Refresh,
    Search,
    Visibility
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "/api/ShelfwiseInventory";

// =========================================================
// FIELD HELPERS
// =========================================================

const getField = (item, ...names) => {
    if (!item) return "";

    for (const name of names) {
        if (
            item[name] !== undefined &&
            item[name] !== null
        ) {
            return item[name];
        }
    }

    return "";
};

const getInventoryId = (item) =>
    getField(
        item,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "id",
        "Id"
    );

const getInventoryStatus = (item) => {
    const quantity = Number(
        getField(item, "quantity", "Quantity") || 0
    );

    const availableQuantity = Number(
        getField(
            item,
            "availableQuantity",
            "AvailableQuantity"
        ) || 0
    );

    const minimumStock = Number(
        getField(item, "minimumStock", "MinimumStock") || 0
    );

    const status = getField(item, "status", "Status");

    if (status) return String(status);

    if (availableQuantity <= 0 || quantity <= 0) {
        return "Out of Stock";
    }

    if (minimumStock > 0 && availableQuantity <= minimumStock) {
        return "Low Stock";
    }

    return "In Stock";
};

const normalizeInventoryResponse = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.Items)) {
        return response.Items;
    }

    if (Array.isArray(response?.records)) {
        return response.records;
    }

    if (Array.isArray(response?.Records)) {
        return response.Records;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response?.data?.Items)) {
        return response.data.Items;
    }

    if (Array.isArray(response?.data?.records)) {
        return response.data.records;
    }

    return [];
};

// =========================================================
// AUTHENTICATION / SELLER / CUSTOMER IDS
// =========================================================

const getStoredObject = (...keys) => {
    for (const key of keys) {
        try {
            const value = localStorage.getItem(key);

            if (!value) continue;

            const parsed = JSON.parse(value);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        } catch {
            // The value may be a plain string rather than JSON.
        }
    }

    return {};
};

const getStoredId = (...keys) => {
    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (value && value !== "null" && value !== "undefined") {
            const number = Number(value);

            if (Number.isInteger(number) && number > 0) {
                return number;
            }
        }
    }

    return null;
};

const getSellerCustomerIds = () => {
    const user = getStoredObject(
        "user",
        "currentUser",
        "authUser",
        "loginResponse"
    );

    const seller = user?.seller || user?.Seller || {};
    const customer = user?.customer || user?.Customer || {};

    const sellerId =
        getStoredId("sellerId", "SellerId") ??
        Number(
            user?.sellerId ??
            user?.SellerId ??
            seller?.sellerId ??
            seller?.SellerId ??
            0
        );

    const customerId =
        getStoredId("customerId", "CustomerId") ??
        Number(
            user?.customerId ??
            user?.CustomerId ??
            customer?.customerId ??
            customer?.CustomerId ??
            0
        );

    return {
        sellerId: sellerId > 0 ? sellerId : null,
        customerId: customerId > 0 ? customerId : null
    };
};

// =========================================================
// STATUS CHIP
// =========================================================

const InventoryStatusChip = ({ status }) => {
    const normalized = String(status || "").toLowerCase();

    let color = "default";

    if (normalized.includes("out")) {
        color = "error";
    } else if (normalized.includes("low")) {
        color = "warning";
    } else if (
        normalized.includes("in stock") ||
        normalized === "available"
    ) {
        color = "success";
    }

    return (
        <Chip
            label={status || "Unknown"}
            color={color}
            size="small"
            variant="outlined"
        />
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ShelfwiseInventoriesList = () => {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // =====================================================
    // FETCH ALL INVENTORY
    // GET /api/ShelfwiseInventory/all
    // =====================================================

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${API_URL}/all`);

            const records = normalizeInventoryResponse(
                response.data
            );

            setInventory(records);
        } catch (err) {
            console.error(
                "Error fetching shelfwise inventory:",
                err
            );

            setInventory([]);

            setError(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.message ||
                "Failed to load shelfwise inventory."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // =====================================================
    // SEARCH AND FILTER
    // =====================================================

    const filteredInventory = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        return inventory.filter((item) => {
            const itemName = String(
                getField(item, "itemName", "ItemName")
            ).toLowerCase();

            const itemCode = String(
                getField(item, "itemCode", "ItemCode")
            ).toLowerCase();

            const categoryName = String(
                getField(item, "categoryName", "CategoryName")
            ).toLowerCase();

            const warehouseName = String(
                getField(item, "warehouseName", "WarehouseName")
            ).toLowerCase();

            const shelfName = String(
                getField(item, "shelfName", "ShelfName")
            ).toLowerCase();

            const shelfCode = String(
                getField(item, "shelfCode", "ShelfCode")
            ).toLowerCase();

            const status = getInventoryStatus(item);

            const matchesSearch =
                !search ||
                itemName.includes(search) ||
                itemCode.includes(search) ||
                categoryName.includes(search) ||
                warehouseName.includes(search) ||
                shelfName.includes(search) ||
                shelfCode.includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [inventory, searchText, statusFilter]);

    useEffect(() => {
        setPage(0);
    }, [searchText, statusFilter]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        let totalQuantity = 0;
        let totalAvailable = 0;
        let lowStock = 0;
        let outOfStock = 0;

        inventory.forEach((item) => {
            totalQuantity += Number(
                getField(item, "quantity", "Quantity") || 0
            );

            totalAvailable += Number(
                getField(
                    item,
                    "availableQuantity",
                    "AvailableQuantity"
                ) || 0
            );

            const status = getInventoryStatus(item).toLowerCase();

            if (status.includes("low")) {
                lowStock++;
            }

            if (status.includes("out")) {
                outOfStock++;
            }
        });

        return {
            totalRecords: inventory.length,
            totalQuantity,
            totalAvailable,
            lowStock,
            outOfStock
        };
    }, [inventory]);

    // =====================================================
    // VIEW DETAILS
    // =====================================================

    const handleView = (id) => {
        if (!id) {
            setError("Inventory ID is missing.");
            return;
        }

        navigate(
            `/shelfwise-inventories/details/${encodeURIComponent(id)}`
        );
    };

    // =====================================================
    // EDIT INVENTORY
    // =====================================================

    const handleEdit = (id) => {
        if (!id) {
            setError("Inventory ID is missing.");
            return;
        }

        navigate(
            `/shelfwise-inventories/${encodeURIComponent(id)}/edit`
        );
    };

    // =====================================================
    // DELETE INVENTORY
    // DELETE /api/ShelfwiseInventory/{id}/seller/{sellerId}/customer/{customerId}
    // =====================================================

    const handleDelete = async (item) => {
        const id = getInventoryId(item);

        if (!id) {
            setError("Cannot delete: inventory ID is missing.");
            return;
        }

        const { sellerId, customerId } = getSellerCustomerIds();

        if (!sellerId || !customerId) {
            setError(
                "Seller ID or Customer ID is missing from localStorage. " +
                "Please check how your login code stores these IDs."
            );
            return;
        }

        const itemName = getField(
            item,
            "itemName",
            "ItemName"
        ) || `Inventory #${id}`;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${itemName}"?`
        );

        if (!confirmed) return;

        setDeletingId(id);
        setError("");
        setSuccess("");

        try {
            await axios.delete(
                `${API_URL}/${encodeURIComponent(id)}` +
                `/seller/${sellerId}/customer/${customerId}`
            );

            setSuccess("Inventory deleted successfully.");

            await fetchInventory();
        } catch (err) {
            console.error("Error deleting inventory:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.message ||
                "Failed to delete inventory."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExport = () => {
        const headers = [
            "Inventory ID",
            "Item Name",
            "Item Code",
            "Category",
            "Warehouse",
            "Shelf Name",
            "Shelf Code",
            "Quantity",
            "Available Quantity",
            "Minimum Stock",
            "Maximum Stock",
            "Unit",
            "Status"
        ];

        const escapeCsv = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const rows = filteredInventory.map((item) => [
            getInventoryId(item),
            getField(item, "itemName", "ItemName"),
            getField(item, "itemCode", "ItemCode"),
            getField(item, "categoryName", "CategoryName"),
            getField(item, "warehouseName", "WarehouseName"),
            getField(item, "shelfName", "ShelfName"),
            getField(item, "shelfCode", "ShelfCode"),
            getField(item, "quantity", "Quantity"),
            getField(
                item,
                "availableQuantity",
                "AvailableQuantity"
            ),
            getField(item, "minimumStock", "MinimumStock"),
            getField(item, "maximumStock", "MaximumStock"),
            getField(item, "unit", "Unit"),
            getInventoryStatus(item)
        ]);

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(","))
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "shelfwise-inventory.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedInventory = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredInventory.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredInventory, page, rowsPerPage]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* PAGE HEADER */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Shelfwise Inventory
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage item quantities, warehouses, and shelf locations.
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleExport}
                        disabled={filteredInventory.length === 0}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchInventory}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            navigate("/shelfwise-inventories/create")
                        }
                    >
                        Add Inventory
                    </Button>
                </Stack>
            </Stack>

            {/* ALERTS */}
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2 }}
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

            {/* STATISTICS */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    {
                        label: "Inventory Records",
                        value: statistics.totalRecords
                    },
                    {
                        label: "Total Quantity",
                        value: statistics.totalQuantity
                    },
                    {
                        label: "Available Quantity",
                        value: statistics.totalAvailable
                    },
                    {
                        label: "Low Stock Items",
                        value: statistics.lowStock
                    },
                    {
                        label: "Out of Stock",
                        value: statistics.outOfStock
                    }
                ].map((stat) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.label}>
                        <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {stat.label}
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ mt: 1 }}
                                >
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* SEARCH AND FILTERS */}
            <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3 }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search inventory"
                            placeholder="Item name, item code, category, warehouse, or shelf..."
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(event.target.value)
                            }
                            InputProps={{
                                startAdornment: (
                                    <Search
                                        sx={{
                                            mr: 1,
                                            color: "text.secondary"
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="inventory-status-label">
                                Status
                            </InputLabel>

                            <Select
                                labelId="inventory-status-label"
                                value={statusFilter}
                                label="Status"
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <MenuItem value="All">All Statuses</MenuItem>
                                <MenuItem value="In Stock">In Stock</MenuItem>
                                <MenuItem value="Low Stock">Low Stock</MenuItem>
                                <MenuItem value="Out of Stock">
                                    Out of Stock
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* INVENTORY TABLE */}
            <TableContainer
                component={Paper}
                variant="outlined"
            >
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Inventory List
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {filteredInventory.length} record(s)
                    </Typography>
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Item Code</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Warehouse</TableCell>
                                <TableCell>Shelf</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Available</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginatedInventory.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {inventory.length === 0
                                                ? "No shelfwise inventory records found."
                                                : "No records match your search or filter."}
                                        </Typography>

                                        {inventory.length === 0 && (
                                            <Button
                                                sx={{ mt: 2 }}
                                                variant="contained"
                                                startIcon={<Add />}
                                                onClick={() =>
                                                    navigate(
                                                        "/shelfwise-inventories/create"
                                                    )
                                                }
                                            >
                                                Add Inventory
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedInventory.map((item, index) => {
                                    const id = getInventoryId(item);

                                    return (
                                        <TableRow
                                            hover
                                            key={id || index}
                                        >
                                            <TableCell>
                                                {id || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {getField(
                                                    item,
                                                    "itemName",
                                                    "ItemName"
                                                ) || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {getField(
                                                    item,
                                                    "itemCode",
                                                    "ItemCode"
                                                ) || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {getField(
                                                    item,
                                                    "categoryName",
                                                    "CategoryName"
                                                ) || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {getField(
                                                    item,
                                                    "warehouseName",
                                                    "WarehouseName"
                                                ) || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {[
                                                    getField(
                                                        item,
                                                        "shelfName",
                                                        "ShelfName"
                                                    ),
                                                    getField(
                                                        item,
                                                        "shelfCode",
                                                        "ShelfCode"
                                                    )
                                                ]
                                                    .filter(Boolean)
                                                    .join(" / ") || "—"}
                                            </TableCell>

                                            <TableCell align="right">
                                                {getField(
                                                    item,
                                                    "quantity",
                                                    "Quantity"
                                                ) || 0}
                                            </TableCell>

                                            <TableCell align="right">
                                                {getField(
                                                    item,
                                                    "availableQuantity",
                                                    "AvailableQuantity"
                                                ) || 0}
                                            </TableCell>

                                            <TableCell>
                                                <InventoryStatusChip
                                                    status={getInventoryStatus(item)}
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Stack
                                                    direction="row"
                                                    spacing={0}
                                                    justifyContent="center"
                                                >
                                                    <Tooltip title="View details">
                                                        <span>
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                disabled={!id}
                                                                onClick={() =>
                                                                    handleView(id)
                                                                }
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>

                                                    <Tooltip title="Edit inventory">
                                                        <span>
                                                            <IconButton
                                                                color="secondary"
                                                                size="small"
                                                                disabled={!id}
                                                                onClick={() =>
                                                                    handleEdit(id)
                                                                }
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>

                                                    <Tooltip title="Delete inventory">
                                                        <span>
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                disabled={
                                                                    !id ||
                                                                    deletingId === id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(item)
                                                                }
                                                            >
                                                                {deletingId === id ? (
                                                                    <CircularProgress
                                                                        size={18}
                                                                    />
                                                                ) : (
                                                                    <Delete fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                )}

                <TablePagination
                    component="div"
                    count={filteredInventory.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
            </TableContainer>
        </Container>
    );
};

export default ShelfwiseInventoriesList;