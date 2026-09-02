// ==========================================================
// ProductPriceList.jsx
// ==========================================================

import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Divider,
    Stack,
    Button,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Snackbar,
    TextField,
    InputAdornment,
    LinearProgress,
    Menu,
    MenuItem,
} from "@mui/material";

import {
    Search,
    Refresh,
    Add,
    Visibility,
    Edit,
    Delete,
    MoreVert,
    CheckCircle,
    Cancel,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

// ==========================================================
// SERVER URL
// ==========================================================

const SERVER_URL = "http://localhost:5000";

// ==========================================================
// Constants
// ==========================================================

const PAGE_SIZE_OPTIONS = [
    5,
    10,
    25,
    50,
    100,
];

const STATUS_COLORS = {
    Active: "success",
    Inactive: "default",
    Enabled: "success",
    Disabled: "default",
    Draft: "warning",
    Pending: "info",
};

// ==========================================================
// Currency Formatter
// ==========================================================

const currencyFormatter =
    new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }
    );

// ==========================================================
// Initial Snackbar
// ==========================================================

const INITIAL_SNACKBAR = {
    open: false,
    severity: "success",
    message: "",
};

// ==========================================================
// Initial Menu
// ==========================================================

const INITIAL_MENU = {
    anchorEl: null,
    row: null,
};

// ==========================================================
// Status Chip
// ==========================================================

const getStatusChip = (status) => {
    const normalizedStatus =
        status || "Inactive";

    return (
        <Chip
            size="small"
            label={normalizedStatus}
            color={
                STATUS_COLORS[
                    normalizedStatus
                ] || "default"
            }
            icon={
                normalizedStatus === "Active" ||
                normalizedStatus === "Enabled" ? (
                    <CheckCircle />
                ) : normalizedStatus ===
                      "Inactive" ||
                  normalizedStatus ===
                      "Disabled" ? (
                    <Cancel />
                ) : undefined
            }
        />
    );
};

// ==========================================================
// ProductPriceList
// ==========================================================

