
import React, {
    useEffect,
    useMemo,
    useState,
    useCallback
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    IconButton
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

import ShelfwiseInventoryToolbar from "./ShelfwiseInventoryToolbar";
import ShelfwiseInventoryStatistics from "./ShelfwiseInventoryStatistics";
import ShelfwiseInventorySearch from "./ShelfwiseInventorySearch";
import ShelfwiseInventoryFilters from "./ShelfwiseInventoryFilters";
import ShelfwiseInventoryCard from "./ShelfwiseInventoryCard";
import ShelfwiseInventoryPagination from "./ShelfwiseInventoryPagination";
import ShelfwiseInventoryCreate from "./ShelfwiseInventoryCreate";
import ShelfwiseInventoryEdit from "./ShelfwiseInventoryEdit";
import ShelfwiseInventoryDetails from "./ShelfwiseInventoryDetails";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "/api/ShelfwiseInventory";

/* =========================================================
   GET FIELD VALUE - CAMELCASE / PASCALCASE
========================================================= */

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   GET INVENTORY ID
========================================================= */

const getInventoryId = (record) =>
    getField(
        record,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "inventoryId",
        "InventoryId",
        "id",
        "Id"
    );

/* =========================================================
   API ERROR MESSAGE
========================================================= */

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data && typeof data === "object") {
        return (
            data.message ||
            data.Message ||
            data.title ||
            data.Title ||
            data.error ||
            data.Error ||
            fallback
        );
    }

    return error?.message || fallback;
};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeInventoryResponse = (data) => {
    if (Array.isArray(data)) return data;

    const possibleArrays = [
        data?.data,
        data?.Data,
        data?.items,
        data?.Items,
        data?.records,
        data?.Records,
        data?.$values
    ];

    return possibleArrays.find(Array.isArray) || [];
};

/* =========================================================
   INVENTORY STATUS
========================================================= */

const getInventoryStatus = (record) => {
    const available = Number(
        getField(
            record,
            "availableQuantity",
            "AvailableQuantity"
        )
    ) || 0;

    const minimum = Number(
        getField(record, "minimumStock", "MinimumStock")
    ) || 0;

    const rawStatus = String(
        getField(record, "status", "Status")
    ).trim().toLowerCase();

    if (rawStatus) {
        if (
            rawStatus === "out of stock" ||
            rawStatus === "outofstock"
        ) {
            return "Out of Stock";
        }

        if (
            rawStatus === "low stock" ||
            rawStatus === "lowstock"
        ) {
            return "Low Stock";
        }

        return rawStatus.replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
    }

    if (available <= 0) return "Out of Stock";

    if (minimum > 0 && available <= minimum) {
        return "Low Stock";
    }

    return "Available";
};

/* =========================================================
   STATUS CHIP
========================================================= */

