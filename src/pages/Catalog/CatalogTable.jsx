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
    loading = false,
}) => {
    // =========================================================
    // GET ID
    // =========================================================

    const getId = (catalog) =>
        catalog?.catalogId ??
        catalog?.id ??
        catalog?.productId;

    // =========================================================
    // CHECK ALL
    // =========================================================

    const allSelected =
        catalogs.length > 0 &&
        catalogs.every((catalog) =>
            selectedIds.includes(
                getId(catalog)
            )
        );

    // =========================================================
    // HANDLE SELECT ALL
    // =========================================================

    const handleSelectAll = (
        event
    ) => {
        if (!onSelectionChange) {
            return;
        }

        if (event.target.checked) {
            onSelectionChange(
                catalogs
                    .map(getId)
                    .filter(
                        (id) =>
                            id !==
                            undefined
                    )
            );
        } else {
            onSelectionChange([]);
        }
    };

    // =========================================================
    // HANDLE SELECT ONE
    // =========================================================

    const handleSelectOne = (
        catalog
    ) => {
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

        if (
            selectedIds.includes(id)
        ) {
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
    // PRODUCT NAME
    // =========================================================

    const getProductName = (
        catalog
    ) =>
        catalog?.catalogName ??
        catalog?.productName ??
        catalog?.product?.productName ??
        catalog?.name ??
        "—";

    // =========================================================
    // PRODUCT CODE
    // =========================================================

    const getProductCode = (
        catalog
    ) =>
        catalog?.productCode ??
        catalog?.sku ??
        catalog?.product?.productCode ??
        catalog?.product?.sku ??
        "—";

    // =========================================================
    // STOCK
    // =========================================================

    const getStock = (catalog) =>
        Number(
            catalog?.stock ??
                catalog?.quantity ??
                catalog?.productInventory
                    ?.quantity ??
                catalog?.inventory
                    ?.quantity ??
                0
        );

    // =========================================================
    // STATUS
    // =========================================================

    const getStatus = (catalog) => {
        const status =
            catalog?.status ??
            catalog?.isActive;

        if (
            status === true ||
            status === "Active" ||
            status === "active"
        ) {
            return "Active";
        }

        if (
            status === false ||
            status === "Inactive" ||
            status === "inactive"
        ) {
            return "Inactive";
        }

        return status || "Unknown";
    };

    // =========================================================
    // STATUS COLOR
    // =========================================================

    const getStatusColor = (
        status
    ) => {
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

                        {/* CODE */}

                        <TableCell>
                            <strong>
                                Product Code
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

                        <TableCell align="center">
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
                        (catalog, index) => {
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

                            const stock =
                                getStock(
                                    catalog
                                );

                            const status =
                                getStatus(
                                    catalog
                                );

                            const customerName =
                                catalog?.customerName ??
                                catalog?.customer
                                    ?.customerName ??
                                catalog?.customer
                                    ?.name ??
                                "—";

                            return (
                                <TableRow
                                    key={
                                        id ??
                                        index
                                    }
                                    hover
                                    selected={selectedIds.includes(
                                        id
                                    )}
                                >
                                    {/* SELECT */}

                                    <TableCell
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                id
                                            )}
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

                                    {/* CODE */}

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

                                    {/* CUSTOMER */}

                                    <TableCell>
                                        {
                                            customerName
                                        }
                                    </TableCell>

                                    {/* PRICE */}

                                    <TableCell align="right">
                                        {formatPrice(
                                            catalog?.price ??
                                                catalog
                                                    ?.sellingPrice ??
                                                catalog
                                                    ?.product
                                                    ?.price
                                        )}
                                    </TableCell>

                                    {/* STOCK */}

                                    <TableCell align="center">
                                        {renderStock(
                                            stock
                                        )}
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell align="center">
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

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            {/* VIEW */}

                                            <Tooltip title="View">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onView?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* EDIT */}

                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() =>
                                                        onEdit?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* DELETE */}

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete?.(
                                                            catalog
                                                        )
                                                    }
                                                >
                                                    <Delete fontSize="small" />
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