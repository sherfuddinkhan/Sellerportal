// =========================================================
// CatalogTable.jsx
// =========================================================

import React from "react";

import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Delete,
    Edit,
    Visibility,
    Image,
    Tune,
    Reviews,
    AccountTree,
    Store,
    Publish,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CatalogTable = ({
    catalogs = [],

    selectedIds = [],
    onSelectionChange,

    onView,
    onEdit,
    onDelete,

    onImages,
    onAttributes,
    onReviews,
    onRelated,

    onMarketplace,
    onPublish,

    loading = false,
}) => {

    // =========================================================
    // GET PRODUCT / CATALOG ID
    // =========================================================

    const getId = (catalog) =>
        catalog?.productId ??
        catalog?.ProductId ??
        catalog?.catalogId ??
        catalog?.CatalogId ??
        catalog?.id ??
        catalog?.Id;

    // =========================================================
    // GET PRODUCT NAME
    // =========================================================

    const getProductName = (catalog) =>
        catalog?.productName ??
        catalog?.ProductName ??
        catalog?.catalogName ??
        catalog?.CatalogName ??
        catalog?.product?.productName ??
        catalog?.name ??
        "—";

    // =========================================================
    // GET SKU / PRODUCT CODE
    // =========================================================

    const getProductCode = (catalog) =>
        catalog?.sku ??
        catalog?.SKU ??
        catalog?.productCode ??
        catalog?.ProductCode ??
        catalog?.product?.sku ??
        catalog?.product?.productCode ??
        "—";

    // =========================================================
    // GET CUSTOMER
    // =========================================================

    const getCustomerName = (catalog) =>
        catalog?.customerName ??
        catalog?.CustomerName ??
        catalog?.customer?.customerName ??
        catalog?.customer?.CustomerName ??
        catalog?.customer?.name ??
        "—";

    // =========================================================
    // GET BRAND
    // =========================================================

    const getBrandName = (catalog) =>
        catalog?.brandName ??
        catalog?.BrandName ??
        catalog?.brand?.brandName ??
        catalog?.brand?.BrandName ??
        "—";

    // =========================================================
    // GET CATEGORY
    // =========================================================

    const getCategoryName = (catalog) =>
        catalog?.categoryName ??
        catalog?.CategoryName ??
        catalog?.category?.categoryName ??
        catalog?.category?.CategoryName ??
        "—";

    // =========================================================
    // GET PRICE
    // =========================================================

    const getPrice = (catalog) =>
        catalog?.price ??
        catalog?.sellingPrice ??
        catalog?.sellingPriceAmount ??
        catalog?.product?.price ??
        catalog?.product?.sellingPrice;

    // =========================================================
    // FORMAT PRICE
    // =========================================================

    const formatPrice = (value) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "—";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return `₹${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // =========================================================
    // GET STOCK
    // =========================================================

    const getStock = (catalog) => {

        const value =
            catalog?.stock ??
            catalog?.quantity ??
            catalog?.stockQuantity ??
            catalog?.productInventory?.quantity ??
            catalog?.inventory?.quantity ??
            0;

        const number = Number(value);

        return Number.isNaN(number)
            ? 0
            : number;
    };

    // =========================================================
    // GET STATUS
    // =========================================================

    const getStatus = (catalog) => {

        const status =
            catalog?.status ??
            catalog?.Status;

        const isActive =
            catalog?.isActive ??
            catalog?.IsActive;

        if (
            status !== undefined &&
            status !== null &&
            status !== ""
        ) {
            return String(status);
        }

        if (isActive === true) {
            return "Active";
        }

        if (isActive === false) {
            return "Inactive";
        }

        return "Unknown";
    };

    // =========================================================
    // STATUS COLOR
    // =========================================================

    const getStatusColor = (status) => {

        switch (
            String(status).toLowerCase()
        ) {

            case "active":
                return "success";

            case "inactive":
                return "default";

            case "pending":
                return "warning";

            case "draft":
                return "info";

            case "published":
                return "success";

            case "rejected":
                return "error";

            case "out of stock":
                return "error";

            default:
                return "default";
        }
    };

    // =========================================================
    // STOCK CHIP
    // =========================================================

    const renderStock = (stock) => {

        if (stock <= 0) {

            return (
                <Chip
                    label="Out of Stock"
                    color="error"
                    size="small"
                />
            );

        }

        if (stock <= 10) {

            return (
                <Chip
                    label={`${stock} Low`}
                    color="warning"
                    size="small"
                />
            );

        }

        return (
            <Chip
                label={stock}
                color="success"
                size="small"
            />
        );

    };

    // =========================================================
    // SELECT ALL
    // =========================================================

    const allSelected =
        catalogs.length > 0 &&
        catalogs.every((catalog) =>
            selectedIds.includes(
                getId(catalog)
            )
        );

    // =========================================================
    // SELECT ALL HANDLER
    // =========================================================

    const handleSelectAll = (event) => {

        if (!onSelectionChange) {
            return;
        }

        if (event.target.checked) {

            const ids = catalogs
                .map(getId)
                .filter(
                    (id) =>
                        id !== undefined &&
                        id !== null
                );

            onSelectionChange(ids);

        } else {

            onSelectionChange([]);

        }

    };

    // =========================================================
    // SELECT ONE
    // =========================================================

    const handleSelectOne = (catalog) => {

        if (!onSelectionChange) {
            return;
        }

        const id = getId(catalog);

        if (
            id === undefined ||
            id === null
        ) {
            return;
        }

        if (selectedIds.includes(id)) {

            onSelectionChange(
                selectedIds.filter(
                    (selectedId) =>
                        selectedId !== id
                )
            );

        } else {

            onSelectionChange([
                ...selectedIds,
                id,
            ]);

        }

    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <TableContainer
                component={Paper}
                elevation={1}
            >
                <Box
                    sx={{
                        py: 8,
                        textAlign: "center",
                    }}
                >

                    <Typography
                        color="text.secondary"
                    >
                        Loading catalogs...
                    </Typography>

                </Box>
            </TableContainer>
        );

    }

    // =========================================================
    // EMPTY
    // =========================================================

    if (!catalogs.length) {

        return (
            <TableContainer
                component={Paper}
                elevation={1}
            >

                <Box
                    sx={{
                        py: 8,
                        px: 2,
                        textAlign: "center",
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                    >
                        No Catalogs Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        There are no catalog records
                        available to display.
                    </Typography>

                </Box>

            </TableContainer>
        );

    }

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <TableContainer
            component={Paper}
            elevation={1}
            sx={{
                borderRadius: 2,
                overflowX: "auto",
            }}
        >

            <Table
                stickyHeader
                size="small"
            >

                {/* =================================================
                    HEADER
                   ================================================= */}

                <TableHead>

                    <TableRow>

                        {/* SELECT */}

                        <TableCell
                            padding="checkbox"
                        >

                            <Checkbox
                                checked={
                                    allSelected
                                }

                                indeterminate={
                                    selectedIds.length >
                                        0 &&
                                    !allSelected
                                }

                                onChange={
                                    handleSelectAll
                                }

                                inputProps={{
                                    "aria-label":
                                        "Select all catalogs",
                                }}
                            />

                        </TableCell>

                        {/* ID */}

                        <TableCell>
                            <strong>
                                ID
                            </strong>
                        </TableCell>

                        {/* PRODUCT */}

                        <TableCell>
                            <strong>
                                Product
                            </strong>
                        </TableCell>

                        {/* SKU */}

                        <TableCell>
                            <strong>
                                SKU
                            </strong>
                        </TableCell>

                        {/* BRAND */}

                        <TableCell>
                            <strong>
                                Brand
                            </strong>
                        </TableCell>

                        {/* CATEGORY */}

                        <TableCell>
                            <strong>
                                Category
                            </strong>
                        </TableCell>

                        {/* CUSTOMER */}

                        <TableCell>
                            <strong>
                                Customer
                            </strong>
                        </TableCell>

                        {/* PRICE */}

                        <TableCell align="right">
                            <strong>
                                Price
                            </strong>
                        </TableCell>

                        {/* STOCK */}

                        <TableCell align="center">
                            <strong>
                                Stock
                            </strong>
                        </TableCell>

                        {/* STATUS */}

                        <TableCell align="center">
                            <strong>
                                Status
                            </strong>
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell
                            align="center"
                            sx={{
                                minWidth: 300
                            }}
                        >
                            <strong>
                                Actions
                            </strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                {/* =================================================
                    BODY
                   ================================================= */}

                <TableBody>

                    {catalogs.map(
                        (
                            catalog,
                            index
                        ) => {

                            const id =
                                getId(
                                    catalog
                                );

                            const productName =
                                getProductName(
                                    catalog
                                );

                            const productCode =
                                getProductCode(
                                    catalog
                                );

                            const brandName =
                                getBrandName(
                                    catalog
                                );

                            const categoryName =
                                getCategoryName(
                                    catalog
                                );

                            const customerName =
                                getCustomerName(
                                    catalog
                                );

                            const price =
                                getPrice(
                                    catalog
                                );

                            const stock =
                                getStock(
                                    catalog
                                );

                            const status =
                                getStatus(
                                    catalog
                                );

                            const isSelected =
                                selectedIds.includes(
                                    id
                                );

                            return (

                                <TableRow
                                    key={
                                        id ??
                                        index
                                    }

                                    hover

                                    selected={
                                        isSelected
                                    }
                                >

                                    {/* SELECT */}

                                    <TableCell
                                        padding="checkbox"
                                    >

                                        <Checkbox
                                            checked={
                                                isSelected
                                            }

                                            onChange={() =>
                                                handleSelectOne(
                                                    catalog
                                                )
                                            }
                                        />

                                    </TableCell>

                                    {/* ID */}

                                    <TableCell>
                                        {id ??
                                            "—"}
                                    </TableCell>

                                    {/* PRODUCT */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {
                                                productName
                                            }
                                        </Typography>

                                    </TableCell>

                                    {/* SKU */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {
                                                productCode
                                            }
                                        </Typography>

                                    </TableCell>

                                    {/* BRAND */}

                                    <TableCell>
                                        {
                                            brandName
                                        }
                                    </TableCell>

                                    {/* CATEGORY */}

                                    <TableCell>
                                        {
                                            categoryName
                                        }
                                    </TableCell>

                                    {/* CUSTOMER */}

                                    <TableCell>
                                        {
                                            customerName
                                        }
                                    </TableCell>

                                    {/* PRICE */}

                                    <TableCell
                                        align="right"
                                    >
                                        {formatPrice(
                                            price
                                        )}
                                    </TableCell>

                                    {/* STOCK */}

                                    <TableCell
                                        align="center"
                                    >
                                        {renderStock(
                                            stock
                                        )}
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Chip
                                            label={
                                                status
                                            }

                                            color={getStatusColor(
                                                status
                                            )}

                                            size="small"
                                        />

                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                gap: 0.3,

                                                flexWrap:
                                                    "nowrap"
                                            }}
                                        >

                                            {/* =================================
                                                VIEW
                                            ================================= */}

                                            <Tooltip title="View Product">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onView?.(
                                                            catalog
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
                                            ================================= */}

                                            <Tooltip title="Edit Product">

                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() =>
                                                        onEdit?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Edit
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                IMAGES
                                            ================================= */}

                                            <Tooltip title="Product Images">

                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() =>
                                                        onImages?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Image
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                ATTRIBUTES
                                            ================================= */}

                                            <Tooltip title="Product Attributes">

                                                <IconButton
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() =>
                                                        onAttributes?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Tune
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                REVIEWS
                                            ================================= */}

                                            <Tooltip title="Product Reviews">

                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() =>
                                                        onReviews?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Reviews
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                RELATED PRODUCTS
                                            ================================= */}

                                            <Tooltip title="Related Products">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onRelated?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <AccountTree
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                MARKETPLACE
                                            ================================= */}

                                            <Tooltip title="Marketplace">

                                                <IconButton
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() =>
                                                        onMarketplace?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Store
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                PUBLISH
                                            ================================= */}

                                            <Tooltip title="Publish Product">

                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() =>
                                                        onPublish?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Publish
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                            {/* =================================
                                                DELETE
                                            ================================= */}

                                            <Tooltip title="Delete Product">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Delete
                                                        fontSize="small"
                                                    />
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

    );

};

export default CatalogTable;
