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

import { useNavigate } from "react-router-dom";


// ==========================================================
// SERVER URL
// ==========================================================

const SERVER_URL = "http://localhost:5000";


// ==========================================================
// PAGE SIZE OPTIONS
// ==========================================================

const PAGE_SIZE_OPTIONS = [
    5,
    10,
    25,
    50,
    100,
];


// ==========================================================
// STATUS COLORS
// ==========================================================

const STATUS_COLORS = {
    Active: "success",
    Inactive: "default",
    Enabled: "success",
    Disabled: "default",
    Draft: "warning",
    Pending: "info",
};


// ==========================================================
// CURRENCY FORMATTER
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
// INITIAL SNACKBAR
// ==========================================================

const INITIAL_SNACKBAR = {
    open: false,
    severity: "success",
    message: "",
};


// ==========================================================
// INITIAL MENU
// ==========================================================

const INITIAL_MENU = {
    anchorEl: null,
    row: null,
};


// ==========================================================
// STATUS CHIP
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
                normalizedStatus === "Enabled"
                    ? <CheckCircle />
                    : normalizedStatus === "Inactive" ||
                      normalizedStatus === "Disabled"
                    ? <Cancel />
                    : undefined
            }
        />
    );
};


// ==========================================================
// GET PRODUCT PRICE ID
// ==========================================================

const getProductPriceId = (row) => {

    return (
        row?.productPriceId ??
        row?.ProductPriceId ??
        row?.id ??
        row?.Id
    );
};


