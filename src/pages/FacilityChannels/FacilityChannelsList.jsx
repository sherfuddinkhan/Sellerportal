import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Add,
    Close,
    Delete,
    Edit,
    Refresh,
    Search,
    Visibility
} from "@mui/icons-material";

import FacilityChannelToolbar from "./FacilityChannelToolbar";
import FacilityChannelStatistics from "./FacilityChannelStatistics";

const API_BASE_URL = "http://localhost:5000/api/FacilityChannel";

/* =====================================================
   HELPERS
===================================================== */

const extractRecords = (data) => {
    if (Array.isArray(data)) return data;

    for (const key of ["data", "items", "records", "result", "value"]) {
        if (Array.isArray(data?.[key])) return data[key];
    }

    return [];
};

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) return data;

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(", ");
    }

    return (
        data?.message ||
        data?.title ||
        data?.detail ||
        error?.message ||
        fallback
    );
};

const getValue = (item, camelCase, pascalCase) =>
    item?.[camelCase] ?? item?.[pascalCase];

const getRecordId = (item) =>
    getValue(item, "id", "Id") ??
    getValue(item, "facilityChannelId", "FacilityChannelId");

const getQuantity = (item) =>
    Number(getValue(item, "sellableQuantity", "SellableQuantity") ?? 0);

const getSku = (item) =>
    getValue(item, "skuCode", "SkuCode") ?? "";

const getFacilityCode = (item) =>
    getValue(item, "facilityCode", "FacilityCode") ?? "";

const getChannelCode = (item) =>
    getValue(item, "channelCode", "ChannelCode") ?? "";

/* =====================================================
   MAIN COMPONENT
===================================================== */

