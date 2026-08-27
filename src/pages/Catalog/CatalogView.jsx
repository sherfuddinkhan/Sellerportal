import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
    Chip,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    InputAdornment,
    Alert,
    CircularProgress,
} from "@mui/material";

import {
    Search,
    Refresh,
    Add,
    Visibility,
    Edit,
    Delete,
    Inventory2,
    CheckCircle,
    Cancel,
    Warning,
    Category,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const CatalogView = () => {
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [categoryFilter, setCategoryFilter] = useState("all");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    // =========================================================
    // SAMPLE DATA
    // Replace this with your API call
    // =========================================================

    const sampleProducts = [
        {
            productId: 1,
            productCode: "PRD-001",
            productName: "Wireless Bluetooth Headphones",
            category: "Electronics",
            brand: "SoundMax",
            price: 2499,
            stock: 120,
            status: "Active",
            image: "",
        },
        {
            productId: 2,
            productCode: "PRD-002",
            productName: "Mechanical Keyboard",
            category: "Electronics",
            brand: "KeyPro",
            price: 3499,
            stock: 45,
            status: "Active",
            image: "",
        },
        {
            productId: 3,
            productCode: "PRD-003",
            productName: "Cotton T-Shirt",
            category: "Fashion",
            brand: "UrbanWear",
            price: 799,
            stock: 8,
            status: "Active",
            image: "",
        },
        {
            productId: 4,
            productCode: "PRD-004",
            productName: "Running Shoes",
            category: "Footwear",
            brand: "FastRun",
            price: 2999,
            stock: 0,
            status: "Inactive",
            image: "",
        },
        {
            productId: 5,
            productCode: "PRD-005",
            productName: "Smart Watch",
            category: "Electronics",
            brand: "TechTime",
            price: 4999,
            stock: 32,
            status: "Active",
            image: "",
        },
    ];

    // =========================================================
    // LOAD CATALOG
    // =========================================================

    const loadCatalog = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * Replace this section with your API:
             *
             * const response = await apiService.get("/Catalog");
             * setProducts(response.data);
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setProducts(sampleProducts);
        } catch (err) {
            console.error("Catalog loading error:", err);

            setError(
                "Unable to load catalog. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadCatalog();
    }, []);

    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = useMemo(() => {
        return [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];
    }, [products]);

    // =========================================================
    // FILTER PRODUCTS
    // =========================================================

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                product.productName
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.productCode
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.brand
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                product.status?.toLowerCase() ===
                    statusFilter.toLowerCase();

            const matchesCategory =
                categoryFilter === "all" ||
                product.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [
        products,
        search,
        statusFilter,
        categoryFilter,
    ]);

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalProducts = products.length;

    const activeProducts = products.filter(
        (product) =>
            product.status?.toLowerCase() === "active"
    ).length;

    const inactiveProducts = products.filter(
        (product) =>
            product.status?.toLowerCase() === "inactive"
    ).length;

    const lowStockProducts = products.filter(
        (product) =>
            Number(product.stock) > 0 &&
            Number(product.stock) <= 10
    ).length;

    const outOfStockProducts = products.filter(
        (product) => Number(product.stock) === 0
    ).length;

    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(
            parseInt(event.target.value, 10)
        );
        setPage(0);
    };

    // =========================================================
    // VIEW PRODUCT
    // =========================================================

    const handleView = (productId) => {
        navigate(`/catalog/${productId}`);
    };

    // =========================================================
    // EDIT PRODUCT
    // =========================================================

    const handleEdit = (productId) => {
        navigate(`/catalog/${productId}/edit`);
    };

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            /*
             * Replace with your API:
             *
             * await apiService.delete(`/Catalog/${productId}`);
             */

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product.productId !== productId
                )
            );
        } catch (err) {
            console.error(
                "Delete product error:",
                err
            );

            setError(
                "Unable to delete the product."
            );
        }
    };

    // =========================================================
    // ADD PRODUCT
    // =========================================================

    const handleAddProduct = () => {
        navigate("/products/create");
    };

    // =========================================================
    // STATUS CHIP
    // =========================================================

    const getStatusChip = (status) => {
        if (status?.toLowerCase() === "active") {
            return (
                <Chip
                    icon={<CheckCircle />}
                    label="Active"
                    color="success"
                    size="small"
                />
            );
        }

        return (
            <Chip
                icon={<Cancel />}
                label="Inactive"
                color="default"
                size="small"
            />
        );
    };

    // =========================================================
    // STOCK CHIP
    // =========================================================

    const getStockChip = (stock) => {
        const quantity = Number(stock);

        if (quantity === 0) {
            return (
                <Chip
                    label="Out of Stock"
                    color="error"
                    size="small"
                />
            );
        }

        if (quantity <= 10) {
            return (
                <Chip
                    icon={<Warning />}
                    label={`Low (${quantity})`}
                    color="warning"
                    size="small"
                />
            );
        }

        return (
            <Chip
                label={quantity}
                color="success"
                variant="outlined"
                size="small"
            />
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Catalog
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage and monitor your product catalog.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Tooltip title="Refresh Catalog">
                        <IconButton
                            onClick={loadCatalog}
                            disabled={loading}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddProduct}
                    >
                        Add Product
                    </Button>
                </Box>
            </Box>

            {/* =====================================================
                ERROR
               ===================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
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
                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Products
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ mt: 1 }}
                                >
                                    {totalProducts}
                                </Typography>
                            </Box>

                            <Avatar>
                                <Inventory2 />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Active Products
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ mt: 1 }}
                                >
                                    {activeProducts}
                                </Typography>
                            </Box>

                            <Avatar>
                                <CheckCircle />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Low Stock
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ mt: 1 }}
                                >
                                    {lowStockProducts}
                                </Typography>
                            </Box>

                            <Avatar>
                                <Warning />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Out of Stock
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ mt: 1 }}
                                >
                                    {outOfStockProducts}
                                </Typography>
                            </Box>

                            <Avatar>
                                <Cancel />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* =====================================================
                FILTERS
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
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search Products"
                            placeholder="Search by product, code or brand..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(
                                    e.target.value
                                );
                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="active">
                                Active
                            </MenuItem>

                            <MenuItem value="inactive">
                                Inactive
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(
                                    e.target.value
                                );
                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">
                                All Categories
                            </MenuItem>

                            {categories.map(
                                (category) => (
                                    <MenuItem
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </MenuItem>
                                )
                            )}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* =====================================================
                CATALOG TABLE
               ===================================================== */}

            <Paper
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Category />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Product Catalog
                    </Typography>

                    <Chip
                        label={filteredProducts.length}
                        size="small"
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Product
                                </TableCell>

                                <TableCell>
                                    Code
                                </TableCell>

                                <TableCell>
                                    Category
                                </TableCell>

                                <TableCell>
                                    Brand
                                </TableCell>

                                <TableCell align="right">
                                    Price
                                </TableCell>

                                <TableCell align="center">
                                    Stock
                                </TableCell>

                                <TableCell align="center">
                                    Status
                                </TableCell>

                                <TableCell align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedProducts.length ===
                              0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            No products found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedProducts.map(
                                    (product) => (
                                        <TableRow
                                            key={
                                                product.productId
                                            }
                                            hover
                                        >
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        src={
                                                            product.image
                                                        }
                                                    >
                                                        <Inventory2 />
                                                    </Avatar>

                                                    <Typography
                                                        fontWeight="medium"
                                                    >
                                                        {
                                                            product.productName
                                                        }
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    product.productCode
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    product.category
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    product.brand
                                                }
                                            </TableCell>

                                            <TableCell align="right">
                                                ₹
                                                {Number(
                                                    product.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {getStockChip(
                                                    product.stock
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {getStatusChip(
                                                    product.status
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Tooltip title="View">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            handleView(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="info"
                                                        onClick={() =>
                                                            handleEdit(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredProducts.length}
                    page={page}
                    onPageChange={
                        handleChangePage
                    }
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={
                        handleChangeRowsPerPage
                    }
                    rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        50,
                    ]}
                />
            </Paper>
        </Box>
    );
};

export default CatalogView;