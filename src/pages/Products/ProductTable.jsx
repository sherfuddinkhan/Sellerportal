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

    onView,
    onViewBySKU,
    onEdit,
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
    // IS ACTIVE
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
    // RUN CALLBACK ACTION
    // =====================================================

    const runAction = (callback, ...args) => {

        handleMenuClose();

        if (typeof callback === "function") {
            callback(...args);
        }
    };

    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    const handleView = () => {

        const id = getProductId(selectedRow);

        handleMenuClose();

        if (!id) {
            return;
        }

        if (typeof onView === "function") {
            onView(selectedRow);
            return;
        }

        navigate(`/products/view/${id}`);
    };

    // =====================================================
    // VIEW PRODUCT BY SKU
    // =====================================================

    const handleViewBySKU = () => {

        const sku = getSKU(selectedRow);

        handleMenuClose();

        if (!sku) {
            return;
        }

        if (typeof onViewBySKU === "function") {
            onViewBySKU(selectedRow);
            return;
        }

        navigate(
            `/products/search?sku=${encodeURIComponent(sku)}`
        );
    };

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = () => {

        const id = getProductId(selectedRow);

        handleMenuClose();

        if (!id) {
            return;
        }

        if (typeof onEdit === "function") {
            onEdit(selectedRow);
            return;
        }

        // IMPORTANT:
        // App.jsx uses /products/edit/:id

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
            return;
        }

        if (typeof onSellerProducts === "function") {
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
            return;
        }

        if (typeof onCustomerProducts === "function") {
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
            return;
        }

        if (
            typeof onSellerCustomerProducts ===
            "function"
        ) {
            onSellerCustomerProducts(selectedRow);
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
            return;
        }

        if (typeof onBrandProducts === "function") {
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
            return;
        }

        if (typeof onCategoryProducts === "function") {
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

        if (typeof onStatusProducts === "function") {
            onStatusProducts(selectedRow);
            return;
        }

        navigate(
            `/products/status/${active}`
        );
    };

    // =====================================================
    // COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // SKU
        // =================================================

        {
            field: "sku",

            headerName: "SKU",

            width: 150,

            sortable: true,

            renderCell: (params) => {

                const sku =
                    getSKU(params.row);

                return (
                    <Tooltip title={sku || "N/A"}>

                        <Box
                            sx={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {sku || "N/A"}
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

                const name =
                    getProductName(params.row);

                return (
                    <Tooltip title={name || "N/A"}>

                        <Box
                            sx={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {name || "N/A"}
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

                <Tooltip title="Product Actions">

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
                    VIEW
                ================================================= */}

                <MenuItem onClick={handleView}>

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
                    EDIT
                ================================================= */}

                <MenuItem onClick={handleEdit}>

                    <Edit
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />

                    Edit Product

                </MenuItem>

                {/* =================================================
                    FILTERS
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
                    BRAND
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
                    CATEGORY
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

                    onClick={() =>
                        runAction(
                            onDelete,
                            selectedRow
                        )
                    }

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
