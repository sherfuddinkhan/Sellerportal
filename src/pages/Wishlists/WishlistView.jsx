// =========================================================
// WishlistView.jsx
// =========================================================

import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    Favorite,
    Refresh,
} from "@mui/icons-material";

// Components
import WishlistToolbar from "./WishlistToolbar";
import WishlistTable from "./WishlistTable";
import WishlistList from "./WishlistList";

// =========================================================
// VIEW COMPONENT
// =========================================================

const WishlistView = () => {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    // =========================================================
    // STATE
    // =========================================================

    const [wishlists, setWishlists] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("all");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedWishlists, setSelectedWishlists] =
        useState([]);

    const [viewMode, setViewMode] = useState(
        "table"
    );

    // =========================================================
    // MODAL STATE
    // =========================================================

    const [openModal, setOpenModal] = useState(false);

    const [selectedWishlist, setSelectedWishlist] =
        useState(null);

    // =========================================================
    // SAMPLE DATA
    // =========================================================
    // Replace this with your API response.
    // =========================================================

    const sampleWishlists = [
        {
            wishlistId: 1,
            customerId: 2,
            customerName: "TechNova Retail Customer",
            customerCode: "CUST-F10EA404",
            productId: 6,
            productName: "Wireless Bluetooth Headphones",
            productCode: "PRD-001",
            categoryName: "Electronics",
            brand: "SoundMax",
            price: 2499,
            stock: 25,
            productImage: "",
            createdDate: "2026-08-25",
        },
        {
            wishlistId: 2,
            customerId: 2,
            customerName: "TechNova Retail Customer",
            customerCode: "CUST-F10EA404",
            productId: 7,
            productName: "Mechanical Keyboard",
            productCode: "PRD-002",
            categoryName: "Electronics",
            brand: "KeyPro",
            price: 3499,
            stock: 10,
            productImage: "",
            createdDate: "2026-08-24",
        },
        {
            wishlistId: 3,
            customerId: 3,
            customerName: "ABC Retail",
            customerCode: "CUST-1003",
            productId: 8,
            productName: "Running Shoes",
            productCode: "PRD-003",
            categoryName: "Footwear",
            brand: "FastRun",
            price: 2999,
            stock: 0,
            productImage: "",
            createdDate: "2026-08-23",
        },
    ];

    // =========================================================
    // LOAD WISHLISTS
    // =========================================================

    const loadWishlists = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * Replace with your actual API.
             *
             * Example:
             *
             * const response = await apiService.get(
             *     "/Wishlist"
             * );
             *
             * setWishlists(response.data);
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setWishlists(sampleWishlists);
        } catch (err) {
            console.error(
                "Wishlist loading error:",
                err
            );

            setError(
                "Unable to load wishlist data."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadWishlists();
    }, []);

    // =========================================================
    // FILTERED WISHLISTS
    // =========================================================

    const filteredWishlists = useMemo(() => {
        return wishlists.filter((wishlist) => {
            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                wishlist.productName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                wishlist.productCode
                    ?.toLowerCase()
                    .includes(searchValue) ||
                wishlist.customerName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                wishlist.customerCode
                    ?.toLowerCase()
                    .includes(searchValue) ||
                wishlist.categoryName
                    ?.toLowerCase()
                    .includes(searchValue);

            let matchesFilter = true;

            if (filter === "in-stock") {
                matchesFilter =
                    Number(wishlist.stock) > 0;
            }

            if (filter === "out-of-stock") {
                matchesFilter =
                    Number(wishlist.stock) === 0;
            }

            if (filter === "low-stock") {
                matchesFilter =
                    Number(wishlist.stock) > 0 &&
                    Number(wishlist.stock) <= 10;
            }

            return (
                matchesSearch &&
                matchesFilter
            );
        });
    }, [wishlists, search, filter]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedWishlists =
        filteredWishlists.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

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

    const handleSearch = (value) => {
        setSearch(value);
        setPage(0);
    };

    // =========================================================
    // FILTER
    // =========================================================

    const handleFilter = (value) => {
        setFilter(value);
        setPage(0);
    };

    // =========================================================
    // VIEW WISHLIST
    // =========================================================

    const handleView = (wishlist) => {
        setSelectedWishlist(wishlist);
        setOpenModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedWishlist(null);
    };

    // =========================================================
    // DELETE SINGLE ITEM
    // =========================================================

    const handleDelete = async (wishlist) => {
        const confirmed = window.confirm(
            `Remove "${wishlist.productName}" from the wishlist?`
        );

        if (!confirmed) {
            return;
        }

        try {
            /*
             * Replace with:
             *
             * await apiService.delete(
             *     `/Wishlist/${wishlist.wishlistId}`
             * );
             */

            setWishlists((prev) =>
                prev.filter(
                    (item) =>
                        item.wishlistId !==
                        wishlist.wishlistId
                )
            );

            setSelectedWishlists((prev) =>
                prev.filter(
                    (id) =>
                        id !==
                        wishlist.wishlistId
                )
            );

            setSuccess(
                "Wishlist item removed successfully."
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

            setError(
                "Unable to remove wishlist item."
            );
        }
    };

    // =========================================================
    // ADD WISHLIST
    // =========================================================

    const handleAdd = () => {
        /*
         * Navigate to your product page or
         * open an Add Wishlist modal here.
         *
         * Example:
         *
         * navigate("/wishlists/create");
         */

        setSuccess(
            "Add Wishlist functionality can be connected to the Product API."
        );

        setTimeout(
            () => setSuccess(""),
            3000
        );
    };

    // =========================================================
    // SELECTED ITEMS
    // =========================================================

    const handleRemoveSelected = async () => {
        if (
            selectedWishlists.length === 0
        ) {
            return;
        }

        const confirmed = window.confirm(
            `Remove ${selectedWishlists.length} selected item(s)?`
        );

        if (!confirmed) {
            return;
        }

        try {
            /*
             * If your API supports bulk delete:
             *
             * await apiService.post(
             *     "/Wishlist/delete-bulk",
             *     {
             *         wishlistIds:
             *             selectedWishlists
             *     }
             * );
             */

            setWishlists((prev) =>
                prev.filter(
                    (item) =>
                        !selectedWishlists.includes(
                            item.wishlistId
                        )
                )
            );

            setSelectedWishlists([]);

            setSuccess(
                "Selected wishlist items removed successfully."
            );

            setTimeout(
                () => setSuccess(""),
                3000
            );
        } catch (err) {
            console.error(
                "Bulk delete error:",
                err
            );

            setError(
                "Unable to remove selected items."
            );
        }
    };

    // =========================================================
    // CLEAR ALL
    // =========================================================

    const handleClearAll = async () => {
        if (wishlists.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to remove all wishlist items?"
        );

        if (!confirmed) {
            return;
        }

        try {
            /*
             * Replace with your API:
             *
             * await apiService.delete(
             *     "/Wishlist/clear"
             * );
             */

            setWishlists([]);

            setSelectedWishlists([]);

            setPage(0);

            setSuccess(
                "All wishlist items have been removed."
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

            setError(
                "Unable to clear wishlist."
            );
        }
    };

    // =========================================================
    // SELECT ITEM
    // =========================================================

    const handleSelectItem = (
        wishlistId
    ) => {
        setSelectedWishlists((prev) => {
            if (prev.includes(wishlistId)) {
                return prev.filter(
                    (id) =>
                        id !== wishlistId
                );
            }

            return [
                ...prev,
                wishlistId,
            ];
        });
    };

    // =========================================================
    // TOTALS
    // =========================================================

    const totalItems = wishlists.length;

    const inStockItems =
        wishlists.filter(
            (item) =>
                Number(item.stock) > 0
        ).length;

    const outOfStockItems =
        wishlists.filter(
            (item) =>
                Number(item.stock) === 0
        ).length;

    const lowStockItems =
        wishlists.filter(
            (item) =>
                Number(item.stock) > 0 &&
                Number(item.stock) <= 10
        ).length;

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
                        alignItems:
                            "center",
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
                            Manage customer wishlist
                            items.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadWishlists}
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
                    md={3}
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
                            Total Wishlist Items
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {totalItems}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
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
                            In Stock
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {inStockItems}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
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
                            Low Stock
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {lowStockItems}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
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
                            Out of Stock
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {outOfStockItems}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* =====================================================
                TOOLBAR
               ===================================================== */}

            <WishlistToolbar
                totalItems={totalItems}
                selectedCount={
                    selectedWishlists.length
                }
                loading={loading}
                onRefresh={loadWishlists}
                onAdd={handleAdd}
                onRemoveSelected={
                    handleRemoveSelected
                }
                onClearAll={handleClearAll}
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
                            placeholder="Search product, customer, code..."
                            value={search}
                            onChange={(event) =>
                                handleSearch(
                                    event.target
                                        .value
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
                            label="Stock Filter"
                            value={filter}
                            onChange={(event) =>
                                handleFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <MenuItem value="all">
                                All Items
                            </MenuItem>

                            <MenuItem value="in-stock">
                                In Stock
                            </MenuItem>

                            <MenuItem value="low-stock">
                                Low Stock
                            </MenuItem>

                            <MenuItem value="out-of-stock">
                                Out of Stock
                            </MenuItem>
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
                        Loading wishlist...
                    </Typography>
                </Paper>
            ) : isMobile ||
              viewMode === "list" ? (
                <WishlistList
                    wishlists={
                        paginatedWishlists
                    }
                    loading={loading}
                    onView={handleView}
                    onDelete={handleDelete}
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
                    onView={handleView}
                    onDelete={handleDelete}
                />
            )}

            {/* =====================================================
                VIEW MODAL
               ===================================================== */}

            <Dialog
                open={openModal}
                onClose={
                    handleCloseModal
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Wishlist Details
                </DialogTitle>

                <DialogContent dividers>
                    {selectedWishlist && (
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >
                                {
                                    selectedWishlist.productName
                                }
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                Product Code:{" "}
                                {
                                    selectedWishlist.productCode
                                }
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Customer
                                    </Typography>

                                    <Typography>
                                        {
                                            selectedWishlist.customerName
                                        }
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Customer Code
                                    </Typography>

                                    <Typography>
                                        {
                                            selectedWishlist.customerCode
                                        }
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Category
                                    </Typography>

                                    <Typography>
                                        {
                                            selectedWishlist.categoryName
                                        }
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Brand
                                    </Typography>

                                    <Typography>
                                        {
                                            selectedWishlist.brand ||
                                            "N/A"
                                        }
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Price
                                    </Typography>

                                    <Typography
                                        fontWeight="bold"
                                    >
                                        ₹
                                        {Number(
                                            selectedWishlist.price ||
                                                0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Stock
                                    </Typography>

                                    <Typography>
                                        {
                                            selectedWishlist.stock
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseModal
                        }
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WishlistView;