const InventoryStatusChip = ({ status }) => {
    const normalized = String(status || "").toLowerCase();

    let color = "success";

    if (
        normalized.includes("out of stock") ||
        normalized.includes("outofstock")
    ) {
        color = "error";
    } else if (
        normalized.includes("low stock") ||
        normalized.includes("lowstock")
    ) {
        color = "warning";
    } else if (
        normalized.includes("inactive") ||
        normalized.includes("blocked")
    ) {
        color = "default";
    }

    return (
        <Chip
            label={status || "Available"}
            color={color}
            size="small"
            variant="outlined"
        />
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ShelfwiseInventoriesList = () => {
    const navigate = useNavigate();
    /* =====================================================
       STATE
    ===================================================== */

    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [statusFilter, setStatusFilter] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        warehouseId: "",
        shelfId: "",
        categoryName: "",
        status: "",
        stockLevel: ""
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const [viewMode, setViewMode] = useState("card");

    const [editOpen, setEditOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedInventory, setSelectedInventory] =
        useState(null);

    /* =====================================================
       FETCH ALL INVENTORY
    ===================================================== */

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL);

            const records = normalizeInventoryResponse(
                response.data
            );

            setInventory(records);
        } catch (err) {
            console.error(
                "GET SHELFWISE INVENTORY ERROR:",
                err.response?.data || err.message
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to load shelfwise inventory."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    /* =====================================================
       SEARCH AND FILTER INVENTORY
    ===================================================== */

    const filteredInventory = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return inventory.filter((record) => {
            const itemName = String(
                getField(record, "itemName", "ItemName")
            ).toLowerCase();

            const itemCode = String(
                getField(record, "itemCode", "ItemCode")
            ).toLowerCase();

            const shelfName = String(
                getField(record, "shelfName", "ShelfName")
            ).toLowerCase();

            const shelfCode = String(
                getField(record, "shelfCode", "ShelfCode")
            ).toLowerCase();

            const warehouseName = String(
                getField(
                    record,
                    "warehouseName",
                    "WarehouseName"
                )
            ).toLowerCase();

            const categoryName = String(
                getField(
                    record,
                    "categoryName",
                    "CategoryName"
                )
            ).toLowerCase();

            const available = Number(
                getField(
                    record,
                    "availableQuantity",
                    "AvailableQuantity"
                )
            ) || 0;

            const minimum = Number(
                getField(record, "minimumStock", "MinimumStock")
            ) || 0;

            const status = getInventoryStatus(record).toLowerCase();

            /* Search field matching */

            let matchesSearch = true;

            if (term) {
                switch (searchField) {
                    case "itemName":
                        matchesSearch = itemName.includes(term);
                        break;

                    case "itemCode":
                        matchesSearch = itemCode.includes(term);
                        break;

                    case "shelfName":
                        matchesSearch = shelfName.includes(term);
                        break;

                    case "shelfCode":
                        matchesSearch = shelfCode.includes(term);
                        break;

                    case "warehouseName":
                        matchesSearch =
                            warehouseName.includes(term);
                        break;

                    case "categoryName":
                        matchesSearch = categoryName.includes(term);
                        break;

                    default:
                        matchesSearch = [
                            itemName,
                            itemCode,
                            shelfName,
                            shelfCode,
                            warehouseName,
                            categoryName
                        ].some((value) => value.includes(term));
                }
            }

            /* Status filter */

            const selectedStatus = String(
                filters.status || statusFilter
            ).toLowerCase();

            const matchesStatus =
                !selectedStatus ||
                status === selectedStatus;

            /* Warehouse filter */

            const warehouseId = String(
                getField(record, "warehouseId", "WarehouseId")
            );

            const matchesWarehouse =
                !filters.warehouseId ||
                warehouseId === String(filters.warehouseId);

            /* Shelf filter */

            const shelfId = String(
                getField(record, "shelfId", "ShelfId")
            );

            const matchesShelf =
                !filters.shelfId ||
                shelfId === String(filters.shelfId);

            /* Category filter */

            const matchesCategory =
                !filters.categoryName ||
                categoryName === String(
                    filters.categoryName
                ).toLowerCase();

            /* Stock level filter */

            let matchesStockLevel = true;

            if (filters.stockLevel === "low") {
                matchesStockLevel =
                    available > 0 &&
                    minimum > 0 &&
                    available <= minimum;
            } else if (filters.stockLevel === "out") {
                matchesStockLevel = available <= 0;
            } else if (filters.stockLevel === "available") {
                matchesStockLevel =
                    available > 0 &&
                    !(minimum > 0 && available <= minimum);
            }

            return (
                matchesSearch &&
                matchesStatus &&
                matchesWarehouse &&
                matchesShelf &&
                matchesCategory &&
                matchesStockLevel
            );
        });
    }, [
        inventory,
        searchTerm,
        searchField,
        statusFilter,
        filters
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedInventory = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredInventory.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredInventory, page, rowsPerPage]);

    useEffect(() => {
        const lastPage = Math.max(
            0,
            Math.ceil(
                filteredInventory.length / rowsPerPage
            ) - 1
        );

        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [filteredInventory.length, rowsPerPage, page]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        return {
            totalRecords: inventory.length,

            totalQuantity: inventory.reduce(
                (sum, record) =>
                    sum +
                    (Number(
                        getField(record, "quantity", "Quantity")
                    ) || 0),
                0
            ),

            availableQuantity: inventory.reduce(
                (sum, record) =>
                    sum +
                    (Number(
                        getField(
                            record,
                            "availableQuantity",
                            "AvailableQuantity"
                        )
                    ) || 0),
                0
            ),

            reservedQuantity: inventory.reduce(
                (sum, record) =>
                    sum +
                    (Number(
                        getField(
                            record,
                            "reservedQuantity",
                            "ReservedQuantity"
                        )
                    ) || 0),
                0
            ),

            lowStock: inventory.filter((record) => {
                const available = Number(
                    getField(
                        record,
                        "availableQuantity",
                        "AvailableQuantity"
                    )
                ) || 0;

                const minimum = Number(
                    getField(
                        record,
                        "minimumStock",
                        "MinimumStock"
                    )
                ) || 0;

                return (
                    available > 0 &&
                    minimum > 0 &&
                    available <= minimum
                );
            }).length,

            outOfStock: inventory.filter((record) => {
                const available = Number(
                    getField(
                        record,
                        "availableQuantity",
                        "AvailableQuantity"
                    )
                ) || 0;

                return available <= 0;
            }).length
        };
    }, [inventory]);

    /* =====================================================
       WAREHOUSE FILTER OPTIONS
    ===================================================== */

    const warehouses = useMemo(() => {
        const unique = new Map();

        inventory.forEach((record) => {
            const id = getField(
                record,
                "warehouseId",
                "WarehouseId"
            );

            const name = getField(
                record,
                "warehouseName",
                "WarehouseName"
            );

            if (id !== "" && name) {
                unique.set(String(id), {
                    warehouseId: id,
                    warehouseName: name
                });
            }
        });

        return Array.from(unique.values());
    }, [inventory]);

    /* =====================================================
       SHELF FILTER OPTIONS
    ===================================================== */

    const shelves = useMemo(() => {
        const unique = new Map();

        inventory.forEach((record) => {
            const id = getField(
                record,
                "shelfId",
                "ShelfId"
            );

            const name = getField(
                record,
                "shelfName",
                "ShelfName"
            );

            if (id !== "" && name) {
                unique.set(String(id), {
                    shelfId: id,
                    shelfName: name
                });
            }
        });

        return Array.from(unique.values());
    }, [inventory]);

    /* =====================================================
       CATEGORY FILTER OPTIONS
    ===================================================== */

    const categories = useMemo(() => {
        return [
            ...new Set(
                inventory
                    .map((record) =>
                        getField(
                            record,
                            "categoryName",
                            "CategoryName"
                        )
                    )
                    .filter(Boolean)
            )
        ];
    }, [inventory]);

    /* =====================================================
       FILTER HANDLERS
    ===================================================== */

    const handleFilterChange = (name, value) => {
        setFilters((previous) => ({
            ...previous,
            [name]: value
        }));

        setPage(0);
    };

    const handleApplyFilters = () => {
        setPage(0);
    };

    const handleResetFilters = () => {
        setFilters({
            warehouseId: "",
            shelfId: "",
            categoryName: "",
            status: "",
            stockLevel: ""
        });

        setStatusFilter("");
        setSearchTerm("");
        setSearchField("all");
        setPage(0);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchField("all");
        setStatusFilter("");
        setPage(0);
    };


    /* =====================================================
       EDIT INVENTORY
    ===================================================== */

    const handleEdit = async (payload) => {
        const id = getInventoryId(selectedInventory);

        if (id === "" || id === null || id === undefined) {
            setError(
                "Cannot update inventory: record ID is missing."
            );
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await axios.put(
                `${API_URL}/${encodeURIComponent(id)}`,
                payload
            );

            setEditOpen(false);
            setSelectedInventory(null);

            setSuccess(
                "Inventory record updated successfully."
            );

            await fetchInventory();
        } catch (err) {
            console.error(
                "UPDATE INVENTORY ERROR:",
                err.response?.data || err.message
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update inventory record."
                )
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       DELETE INVENTORY
    ===================================================== */

    const handleDelete = async () => {
        const id = getInventoryId(selectedInventory);

        if (id === "" || id === null || id === undefined) {
            setError(
                "Cannot delete inventory: record ID is missing."
            );
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await axios.delete(
                `${API_URL}/${encodeURIComponent(id)}`
            );

            setDeleteOpen(false);
            setSelectedInventory(null);

            setSuccess(
                "Inventory record deleted successfully."
            );

            await fetchInventory();
        } catch (err) {
            console.error(
                "DELETE INVENTORY ERROR:",
                err.response?.data || err.message
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to delete inventory record."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       OPEN ACTIONS
    ===================================================== */

    const openView = (record) => {
        setSelectedInventory(record);
        setDetailsOpen(true);
    };

    const openEdit = (record) => {
        setSelectedInventory(record);
        setEditOpen(true);
    };

    const openDelete = (record) => {
        setSelectedInventory(record);
        setDeleteOpen(true);
    };

    /* =====================================================
       EXPORT CSV
    ===================================================== */

    const handleExport = () => {
        if (!filteredInventory.length) {
            setError(
                "There are no inventory records to export."
            );
            return;
        }

        const columns = [
            ["Inventory ID", (r) => getInventoryId(r)],
            ["Item Name", (r) => getField(r, "itemName", "ItemName")],
            ["Item Code", (r) => getField(r, "itemCode", "ItemCode")],
            ["Warehouse", (r) => getField(r, "warehouseName", "WarehouseName")],
            ["Warehouse ID", (r) => getField(r, "warehouseId", "WarehouseId")],
            ["Shelf", (r) => getField(r, "shelfName", "ShelfName")],
            ["Shelf Code", (r) => getField(r, "shelfCode", "ShelfCode")],
            ["Shelf ID", (r) => getField(r, "shelfId", "ShelfId")],
            ["Category", (r) => getField(r, "categoryName", "CategoryName")],
            ["Quantity", (r) => getField(r, "quantity", "Quantity")],
            ["Available Quantity", (r) => getField(r, "availableQuantity", "AvailableQuantity")],
            ["Reserved Quantity", (r) => getField(r, "reservedQuantity", "ReservedQuantity")],
            ["Minimum Stock", (r) => getField(r, "minimumStock", "MinimumStock")],
            ["Maximum Stock", (r) => getField(r, "maximumStock", "MaximumStock")],
            ["Unit", (r) => getField(r, "unit", "Unit")],
            ["Status", (r) => getInventoryStatus(r)]
        ];

        const escapeCsv = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csv = [
            columns
                .map(([label]) => escapeCsv(label))
                .join(","),

            ...filteredInventory.map((record) =>
                columns
                    .map(([, getter]) =>
                        escapeCsv(getter(record))
                    )
                    .join(",")
            )
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF", csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "shelfwise-inventories.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>

            {/* =================================================
                TOOLBAR - ONLY PAGE HEADER
            ================================================= */}
<ShelfwiseInventoryToolbar
    totalRecords={statistics.totalRecords}
    totalQuantity={statistics.totalQuantity}
    loading={loading}
    onAdd={() => navigate("/shelfwise-inventories/create")}
    onRefresh={fetchInventory}
    onExport={handleExport}
    onToggleFilters={() => setShowFilters((value) => !value)}
    onToggleView={() => setViewMode((value) => value === "card" ? "table" : "card")}
    showFilters={showFilters}
    viewMode={viewMode}
    addButtonLabel="ADD INVENTORY"
/>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <Box sx={{ mt: 3 }}>
                <ShelfwiseInventoryStatistics
                    inventory={inventory}
                    statistics={statistics}
                    loading={loading}
                />
            </Box>

            {/* =================================================
                SEARCH
            ================================================= */}

            <Box sx={{ mt: 3 }}>
                <ShelfwiseInventorySearch
                    searchTerm={searchTerm}
                    searchField={searchField}
                    status={statusFilter}
                    onSearchChange={(value) => {
                        setSearchTerm(value);
                        setPage(0);
                    }}
                    onSearchFieldChange={(value) => {
                        setSearchField(value);
                        setPage(0);
                    }}
                    onStatusChange={(value) => {
                        setStatusFilter(value);
                        setPage(0);
                    }}
                    onClear={handleClearSearch}
                    onToggleFilters={() =>
                        setShowFilters((value) => !value)
                    }
                    showFilters={showFilters}
                    loading={loading}
                />
            </Box>

            {/* =================================================
                FILTERS
            ================================================= */}

            {showFilters && (
                <Box sx={{ mt: 2 }}>
                    <ShelfwiseInventoryFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                        warehouses={warehouses}
                        shelves={shelves}
                        categories={categories}
                        loading={loading}
                        showFilters={showFilters}
                    />
                </Box>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mt: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                RESULTS SUMMARY
            ================================================= */}

            <Box
                sx={{
                    mt: 3,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing{" "}
                    {filteredInventory.length === 0
                        ? 0
                        : page * rowsPerPage + 1}
                    {" - "}
                    {Math.min(
                        (page + 1) * rowsPerPage,
                        filteredInventory.length
                    )}
                    {" of "}
                    {filteredInventory.length} records
                </Typography>

                {(searchTerm ||
                    statusFilter ||
                    Object.values(filters).some(Boolean)) && (
                    <Button
                        size="small"
                        onClick={handleResetFilters}
                    >
                        Clear all filters
                    </Button>
                )}
            </Box>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && inventory.length === 0 ? (
                <Box
                    sx={{
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading shelfwise inventory...
                    </Typography>
                </Box>
            ) : filteredInventory.length === 0 ? (
                /* =================================================
                   EMPTY STATE
                ================================================= */

                <Box
                    sx={{
                        py: 8,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        No inventory records found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        Try changing your search or filters,
                        or create a new inventory record.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => setCreateOpen(true)}
                    >
                        Add Inventory
                    </Button>
                </Box>
            ) : (
                <>
                    {/* =============================================
                        CARD VIEW
                    ============================================= */}

                    {viewMode === "card" && (
                        <Grid container spacing={2}>
                            {paginatedInventory.map(
                                (record, index) => {
                                    const id =
                                        getInventoryId(record);

                                    return (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            lg={4}
                                            xl={3}
                                            key={
                                                id !== ""
                                                    ? id
                                                    : index
                                            }
                                        >
                                            <ShelfwiseInventoryCard
                                                inventory={record}
                                                loading={loading}
                                                onView={openView}
                                                onEdit={openEdit}
                                                onDelete={openDelete}
                                            />
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                    )}

                    {/* =============================================
                        TABLE VIEW
                    ============================================= */}

                    {viewMode === "table" && (
                        <TableContainer
                            component={Paper}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            <Table
                                size="small"
                                sx={{ minWidth: 950 }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <strong>Item Name</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Item Code</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Warehouse</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Shelf</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Category</strong>
                                        </TableCell>

                                        <TableCell align="right">
                                            <strong>Quantity</strong>
                                        </TableCell>

                                        <TableCell align="right">
                                            <strong>Available</strong>
                                        </TableCell>

                                        <TableCell align="right">
                                            <strong>Reserved</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Status</strong>
                                        </TableCell>

                                        <TableCell align="center">
                                            <strong>Actions</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedInventory.map(
                                        (record, index) => {
                                            const id =
                                                getInventoryId(record);

                                            return (
                                                <TableRow
                                                    hover
                                                    key={
                                                        id !== ""
                                                            ? id
                                                            : index
                                                    }
                                                >
                                                    <TableCell>
                                                        {getField(
                                                            record,
                                                            "itemName",
                                                            "ItemName"
                                                        ) || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {getField(
                                                            record,
                                                            "itemCode",
                                                            "ItemCode"
                                                        ) || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {getField(
                                                            record,
                                                            "warehouseName",
                                                            "WarehouseName"
                                                        ) || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {getField(
                                                            record,
                                                            "shelfName",
                                                            "ShelfName"
                                                        ) || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {getField(
                                                            record,
                                                            "categoryName",
                                                            "CategoryName"
                                                        ) || "-"}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {Number(
                                                            getField(
                                                                record,
                                                                "quantity",
                                                                "Quantity"
                                                            )
                                                        ) || 0}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {Number(
                                                            getField(
                                                                record,
                                                                "availableQuantity",
                                                                "AvailableQuantity"
                                                            )
                                                        ) || 0}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {Number(
                                                            getField(
                                                                record,
                                                                "reservedQuantity",
                                                                "ReservedQuantity"
                                                            )
                                                        ) || 0}
                                                    </TableCell>

                                                    <TableCell>
                                                        <InventoryStatusChip
                                                            status={getInventoryStatus(
                                                                record
                                                            )}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <Tooltip title="View details">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        openView(
                                                                            record
                                                                        )
                                                                    }
                                                                >
                                                                    <Visibility fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Edit inventory">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        openEdit(
                                                                            record
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete inventory">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() =>
                                                                        openDelete(
                                                                            record
                                                                        )
                                                                    }
                                                                >
                                                                    <Delete fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* =============================================
                        PAGINATION
                    ============================================= */}

                    <Box sx={{ mt: 3 }}>
                        <ShelfwiseInventoryPagination
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalRecords={filteredInventory.length}
                            onPageChange={(newPage) =>
                                setPage(newPage)
                            }
                            onRowsPerPageChange={(value) => {
                                setRowsPerPage(Number(value));
                                setPage(0);
                            }}
                            loading={loading}
                        />
                    </Box>
                </>
            )}

            {/* =================================================
                CREATE DIALOG
            ================================================= */}

          

            {/* =================================================
                EDIT DIALOG
            ================================================= */}

            <ShelfwiseInventoryEdit
                open={editOpen}
                inventory={selectedInventory}
                onClose={() => {
                    if (!submitting) {
                        setEditOpen(false);
                        setSelectedInventory(null);
                    }
                }}
                onSubmit={handleEdit}
                submitting={submitting}
            />

            {/* =================================================
                DETAILS DIALOG
            ================================================= */}

            <ShelfwiseInventoryDetails
                open={detailsOpen}
                inventory={selectedInventory}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedInventory(null);
                }}
                onEdit={(record) => {
                    setDetailsOpen(false);
                    openEdit(record);
                }}
            />

            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!submitting) {
                        setDeleteOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Delete Inventory
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>
                            {getField(
                                selectedInventory,
                                "itemName",
                                "ItemName"
                            ) || "this inventory record"}
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={submitting}
                    >
                        {submitting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =================================================
                SUCCESS NOTIFICATION
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={() => setSuccess("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ShelfwiseInventoriesList;