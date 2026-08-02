import React from "react";

import { DataGrid } from "@mui/x-data-grid";

import {
    Box,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const ProductPriceTable = ({

    productPrices = [],

    loading = false,

    onView,

    onEdit,

    onDelete

}) => {

    const columns = [

        {
            field: "ProductName",
            headerName: "Product",
            flex: 1.5,
            minWidth: 220,

            valueGetter: (value, row) =>

                row.ProductName ||

                row.productName ||

                "-"
        },

        {
            field: "SKU",
            headerName: "SKU",
            width: 130,

            valueGetter: (value, row) =>

                row.SKU ||

                row.sku ||

                "-"
        },

        {
            field: "PriceType",
            headerName: "Price Type",
            width: 140
        },

        {
            field: "Price",
            headerName: "Price",
            width: 130,

            valueFormatter: (value) =>

                value == null

                    ? "-"

                    : `₹ ${Number(value).toFixed(2)}`
        },

        {
            field: "Currency",
            headerName: "Currency",
            width: 120
        },

        {
            field: "EffectiveFrom",
            headerName: "Effective From",
            width: 170,

            valueFormatter: (value) =>

                value

                    ? new Date(value).toLocaleDateString()

                    : "-"
        },

        {
            field: "EffectiveTo",
            headerName: "Effective To",
            width: 170,

            valueFormatter: (value) =>

                value

                    ? new Date(value).toLocaleDateString()

                    : "-"
        },

        {
            field: "IsActive",
            headerName: "Status",
            width: 120,

            renderCell: (params) => (

                <Chip

                    size="small"

                    label={
                        params.value

                            ? "Active"

                            : "Inactive"
                    }

                    color={
                        params.value

                            ? "success"

                            : "error"
                    }

                />

            )

        },

        {
            field: "actions",

            headerName: "Actions",

            width: 160,

            sortable: false,

            filterable: false,

            renderCell: (params) => (

                <>

                    <Tooltip title="View">

                        <IconButton

                            color="primary"

                            onClick={() =>

                                onView(params.row)

                            }

                        >

                            <Visibility />

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton

                            color="warning"

                            onClick={() =>

                                onEdit(params.row)

                            }

                        >

                            <Edit />

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete">

                        <IconButton

                            color="error"

                            onClick={() =>

                                onDelete(params.row)

                            }

                        >

                            <Delete />

                        </IconButton>

                    </Tooltip>

                </>

            )

        }

    ];

    return (

        <Box

            sx={{

                height: 650,

                width: "100%"

            }}

        >

            <DataGrid

                rows={productPrices}

                columns={columns}

                loading={loading}

                getRowId={(row) =>

                    row.ProductPriceId
                }

                disableRowSelectionOnClick

                pageSizeOptions={[5, 10, 20, 50]}

                initialState={{

                    pagination: {

                        paginationModel: {

                            page: 0,

                            pageSize: 10

                        }

                    }

                }}

            />

        </Box>

    );

};

export default ProductPriceTable;