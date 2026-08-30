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

            if (
                row[key] !== undefined &&
                row[key] !== null &&
                row[key] !== ""
            ) {
                return row[key];
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
            value === "true" ||
            value === "True"
        );
    };

    // =====================================================
    // OPEN MENU
    // =====================================================

    const handleMenuOpen = (event, row) => {

        event.stopPropagation();

        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    // =====================================================
    // CLOSE MENU
    // =====================================================

    const handleMenuClose = () => {

        setAnchorEl(null);
        setSelectedRow(null);
    };

    // =====================================================
    // VIEW PRODUCT
    //
    // IMPORTANT:
    // This ALWAYS redirects to a PAGE.
    // It does NOT call onView.
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
            `/products/view/${productId}`
        );
    };

    // =====================================================
    // VIEW BY SKU
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
            `/products/search?sku=${encodeURIComponent(
                sku
            )}`
        );
    };

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

const handleEdit = () => {
    const id = getProductId(selectedRow);

    console.log("Selected row:", selectedRow);
    console.log("Product ID:", id);

    handleMenuClose();

    if (!id || String(id) === ":id") {
        console.error("Invalid Product ID:", id);
        return;
    }

    navigate(`/products/edit/${id}`);
};

    // =====================================================
    // SELLER PRODUCTS
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
            onSellerProducts(selectedRow);
            return;
        }

        navigate(
            `/products/seller/${sellerId}`
        );
    };

    // =====================================================
    // CUSTOMER PRODUCTS
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
            onCustomerProducts(selectedRow);
            return;
        }

        navigate(
            `/products/customer/${customerId}`
        );
    };

    // =====================================================
    // SELLER + CUSTOMER PRODUCTS
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
            `/products/seller/${sellerId}/customer/${customerId}`
        );
    };

    // =====================================================
    // BRAND PRODUCTS
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
            onBrandProducts(selectedRow);
            return;
        }

        navigate(
            `/products/brand/${brandId}`
        );
    };

    // =====================================================
    // CATEGORY PRODUCTS
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
            onCategoryProducts(selectedRow);
            return;
        }

        navigate(
            `/products/category/${categoryId}`
        );
    };

    // =====================================================
    // PRODUCT TYPE PRODUCTS
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
            onProductTypeProducts(selectedRow);
            return;
        }

        navigate(
            `/products/product-type/${productTypeId}`
        );
    };

    // =====================================================
    // STATUS PRODUCTS
    // =====================================================

    const handleStatusProducts = () => {

        const active =
            isActive(selectedRow);

        handleMenuClose();

        if (
            typeof onStatusProducts ===
            "function"
        ) {
            onStatusProducts(selectedRow);
            return;
        }

        navigate(
            `/products/status/${active}`
        );
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = () => {

        const row = selectedRow;

        handleMenuClose();

        if (
            typeof onDelete ===
            "function"
        ) {
            onDelete(row);
        }
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
            headerName: "Product ID",
            width: 110,
            sortable: true,

            renderCell: (params) => {

                const value =
                    getProductId(params.row);

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
            headerName: "Seller ID",
            width: 110,
            sortable: true,

            renderCell: (params) => {

                const value =
                    getSellerId(params.row);

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
            headerName: "Customer ID",
            width: 120,
            sortable: true,

            renderCell: (params) => {

                const value =
                    getCustomerId(params.row);

                return (
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
            headerName: "SKU",
            width: 150,
            sortable: true,

            renderCell: (params) => {

                const value =
                    getSKU(params.row);

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
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
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
            headerName: "Product Name",
            width: 250,
            sortable: true,

            renderCell: (params) => {

                const value =
                    getProductName(params.row);

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
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
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
            headerName: "Status",
            width: 120,
            sortable: true,

            renderCell: (params) => {

                const active =
                    isActive(params.row);

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
            headerName: "Actions",
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

                    columns={columns}

                    loading={loading}

                    getRowId={(row) =>
                        getProductId(row)
                    }

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
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}

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
                    onClick={handleView}
                >

                    <Visibility
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    View Product

                </MenuItem>

                {/* =================================================
                    VIEW BY SKU
                ================================================= */}

                <MenuItem
                    onClick={handleViewBySKU}
                >

                    <Search
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    View By SKU

                </MenuItem>

                {/* =================================================
                    EDIT PRODUCT
                ================================================= */}

                <MenuItem
                    onClick={handleEdit}
                >

                    <Edit
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    Edit Product

                </MenuItem>

                {/* =================================================
                    PRODUCT FILTERS
                ================================================= */}

                <MenuItem
                    onClick={() => {

                        handleMenuClose();

                        navigate(
                            "/products/filters"
                        );

                    }}
                >

                    <Search
                        fontSize="small"
                        sx={{ mr: 1 }}
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
                        sx={{ mr: 1 }}
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
                        sx={{ mr: 1 }}
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
                        sx={{ mr: 1 }}
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
                        sx={{ mr: 1 }}
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
                        sx={{ mr: 1 }}
                    />

                    Category Products

                </MenuItem>

                {/* =================================================
                    PRODUCT TYPE
                ================================================= */}

                <MenuItem
                    onClick={
                        handleProductTypeProducts
                    }
                >

                    <Inventory2
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    Product Type Products

                </MenuItem>

                {/* =================================================
                    STATUS
                ================================================= */}

                <MenuItem
                    onClick={
                        handleStatusProducts
                    }
                >

                    <ToggleOn
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    Products By Status

                </MenuItem>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <Box
                    sx={{
                        borderTop: "1px solid",
                        borderColor: "divider",
                        my: 0.5,
                    }}
                />

                {/* =================================================
                    DELETE
                ================================================= */}

                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        color: "error.main",
                    }}
                >

                    <Delete
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    Delete Product

                </MenuItem>

            </Menu>

        </Box>
    );
};

export default ProductTable;