// ==========================================================
// PRODUCT PRICE LIST
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
    // NAVIGATION
    // ======================================================

    const navigate = useNavigate();


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
                        : Array.isArray(data?.items)
                        ? data.items
                        : [];


                console.log(
                    "Product Prices Loaded:",
                    result
                );


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
                            item.ProductPriceId ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.productId ??
                            item.ProductId ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.productName ??
                            item.ProductName ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.sku ??
                            item.SKU ??
                            item.productSku ??
                            item.ProductSku ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.priceType ??
                            item.PriceType ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.currency ??
                            item.Currency ??
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            item.status ??
                            item.Status ??
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
    // SEARCH CHANGE
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
    // ADD
    // ======================================================

    const handleAdd = () => {

        console.log(
            "ADD PRODUCT PRICE"
        );


        if (typeof onAdd === "function") {

            onAdd();

            return;
        }


        navigate(
            "/product-prices/create"
        );
    };


    // ======================================================
    // VIEW
    // ======================================================

    const handleView = (
        event,
        row
    ) => {

        if (event) {

            event.preventDefault();
            event.stopPropagation();
        }


        const productPriceId =
            getProductPriceId(row);


        console.log(
            "VIEW PRODUCT PRICE"
        );

        console.log(
            "Product Price ID:",
            productPriceId
        );

        console.log(
            "Row:",
            row
        );


        if (!productPriceId) {

            console.error(
                "Product Price ID not found:",
                row
            );


            setSnackbar({
                open: true,
                severity: "error",
                message:
                    "Product Price ID not found.",
            });


            return;
        }


        // ------------------------------------------------------
        // OPTIONAL CALLBACK
        // ------------------------------------------------------

        if (typeof onView === "function") {

            onView(row);
        }


        // ------------------------------------------------------
        // NAVIGATE
        // ------------------------------------------------------

        navigate(
            `/product-prices/view/${productPriceId}`
        );
    };


    // ======================================================
    // EDIT
    // ======================================================

    const handleEdit = (
        event,
        row
    ) => {

        if (event) {

            event.preventDefault();
            event.stopPropagation();
        }


        if (readOnly) {
            return;
        }


        const productPriceId =
            getProductPriceId(row);


        console.log(
            "EDIT PRODUCT PRICE"
        );

        console.log(
            "Product Price ID:",
            productPriceId
        );

        console.log(
            "Row:",
            row
        );


        if (!productPriceId) {

            console.error(
                "Product Price ID not found:",
                row
            );


            setSnackbar({
                open: true,
                severity: "error",
                message:
                    "Product Price ID not found.",
            });


            return;
        }


        // ------------------------------------------------------
        // OPTIONAL CALLBACK
        // ------------------------------------------------------

        if (typeof onEdit === "function") {

            onEdit(row);
        }


        // ------------------------------------------------------
        // NAVIGATE
        // ------------------------------------------------------

        navigate(
            `/product-prices/edit/${productPriceId}`
        );
    };


    // ======================================================
    // DELETE
    // ======================================================

    const handleDelete = (
        event,
        row
    ) => {

        if (event) {

            event.preventDefault();
            event.stopPropagation();
        }


        if (readOnly) {
            return;
        }


        const productPriceId =
            getProductPriceId(row);


        console.log(
            "DELETE PRODUCT PRICE"
        );

        console.log(
            "Product Price ID:",
            productPriceId
        );


        if (typeof onDelete === "function") {

            onDelete(row);

            return;
        }


        setSnackbar({
            open: true,
            severity: "warning",
            message:
                "Delete handler is not configured.",
        });
    };


    // ======================================================
    // MORE MENU OPEN
    // ======================================================

    const handleMenuOpen = (
        event,
        row
    ) => {

        event.preventDefault();
        event.stopPropagation();


        setMenuState({
            anchorEl:
                event.currentTarget,
            row,
        });
    };


    // ======================================================
    // MORE MENU CLOSE
    // ======================================================

    const handleMenuClose = () => {

        setMenuState(
            INITIAL_MENU
        );
    };


    // ======================================================
    // MENU VIEW
    // ======================================================

    const handleMenuView = () => {

        const row =
            menuState.row;


        handleMenuClose();


        if (row) {

            handleView(
                null,
                row
            );
        }
    };


    // ======================================================
    // MENU EDIT
    // ======================================================

    const handleMenuEdit = () => {

        const row =
            menuState.row;


        handleMenuClose();


        if (row) {

            handleEdit(
                null,
                row
            );
        }
    };


    // ======================================================
    // MENU DELETE
    // ======================================================

    const handleMenuDelete = () => {

        const row =
            menuState.row;


        handleMenuClose();


        if (row) {

            handleDelete(
                null,
                row
            );
        }
    };


    // ======================================================
    // SNACKBAR CLOSE
    // ======================================================

    const handleSnackbarClose =
        () => {

            setSnackbar(
                (previous) => ({
                    ...previous,
                    open: false,
                })
            );
        };


    // ======================================================
    // STATISTICS
    // ======================================================

    const totalPrices =
        prices.length;


    const activePrices =
        prices.filter(
            (item) => {

                return (
                    item.isActive === true ||
                    item.IsActive === true ||
                    item.status === "Active" ||
                    item.Status === "Active" ||
                    item.status === "Enabled" ||
                    item.Status === "Enabled"
                );
            }
        ).length;


    const inactivePrices =
        totalPrices -
        activePrices;


    // ======================================================
    // DATA GRID COLUMNS
    // ======================================================

    const columns = useMemo(
        () => [

            // =================================================
            // PRICE ID
            // =================================================

            {
                field:
                    "productPriceId",

                headerName:
                    "Price ID",

                width: 100,
            },


            // =================================================
            // PRODUCT ID
            // =================================================

            {
                field:
                    "productId",

                headerName:
                    "Product ID",

                width: 110,
            },


            // =================================================
            // PRODUCT
            // =================================================

            {
                field:
                    "productName",

                headerName:
                    "Product",

                minWidth: 180,

                flex: 1,

                renderCell: ({
                    row,
                }) => {

                    const productName =
                        row?.productName ??
                        row?.ProductName ??
                        "-";


                    return (
                        <Typography
                            variant="body2"
                            fontWeight={500}
                        >
                            {productName}
                        </Typography>
                    );
                },
            },


            // =================================================
            // SKU
            // =================================================

            {
                field:
                    "productSku",

                headerName:
                    "SKU",

                minWidth: 140,

                flex: 0.8,

                renderCell: ({
                    row,
                }) => {

                    return (
                        row?.productSku ??
                        row?.ProductSku ??
                        row?.sku ??
                        row?.SKU ??
                        "-"
                    );
                },
            },


            // =================================================
            // PRICE TYPE
            // =================================================

            {
                field:
                    "priceType",

                headerName:
                    "Price Type",

                width: 130,

                renderCell: ({
                    row,
                }) => {

                    const value =
                        row?.priceType ??
                        row?.PriceType ??
                        "Standard";


                    return (
                        <Chip
                            size="small"
                            label={value}
                            variant="outlined"
                        />
                    );
                },
            },


            // =================================================
            // PRICE
            // =================================================

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
                    row,
                }) => {

                    const value =
                        row?.price ??
                        row?.Price ??
                        0;


                    return (
                        <Typography>
                            {
                                currencyFormatter.format(
                                    Number(value) || 0
                                )
                            }
                        </Typography>
                    );
                },
            },


            // =================================================
            // MRP
            // =================================================

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
                    row,
                }) => {

                    const value =
                        row?.mrp ??
                        row?.MRP ??
                        0;


                    return (
                        <Typography>
                            {
                                currencyFormatter.format(
                                    Number(value) || 0
                                )
                            }
                        </Typography>
                    );
                },
            },


            // =================================================
            // DISCOUNT
            // =================================================

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
                    row,
                }) => {

                    const value =
                        row?.discount ??
                        row?.Discount;


                    if (
                        value === null ||
                        value === undefined
                    ) {
                        return "-";
                    }


                    return (
                        `${Number(value).toFixed(2)}%`
                    );
                },
            },


            // =================================================
            // CURRENCY
            // =================================================

            {
                field:
                    "currency",

                headerName:
                    "Currency",

                width: 110,

                renderCell: ({
                    row,
                }) => {

                    return (
                        row?.currency ??
                        row?.Currency ??
                        "INR"
                    );
                },
            },


            // =================================================
            // STATUS
            // =================================================

            {
                field:
                    "status",

                headerName:
                    "Status",

                width: 130,

                renderCell: ({
                    row,
                }) => {

                    const status =
                        row?.status ??
                        row?.Status ??
                        (
                            row?.isActive === true ||
                            row?.IsActive === true
                                ? "Active"
                                : "Inactive"
                        );


                    return getStatusChip(
                        status
                    );
                },
            },


            // =================================================
            // ACTIONS
            // =================================================

            {
                field:
                    "actions",

                headerName:
                    "Actions",

                width:
                    readOnly
                        ? 120
                        : 170,

                sortable: false,

                filterable: false,

                disableColumnMenu: true,

                renderCell: ({
                    row,
                }) => {

                    return (

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                                gap: 0.25,
                            }}
                        >

                            {/* =================================
                                VIEW
                            ================================== */}

                            <Tooltip
                                title="View"
                            >

                                <IconButton
                                    type="button"
                                    size="small"
                                    color="primary"
                                    onClick={(event) =>
                                        handleView(
                                            event,
                                            row
                                        )
                                    }
                                >

                                    <Visibility
                                        fontSize="small"
                                    />

                                </IconButton>

                            </Tooltip>


                            {/* =================================
                                EDIT
                            ================================== */}

                            {!readOnly && (

                                <Tooltip
                                    title="Edit"
                                >

                                    <IconButton
                                        type="button"
                                        size="small"
                                        color="warning"
                                        onClick={(event) =>
                                            handleEdit(
                                                event,
                                                row
                                            )
                                        }
                                    >

                                        <Edit
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>
                            )}


                            {/* =================================
                                DELETE
                            ================================== */}

                            {!readOnly && (

                                <Tooltip
                                    title="Delete"
                                >

                                    <IconButton
                                        type="button"
                                        size="small"
                                        color="error"
                                        onClick={(event) =>
                                            handleDelete(
                                                event,
                                                row
                                            )
                                        }
                                    >

                                        <Delete
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>
                            )}


                            {/* =================================
                                MORE
                            ================================== */}

                            <Tooltip
                                title="More"
                            >

                                <IconButton
                                    type="button"
                                    size="small"
                                    onClick={(event) =>
                                        handleMenuOpen(
                                            event,
                                            row
                                        )
                                    }
                                >

                                    <MoreVert
                                        fontSize="small"
                                    />

                                </IconButton>

                            </Tooltip>

                        </Box>
                    );
                },
            },
        ],

        [
            readOnly,
        ]
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

            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (
                <LinearProgress />
            )}


            {/* ==================================================
                ERROR
            ================================================== */}

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


            {/* ==================================================
                HEADER
            ================================================== */}

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
                        Manage product pricing,
                        MRP, discounts and
                        price status.
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    {/* REFRESH */}

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


                    {/* ADD */}

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


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                mb={2}
            >

                {/* TOTAL */}

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


                {/* ACTIVE */}

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


                {/* INACTIVE */}

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


            {/* ==================================================
                MAIN CARD
            ================================================== */}

            <Card>

                <CardHeader
                    title="Product Price List"
                    subheader={
                        `${filteredPrices.length} price record(s) found`
                    }
                />


                <Divider />


                {/* =================================================
                    SEARCH
                ================================================= */}

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
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                >
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                </Box>


                <Divider />


                {/* =================================================
                    DATA GRID
                ================================================= */}

                <CardContent
                    sx={{
                        p: 0,
                    }}
                >

                    {filteredPrices.length === 0 ? (

                        <Box
                            py={8}
                            textAlign="center"
                        >

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                No Product Prices
                                Found
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {searchText
                                    ? "No price records match your search."
                                    : "There are no product price records available."
                                }
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
                                        Add Product Price
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


                                // --------------------------------
                                // ROW ID
                                // --------------------------------

                                getRowId={(row) =>
                                    getProductPriceId(
                                        row
                                    )
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

                                    "& .MuiDataGrid-cell":
                                        {
                                            display: "flex",
                                            alignItems:
                                                "center",
                                        },

                                    "& .MuiDataGrid-cell:focus":
                                        {
                                            outline:
                                                "none",
                                        },

                                    "& .MuiDataGrid-cell:focus-within":
                                        {
                                            outline:
                                                "none",
                                        },
                                }}
                            />

                        </Box>
                    )}

                </CardContent>

            </Card>


            {/* ==================================================
                MORE MENU
            ================================================== */}

            <Menu
                anchorEl={
                    menuState.anchorEl
                }

                open={
                    Boolean(
                        menuState.anchorEl
                    )
                }

                onClose={
                    handleMenuClose
                }
            >

                {/* VIEW */}

                <MenuItem
                    onClick={
                        handleMenuView
                    }
                >

                    <Visibility
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    View

                </MenuItem>


                {/* EDIT */}

                {!readOnly && (

                    <MenuItem
                        onClick={
                            handleMenuEdit
                        }
                    >

                        <Edit
                            fontSize="small"
                            sx={{
                                mr: 1,
                            }}
                        />

                        Edit

                    </MenuItem>
                )}


                {/* DELETE */}

                {!readOnly && (

                    <MenuItem
                        onClick={
                            handleMenuDelete
                        }
                    >

                        <Delete
                            fontSize="small"
                            sx={{
                                mr: 1,
                            }}
                        />

                        Delete

                    </MenuItem>
                )}

            </Menu>


            {/* ==================================================
                SNACKBAR
            ================================================== */}

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
// PROP TYPES
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