const FacilityChannelsList = ({ apiBaseUrl = API_BASE_URL }) => {
    const navigate = useNavigate();

    const [facilityChannels, setFacilityChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [facilityFilter, setFacilityFilter] = useState("All");
    const [channelFilter, setChannelFilter] = useState("All");

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);

    /* =====================================================
       FETCH RECORDS
    ===================================================== */

    const fetchFacilityChannels = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${apiBaseUrl}/all`);
            setFacilityChannels(extractRecords(response.data));
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Failed to load facility channel inventory."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        fetchFacilityChannels();
    }, [fetchFacilityChannels]);

    /* =====================================================
       FILTER OPTIONS
    ===================================================== */

    const facilityOptions = useMemo(
        () => [
            ...new Set(
                facilityChannels.map(getFacilityCode).filter(Boolean)
            )
        ].sort(),
        [facilityChannels]
    );

    const channelOptions = useMemo(
        () => [
            ...new Set(
                facilityChannels.map(getChannelCode).filter(Boolean)
            )
        ].sort(),
        [facilityChannels]
    );

    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredChannels = useMemo(() => {
        const term = search.trim().toLowerCase();

        return facilityChannels.filter((item) => {
            const values = [
                getRecordId(item),
                getValue(item, "sellerId", "SellerId"),
                getValue(item, "customerId", "CustomerId"),
                getValue(item, "productId", "ProductId"),
                getSku(item),
                getFacilityCode(item),
                getChannelCode(item),
                getQuantity(item)
            ];

            const matchesSearch =
                !term ||
                values.some((value) =>
                    String(value ?? "").toLowerCase().includes(term)
                );

            const matchesFacility =
                facilityFilter === "All" ||
                getFacilityCode(item) === facilityFilter;

            const matchesChannel =
                channelFilter === "All" ||
                getChannelCode(item) === channelFilter;

            return matchesSearch && matchesFacility && matchesChannel;
        });
    }, [
        facilityChannels,
        search,
        facilityFilter,
        channelFilter
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredChannels.length / rowsPerPage)
    );

    const paginatedChannels = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredChannels.slice(start, start + rowsPerPage);
    }, [filteredChannels, page, rowsPerPage]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    /* =====================================================
       CREATE — FULL PAGE
    ===================================================== */

    const handleOpenCreate = () => {
        navigate("/facility-channels/create");
    };

    /* =====================================================
       VIEW — FULL PAGE
    ===================================================== */

    const handleView = (item) => {
        const id = getRecordId(item);

        if (id === null || id === undefined || id === "") {
            setError("Facility channel ID was not found.");
            return;
        }

        navigate(`/facility-channels/details/${id}`, {
            state: { facilityChannel: item }
        });
    };

    /* =====================================================
       EDIT — FULL PAGE
    ===================================================== */

    const handleEdit = (item) => {
        const id = getRecordId(item);

        if (id === null || id === undefined || id === "") {
            setError("Facility channel ID was not found.");
            return;
        }

        navigate(`/facility-channels/${id}/edit`, {
            state: { facilityChannel: item }
        });
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleOpenDelete = (item) => {
        setSelectedChannel(item);
        setError("");
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        const id = getRecordId(selectedChannel);

        if (id === null || id === undefined || id === "") {
            setError("Facility channel ID was not found.");
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await axios.delete(`${apiBaseUrl}/${encodeURIComponent(id)}`);

            setDeleteOpen(false);
            setSelectedChannel(null);
            setSuccess("Facility channel inventory deleted successfully.");

            await fetchFacilityChannels();
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Failed to delete facility channel inventory."
                )
            );
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearch("");
        setFacilityFilter("All");
        setChannelFilter("All");
        setPage(1);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            className="facility-channels-list"
            sx={{
                width: "100%",
                minWidth: 0,
                p: { xs: 1.5, sm: 2.5 }
            }}
        >
            <Stack spacing={3}>
                <FacilityChannelToolbar
                    title="Facility Channel Inventory"
                    subtitle="Manage sellable inventory by facility and sales channel"
                    onCreate={handleOpenCreate}
                    onRefresh={fetchFacilityChannels}
                    loading={loading}
                    showCreate
                    showRefresh
                    showExport={false}
                />

                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchFacilityChannels}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                <FacilityChannelStatistics
                    facilityChannels={facilityChannels}
                    loading={loading}
                />

                {/* SEARCH AND FILTERS */}

                <Box
                    sx={{
                        width: "100%",
                        p: { xs: 1.5, sm: 2 },
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search inventory"
                                placeholder="Search ID, SKU, facility, channel..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Facility"
                                value={facilityFilter}
                                onChange={(event) => {
                                    setFacilityFilter(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="All">All Facilities</MenuItem>

                                {facilityOptions.map((facility) => (
                                    <MenuItem key={facility} value={facility}>
                                        {facility}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Channel"
                                value={channelFilter}
                                onChange={(event) => {
                                    setChannelFilter(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="All">All Channels</MenuItem>

                                {channelOptions.map((channel) => (
                                    <MenuItem key={channel} value={channel}>
                                        {channel}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Rows per page"
                                value={rowsPerPage}
                                onChange={(event) => {
                                    setRowsPerPage(Number(event.target.value));
                                    setPage(1);
                                }}
                            >
                                {[5, 10, 25, 50].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                        sx={{ mt: 2 }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {filteredChannels.length} inventory record(s) found
                        </Typography>

                        <Button
                            size="small"
                            startIcon={<Refresh />}
                            onClick={handleClearFilters}
                            disabled={
                                !search &&
                                facilityFilter === "All" &&
                                channelFilter === "All"
                            }
                        >
                            Clear Filters
                        </Button>
                    </Stack>
                </Box>

                {/* TABLE */}

                <Box
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    {loading ? (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            spacing={2}
                            sx={{ py: 6 }}
                        >
                            <CircularProgress />
                            <Typography color="text.secondary">
                                Loading facility channel inventory...
                            </Typography>
                        </Stack>
                    ) : filteredChannels.length === 0 ? (
                        <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 2 }}>
                            <Typography variant="h6">
                                No inventory records found
                            </Typography>

                            <Typography
                                color="text.secondary"
                                variant="body2"
                                textAlign="center"
                            >
                                Change your filters or create a new inventory record.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleOpenCreate}
                            >
                                Create Inventory
                            </Button>
                        </Stack>
                    ) : (
                        <Box
                            component="table"
                            sx={{
                                width: "100%",
                                minWidth: 950,
                                borderCollapse: "collapse",
                                "& th, & td": {
                                    p: 1.5,
                                    textAlign: "left",
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    whiteSpace: "nowrap"
                                },
                                "& th": {
                                    bgcolor: "action.hover",
                                    fontWeight: 700
                                },
                                "& tbody tr:hover": {
                                    bgcolor: "action.hover"
                                }
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Seller ID</th>
                                    <th>Customer ID</th>
                                    <th>Product ID</th>
                                    <th>SKU Code</th>
                                    <th>Facility Code</th>
                                    <th>Channel Code</th>
                                    <th>Sellable Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedChannels.map((item, index) => (
                                    <tr
                                        key={
                                            getRecordId(item) ??
                                            `${getSku(item)}-${index}`
                                        }
                                    >
                                        <td>{getRecordId(item) ?? "-"}</td>
                                        <td>
                                            {getValue(item, "sellerId", "SellerId") ?? "-"}
                                        </td>
                                        <td>
                                            {getValue(item, "customerId", "CustomerId") ?? "-"}
                                        </td>
                                        <td>
                                            {getValue(item, "productId", "ProductId") ?? "-"}
                                        </td>
                                        <td>{getSku(item) || "-"}</td>
                                        <td>{getFacilityCode(item) || "-"}</td>
                                        <td>{getChannelCode(item) || "-"}</td>
                                        <td>
                                            <Typography
                                                fontWeight={700}
                                                color={
                                                    getQuantity(item) > 0
                                                        ? "success.main"
                                                        : "error.main"
                                                }
                                            >
                                                {getQuantity(item)}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title="View full page">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => handleView(item)}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit full page">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDelete(item)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Box>
                    )}
                </Box>

                {/* PAGINATION */}

                {!loading && filteredChannels.length > 0 && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Showing {(page - 1) * rowsPerPage + 1}
                            {" - "}
                            {Math.min(page * rowsPerPage, filteredChannels.length)}
                            {" of "}
                            {filteredChannels.length}
                        </Typography>

                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>
                )}
            </Stack>

            {/* DELETE CONFIRMATION DIALOG ONLY */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!deleting) setDeleteOpen(false);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Confirm Delete

                    <IconButton
                        aria-label="Close delete dialog"
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleting}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete inventory record{" "}
                        <strong>{getRecordId(selectedChannel) ?? ""}</strong>?
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        SKU: {getSku(selectedChannel) || "-"}
                        <br />
                        Facility: {getFacilityCode(selectedChannel) || "-"}
                        <br />
                        Channel: {getChannelCode(selectedChannel) || "-"}
                    </Typography>

                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={
                            deleting
                                ? <CircularProgress size={18} color="inherit" />
                                : <Delete />
                        }
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SUCCESS NOTIFICATION */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={() => setSuccess("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default FacilityChannelsList;
