// =========================================================
// ProductPriceTable.jsx
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
} from "@mui/icons-material";

import {
    DataGrid,
} from "@mui/x-data-grid";

// =========================================================
// Product Price Table
// =========================================================

const ProductPriceTable = ({
    productPrices = [],
    loading = false,

    onView,
    onEdit,
    onDelete,
}) => {

    // =====================================================
    // HELPER
    // Supports PascalCase + camelCase API responses
    // =====================================================

    const getValue = (
        row,
        pascalCase,
        camelCase,
        fallback = "-"
    ) => {

        const value =
            row?.[pascalCase] ??
            row?.[camelCase];

        return value == null || value === ""
            ? fallback
            : value;
    };


    // =====================================================
    // COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // PRODUCT
        // =================================================

        {
            field: "ProductName",
            headerName: "Product",
            flex: 1.5,
            minWidth: 220,

            valueGetter: (value, row) =>
                getValue(
                    row,
                    "ProductName",
                    "productName"
                ),
        },


        // =================================================
        // SKU
        // =================================================

        {
            field: "SKU",
            headerName: "SKU",
            width: 140,

            valueGetter: (value, row) =>
                getValue(
                    row,
                    "SKU",
                    "sku"
                ),
        },


        // =================================================
        // PRICE TYPE
        // =================================================

        {
            field: "PriceType",
            headerName: "Price Type",
            width: 150,

            valueGetter: (value, row) =>
                getValue(
                    row,
                    "PriceType",
                    "priceType"
                ),
        },


        // =================================================
        // PRICE
        // =================================================

        {
            field: "Price",
            headerName: "Price",
            width: 140,

            valueGetter: (value, row) =>
                row?.Price ??
                row?.price ??
                null,

            valueFormatter: (value) => {

                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return "-";
                }

                const number = Number(value);

                return Number.isNaN(number)
                    ? "-"
                    : `₹ ${number.toFixed(2)}`;
            },
        },


        // =================================================
        // CURRENCY
        // =================================================

        {
            field: "Currency",
            headerName: "Currency",
            width: 120,

            valueGetter: (value, row) =>
                getValue(
                    row,
                    "Currency",
                    "currency"
                ),
        },


        // =================================================
        // EFFECTIVE FROM
        // =================================================

        {
            field: "EffectiveFrom",
            headerName: "Effective From",
            width: 170,

            valueGetter: (value, row) =>
                row?.EffectiveFrom ??
                row?.effectiveFrom ??
                null,

            valueFormatter: (value) => {

                if (!value) {
                    return "-";
                }

                const date = new Date(value);

                return Number.isNaN(date.getTime())
                    ? "-"
                    : date.toLocaleDateString();
            },
        },


        // =================================================
        // EFFECTIVE TO
        // =================================================

        {
            field: "EffectiveTo",
            headerName: "Effective To",
            width: 170,

            valueGetter: (value, row) =>
                row?.EffectiveTo ??
                row?.effectiveTo ??
                null,

            valueFormatter: (value) => {

                if (!value) {
                    return "-";
                }

                const date = new Date(value);

                return Number.isNaN(date.getTime())
                    ? "-"
                    : date.toLocaleDateString();
            },
        },


        // =================================================
        // STATUS
        // =================================================

        {
            field: "IsActive",
            headerName: "Status",
            width: 120,

            valueGetter: (value, row) =>
                row?.IsActive ??
                row?.isActive ??
                false,

            renderCell: (params) => {

                const active = Boolean(params.value);

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
                        variant="filled"
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
            width: 160,

            sortable: false,
            filterable: false,

            renderCell: (params) => (

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >

                    {/* =====================================
                        VIEW
                    ===================================== */}

                    <Tooltip title="View">

                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() =>
                                onView?.(params.row)
                            }
                        >
                            <Visibility />
                        </IconButton>

                    </Tooltip>


                    {/* =====================================
                        EDIT
                    ===================================== */}

                    <Tooltip title="Edit">

                        <IconButton
                            color="warning"
                            size="small"
                            onClick={() =>
                                onEdit?.(params.row)
                            }
                        >
                            <Edit />
                        </IconButton>

                    </Tooltip>


                    {/* =====================================
                        DELETE
                    ===================================== */}

                    <Tooltip title="Delete">

                        <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                                onDelete?.(params.row)
                            }
                        >
                            <Delete />
                        </IconButton>

                    </Tooltip>

                </Box>
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
                height: 650,
            }}
        >

            <DataGrid
                rows={productPrices}
                columns={columns}
                loading={loading}

                // =========================================
                // IMPORTANT:
                // ProductPriceId is the unique database ID
                // =========================================

                getRowId={(row) =>
                    row?.ProductPriceId ??
                    row?.productPriceId
                }

                disableRowSelectionOnClick

                // =========================================
                // Since pagination is handled by
                // ProductPricePagination.jsx,
                // disable DataGrid pagination.
                // =========================================

                hideFooterPagination

                sx={{
                    borderRadius: 2,

                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "bold",
                    },

                    "& .MuiDataGrid-cell": {
                        display: "flex",
                        alignItems: "center",
                    },
                }}
            />

        </Box>
    );
};

export default ProductPriceTable;