const ProductPriceList = ({
    productId,
    sellerId,
    readOnly = false,
    refreshTrigger = 0,
    onAdd,
    onView,
    onEdit,
    onDelete,
}) => {
    // ======================================================
    // STATE
    // ======================================================

    const [prices, setPrices] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [pageSize, setPageSize] =
        useState(10);

    const [selectedPrice, setSelectedPrice] =
        useState(null);

    const [menuState, setMenuState] =
        useState(INITIAL_MENU);

    const [snackbar, setSnackbar] =
        useState(INITIAL_SNACKBAR);

    // ======================================================
    // LOAD PRODUCT PRICES
    // ======================================================

    const loadProductPrices =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                let url;

                // ------------------------------------------------
                // BY PRODUCT
                // ------------------------------------------------

                if (productId) {
                    url =
                        `${SERVER_URL}/api/product-prices/product/${productId}`;
                }

                // ------------------------------------------------
                // BY SELLER
                // ------------------------------------------------

                else if (sellerId) {
                    url =
                        `${SERVER_URL}/api/product-prices/seller/${sellerId}`;
                }

                // ------------------------------------------------
                // ALL
                // ------------------------------------------------

                else {
                    url =
                        `${SERVER_URL}/api/product-prices/all`;
                }

                console.log(
                    "Loading Product Prices:",
                    url
                );

                const response =
                    await fetch(url);

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "Unable to load product prices."
                    );
                }

                const result =
                    Array.isArray(data)
                        ? data
                        : [];

                setPrices(result);
            } catch (err) {
                console.error(
                    "Product price loading error:",
                    err
                );

                setPrices([]);

                const message =
                    err?.message ||
                    "Unable to load product prices.";

                setError(message);

                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        "Failed to load product prices.",
                });
            } finally {
                setLoading(false);
            }
        }, [
            productId,
            sellerId,
        ]);

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadProductPrices();
    }, [
        loadProductPrices,
        refreshTrigger,
    ]);

    // ======================================================
    // SEARCH
    // ======================================================

    const filteredPrices =
        useMemo(() => {
            const keyword =
                searchText
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return prices;
            }

            return prices.filter(
                (item) => {
                    return (
                        String(
                            item.productPriceId ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.productId ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.productName ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.sku ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.productSku ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.priceType ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.currency ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.status ??
                                ""
                        )
                            .toLowerCase()
                            .includes(keyword)
                    );
                }
            );
        }, [
            prices,
            searchText,
        ]);

    // ======================================================
    // SEARCH HANDLER
    // ======================================================

    const handleSearchChange =
        (event) => {
            setSearchText(
                event.target.value
            );

            setPage(0);
        };

    // ======================================================
    // REFRESH
    // ======================================================

    const handleRefresh = () => {
        loadProductPrices();
    };

    // ======================================================
    // VIEW
    // ======================================================

    const handleView = (row) => {
        setSelectedPrice(row);

        if (
            typeof onView ===
            "function"
        ) {
            onView(row);
        }
    };

    // ======================================================
    // EDIT
    // ======================================================

    const handleEdit = (row) => {
        if (readOnly) {
            return;
        }

        if (
            typeof onEdit ===
            "function"
        ) {
            onEdit(row);
        }
    };

    // ======================================================
    // DELETE
    // ======================================================

    const handleDelete = (row) => {
        if (readOnly) {
            return;
        }

        if (
            typeof onDelete ===
            "function"
        ) {
            onDelete(row);
        }
    };

    // ======================================================
    // ADD
    // ======================================================

    const handleAdd = () => {
        if (
            typeof onAdd ===
            "function"
        ) {
            onAdd();
        }
    };

    // ======================================================
    // MENU
    // ======================================================

    const handleMenuOpen = (
        event,
        row
    ) => {
        setMenuState({
            anchorEl:
                event.currentTarget,
            row,
        });
    };

    const handleMenuClose = () => {
        setMenuState(
            INITIAL_MENU
        );
    };

    // ======================================================
    // SNACKBAR
    // ======================================================

    const handleSnackbarClose =
        () => {
            setSnackbar((prev) => ({
                ...prev,
                open: false,
            }));
        };

    // ======================================================
    // STATISTICS
    // ======================================================

    const totalPrices =
        prices.length;

    const activePrices =
        prices.filter(
            (item) =>
                item.isActive === true ||
                item.status === "Active" ||
                item.status === "Enabled"
        ).length;

    const inactivePrices =
        totalPrices -
        activePrices;

    // ======================================================
    // DATA GRID COLUMNS
    // ======================================================

    const columns = useMemo(
        () => [
            {
                field:
                    "productPriceId",
                headerName:
                    "Price ID",
                width: 100,
            },

            {
                field:
                    "productId",
                headerName:
                    "Product ID",
                width: 110,
            },

            {
                field:
                    "productName",
                headerName:
                    "Product",
                minWidth: 180,
                flex: 1,

                renderCell: ({
                    value,
                }) => (
                    <Typography
                        variant="body2"
                        fontWeight={500}
                    >
                        {value || "-"}
                    </Typography>
                ),
            },

            {
                field:
                    "productSku",
                headerName:
                    "SKU",
                minWidth: 140,
                flex: 0.8,
            },

            {
                field:
                    "priceType",
                headerName:
                    "Price Type",
                width: 130,

                renderCell: ({
                    value,
                }) => (
                    <Chip
                        size="small"
                        label={
                            value ||
                            "Standard"
                        }
                        variant="outlined"
                    />
                ),
            },

            {
                field:
                    "price",
                headerName:
                    "Price",
                width: 140,
                align: "right",
                headerAlign:
                    "right",

                renderCell: ({
                    value,
                }) =>
                    currencyFormatter.format(
                        Number(
                            value
                        ) || 0
                    ),
            },

            {
                field:
                    "mrp",
                headerName:
                    "MRP",
                width: 140,
                align: "right",
                headerAlign:
                    "right",

                renderCell: ({
                    value,
                }) =>
                    currencyFormatter.format(
                        Number(
                            value
                        ) || 0
                    ),
            },

            {
                field:
                    "discount",
                headerName:
                    "Discount",
                width: 130,
                align: "right",
                headerAlign:
                    "right",

                renderCell: ({
                    value,
                }) => {
                    if (
                        value ===
                            null ||
                        value ===
                            undefined
                    ) {
                        return "-";
                    }

                    return `${Number(
                        value
                    ).toFixed(2)}%`;
                },
            },

            {
                field:
                    "currency",
                headerName:
                    "Currency",
                width: 110,

                renderCell: ({
                    value,
                }) => (
                    <Typography
                        variant="body2"
                    >
                        {value ||
                            "INR"}
                    </Typography>
                ),
            },

            {
                field:
                    "status",
                headerName:
                    "Status",
                width: 130,

                renderCell: ({
                    row,
                    value,
                }) => {
                    const status =
                        value ||
                        (row.isActive
                            ? "Active"
                            : "Inactive");

                    return getStatusChip(
                        status
                    );
                },
            },

            {
                field:
                    "actions",
                headerName:
                    "Actions",
                width: readOnly
                    ? 150
                    : 200,

                sortable: false,
                filterable: false,

                renderCell: ({
                    row,
                }) => (
                    <Stack
                        direction="row"
                        spacing={0.5}
                    >
                        <Tooltip title="View">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                    handleView(
                                        row
                                    )
                                }
                            >
                                <Visibility />
                            </IconButton>
                        </Tooltip>

                        {!readOnly && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() =>
                                        handleEdit(
                                            row
                                        )
                                    }
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        )}

                        {!readOnly && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                        handleDelete(
                                            row
                                        )
                                    }
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="More">
                            <IconButton
                                size="small"
                                onClick={(
                                    event
                                ) =>
                                    handleMenuOpen(
                                        event,
                                        row
                                    )
                                }
                            >
                                <MoreVert />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ],
        [readOnly]
    );

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            {loading && (
                <LinearProgress />
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* HEADER */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={2}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Product Prices
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage product
                        pricing, MRP,
                        discounts and
                        price status.
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <Refresh />
                        }
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading
                        }
                    >
                        Refresh
                    </Button>

                    {!readOnly && (
                        <Button
                            variant="contained"
                            startIcon={
                                <Add />
                            }
                            onClick={
                                handleAdd
                            }
                        >
                            Add Price
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* STATISTICS */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                mb={2}
            >
                <Card
                    sx={{
                        flex: 1,
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Prices
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {totalPrices}
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Active Prices
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            color="success.main"
                        >
                            {activePrices}
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Inactive Prices
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            color="text.secondary"
                        >
                            {inactivePrices}
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* MAIN CARD */}

            <Card>
                <CardHeader
                    title="Product Price List"
                    subheader={`${filteredPrices.length} price record(s) found`}
                />

                <Divider />

                {/* SEARCH */}

                <Box
                    sx={{
                        p: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Product Prices"
                        placeholder="Search product, SKU, price type, currency, status..."
                        value={
                            searchText
                        }
                        onChange={
                            handleSearchChange
                        }
                        InputProps={{
                            startAdornment:
                                (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                        }}
                    />
                </Box>

                <Divider />

                {/* DATAGRID */}

                <CardContent
                    sx={{
                        p: 0,
                    }}
                >
                    {filteredPrices.length ===
                    0 ? (
                        <Box
                            py={8}
                            textAlign="center"
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                No Product
                                Prices
                                Found
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {searchText
                                    ? "No price records match your search."
                                    : "There are no product price records available."}
                            </Typography>

                            {!readOnly &&
                                !searchText && (
                                    <Button
                                        sx={{
                                            mt: 2,
                                        }}
                                        variant="contained"
                                        startIcon={
                                            <Add />
                                        }
                                        onClick={
                                            handleAdd
                                        }
                                    >
                                        Add Product
                                        Price
                                    </Button>
                                )}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: 600,
                            }}
                        >
                            <DataGrid
                                rows={
                                    filteredPrices
                                }
                                columns={
                                    columns
                                }
                                getRowId={(
                                    row
                                ) =>
                                    row.productPriceId ??
                                    row.id ??
                                    `${row.productId}-${row.price}`
                                }
                                pagination
                                pageSizeOptions={
                                    PAGE_SIZE_OPTIONS
                                }
                                paginationModel={{
                                    page,
                                    pageSize,
                                }}
                                onPaginationModelChange={(
                                    model
                                ) => {
                                    setPage(
                                        model.page
                                    );

                                    setPageSize(
                                        model.pageSize
                                    );
                                }}
                                loading={
                                    loading
                                }
                                disableRowSelectionOnClick
                                sx={{
                                    border: 0,

                                    "& .MuiDataGrid-columnHeaders":
                                        {
                                            backgroundColor:
                                                "action.hover",
                                            fontWeight: 600,
                                        },
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* MORE MENU */}

            <Menu
                anchorEl={
                    menuState.anchorEl
                }
                open={Boolean(
                    menuState.anchorEl
                )}
                onClose={
                    handleMenuClose
                }
            >
                <MenuItem
                    onClick={() => {
                        if (
                            menuState.row
                        ) {
                            handleView(
                                menuState.row
                            );
                        }

                        handleMenuClose();
                    }}
                >
                    <Visibility
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    View
                </MenuItem>

                {!readOnly && (
                    <>
                        <MenuItem
                            onClick={() => {
                                if (
                                    menuState.row
                                ) {
                                    handleEdit(
                                        menuState.row
                                    );
                                }

                                handleMenuClose();
                            }}
                        >
                            <Edit
                                fontSize="small"
                                sx={{
                                    mr: 1,
                                }}
                            />

                            Edit
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                if (
                                    menuState.row
                                ) {
                                    handleDelete(
                                        menuState.row
                                    );
                                }

                                handleMenuClose();
                            }}
                        >
                            <Delete
                                fontSize="small"
                                sx={{
                                    mr: 1,
                                }}
                            />

                            Delete
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* SNACKBAR */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    4000
                }
                onClose={
                    handleSnackbarClose
                }
            >
                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={
                        handleSnackbarClose
                    }
                >
                    {
                        snackbar.message
                    }
                </Alert>
            </Snackbar>
        </Box>
    );
};

// ==========================================================
// PROPTYPES
// ==========================================================

ProductPriceList.propTypes = {
    productId:
        PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),

    sellerId:
        PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),

    readOnly:
        PropTypes.bool,

    refreshTrigger:
        PropTypes.number,

    onAdd:
        PropTypes.func,

    onView:
        PropTypes.func,

    onEdit:
        PropTypes.func,

    onDelete:
        PropTypes.func,
};

// ==========================================================
// DEFAULT PROPS
// ==========================================================

ProductPriceList.defaultProps = {
    productId: null,
    sellerId: null,
    readOnly: false,
    refreshTrigger: 0,
    onAdd: null,
    onView: null,
    onEdit: null,
    onDelete: null,
};

// ==========================================================
// EXPORT
// ==========================================================

export default ProductPriceList;
