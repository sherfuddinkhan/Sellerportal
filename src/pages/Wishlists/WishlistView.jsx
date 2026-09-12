import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Favorite,
    Refresh,
} from "@mui/icons-material";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

// Components
import WishlistToolbar from "./WishlistToolbar";
import WishlistTable from "./WishlistTable";
import WishlistList from "./WishlistList";

// =========================================================
// CONSTANTS
// =========================================================

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api`;
const WISHLIST_API = `${API_URL}/Wishlist`;

// =========================================================
// VIEW COMPONENT
// =========================================================

const WishlistView = () => {

    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [wishlists, setWishlists] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [selectedWishlists, setSelectedWishlists] =
        useState([]);

    const [viewMode, setViewMode] =
        useState("table");

    // =========================================================
    // LOAD WISHLISTS
    // =========================================================

    const loadWishlists = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "GET ALL WISHLISTS"
            );

            const response = await axios.get(
                WISHLIST_API,
                {
                    timeout: 30000,
                }
            );

            console.log(
                "WISHLISTS RESPONSE:",
                response.data
            );

            // -------------------------------------------------
            // ASP.NET normally returns an array.
            // Keep normalization defensive.
            // -------------------------------------------------

            let data = response.data;

            if (Array.isArray(data)) {
                data = data;
            } else if (
                Array.isArray(data?.data)
            ) {
                data = data.data;
            } else if (
                Array.isArray(data?.items)
            ) {
                data = data.items;
            } else if (
                Array.isArray(data?.wishlists)
            ) {
                data = data.wishlists;
            } else if (data) {
                data = [data];
            } else {
                data = [];
            }

            setWishlists(data);

            console.log(
                "NORMALIZED WISHLISTS:",
                data
            );

        } catch (err) {

            console.error(
                "Wishlist loading error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to load wishlists.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to load wishlists."
            );

        } finally {

            setLoading(false);

        }

    }, []);

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadWishlists();

    }, [loadWishlists]);

    // =========================================================
    // STATUS OPTIONS
    // =========================================================

    const statusOptions = useMemo(() => {

        const statuses = wishlists
            .map(
                (wishlist) =>
                    wishlist.status
            )
            .filter(Boolean)
            .map(
                (status) =>
                    String(status)
            );

        return [
            ...new Set(statuses),
        ];

    }, [wishlists]);

    // =========================================================
    // FILTER WISHLISTS
    // =========================================================

    const filteredWishlists = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();

        return wishlists.filter(
            (wishlist) => {

                // ---------------------------------------------
                // SEARCH
                // ---------------------------------------------

                const wishlistId =
                    String(
                        wishlist.wishlistId ??
                        wishlist.id ??
                        ""
                    );

                const sellerId =
                    String(
                        wishlist.sellerId ??
                        ""
                    );

                const customerId =
                    String(
                        wishlist.customerId ??
                        ""
                    );

                const status =
                    String(
                        wishlist.status ??
                        ""
                    );

                const matchesSearch =
                    !searchValue ||
                    wishlistId
                        .toLowerCase()
                        .includes(searchValue) ||
                    sellerId
                        .toLowerCase()
                        .includes(searchValue) ||
                    customerId
                        .toLowerCase()
                        .includes(searchValue) ||
                    status
                        .toLowerCase()
                        .includes(searchValue);

                // ---------------------------------------------
                // STATUS FILTER
                // ---------------------------------------------

                const matchesStatus =
                    statusFilter === "all" ||
                    status.toLowerCase() ===
                        statusFilter.toLowerCase();

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    }, [
        wishlists,
        search,
        statusFilter,
    ]);

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handleChangePage = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };

    // =========================================================
    // ROWS PER PAGE
    // =========================================================

    const handleChangeRowsPerPage = (
        event
    ) => {

        setRowsPerPage(
            parseInt(
                event.target.value,
                10
            )
        );

        setPage(0);

    };

    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = (
        value
    ) => {

        setSearch(value);

        setPage(0);

    };

    // =========================================================
    // STATUS FILTER
    // =========================================================

    const handleStatusFilter = (
        value
    ) => {

        setStatusFilter(value);

        setPage(0);

    };

    // =========================================================
    // VIEW WISHLIST
    // =========================================================
    //
    // Full-page details route:
    // /wishlists/details/:id
    //
    // No popup/modal.
    // =========================================================

    const handleView = (
        wishlist
    ) => {

        const id =
            wishlist?.wishlistId ??
            wishlist?.id;

        if (!id) {

            setError(
                "Wishlist ID is missing."
            );

            return;
        }

        navigate(
            `/wishlists/details/${id}`
        );

    };

    // =========================================================
    // EDIT WISHLIST
    // =========================================================
    //
    // Available for future toolbar/table use.
    // =========================================================

    const handleEdit = (
        wishlist
    ) => {

        const id =
            wishlist?.wishlistId ??
            wishlist?.id;

        if (!id) {

            setError(
                "Wishlist ID is missing."
            );

            return;
        }

        navigate(
            `/wishlists/edit/${id}`
        );

    };

    // =========================================================
    // DELETE SINGLE WISHLIST
    // =========================================================

    const handleDelete = async (
        wishlist
    ) => {

        const wishlistId =
            wishlist?.wishlistId ??
            wishlist?.id;

        if (!wishlistId) {

            setError(
                "Wishlist ID is missing."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete Wishlist #${wishlistId}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            console.log(
                "DELETE WISHLIST:",
                wishlistId
            );

            await axios.delete(
                `${WISHLIST_API}/${wishlistId}`,
                {
                    timeout: 30000,
                }
            );

            setWishlists(
                (prev) =>
                    prev.filter(
                        (item) =>
                            (
                                item.wishlistId ??
                                item.id
                            ) !== wishlistId
                    )
            );

            setSelectedWishlists(
                (prev) =>
                    prev.filter(
                        (id) =>
                            id !== wishlistId
                    )
            );

            setSuccess(
                `Wishlist #${wishlistId} deleted successfully.`
            );

            setTimeout(
                () => setSuccess(""),
                3000
            );

        } catch (err) {

            console.error(
                "Delete wishlist error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to delete wishlist.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to delete wishlist."
            );

        }

    };

    // =========================================================
    // ADD WISHLIST
    // =========================================================

    const handleAdd = () => {

        navigate(
            "/wishlists/create"
        );

    };

    // =========================================================
    // SELECT WISHLIST
    // =========================================================

    const handleSelectItem = (
        wishlistId
    ) => {

        setSelectedWishlists(
            (prev) => {

                if (
                    prev.includes(
                        wishlistId
                    )
                ) {

                    return prev.filter(
                        (id) =>
                            id !== wishlistId
                    );

                }

                return [
                    ...prev,
                    wishlistId,
                ];

            }
        );

    };

    // =========================================================
    // REMOVE SELECTED
    // =========================================================
    //
    // Backend does not expose a bulk-delete endpoint.
    // Delete each selected Wishlist using DELETE /Wishlist/{id}.
    // =========================================================

    const handleRemoveSelected =
        async () => {

            if (
                selectedWishlists.length === 0
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete ${selectedWishlists.length} selected wishlist(s)?`
                );

            if (!confirmed) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                for (
                    const wishlistId of
                    selectedWishlists
                ) {

                    await axios.delete(
                        `${WISHLIST_API}/${wishlistId}`,
                        {
                            timeout: 30000,
                        }
                    );

                }

                setWishlists(
                    (prev) =>
                        prev.filter(
                            (item) =>
                                !selectedWishlists.includes(
                                    item.wishlistId ??
                                    item.id
                                )
                        )
                );

                setSelectedWishlists([]);

                setPage(0);

                setSuccess(
                    "Selected wishlists deleted successfully."
                );

                setTimeout(
                    () => setSuccess(""),
                    3000
                );

            } catch (err) {

                console.error(
                    "Bulk wishlist delete error:",
                    err
                );

                const message =
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Unable to delete selected wishlists.";

                setError(
                    typeof message === "string"
                        ? message
                        : "Unable to delete selected wishlists."
                );

            } finally {

                setLoading(false);

            }

        };

    // =========================================================
    // CLEAR ALL
    // =========================================================
    //
    // There is no /Wishlist/clear endpoint.
    // Therefore delete each existing Wishlist individually.
    // =========================================================

    const handleClearAll = async () => {

        if (wishlists.length === 0) {
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete all ${wishlists.length} wishlists?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            for (
                const wishlist of
                wishlists
            ) {

                const wishlistId =
                    wishlist.wishlistId ??
                    wishlist.id;

                if (!wishlistId) {
                    continue;
                }

                await axios.delete(
                    `${WISHLIST_API}/${wishlistId}`,
                    {
                        timeout: 30000,
                    }
                );

            }

            setWishlists([]);

            setSelectedWishlists([]);

            setPage(0);

            setSuccess(
                "All wishlists have been deleted successfully."
            );

            setTimeout(
                () => setSuccess(""),
                3000
            );

        } catch (err) {

            console.error(
                "Clear wishlist error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to clear wishlists.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to clear wishlists."
            );

            // Reload because some records may
            // have already been deleted.
            await loadWishlists();

        } finally {

            setLoading(false);

        }

    };

    // =========================================================
    // TOTALS
    // =========================================================

    const totalWishlists =
        wishlists.length;

    const activeWishlists =
        wishlists.filter(
            (wishlist) =>
                String(
                    wishlist.status || ""
                ).toLowerCase() ===
                "active"
        ).length;

    const inactiveWishlists =
        wishlists.filter(
            (wishlist) =>
                String(
                    wishlist.status || ""
                ).toLowerCase() ===
                "inactive"
        ).length;

    const selectedCount =
        selectedWishlists.length;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* =====================================================
                PAGE HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >

                    <Favorite
                        color="error"
                        sx={{
                            fontSize: 38,
                        }}
                    />

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Wishlist
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage customer wishlists.
                        </Typography>

                    </Box>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={
                        loadWishlists
                    }
                    disabled={loading}
                >
                    Refresh
                </Button>

            </Box>

            {/* =====================================================
                ALERTS
               ===================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>
            )}

            {/* =====================================================
                STATISTICS
               ===================================================== */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Wishlists
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {totalWishlists}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Active
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {activeWishlists}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Inactive
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {inactiveWishlists}
                        </Typography>
                    </Paper>
                </Grid>

            </Grid>

            {/* =====================================================
                TOOLBAR
               ===================================================== */}

            <WishlistToolbar
                totalItems={
                    totalWishlists
                }
                selectedCount={
                    selectedCount
                }
                loading={loading}
                onRefresh={
                    loadWishlists
                }
                onAdd={
                    handleAdd
                }
                onRemoveSelected={
                    handleRemoveSelected
                }
                onClearAll={
                    handleClearAll
                }
            />

            {/* =====================================================
                SEARCH / FILTER
               ===================================================== */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={8}
                    >

                        <TextField
                            fullWidth
                            label="Search Wishlist"
                            placeholder="Search wishlist ID, seller ID, customer ID, status..."
                            value={search}
                            onChange={(event) =>
                                handleSearch(
                                    event.target.value
                                )
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={
                                statusFilter
                            }
                            onChange={(event) =>
                                handleStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            {statusOptions.map(
                                (status) => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>
                                )
                            )}

                        </TextField>

                    </Grid>

                </Grid>

            </Paper>

            {/* =====================================================
                CONTENT
               ===================================================== */}

            {loading ? (

                <Paper
                    sx={{
                        p: 8,
                        textAlign: "center",
                    }}
                >

                    <CircularProgress />

                    <Typography
                        sx={{ mt: 2 }}
                        color="text.secondary"
                    >
                        Loading wishlists...
                    </Typography>

                </Paper>

            ) : viewMode === "list" ? (

                <WishlistList
                    wishlists={
                        filteredWishlists
                    }
                    loading={loading}
                    onView={
                        handleView
                    }
                    onDelete={
                        handleDelete
                    }
                />

            ) : (

                <WishlistTable
                    wishlists={
                        filteredWishlists
                    }
                    page={page}
                    rowsPerPage={
                        rowsPerPage
                    }
                    loading={loading}
                    onPageChange={
                        handleChangePage
                    }
                    onRowsPerPageChange={
                        handleChangeRowsPerPage
                    }
                    onView={
                        handleView
                    }
                    onDelete={
                        handleDelete
                    }
                />

            )}

        </Box>
    );
};

export default WishlistView;
