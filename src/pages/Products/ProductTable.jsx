// =========================================================
// ProductTable.jsx
// Marketplace Seller Portal
// Product Management
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {
    Visibility,
    Edit,
    Delete,
    MoreVert,
    Search,
    Business,
    Person,
    Link as LinkIcon,
    LocalOffer,
    Category,
    Inventory2,
    ToggleOn,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// COMPONENT
// =========================================================

const ProductTable = ({
    products = [],
    loading = false,

    onDelete,

    onSellerProducts,
    onCustomerProducts,
    onSellerCustomerProducts,
    onBrandProducts,
    onCategoryProducts,
    onProductTypeProducts,
    onStatusProducts,
}) => {

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null);

    // =====================================================
    // SAFE VALUE
    // =====================================================

    const getValue = (row, ...keys) => {

        if (!row) {
            return "";
        }

        for (const key of keys) {

            const value = row[key];

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                return value;
            }
        }

        return "";
    };

    // =====================================================
    // PRODUCT ID
    // =====================================================

    const getProductId = (row) =>
        getValue(
            row,
            "productId",
            "ProductId"
        );

    // =====================================================
    // SELLER ID
    // =====================================================

    const getSellerId = (row) =>
        getValue(
            row,
            "sellerId",
            "SellerId"
        );

    // =====================================================
    // CUSTOMER ID
    // =====================================================

    const getCustomerId = (row) =>
        getValue(
            row,
            "customerId",
            "CustomerId"
        );

    // =====================================================
    // SKU
    // =====================================================

    const getSKU = (row) =>
        getValue(
            row,
            "sku",
            "SKU"
        );

    // =====================================================
    // PRODUCT NAME
    // =====================================================

    const getProductName = (row) =>
        getValue(
            row,
            "productName",
            "ProductName"
        );

    // =====================================================
    // BRAND ID
    // =====================================================

    const getBrandId = (row) =>
        getValue(
            row,
            "brandId",
            "BrandId"
        );

    // =====================================================
    // CATEGORY ID
    // =====================================================

    const getCategoryId = (row) =>
        getValue(
            row,
            "categoryId",
            "CategoryId"
        );

    // =====================================================
    // PRODUCT TYPE ID
    // =====================================================

    const getProductTypeId = (row) =>
        getValue(
            row,
            "productTypeId",
            "ProductTypeId"
        );

    // =====================================================
    // ACTIVE STATUS
    // =====================================================

    const isActive = (row) => {

        const value = getValue(
            row,
            "isActive",
            "IsActive"
        );

        return (
            value === true ||
            value === 1 ||
            value === "1" ||
            value === "true" ||
            value === "True" ||
            value === "ACTIVE" ||
            value === "Active"
        );
    };

    // =====================================================
    // STATUS VALUE
    // =====================================================

    const getStatus = (row) => {

        const active = isActive(row);

        return active
            ? "Active"
            : "Inactive";
    };

    // =====================================================
    // OPEN ACTION MENU
    // =====================================================

    const handleMenuOpen = (event, row) => {

        event.stopPropagation();

        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    // =====================================================
    // CLOSE ACTION MENU
    // =====================================================

    const handleMenuClose = () => {

        setAnchorEl(null);
        setSelectedRow(null);
    };

    // =====================================================
    // VIEW PRODUCT
    //
    // React route:
    // /products/view/:id
    //
    // API:
    // GET /api/products/:id
    // =====================================================

    const handleView = () => {

        const productId =
            getProductId(selectedRow);

        handleMenuClose();

        if (!productId) {

            console.error(
                "Product ID is missing:",
                selectedRow
            );

            return;
        }

        navigate(
            `/products/view/${encodeURIComponent(
                productId
            )}`
        );
    };

    // =====================================================
    // VIEW BY SKU
    //
    // React route:
    // /products/sku/:sku
    //
    // API:
    // GET /api/products/sku/:sku
    // =====================================================

    const handleViewBySKU = () => {

        const sku =
            getSKU(selectedRow);

        handleMenuClose();

        if (!sku) {

            console.error(
                "SKU is missing:",
                selectedRow
            );

            return;
        }

        navigate(
            `/products/sku/${encodeURIComponent(
                sku
            )}`
        );
    };

    // =====================================================
    // EDIT PRODUCT
    //
    // React route:
    // /products/edit/:id
    //
    // API:
    // PUT /api/products/:id
    // =====================================================

    const handleEdit = () => {

        const productId =
            getProductId(selectedRow);

        console.log(
            "Selected Product:",
            selectedRow
        );

        console.log(
            "Product ID:",
            productId
        );

        handleMenuClose();

        if (
            !productId ||
            String(productId) === ":id"
        ) {

            console.error(
                "Invalid Product ID:",
                productId
            );

            return;
        }

        navigate(
            `/products/edit/${encodeURIComponent(
                productId
            )}`
        );
    };

    // =====================================================
    // PRODUCT FILTERS
    // =====================================================

    const handleProductFilters = () => {

        handleMenuClose();

        navigate(
            "/products/filters"
        );
    };

    // =====================================================
    // SELLER PRODUCTS
    //
    // API:
    // GET /api/products/seller/{sellerId}
    // =====================================================

    const handleSellerProducts = () => {

        const sellerId =
            getSellerId(selectedRow);

        handleMenuClose();

        if (!sellerId) {

            console.error(
                "Seller ID is missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onSellerProducts ===
            "function"
        ) {

            onSellerProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/seller/${encodeURIComponent(
                sellerId
            )}`
        );
    };

    // =====================================================
    // CUSTOMER PRODUCTS
    //
    // API:
    // GET /api/products/customer/{customerId}
    // =====================================================

    const handleCustomerProducts = () => {

        const customerId =
            getCustomerId(selectedRow);

        handleMenuClose();

        if (!customerId) {

            console.error(
                "Customer ID is missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onCustomerProducts ===
            "function"
        ) {

            onCustomerProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/customer/${encodeURIComponent(
                customerId
            )}`
        );
    };

    // =====================================================
    // SELLER + CUSTOMER PRODUCTS
    //
    // API:
    // GET /api/products/seller/{sellerId}/customer/{customerId}
    // =====================================================

    const handleSellerCustomerProducts = () => {

        const sellerId =
            getSellerId(selectedRow);

        const customerId =
            getCustomerId(selectedRow);

        handleMenuClose();

        if (!sellerId || !customerId) {

            console.error(
                "Seller ID or Customer ID missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onSellerCustomerProducts ===
            "function"
        ) {

            onSellerCustomerProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/seller/${encodeURIComponent(
                sellerId
            )}/customer/${encodeURIComponent(
                customerId
            )}`
        );
    };

    // =====================================================
    // BRAND PRODUCTS
    //
    // API:
    // GET /api/products/brand/{brandId}
    // =====================================================

    const handleBrandProducts = () => {

        const brandId =
            getBrandId(selectedRow);

        handleMenuClose();

        if (!brandId) {

            console.error(
                "Brand ID is missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onBrandProducts ===
            "function"
        ) {

            onBrandProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/brand/${encodeURIComponent(
                brandId
            )}`
        );
    };

    // =====================================================
    // CATEGORY PRODUCTS
    //
    // API:
    // GET /api/products/category/{categoryId}
    // =====================================================

    const handleCategoryProducts = () => {

        const categoryId =
            getCategoryId(selectedRow);

        handleMenuClose();

        if (!categoryId) {

            console.error(
                "Category ID is missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onCategoryProducts ===
            "function"
        ) {

            onCategoryProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/category/${encodeURIComponent(
                categoryId
            )}`
        );
    };

    // =====================================================
    // PRODUCT TYPE PRODUCTS
    //
    // API:
    // GET /api/products/product-type/{productTypeId}
    // =====================================================

    const handleProductTypeProducts = () => {

        const productTypeId =
            getProductTypeId(selectedRow);

        handleMenuClose();

        if (!productTypeId) {

            console.error(
                "Product Type ID is missing:",
                selectedRow
            );

            return;
        }

        if (
            typeof onProductTypeProducts ===
            "function"
        ) {

            onProductTypeProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/product-type/${encodeURIComponent(
                productTypeId
            )}`
        );
    };

    // =====================================================
    // STATUS PRODUCTS
    //
    // API:
    // GET /api/products/status/{status}
    //
    // Example:
    // GET /api/products/status/Active
    // =====================================================

    const handleStatusProducts = () => {

        const status =
            getStatus(selectedRow);

        handleMenuClose();

        if (
            typeof onStatusProducts ===
            "function"
        ) {

            onStatusProducts(
                selectedRow
            );

            return;
        }

        navigate(
            `/products/status/${encodeURIComponent(
                status
            )}`
        );
    };

    // =====================================================
    // DELETE PRODUCT
    //
    // API:
    // DELETE /api/products/{id}
    // =====================================================

    const handleDelete = () => {

        const row =
            selectedRow;

        const productId =
            getProductId(row);

        handleMenuClose();

        if (!productId) {

            console.error(
                "Product ID is missing:",
                row
            );

            return;
        }

        if (
            typeof onDelete ===
            "function"
        ) {

            onDelete(row);

            return;
        }

        console.warn(
            "onDelete callback was not provided."
        );
    };

    // =====================================================
    // COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // PRODUCT ID
        // =================================================

        {
            field: "productId",

            headerName:
                "Product ID",

            width: 110,

            sortable: true,

            renderCell: (params) => {

                const value =
                    getProductId(
                        params.row
                    );

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {value || "N/A"}
                    </Box>
                );
            },
        },

        // =================================================
        // SELLER ID
        // =================================================

        {
            field: "sellerId",

            headerName:
                "Seller ID",

            width: 110,

            sortable: true,

            renderCell: (params) => {

                const value =
                    getSellerId(
                        params.row
                    );

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {value || "N/A"}
                    </Box>
                );
            },
        },

        // =================================================
        // CUSTOMER ID
        // =================================================

        {
            field: "customerId",

            headerName:
                "Customer ID",

            width: 120,

            sortable: true,

            renderCell: (params) => {

                const value =
                    getCustomerId(
                        params.row
                    );

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {value || "N/A"}
                    </Box>
                );
            },
        },

        // =================================================
        // SKU
        // =================================================

        {
            field: "sku",

            headerName:
                "SKU",

            width: 150,

            sortable: true,

            renderCell: (params) => {

                const value =
                    getSKU(
                        params.row
                    );

                return (
                    <Tooltip
                        title={
                            value ||
                            "N/A"
                        }
                    >
                        <Box
                            sx={{
                                width: "100%",
                                overflow:
                                    "hidden",
                                textOverflow:
                                    "ellipsis",
                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            {value || "N/A"}
                        </Box>
                    </Tooltip>
                );
            },
        },

        // =================================================
        // PRODUCT NAME
        // =================================================

        {
            field: "productName",

            headerName:
                "Product Name",

            width: 250,

            sortable: true,

            renderCell: (params) => {

                const value =
                    getProductName(
                        params.row
                    );

                return (
                    <Tooltip
                        title={
                            value ||
                            "N/A"
                        }
                    >
                        <Box
                            sx={{
                                width: "100%",
                                overflow:
                                    "hidden",
                                textOverflow:
                                    "ellipsis",
                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            {value || "N/A"}
                        </Box>
                    </Tooltip>
                );
            },
        },

        // =================================================
        // STATUS
        // =================================================

        {
            field: "isActive",

            headerName:
                "Status",

            width: 120,

            sortable: true,

            renderCell: (params) => {

                const active =
                    isActive(
                        params.row
                    );

                return (
                    <Chip
                        size="small"

                        label={
                            active
                                ? "Active"
                                : "Inactive"
                        }

                        color={
                            active
                                ? "success"
                                : "error"
                        }
                    />
                );
            },
        },

        // =================================================
        // ACTIONS
        // =================================================

        {
            field: "actions",

            headerName:
                "Actions",

            width: 100,

            sortable: false,

            filterable: false,

            disableColumnMenu: true,

            renderCell: (params) => (

                <Tooltip
                    title="Product Actions"
                >
                    <IconButton
                        size="small"
                        color="primary"

                        onClick={(event) =>
                            handleMenuOpen(
                                event,
                                params.row
                            )
                        }
                    >
                        <MoreVert />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    height: 600,
                }}
            >

                <DataGrid

                    rows={
                        Array.isArray(products)
                            ? products
                            : []
                    }

                    columns={
                        columns
                    }

                    loading={
                        loading
                    }

                    getRowId={(row) => {

                        const id =
                            getProductId(
                                row
                            );

                        return id;
                    }}

                    pageSizeOptions={[
                        5,
                        10,
                        20,
                        50,
                    ]}

                    disableRowSelectionOnClick

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                                page: 0,
                            },
                        },
                    }}

                    sx={{
                        width: "100%",

                        borderRadius: 2,

                        "& .MuiDataGrid-cell": {
                            overflow: "hidden",
                        },

                        "& .MuiDataGrid-columnHeaders": {
                            fontWeight: 700,
                        },
                    }}
                />

            </Box>

            {/* =================================================
                ACTION MENU
            ================================================= */}

            <Menu
                anchorEl={
                    anchorEl
                }

                open={
                    Boolean(
                        anchorEl
                    )
                }

                onClose={
                    handleMenuClose
                }

                PaperProps={{
                    sx: {
                        minWidth: 250,
                    },
                }}
            >

                {/* =================================================
                    VIEW PRODUCT
                ================================================= */}

                <MenuItem
                    onClick={
                        handleView
                    }
                >

                    <Visibility
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    View Product

                </MenuItem>


                {/* =================================================
                    VIEW BY SKU
                ================================================= */}

                <MenuItem
                    onClick={
                        handleViewBySKU
                    }
                >

                    <Search
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    View By SKU

                </MenuItem>


                {/* =================================================
                    EDIT PRODUCT
                ================================================= */}

                <MenuItem
                    onClick={
                        handleEdit
                    }
                >

                    <Edit
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Edit Product

                </MenuItem>


                {/* =================================================
                    PRODUCT FILTERS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleProductFilters
                    }
                >

                    <Search
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Product Filters

                </MenuItem>


                {/* =================================================
                    SELLER PRODUCTS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleSellerProducts
                    }
                >

                    <Business
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Seller Products

                </MenuItem>


                {/* =================================================
                    CUSTOMER PRODUCTS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleCustomerProducts
                    }
                >

                    <Person
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Customer Products

                </MenuItem>


                {/* =================================================
                    SELLER + CUSTOMER
                ================================================= */}

                <MenuItem
                    onClick={
                        handleSellerCustomerProducts
                    }
                >

                    <LinkIcon
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Seller + Customer

                </MenuItem>


                {/* =================================================
                    BRAND PRODUCTS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleBrandProducts
                    }
                >

                    <LocalOffer
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Brand Products

                </MenuItem>


                {/* =================================================
                    CATEGORY PRODUCTS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleCategoryProducts
                    }
                >

                    <Category
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Category Products

                </MenuItem>


                {/* =================================================
                    PRODUCT TYPE PRODUCTS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleProductTypeProducts
                    }
                >

                    <Inventory2
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Product Type Products

                </MenuItem>


                {/* =================================================
                    PRODUCTS BY STATUS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleStatusProducts
                    }
                >

                    <ToggleOn
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Products By Status

                </MenuItem>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <Box
                    sx={{
                        borderTop:
                            "1px solid",

                        borderColor:
                            "divider",

                        my: 0.5,
                    }}
                />


                {/* =================================================
                    DELETE PRODUCT
                ================================================= */}

                <MenuItem
                    onClick={
                        handleDelete
                    }

                    sx={{
                        color:
                            "error.main",
                    }}
                >

                    <Delete
                        fontSize="small"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Delete Product

                </MenuItem>

            </Menu>

        </Box>
    );
};

export default ProductTable;
